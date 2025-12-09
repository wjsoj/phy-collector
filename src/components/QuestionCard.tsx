import { Card, Chip } from '@heroui/react';
import type { LocalStorageQuestion } from '../types';

interface QuestionCardProps {
  question: LocalStorageQuestion;
}

function extractTitle(markdown: string): string {
  const stripped = markdown.replace(/[#*`_\[\]!]/g, '');
  const firstLine = stripped.split('\n')[0];
  return firstLine.slice(0, 100) + (firstLine.length > 100 ? '...' : '');
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const title = extractTitle(question.question);

  return (
    <Card className="w-full">
      <Card.Header>
        <Card.Title className="text-lg font-semibold line-clamp-2">
          {title}
        </Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="flex flex-wrap gap-1 mb-3">
          {question.tags.map((tag, index) => (
            <Chip key={index} size="sm" variant="soft" color="accent">
              {tag}
            </Chip>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Answer: {question.answer}</span>
          <span>By {question.contributor}</span>
        </div>
      </Card.Content>

      <Card.Footer>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          Submitted: {formatDate(question.createdAt)}
        </span>
      </Card.Footer>
    </Card>
  );
}
