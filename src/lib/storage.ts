import type { LocalStorageQuestion, Question } from '../types';

const STORAGE_KEY = 'submitted_questions';

export function saveQuestion(question: Question): void {
  const questions = getQuestions();

  const localQuestion: LocalStorageQuestion = {
    ...question,
    id: question.id || crypto.randomUUID(),
    createdAt: question.createdAt || new Date().toISOString(),
  };

  questions.push(localQuestion);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export function getQuestions(): LocalStorageQuestion[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const questions = JSON.parse(stored);
    return Array.isArray(questions) ? questions : [];
  } catch (error) {
    console.error('Failed to parse questions from localStorage:', error);
    return [];
  }
}

export function clearQuestions(): void {
  localStorage.removeItem(STORAGE_KEY);
}
