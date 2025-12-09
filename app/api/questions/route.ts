import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { questionSchema } from '@/lib/validations';
import { ZodError } from 'zod';

/**
 * POST /api/questions
 * Submit a new question to the database
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input with Zod
    const validated = questionSchema.parse(body);

    // Create server-side Supabase client
    const supabase = createServerSupabaseClient();

    // Insert question into database
    const { data, error } = await supabase
      .from('questions')
      .insert({
        question: validated.question,
        solution: validated.solution,
        answer: validated.answer,
        tags: validated.tags,
        contributor: validated.contributor,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to insert question into database' },
        { status: 500 }
      );
    }

    // Return the created question
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('Question submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit question' },
      { status: 500 }
    );
  }
}
