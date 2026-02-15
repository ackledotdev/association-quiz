import { KEYS } from '@/lib/constants';
import { QuizDisplayData } from '@/lib/redisSchema';
import { createClient } from 'redis';

export async function GET() {
	const redis = await createClient({
		url: process.env.REDIS_URL
	}).connect();

	const hashes = await redis.lRange(KEYS.QUIZ_STACK, 0, -1);

	const quizStack: QuizDisplayData[] = [];

	for (const hash of hashes) {
		const quiz = await redis.hGet(KEYS.QUIZ_HASHSET_DATA, hash);
		if (!quiz) continue;
		const { title, description } = JSON.parse(quiz);
		quiz &&
			quizStack.push({
				hash,
				title,
				description
			} satisfies QuizDisplayData);
	}

	return new Response(JSON.stringify(quizStack));
}
