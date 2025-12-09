import { createClient } from '@supabase/supabase-js';
import type { Question } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function insertQuestion(question: Omit<Question, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('questions')
    .insert({
      question: question.question,
      solution: question.solution,
      answer: question.answer,
      tags: question.tags,
      contributor: question.contributor,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to insert question: ${error.message}`);
  }

  return data;
}
