import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET all tasks
export async function GET() {
  try {
    const tasks = await sql`
      SELECT * FROM mc_tasks 
      ORDER BY 
        CASE priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
        END,
        created_at DESC
    `;
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, assignee, priority, project_id, status } = body;

    const result = await sql`
      INSERT INTO mc_tasks (title, description, assignee, priority, project_id, status)
      VALUES (${title}, ${description || null}, ${assignee || 'unassigned'}, ${priority || 'medium'}, ${project_id || null}, ${status || 'backlog'})
      RETURNING *
    `;

    // Log activity
    await sql`
      INSERT INTO mc_activity_log (agent, action, target, details)
      VALUES (${assignee || 'system'}, 'created task', ${title}, ${description || null})
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
