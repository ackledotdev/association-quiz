import { KEYS } from '@/lib/constants';
import { validateQuizData } from '@/lib/helpers';
import { createClient } from 'redis';

export async function POST(request: Request) {
	const quizData = await request.json();
	const authHeader = request.headers.get('Authorization');

	const redis = await createClient({
		url: process.env.REDIS_URL
	}).connect();

	if (authHeader !== `Custom ${await redis.get(KEYS.QUIZ_UPLOAD_KEY)}`)
		return new Response('Unauthorized', { status: 401 });

	if (!validateQuizData(quizData))
		return new Response('Invalid quiz data', { status: 400 });

	for (let i = 0; i < 32; i++) {
		const hashes = await redis.lRange(KEYS.QUIZ_STACK, 0, -1);
		const hash = Math.random().toString(36).toLowerCase().substring(2, 9);
		const key = KEYS.QUIZ_HASHSET_DATA;
		if (!hashes.includes(hash)) {
			await redis.hSet(key, hash, JSON.stringify(quizData));
			await redis.lPush(KEYS.QUIZ_STACK, hash);
			return new Response(hash, { status: 200 });
		}
	}

	return new Response('Failed to generate unique hash', { status: 500 });
}
