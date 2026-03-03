import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await sql`SELECT * FROM mc_tasks WHERE id = ${id}`;
    if (result.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// PUT update task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, status, assignee, priority, project_id } = body;

    // Get old task for activity logging
    const oldTask = await sql`SELECT * FROM mc_tasks WHERE id = ${id}`;
    
    const result = await sql`
      UPDATE mc_tasks 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        status = COALESCE(${status}, status),
        assignee = COALESCE(${assignee}, assignee),
        priority = COALESCE(${priority}, priority),
        project_id = COALESCE(${project_id}, project_id),
        updated_at = NOW(),
        completed_at = CASE WHEN ${status} = 'done' THEN NOW() ELSE completed_at END
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Log activity if status changed
    if (oldTask.length > 0 && status && oldTask[0].status !== status) {
      await sql`
        INSERT INTO mc_activity_log (task_id, agent, action, target, details)
        VALUES (${id}, ${assignee || oldTask[0].assignee}, 'moved', ${result[0].title}, ${`${oldTask[0].status} → ${status}`})
      `;
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await sql`DELETE FROM mc_tasks WHERE id = ${id} RETURNING *`;
    if (result.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
