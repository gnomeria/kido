import type { APIRoute } from 'astro';
import { childQueries } from '../../lib/database';

export const GET: APIRoute = async ({ request }) => {
  try {
    const childrenData = childQueries.getAll.all();
    // Transform database column names to match frontend expectations
    const children = childrenData.map((child: any) => ({
      id: child.id,
      name: child.name,
      dateOfBirth: child.date_of_birth,
      sex: child.sex,
      notes: child.notes,
      createdAt: child.created_at
    }));
    
    return new Response(JSON.stringify(children), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching children:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch children' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, name, dateOfBirth, sex, notes } = body;
    
    if (!id || !name || !dateOfBirth || !sex) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const createdAt = new Date().toISOString();
    childQueries.create.run(id, name, dateOfBirth, sex, notes || '', createdAt);
    
    const childData = childQueries.getById.get(id) as any;
    const newChild = {
      id: childData.id,
      name: childData.name,
      dateOfBirth: childData.date_of_birth,
      sex: childData.sex,
      notes: childData.notes,
      createdAt: childData.created_at
    };
    
    return new Response(JSON.stringify(newChild), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating child:', error);
    return new Response(JSON.stringify({ error: 'Failed to create child' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};