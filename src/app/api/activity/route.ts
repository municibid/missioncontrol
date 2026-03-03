import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET recent activity
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const activity = await sql`
      SELECT * FROM mc_activity_log 
      ORDER BY created_at DESC 
      LIMIT ${limit}
    `;
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}

// POST new activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task_id, agent, action, target, details } = body;

    const result = await sql`
      INSERT INTO mc_activity_log (task_id, agent, action, target, details)
      VALUES (${task_id || null}, ${agent}, ${action}, ${target}, ${details || null})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
