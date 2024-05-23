import Bar from "@/components/bar";
import ProgressBar from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useReward } from "react-rewards";

type Props = {
  scorePercentage: number;
  score: number;
  totalQuestions: number;
};

const QuizzSubmission = (props: Props) => {
  const { scorePercentage, score, totalQuestions } = props;
  const { reward } = useReward("rewardId", "confetti");
  const router = useRouter();

  useEffect(() => {
    if (scorePercentage === 100) {
      reward();
    }
  }, [scorePercentage, reward]);

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
        <header className="flex items-center justify-end py-2 gap-2">
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={handleClose}
          >
            <X />
          </Button>
        </header>
      </div>
      <main className="py-11 flex flex-col gap-4 items-center flex-1 mt-24">
        <h2 className="text-3xl font-bold">Quizz Complete!</h2>
        <p>You scored: {scorePercentage}%</p>
        {scorePercentage === 100 ? (
          <div>
            <p className="flex flex-col items-center">Congratulations! 🎉</p>
            <div className="flex justify-center">
              <Image
                src="/images/owl-smiling.png"
                alt="Smiling Owl"
                width={400}
                height={400}
              />
            </div>
            <span id="rewardId" />
          </div>
        ) : (
          <>
            <div className="flex flex-row gap-8 mt-6">
              <Bar
                percentage={scorePercentage}
                color="green"
              />
              <Bar
                percentage={100 - scorePercentage}
                color="red"
              />
            </div>
            <div className="flex flex-row gap-8">
              <p>{score} Correct</p>
              <p>{totalQuestions - score} Incorrect</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default QuizzSubmission;
