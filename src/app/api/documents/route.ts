import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET all documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let documents;
    if (category && category !== 'all') {
      documents = await sql`
        SELECT * FROM mc_documents 
        WHERE category = ${category}
        ORDER BY created_at DESC
      `;
    } else {
      documents = await sql`
        SELECT * FROM mc_documents 
        ORDER BY created_at DESC
      `;
    }
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, format, project_id } = body;

    const result = await sql`
      INSERT INTO mc_documents (title, content, category, format, project_id)
      VALUES (${title}, ${content}, ${category || 'other'}, ${format || 'markdown'}, ${project_id || null})
      RETURNING *
    `;

    // Log activity
    await sql`
      INSERT INTO mc_activity_log (agent, action, target, details)
      VALUES ('marty', 'created document', ${title}, ${category || 'other'})
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
