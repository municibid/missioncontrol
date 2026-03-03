import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET all projects
export async function GET() {
  try {
    const projects = await sql`
      SELECT 
        p.*,
        (SELECT COUNT(*) FROM mc_tasks WHERE project_id = p.id) as tasks_count,
        (SELECT COUNT(*) FROM mc_documents WHERE project_id = p.id) as docs_count
      FROM mc_projects p
      ORDER BY 
        CASE status WHEN 'active' THEN 1 WHEN 'paused' THEN 2 ELSE 3 END,
        updated_at DESC
    `;
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, status, progress, business_line } = body;

    const result = await sql`
      INSERT INTO mc_projects (name, description, status, progress, business_line)
      VALUES (${name}, ${description || null}, ${status || 'active'}, ${progress || 0}, ${business_line || 'municibid'})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
