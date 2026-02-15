import {
	QuizData,
	QuizResponse,
	AssociativeOption,
	QuizScore,
	ValidQuizData,
	QuizSchema
} from './schema';

export function evaluateQuizScore(quiz: QuizData, responses: QuizResponse) {
	const scoreMap = new Map<AssociativeOption, number>();

	for (const response of responses)
		scoreMap.set(
			response.option,
			(scoreMap.get(response.option) ?? 0) + response.weight
		);

	const maxScoreMap = new Map<AssociativeOption, number>();
	for (const question of quiz.questions) {
		for (const answer of question.answers)
			for (const association of answer.association)
				maxScoreMap.set(
					association.option,
					(maxScoreMap.get(association.option) ?? 0) + association.weight
				);
	}

	for (const option of quiz.options) {
		if (!scoreMap.has(option)) scoreMap.set(option, 0);
		if (!maxScoreMap.has(option)) maxScoreMap.set(option, 0);
		scoreMap.set(
			option,
			(scoreMap.get(option)! / maxScoreMap.get(option)!) * 100
		);
	}

	const score: QuizScore = [];
	for (const [option, weight] of scoreMap) score.push({ option, weight });

	return score.sort((a, b) => b.weight - a.weight);
}

export function validateQuizData(data: unknown): data is ValidQuizData {
	const result = QuizSchema.safeParse(data);
	const expKeys = result.data?.explanations
		? Object.keys(result.data.explanations)
		: [];
	return (
		result.success &&
		result.data.options.every(
			(opt, i, arr) => arr.filter((o) => o === opt).length === 1
		) &&
		result.data.questions.every((q) =>
			q.answers.every((a) =>
				a.association.every((assoc) =>
					result.data.options.includes(assoc.option)
				)
			)
		) &&
		result.data.options.every((opt) =>
			result.data.questions.some((q) =>
				q.answers.some((a) =>
					a.association.some((assoc) => assoc.option === opt)
				)
			)
		) &&
		(!result.data.explanations ||
			(expKeys.every((key) => result.data.options.includes) &&
				result.data.options.every((opt) => expKeys.includes)))
	);
}
