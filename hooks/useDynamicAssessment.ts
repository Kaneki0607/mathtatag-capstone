import { get, onValue, ref, set } from 'firebase/database';
import { useEffect, useState } from 'react';
import { AssessmentQuestion, defaultAssessments, getRandomQuestion } from '../constants/assessmentConfig';
import { db } from '../constants/firebaseConfig';

export function useDynamicAssessment(gameId: string) {
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions from database
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if assessments exist in database
        const assessmentsRef = ref(db, `Assessments/${gameId}`);
        const snapshot = await get(assessmentsRef);

        if (snapshot.exists()) {
          // Use existing assessments from database
          const data = snapshot.val();
          setQuestions(data.questions || []);
        } else {
          // Initialize with default assessments
          const defaultQuestions = defaultAssessments[gameId] || [];
          await set(ref(db, `Assessments/${gameId}`), {
            gameId,
            questions: defaultQuestions,
            version: '1.0.0',
            lastUpdated: Date.now()
          });
          setQuestions(defaultQuestions);
        }

        // Select a random question
        if (questions.length > 0) {
          setCurrentQuestion(getRandomQuestion(questions));
        }
      } catch (err) {
        console.error('Error loading assessments:', err);
        setError('Failed to load assessments');
        
        // Fallback to default questions
        const defaultQuestions = defaultAssessments[gameId] || [];
        setQuestions(defaultQuestions);
        if (defaultQuestions.length > 0) {
          setCurrentQuestion(getRandomQuestion(defaultQuestions));
        }
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [gameId]);

  // Listen for real-time updates
  useEffect(() => {
    if (!gameId) return;

    const assessmentsRef = ref(db, `Assessments/${gameId}`);
    const unsubscribe = onValue(assessmentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const updatedQuestions = data.questions || [];
        setQuestions(updatedQuestions);
        
        // Update current question if it's no longer valid
        if (currentQuestion && !updatedQuestions.find(q => q.id === currentQuestion.id)) {
          setCurrentQuestion(getRandomQuestion(updatedQuestions));
        }
      }
    }, (error) => {
      console.error('Error listening to assessments:', error);
    });

    return () => unsubscribe();
  }, [gameId, currentQuestion]);

  // Get a new random question
  const getNewQuestion = () => {
    if (questions.length > 0) {
      setCurrentQuestion(getRandomQuestion(questions));
    }
  };

  // Get question by difficulty
  const getQuestionByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    const filteredQuestions = questions.filter(q => q.difficulty === difficulty);
    if (filteredQuestions.length > 0) {
      setCurrentQuestion(getRandomQuestion(filteredQuestions));
    }
  };

  // Get question by category
  const getQuestionByCategory = (category: 'pattern' | 'numbers') => {
    const filteredQuestions = questions.filter(q => q.category === category);
    if (filteredQuestions.length > 0) {
      setCurrentQuestion(getRandomQuestion(filteredQuestions));
    }
  };

  // Add a new question to the database
  const addQuestion = async (newQuestion: Omit<AssessmentQuestion, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const questionId = `${gameId}_q${Date.now()}`;
      const question: AssessmentQuestion = {
        ...newQuestion,
        id: questionId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const updatedQuestions = [...questions, question];
      await set(ref(db, `Assessments/${gameId}`), {
        gameId,
        questions: updatedQuestions,
        version: '1.0.0',
        lastUpdated: Date.now()
      });

      setQuestions(updatedQuestions);
      return question;
    } catch (err) {
      console.error('Error adding question:', err);
      throw new Error('Failed to add question');
    }
  };

  // Update an existing question
  const updateQuestion = async (questionId: string, updates: Partial<AssessmentQuestion>) => {
    try {
      const updatedQuestions = questions.map(q => 
        q.id === questionId 
          ? { ...q, ...updates, updatedAt: Date.now() }
          : q
      );

      await set(ref(db, `Assessments/${gameId}`), {
        gameId,
        questions: updatedQuestions,
        version: '1.0.0',
        lastUpdated: Date.now()
      });

      setQuestions(updatedQuestions);
      
      // Update current question if it was the one updated
      if (currentQuestion?.id === questionId) {
        setCurrentQuestion(updatedQuestions.find(q => q.id === questionId) || null);
      }
    } catch (err) {
      console.error('Error updating question:', err);
      throw new Error('Failed to update question');
    }
  };

  // Delete a question
  const deleteQuestion = async (questionId: string) => {
    try {
      const updatedQuestions = questions.filter(q => q.id !== questionId);
      await set(ref(db, `Assessments/${gameId}`), {
        gameId,
        questions: updatedQuestions,
        version: '1.0.0',
        lastUpdated: Date.now()
      });

      setQuestions(updatedQuestions);
      
      // Update current question if it was deleted
      if (currentQuestion?.id === questionId) {
        setCurrentQuestion(updatedQuestions.length > 0 ? getRandomQuestion(updatedQuestions) : null);
      }
    } catch (err) {
      console.error('Error deleting question:', err);
      throw new Error('Failed to delete question');
    }
  };

  return {
    currentQuestion,
    questions,
    loading,
    error,
    getNewQuestion,
    getQuestionByDifficulty,
    getQuestionByCategory,
    addQuestion,
    updateQuestion,
    deleteQuestion
  };
} 