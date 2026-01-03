import React, { useState, useEffect } from "react";
import "./style.newtab.css"

interface Question {
  id: string;
  question: string;
  answer: string;
  difficulty: string;
}

function ReviewPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    remaining: 0,
  });

  useEffect(() => {
    loadDueQuestions();
  }, []);

  const loadDueQuestions = async () => {
    // TODO: Load questions due for review from IndexedDB
    const mockQuestions: Question[] = [
      {
        id: "1",
        question: "What is the main concept of spaced repetition?",
        answer: "Reviewing material at increasing intervals to improve retention",
        difficulty: "medium",
      },
    ];
    setQuestions(mockQuestions);
    setStats({ ...stats, remaining: mockQuestions.length });
  };

  const handleAnswer = (quality: number) => {
    // Quality: 0-5 (0=complete blackout, 5=perfect response)
    if (quality >= 3) {
      setStats({ ...stats, correct: stats.correct + 1 });
    } else {
      setStats({ ...stats, incorrect: stats.incorrect + 1 });
    }

    // Update next review time using FSRS algorithm
    updateQuestionSchedule(questions[currentIndex].id, quality);

    // Move to next question
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      // Review complete
      alert("Review session complete!");
    }
  };

  const updateQuestionSchedule = (questionId: string, quality: number) => {
    // TODO: Implement FSRS algorithm
    console.log(`Updating schedule for ${questionId} with quality ${quality}`);
  };

  if (questions.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading questions...
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        <span style={{ color: '#16a34a', fontWeight: '500' }}>
          Correct: {stats.correct}
        </span>
        <span style={{ color: '#dc2626', fontWeight: '500' }}>
          Incorrect: {stats.incorrect}
        </span>
        <span style={{ color: '#6b7280', fontWeight: '500' }}>
          Remaining: {stats.remaining}
        </span>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          {currentQuestion.question}
        </div>

        {showAnswer && (
          <div style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb',
            fontSize: '16px',
            color: '#374151',
            lineHeight: '1.6'
          }}>
            {currentQuestion.answer}
          </div>
        )}

        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            style={{
              marginTop: '24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              width: '100%'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            Show Answer
          </button>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginTop: '24px'
          }}>
            <button
              onClick={() => handleAnswer(1)}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            >
              Again (1)
            </button>
            <button
              onClick={() => handleAnswer(3)}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
            >
              Hard (3)
            </button>
            <button
              onClick={() => handleAnswer(4)}
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
            >
              Good (4)
            </button>
            <button
              onClick={() => handleAnswer(5)}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              Easy (5)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewPage;
