'use client';

import { useState } from 'react';
import { Button, Input, Select, ListBox, Label, Card, Alert } from '@heroui/react';
import VditorEditor from './VditorEditor';
import { saveQuestion } from '@/lib/storage';
import type { Question } from '@/types';

export default function QuestionForm() {
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState('');
  const [answer, setAnswer] = useState<string>('A');
  const [tags, setTags] = useState('');
  const [contributor, setContributor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!question.trim()) {
      setError('Question is required');
      return;
    }

    if (!solution.trim()) {
      setError('Solution is required');
      return;
    }

    if (!contributor.trim()) {
      setError('Contributor name is required');
      return;
    }

    const parsedTags = tags
      .split(/[,\s]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (parsedTags.length === 0) {
      setError('At least one tag is required');
      return;
    }

    const questionData: Omit<Question, 'id' | 'createdAt'> = {
      question: question.trim(),
      solution: solution.trim(),
      answer: answer as 'A' | 'B' | 'C' | 'D',
      tags: parsedTags,
      contributor: contributor.trim(),
    };

    setIsSubmitting(true);

    try {
      // Submit to server API instead of direct Supabase
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit question');
      }

      const insertedQuestion = await response.json();

      const fullQuestion: Question = {
        ...questionData,
        id: insertedQuestion.id,
        createdAt: insertedQuestion.created_at,
      };

      // Save to localStorage for quick access
      saveQuestion(fullQuestion);

      setSuccess('Question submitted successfully!');

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setQuestion('');
      setSolution('');
      setAnswer('A');
      setTags('');
      setContributor('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Alert */}
        {success && (
          <Alert status="success" className="mb-4">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Success</Alert.Title>
              <Alert.Description>{success}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert status="danger" className="mb-4">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Error</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        <Card className="shadow-lg">
          <Card.Header>
            <Card.Title className="text-2xl">Submit a Question</Card.Title>
            <Card.Description>Fill in the details below to submit a new question</Card.Description>
          </Card.Header>

          <Card.Content className="space-y-6">
            {/* Question Editor */}
            <div>
              <Label htmlFor="question-editor" className="text-base font-semibold mb-2 block">
                Question *
              </Label>
              <VditorEditor
                value={question}
                onChange={setQuestion}
                placeholder="Enter your question in Markdown format..."
                height="300px"
              />
            </div>

            {/* Solution Editor */}
            <div>
              <Label htmlFor="solution-editor" className="text-base font-semibold mb-2 block">
                Solution *
              </Label>
              <VditorEditor
                value={solution}
                onChange={setSolution}
                placeholder="Enter the solution in Markdown format..."
                height="300px"
              />
            </div>

            {/* Answer Selector */}
            <div>
              <Select
                value={answer}
                onChange={(value) => {
                  if (value && typeof value === 'string' && ['A', 'B', 'C', 'D'].includes(value)) {
                    setAnswer(value);
                  }
                }}
                className="w-full"
              >
                <Label className="text-base font-semibold mb-2">Correct Answer *</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="A" textValue="A">
                      A
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="B" textValue="B">
                      B
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="C" textValue="C">
                      C
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="D" textValue="D">
                      D
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Tags Input */}
            <div className="w-full">
              <Label className="text-base font-semibold mb-2">
                Tags * <span className="text-sm font-normal opacity-70">(comma or space separated)</span>
              </Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., Math, Algebra, Functions"
                className="w-full"
              />
            </div>

            {/* Contributor Input */}
            <div className="w-full">
              <Label className="text-base font-semibold mb-2">Your Name *</Label>
              <Input
                value={contributor}
                onChange={(e) => setContributor(e.target.value)}
                placeholder="Enter your name"
                className="w-full"
              />
            </div>
          </Card.Content>

          <Card.Footer className="flex justify-end">
            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isDisabled={isSubmitting}
              className="w-full sm:w-auto px-8"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Question'}
            </Button>
          </Card.Footer>
        </Card>
      </form>
    </div>
  );
}
