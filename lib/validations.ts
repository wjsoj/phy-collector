import { z } from 'zod';

/**
 * Validation schema for question submission
 */
export const questionSchema = z.object({
  question: z
    .string()
    .min(1, 'Question is required')
    .max(50000, 'Question is too long (max 50,000 characters)'),
  solution: z
    .string()
    .min(1, 'Solution is required')
    .max(50000, 'Solution is too long (max 50,000 characters)'),
  answer: z.enum(['A', 'B', 'C', 'D'], {
    errorMap: () => ({ message: 'Answer must be A, B, C, or D' }),
  }),
  tags: z
    .array(z.string().min(1).max(50))
    .min(1, 'At least one tag is required')
    .max(10, 'Maximum 10 tags allowed'),
  contributor: z
    .string()
    .min(1, 'Contributor name is required')
    .max(100, 'Contributor name is too long'),
});

export type QuestionInput = z.infer<typeof questionSchema>;

/**
 * Validation schema for file uploads
 */
export const fileUploadSchema = z.object({
  files: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= 10 * 1024 * 1024, {
          message: 'File size must be less than 10MB',
        })
        .refine((file) => file.type.startsWith('image/'), {
          message: 'Only image files are allowed',
        })
    )
    .min(1, 'At least one file is required')
    .max(10, 'Maximum 10 files allowed'),
});
