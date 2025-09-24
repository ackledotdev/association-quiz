import z from 'zod';

export interface QuizData {
	title: string;
	description: string;
	questions: Question[];
	options: AssociativeOption[];
	explanations?: Record<AssociativeOption, string>;
}

export interface ValidQuizData extends QuizData {}

export type AssociativeOption = string;

export interface Question {
	question: string;
	answers: Answer[];
}

export interface Answer {
	association: WeightedOption[];
	response: string;
}

export interface WeightedOption {
	option: AssociativeOption;
	weight: number;
}

export type QuizResponse = WeightedOption[];

export type QuizScore = WeightedOption[];

const zod = { StringNonEmpty: z.string().min(1) };
export const QuizSchema = z.strictObject({
	title: zod.StringNonEmpty,
	description: zod.StringNonEmpty,
	questions: z
		.array(
			z.object({
				question: zod.StringNonEmpty,
				answers: z
					.array(
						z.object({
							association: z
								.array(
									z.object({
										option: zod.StringNonEmpty,
										weight: z.int().min(1).max(10)
									})
								)
								.min(1),
							response: zod.StringNonEmpty
						})
					)
					.min(2)
			})
		)
		.min(1),
	options: z.array(zod.StringNonEmpty).min(2),
	explanations: z.object({}).catchall(zod.StringNonEmpty).optional()
});
