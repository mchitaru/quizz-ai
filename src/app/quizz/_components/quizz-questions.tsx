"use client";

import ProgressBar from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import { useState } from "react";
import ResultCard from "./result-card";
import QuizzSubmission from "./quizz-submission";
import { InferSelectModel } from "drizzle-orm";
import {
  questions as DbQuestions,
  answers,
  questions,
  quizzes,
} from "@/db/schema";
import { useRouter } from "next/navigation";
import { saveResults } from "@/app/actions/save-results";

type Quizz = InferSelectModel<typeof quizzes> & { questions: Question[] };
type Question = InferSelectModel<typeof questions> & { answers: Answer[] };
type Answer = InferSelectModel<typeof answers>;

type Props = {
  quizz: Quizz;
};

export default function QuizzQuestions(props: Props) {
  const { questions } = props.quizz;
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: number; answerId: number }[]
  >([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const router = useRouter();

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
  };

  const handleAnswer = (answer: Answer, questionId: number) => {
    const newUserAnswers = [
      ...userAnswers,
      {
        answerId: answer.id,
        questionId,
      },
    ];
    setUserAnswers(newUserAnswers);

    const isCurrentCorrect = answer.isCorrect;
    if (isCurrentCorrect) {
      setScore(score + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion !== 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    router.push("/dashboard");
  };

  const handleSubmit = async () => {
    try {
      const resId = await saveResults({ score }, props.quizz.id);
    } catch (e) {
      console.log(e);
    }

    setSubmitted(true);
  };

  const scorePercentage: number = Math.round((score / questions.length) * 100);
  const selectedAnswer: number | null | undefined = userAnswers.find(
    (item) => item.questionId === questions[currentQuestion].id
  )?.answerId;
  const answerIdx = questions[currentQuestion].answers.findIndex(
    (answer) => answer.id === selectedAnswer
  );
  const isCorrect: boolean | null | undefined =
    answerIdx >= 0
      ? questions[currentQuestion].answers[answerIdx]?.isCorrect
      : null;

  console.log(isCorrect);

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
            onClick={handlePrev}
          >
            <ChevronLeft />
          </Button>
          <ProgressBar value={(currentQuestion / questions.length) * 100} />
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={handleClose}
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
                    disabled={!!selectedAnswer}
                    variant={variant}
                    size={"xl"}
                    onClick={() =>
                      handleAnswer(answer, questions[currentQuestion].id)
                    }
                    className="disabled:opacity-100"
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
            )?.text || ""
          }
        />
        {currentQuestion === questions.length - 1 ? (
          <Button
            variant={"neo"}
            size={"lg"}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        ) : (
          <Button
            variant={"neo"}
            size={"lg"}
            onClick={handleNext}
          >
            {!started ? "Start" : "Next"}
          </Button>
        )}
      </footer>
    </div>
  );
}
