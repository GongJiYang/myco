import React from "react";
import { Question } from "~types/question";

interface QuestionCardProps {
  question: Question;
  showAnswer?: boolean;
  onShowAnswer?: () => void;
  onRate?: (quality: number) => void;
  rating?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  showAnswer = false,
  onShowAnswer,
  onRate,
  rating = false,
}) => {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-2">Question</p>
          <h3 className="text-xl font-semibold text-gray-900">
            {question.question}
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[question.difficulty]}`}
        >
          {question.difficulty}
        </span>
      </div>

      {showAnswer && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Answer</p>
          <p className="text-gray-700">{question.answer}</p>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Created: {new Date(question.createdAt).toLocaleDateString()}
        </div>

        {!showAnswer && onShowAnswer && (
          <button
            onClick={onShowAnswer}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Show Answer
          </button>
        )}
      </div>

      {rating && showAnswer && onRate && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Rate your recall:</p>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => onRate(1)}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
              Again
            </button>
            <button
              onClick={() => onRate(3)}
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors"
            >
              Hard
            </button>
            <button
              onClick={() => onRate(4)}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Good
            </button>
            <button
              onClick={() => onRate(5)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Easy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
