import { useState } from 'react';
import { Button, Input, Select, ListBox, Label } from '@heroui/react';
import VditorEditor from './VditorEditor';
import { insertQuestion } from '../lib/supabase';
import { saveQuestion } from '../lib/storage';
import type { Question } from '../types';

export default function QuestionForm() {
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState('');
  const [answer, setAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
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
      answer,
      tags: parsedTags,
      contributor: contributor.trim(),
    };

    setIsSubmitting(true);

    try {
      const insertedQuestion = await insertQuestion(questionData);

      const fullQuestion: Question = {
        ...questionData,
        id: insertedQuestion.id,
        createdAt: insertedQuestion.created_at,
      };

      saveQuestion(fullQuestion);

      setSuccess('Question submitted successfully!');
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div>
        <label className="block text-sm font-medium mb-2">
          Question <span className="text-red-500">*</span>
        </label>
        <VditorEditor
          value={question}
          onChange={setQuestion}
          placeholder="Enter the question in markdown format..."
          height="400px"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Solution <span className="text-red-500">*</span>
        </label>
        <VditorEditor
          value={solution}
          onChange={setSolution}
          placeholder="Enter the solution in markdown format..."
          height="400px"
        />
      </div>

      <div>
        <Select
          placeholder="Select the correct answer"
          value={answer}
          onChange={(key) => {
            if (key) setAnswer(key as 'A' | 'B' | 'C' | 'D');
          }}
          isRequired
        >
          <Label>Answer *</Label>
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

      <div>
        <Label htmlFor="tags-input">Tags *</Label>
        <Input
          id="tags-input"
          placeholder="Enter tags separated by commas or spaces (e.g., math, physics, hard)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="contributor-input">Contributor *</Label>
        <Input
          id="contributor-input"
          placeholder="Your name"
          value={contributor}
          onChange={(e) => setContributor(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" isPending={isSubmitting}>
          Submit Question
        </Button>
      </div>
    </form>
  );
}
