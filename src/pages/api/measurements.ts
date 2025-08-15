import type { APIRoute } from 'astro';
import { measurementQueries } from '../../lib/database';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const childId = url.searchParams.get('childId');
    
    let measurementData;
    if (childId) {
      measurementData = measurementQueries.getByChildId.all(childId);
    } else {
      measurementData = measurementQueries.getAll.all();
    }
    
    // Transform database column names to match frontend expectations
    const measurements = measurementData.map((m: any) => ({
      id: m.id,
      child_id: m.child_id,
      childName: m.child_name,
      dateOfBirth: m.date_of_birth,
      measurementDate: m.measurement_date,
      sex: m.sex,
      ageInDays: m.age_in_days,
      weight: m.weight,
      height: m.height,
      headCircumference: m.head_circumference,
      notes: m.notes,
      createdAt: m.created_at
    }));
    
    return new Response(JSON.stringify(measurements), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching measurements:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch measurements' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { 
      id, 
      childId, 
      measurementDate, 
      ageInDays, 
      weight, 
      height, 
      headCircumference, 
      notes 
    } = body;
    
    console.log('Received measurement data:', {
      id, childId, measurementDate, ageInDays, weight, height, headCircumference, notes
    });
    
    if (!id || !childId || !measurementDate || ageInDays === undefined || ageInDays === null || isNaN(ageInDays)) {
      console.log('Validation failed - missing required fields or invalid ageInDays');
      return new Response(JSON.stringify({ error: 'Missing required fields or invalid age calculation' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate that at least one measurement is provided
    if (weight === null && height === null && headCircumference === null) {
      return new Response(JSON.stringify({ error: 'At least one measurement (weight, height, or head circumference) is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const createdAt = new Date().toISOString();
    measurementQueries.create.run(
      id, 
      childId, 
      measurementDate, 
      parseInt(ageInDays.toString()), // Ensure it's an integer
      weight, 
      height, 
      headCircumference, 
      notes || '', 
      createdAt
    );
    
    const measurementData = measurementQueries.getById.get(id) as any;
    const newMeasurement = {
      id: measurementData.id,
      child_id: measurementData.child_id,
      childName: measurementData.child_name,
      dateOfBirth: measurementData.date_of_birth,
      measurementDate: measurementData.measurement_date,
      sex: measurementData.sex,
      ageInDays: measurementData.age_in_days,
      weight: measurementData.weight,
      height: measurementData.height,
      headCircumference: measurementData.head_circumference,
      notes: measurementData.notes,
      createdAt: measurementData.created_at
    };
    
    return new Response(JSON.stringify(newMeasurement), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating measurement:', error);
    return new Response(JSON.stringify({ error: 'Failed to create measurement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Measurement ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    measurementQueries.delete.run(id);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting measurement:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete measurement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};