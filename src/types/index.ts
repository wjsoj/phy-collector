export interface Question {
  id?: string;
  question: string;
  solution: string;
  answer: 'A' | 'B' | 'C' | 'D';
  tags: string[];
  contributor: string;
  createdAt?: string;
}

export interface UploadResponse {
  msg: string;
  code: number;
  data: {
    errFiles?: string[];
    succMap?: Record<string, string>;
  };
}

export interface LocalStorageQuestion extends Question {
  id: string;
  createdAt: string;
}
