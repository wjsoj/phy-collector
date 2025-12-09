import { Card, Chip } from '@heroui/react';
import type { LocalStorageQuestion } from '@/types';

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
    <Card className="w-full glass hover:glow-pink transition-all duration-300 group">
      <Card.Header>
        <Card.Title className="text-lg font-semibold line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {title}
        </Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag, index) => (
            <Chip
              key={index}
              size="sm"
              className="hover:glow-blue transition-all duration-200"
            >
              {tag}
            </Chip>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Answer: {question.answer}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            By {question.contributor}
          </span>
        </div>
      </Card.Content>

      <Card.Footer>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          📅 {formatDate(question.createdAt)}
        </span>
      </Card.Footer>
    </Card>
  );
}
