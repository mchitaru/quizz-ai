"use server";

import { db } from "@/db";
import { results } from "@/db/schema";
import { InferInsertModel, eq } from "drizzle-orm";

type Result = InferInsertModel<typeof results>;

export async function saveResults(res: Result, quizzId: number) {
  const { score } = res;

  const newResult = await db
    .insert(results)
    .values({
      score,
      quizzId,
    })
    .returning({ id: results.id });

  const resultId = newResult[0].id;
  return resultId;
}
