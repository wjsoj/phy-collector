import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

/**
 * GET /api/questions-list
 * Fetch questions from the database
 * Supports pagination with limit and offset query parameters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Create server-side Supabase client
    const supabase = createServerSupabaseClient();

    // Fetch questions with pagination
    const { data, error, count } = await supabase
      .from('questions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch questions from database' },
        { status: 500 }
      );
    }

    // Transform database response to match our Question type
    const questions = data.map((item) => ({
      id: item.id,
      question: item.question,
      solution: item.solution,
      answer: item.answer as 'A' | 'B' | 'C' | 'D',
      tags: item.tags,
      contributor: item.contributor,
      createdAt: item.created_at,
    }));

    return NextResponse.json(
      {
        questions,
        total: count || 0,
        limit,
        offset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Questions list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
