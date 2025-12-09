import type { LocalStorageQuestion, Question } from '@/types';

const STORAGE_KEY = 'submitted_questions';

/**
 * Checks if we're running in a browser environment
 * @returns true if window and localStorage are available
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Saves a question to localStorage
 * @param question - The question to save
 */
export function saveQuestion(question: Question): void {
  if (!isBrowser()) return;

  const questions = getQuestions();

  const localQuestion: LocalStorageQuestion = {
    ...question,
    id: question.id || crypto.randomUUID(),
    createdAt: question.createdAt || new Date().toISOString(),
  };

  questions.push(localQuestion);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

/**
 * Retrieves all questions from localStorage
 * @returns Array of questions
 */
export function getQuestions(): LocalStorageQuestion[] {
  if (!isBrowser()) return [];

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

/**
 * Clears all questions from localStorage
 */
export function clearQuestions(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Merges local storage questions with server data
 * Server data takes precedence for questions with matching IDs
 * @param serverQuestions - Questions from the server
 * @returns Merged array of questions
 */
export function mergeWithServerData(
  serverQuestions: Question[]
): LocalStorageQuestion[] {
  if (!isBrowser()) return [];

  const localQuestions = getQuestions();
  const merged = new Map<string, LocalStorageQuestion>();

  // Add local questions first
  localQuestions.forEach((q) => merged.set(q.id, q));

  // Overwrite with server data (source of truth)
  serverQuestions.forEach((q) => {
    if (q.id) {
      merged.set(q.id, {
        ...q,
        id: q.id,
        createdAt: q.createdAt || new Date().toISOString(),
      });
    }
  });

  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
