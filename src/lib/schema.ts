import z from 'zod';

export interface QuizData {
	title: string;
	description: string;
	questions: Question[];
	options: AssociativeOption[];
	explanations?: OptionExplanationSet;
}

export type OptionExplanationSet = Record<AssociativeOption, string>;

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

const zod = { StringNonEmpty: (err: string) => z.string().min(1, err) };

export const QuestionSchema = z.object({
	question: zod.StringNonEmpty('Question cannot be empty.'),
	answers: z
		.array(
			z.object({
				association: z
					.array(
						z.object({
							option: zod.StringNonEmpty('Answer association cannot be empty.'),
							weight: z
								.int('Weight must be an integer between 1 and 10.')
								.min(1, 'Weight must be at least 1.')
								.max(10, 'Weight must be at most 10.')
						})
					)
					.min(1),
				response: zod.StringNonEmpty('Response cannot be empty.')
			})
		)
		.min(2, 'At least two answers are required.')
});

export const QuizSchema = z
	.strictObject({
		title: zod.StringNonEmpty('Title cannot be empty.'),
		description: zod.StringNonEmpty('Description cannot be empty.'),
		questions: z
			.array(QuestionSchema)
			.min(1, 'At least one question is required.'),
		options: z
			.array(zod.StringNonEmpty('Option cannot be empty.'))
			.min(2, 'At least two results are required.'),
		explanations: z.optional(z.record(z.string(), z.string()))
	})
	.refine(
		(obj) =>
			obj.questions.every((q) =>
				q.answers.every((a) =>
					a.association.every((assoc) => obj.options.includes(assoc.option))
				)
			),
		{
			message: 'All associations must be included in the options array.'
		}
	)
	.refine(
		(obj) =>
			!obj.explanations ||
			Object.keys(obj.explanations).every((option) =>
				obj.options.includes(option)
			),
		{
			message: 'All explanation keys must be included in the options array.'
		}
	)
	.refine(
		(obj) =>
			!obj.explanations ||
			obj.options.every(
				(option) =>
					option in obj.explanations! && obj.explanations![option].length > 0
			),
		{
			message:
				'All explanation keys must be included in the options array and be non-empty.'
		}
	);
