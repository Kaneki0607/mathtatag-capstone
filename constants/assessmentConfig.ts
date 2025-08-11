// Assessment Configuration for Dynamic Game Questions
// This file defines the structure and default assessments that will be stored in Firebase

export interface AssessmentQuestion {
  id: string;
  gameId: string;
  question: string;
  equation: string;
  correctAnswer: number;
  options: number[];
  totalItems: number;
  itemsToRemove: number;
  story: string;
  instruction: string;
  category: 'pattern' | 'numbers';
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: number;
  updatedAt: number;
}

export interface GameAssessment {
  gameId: string;
  questions: AssessmentQuestion[];
  version: string;
  lastUpdated: number;
}

// Default assessments to initialize the database
export const defaultAssessments: { [gameId: string]: AssessmentQuestion[] } = {
  Game1: [
    {
      id: 'game1_q1',
      gameId: 'Game1',
      question: 'How many balloons are still there?',
      equation: '10 - 5 = ?',
      correctAnswer: 5,
      options: [3, 5, 7],
      totalItems: 10,
      itemsToRemove: 5,
      story: 'A boy holds 10 balloons. 5 balloons popped.',
      instruction: 'Tap 5 balloons to pop them!',
      category: 'numbers',
      difficulty: 'easy',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: 'game1_q2',
      gameId: 'Game1',
      question: 'How many balloons are still there?',
      equation: '8 - 3 = ?',
      correctAnswer: 5,
      options: [4, 5, 6],
      totalItems: 8,
      itemsToRemove: 3,
      story: 'A boy holds 8 balloons. 3 balloons popped.',
      instruction: 'Tap 3 balloons to pop them!',
      category: 'numbers',
      difficulty: 'easy',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: 'game1_q3',
      gameId: 'Game1',
      question: 'How many balloons are still there?',
      equation: '12 - 7 = ?',
      correctAnswer: 5,
      options: [3, 5, 7],
      totalItems: 12,
      itemsToRemove: 7,
      story: 'A boy holds 12 balloons. 7 balloons popped.',
      instruction: 'Tap 7 balloons to pop them!',
      category: 'numbers',
      difficulty: 'medium',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ],
  Game2: [
    {
      id: 'game2_q1',
      gameId: 'Game2',
      question: 'How many birds stayed?',
      equation: '6 - 6 = ?',
      correctAnswer: 0,
      options: [0, 2, 6],
      totalItems: 6,
      itemsToRemove: 6,
      story: '6 birds are on a branch.',
      instruction: 'Tap all 6 birds to make them fly away!',
      category: 'numbers',
      difficulty: 'easy',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: 'game2_q2',
      gameId: 'Game2',
      question: 'How many birds stayed?',
      equation: '8 - 5 = ?',
      correctAnswer: 3,
      options: [2, 3, 4],
      totalItems: 8,
      itemsToRemove: 5,
      story: '8 birds are on a branch.',
      instruction: 'Tap 5 birds to make them fly away!',
      category: 'numbers',
      difficulty: 'medium',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ],
  Game3: [
    {
      id: 'game3_q1',
      gameId: 'Game3',
      question: 'What comes next in the pattern?',
      equation: '2, 4, 6, 8, ?',
      correctAnswer: 10,
      options: [9, 10, 11],
      totalItems: 4,
      itemsToRemove: 0,
      story: 'Look at the number pattern.',
      instruction: 'Find the next number in the sequence!',
      category: 'pattern',
      difficulty: 'easy',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ],
  Game4: [
    {
      id: 'game4_q1',
      gameId: 'Game4',
      question: 'How many guavas does Kat have left?',
      equation: '12 - 7 = ?',
      correctAnswer: 5,
      options: [4, 5, 6],
      totalItems: 12,
      itemsToRemove: 7,
      story: 'Kat has 12 guavas. She gives 7 to her friend.',
      instruction: 'Count the remaining guavas!',
      category: 'numbers',
      difficulty: 'medium',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ],
  Game5: [
    {
      id: 'game5_q1',
      gameId: 'Game5',
      question: 'How many balls are in the box?',
      equation: '5 + 3 = ?',
      correctAnswer: 8,
      options: [7, 8, 9],
      totalItems: 8,
      itemsToRemove: 0,
      story: 'There are 5 balls in the box. 3 more are added.',
      instruction: 'Count all the balls in the box!',
      category: 'numbers',
      difficulty: 'easy',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ]
};

// Helper function to get a random question for a game
export function getRandomQuestion(questions: AssessmentQuestion[]): AssessmentQuestion {
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

// Helper function to get questions by difficulty
export function getQuestionsByDifficulty(questions: AssessmentQuestion[], difficulty: 'easy' | 'medium' | 'hard'): AssessmentQuestion[] {
  return questions.filter(q => q.difficulty === difficulty);
}

// Helper function to get questions by category
export function getQuestionsByCategory(questions: AssessmentQuestion[], category: 'pattern' | 'numbers'): AssessmentQuestion[] {
  return questions.filter(q => q.category === category);
} 