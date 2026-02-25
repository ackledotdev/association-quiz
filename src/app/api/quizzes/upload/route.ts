import { KEYS } from '@/lib/constants';
import { QuizSchema } from '@/lib/schema';
import { createClient } from 'redis';

export async function POST(request: Request) {
	const quizData = await request.json();
	const authHeader = request.headers.get('Authorization');

	const redis = await createClient({
		url: process.env.REDIS_URL
	}).connect();

	if (authHeader !== `Custom ${await redis.get(KEYS.QUIZ_UPLOAD_KEY)}`)
		return new Response('Unauthorized', { status: 403 });

	if (!QuizSchema.safeParse(quizData).success)
		return new Response('Invalid quiz data', { status: 400 });

	for (let i = 0; i < 32; i++) {
		const hashes = await redis.lRange(KEYS.QUIZ_STACK, 0, -1);
		const hash = Math.random().toString(36).toLowerCase().substring(2, 9);
		if (!hashes.includes(hash)) {
			await redis.hSet(KEYS.QUIZ_HASHSET_DATA, hash, JSON.stringify(quizData));
			await redis.lPush(KEYS.QUIZ_STACK, hash);
			return new Response(hash, { status: 201 });
		}
	}

	redis.close();

	return new Response('Failed to generate unique hash', { status: 500 });
}
