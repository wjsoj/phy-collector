import { useEffect, useState } from 'react';
import { getQuestions } from '../lib/storage';
import QuestionCard from './QuestionCard';
import type { LocalStorageQuestion } from '../types';

export default function QuestionList() {
  const [questions, setQuestions] = useState<LocalStorageQuestion[]>([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    const stored = getQuestions();
    const sorted = stored.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setQuestions(sorted);
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No Submissions Yet</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You haven't submitted any questions yet. Switch to the "Submit Question" tab to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">My Submissions</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {questions.length} question{questions.length !== 1 ? 's' : ''} submitted
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}
