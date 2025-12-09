'use client';

import { useEffect, useState } from 'react';
import { Card, Skeleton } from '@heroui/react';
import { getQuestions } from '@/lib/storage';
import QuestionCard from './QuestionCard';
import type { LocalStorageQuestion } from '@/types';

export default function QuestionList() {
  const [questions, setQuestions] = useState<LocalStorageQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    setLoading(true);
    const stored = getQuestions();
    const sorted = stored.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setQuestions(sorted);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="w-full">
              <Card.Header>
                <Skeleton className="h-6 w-3/4 rounded-lg" />
              </Card.Header>
              <Card.Content className="space-y-3">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3 rounded-lg" />
              </Card.Content>
              <Card.Footer>
                <Skeleton className="h-3 w-32 rounded-lg" />
              </Card.Footer>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Card className="text-center max-w-md shadow-lg">
          <Card.Header>
            <div className="text-6xl mb-4 w-full text-center">📝</div>
            <Card.Title className="text-2xl">No Submissions Yet</Card.Title>
            <Card.Description className="text-base">
              You haven't submitted any questions yet. Switch to the "Submit Question" tab to get started.
            </Card.Description>
          </Card.Header>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Submissions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {questions.length} question{questions.length !== 1 ? 's' : ''} submitted
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}
