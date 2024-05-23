import {
  timestamp,
  serial,
  text,
  primaryKey,
  integer,
  boolean,
  pgEnum,
  pgTable,
} from "drizzle-orm/pg-core";

import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  userId: text("user_id"),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text"),
  quizzId: integer("quizz_id"),
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id"),
  text: text("text"),
  isCorrect: boolean("is_correct"),
});

export const quizzesRelations = relations(quizzes, ({ many, one }) => ({
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quizz: one(quizzes, {
    fields: [questions.quizzId],
    references: [quizzes.id],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));
