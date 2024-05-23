import { db } from "@/db";
import { quizzes, questions as dbQuestions, answers } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

type Quizz = InferInsertModel<typeof quizzes>;
type Question = InferInsertModel<typeof dbQuestions>;
type Answer = InferInsertModel<typeof answers>;

interface SaveQuizzData extends Quizz {
  questions: Array<Question & { answers?: Answer[] }>;
}

export default async function saveQuizz(quizzData: SaveQuizzData) {
  const { name, description, questions } = quizzData;

  const newQuizz = await db
    .insert(quizzes)
    .values({
      name,
      description,
    })
    .returning({ insertedId: quizzes.id });

  const quizzId = newQuizz[0].insertedId;

  await db.transaction(async (tx) => {
    for (const q of questions) {
      const [{ questionId }] = await tx
        .insert(dbQuestions)
        .values({
          text: q.text,
          quizzId,
        })
        .returning({ questionId: dbQuestions.id });

      if (q.answers && q.answers.length > 0) {
        await tx.insert(answers).values(
          q.answers.map((answer) => ({
            text: answer.text,
            isCorrect: answer.isCorrect,
            questionId,
          }))
        );
      }
    }
  });

  return { quizzId };
}
