import React, { useState, useEffect } from "react";
import "./style.css";

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
    return <div className="loading">Loading questions...</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="review-container">
      <div className="stats-bar">
        <span>Correct: {stats.correct}</span>
        <span>Incorrect: {stats.incorrect}</span>
        <span>Remaining: {stats.remaining}</span>
      </div>

      <div className="question-card">
        <div className="question-text">{currentQuestion.question}</div>

        {showAnswer && (
          <div className="answer-text">{currentQuestion.answer}</div>
        )}

        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="btn-primary"
          >
            Show Answer
          </button>
        ) : (
          <div className="rating-buttons">
            <button onClick={() => handleAnswer(1)} className="btn-danger">
              Again (1)
            </button>
            <button onClick={() => handleAnswer(3)} className="btn-warning">
              Hard (3)
            </button>
            <button onClick={() => handleAnswer(4)} className="btn-success">
              Good (4)
            </button>
            <button onClick={() => handleAnswer(5)} className="btn-primary">
              Easy (5)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewPage;
