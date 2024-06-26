"use client";

import ProgressBar from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import { useState } from "react";
import ResultCard from "./_components/result-card";
import QuizzSubmission from "./_components/quizz-submission";

const questions = [
  {
    text: "What is React?",
    answers: [
      {
        text: "A library for building user interfaces",
        isCorrect: true,
        id: 1,
      },
      {
        text: "A front-end framework",
        isCorrect: false,
        id: 2,
      },
      {
        text: "A back-end framework",
        isCorrect: false,
        id: 3,
      },
      {
        text: "A database",
        isCorrect: false,
        id: 4,
      },
    ],
  },
  {
    text: "What is JSX?",
    answers: [
      {
        text: "JavaScript XML",
        isCorrect: true,
        id: 1,
      },
      {
        text: "JavaScript",
        isCorrect: false,
        id: 2,
      },
      {
        text: "JavaScript and XML",
        isCorrect: false,
        id: 3,
      },
      {
        text: "JavaScript and HTML",
        isCorrect: false,
        id: 4,
      },
    ],
  },
  {
    text: "What is the Virtual DOM?",
    answers: [
      {
        text: "A virtual representation of the DOM",
        isCorrect: true,
        id: 1,
      },
      {
        text: "A real DOM",
        isCorrect: false,
        id: 2,
      },
      {
        text: "A virtual representation of the browser",
        isCorrect: false,
        id: 3,
      },
      {
        text: "A virtual representation of the server",
        isCorrect: false,
        id: 4,
      },
    ],
  },
];

export default function Home() {
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleNext = () => {
    if (!started) {
      setStarted(true);
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSubmitted(true);
      return;
    }

    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer.id);
    const isCurrentCorrect = answer.isCorrect;
    if (isCurrentCorrect) {
      setScore(score + 1);
    }
    setIsCorrect(isCurrentCorrect);
  };

  const scorePercentage: number = Math.round((score / questions.length) * 100);

  if (submitted) {
    return (
      <QuizzSubmission
        score={score}
        scorePercentage={scorePercentage}
        totalQuestions={questions.length}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
        <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between py-2 gap-2">
          <Button
            size={"icon"}
            variant={"outline"}
          >
            <ChevronLeft />
          </Button>
          <ProgressBar value={(currentQuestion / questions.length) * 100} />
          <Button
            size={"icon"}
            variant={"outline"}
          >
            <X />
          </Button>
        </header>
      </div>
      <main className="flex flex-1 justify-center">
        {!started ? (
          <h1 className="text-3xl font-bold">Hello World👋</h1>
        ) : (
          <div>
            <h2 className="text-3xl font-bold">
              {questions[currentQuestion].text}
            </h2>
            <div className="grid grid-cols-1 gap-6 mt-6">
              {questions[currentQuestion].answers.map((answer) => {
                const variant =
                  selectedAnswer === answer.id
                    ? answer.isCorrect
                      ? "neoSuccess"
                      : "neoDanger"
                    : "neoOutline";
                return (
                  <Button
                    key={answer.id}
                    variant={variant}
                    size={"xl"}
                    onClick={() => handleAnswer(answer)}
                  >
                    <p className="whitespace-normal">{answer.text}</p>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <footer className="footer pb-9 px-6 relative mb-0">
        <ResultCard
          isCorrect={isCorrect}
          correctAnswer={
            questions[currentQuestion].answers.find(
              (answer) => answer.isCorrect === true
            )?.text
          }
        />
        <Button
          variant={"neo"}
          size={"lg"}
          onClick={handleNext}
        >
          {!started
            ? "Start"
            : currentQuestion === questions.length - 1
            ? "Submit"
            : "Next"}
        </Button>
      </footer>
    </div>
  );
}
