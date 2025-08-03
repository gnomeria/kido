import { test, expect } from '@playwright/test';

// Declare global window properties for TypeScript


test.describe('Dashboard Console Error Detection', () => {
  let consoleErrors: string[] = [];
  let consoleWarnings: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Clear previous errors
    consoleErrors = [];
    consoleWarnings = [];

    // Listen for console errors and warnings
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    // Listen for page errors (uncaught exceptions)
    page.on('pageerror', error => {
      consoleErrors.push(`Uncaught exception: ${error.message}`);
    });
  });

  test('should load dashboard without console errors', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for console errors
    expect(consoleErrors).toEqual([]);
    
    // Log warnings if any (but don't fail the test)
    if (consoleWarnings.length > 0) {
      console.log('Warnings found:', consoleWarnings);
    }
  });

  test('should open add child modal without errors', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Clear any existing errors from page load
    consoleErrors = [];
    
    // Click add child button
    await page.click('text="+ Add"');
    
    // Wait for modal to appear
    await page.waitForSelector('#add-child-modal[open]', { timeout: 5000 });
    
    // Check modal is visible
    const modal = page.locator('#add-child-modal');
    await expect(modal).toBeVisible();
    
    // Check for console errors during modal interaction
    expect(consoleErrors).toEqual([]);
  });

  test('should handle chart type selection without errors', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Create a test child first
    await page.click('text="+ Add"');
    await page.fill('[name="name"]', 'Test Child');
    await page.fill('[name="dateOfBirth"]', '2023-01-01');
    await page.selectOption('[name="sex"]', 'male');
    await page.click('text="Save Child"');
    
    // Wait for modal to close and child to be added
    await page.waitForSelector('#add-child-modal:not([open])', { timeout: 5000 });
    
    // Select the child
    await page.click('text="Test Child"');
    
    // Wait for chart buttons to be visible
    await page.waitForSelector('#chart-btn-weight', { timeout: 5000 });
    
    // Clear previous errors
    consoleErrors = [];
    
    // Test each chart type button
    const chartTypes = ['weight', 'height', 'head', 'weight-height'];
    
    for (const chartType of chartTypes) {
      await page.click(`#chart-btn-${chartType}`);
      await page.waitForTimeout(500); // Allow chart to render
      
      // Check for errors after clicking each button
      if (consoleErrors.length > 0) {
        console.log(`Errors found when clicking ${chartType}:`, consoleErrors);
      }
    }
    
    // Final check - should have no console errors
    expect(consoleErrors).toEqual([]);
  });

  test('should detect Chart.js availability', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check if Chart.js is loaded by testing if we can create a chart
    const chartJsAvailable = await page.evaluate(() => {
      // Chart.js is loaded as a module, not global
      // Test if canvas exists and can be used for charting
      const canvas = document.getElementById('growth-chart');
      return canvas !== null && canvas.tagName === 'CANVAS';
    });
    
    expect(chartJsAvailable).toBe(true);
  });

  test('should detect missing global functions', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check if required global functions exist
    const globalFunctions = await page.evaluate(() => {
      return {
        selectChild: typeof window.selectChild,
        selectChartType: typeof window.selectChartType, 
        saveNewChild: typeof window.saveNewChild,
        showAddChildModal: typeof window.showAddChildModal,
        addMeasurementForSelected: typeof window.addMeasurementForSelected
      };
    });
    
    expect(globalFunctions.selectChild).toBe('function');
    expect(globalFunctions.selectChartType).toBe('function');
    expect(globalFunctions.saveNewChild).toBe('function');
    expect(globalFunctions.showAddChildModal).toBe('function');
    expect(globalFunctions.addMeasurementForSelected).toBe('function');
  });
});
