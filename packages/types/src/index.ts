export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation?: string;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuestionWithMetadata extends Question {
  difficulty: QuestionDifficulty;
  category?: string;
  tags?: string[];
} 