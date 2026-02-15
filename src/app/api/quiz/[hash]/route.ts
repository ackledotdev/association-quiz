import { KEYS } from '@/lib/constants';
import { createClient } from 'redis';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ hash: string }> }
) {
	const { hash } = await params;

	const redis = await createClient({
		url: process.env.REDIS_URL
	}).connect();

	const quizData = await redis.hGet(KEYS.QUIZ_HASHSET_DATA, hash);

	redis.close();

	if (!quizData) return new Response('Quiz not found', { status: 404 });

	return new Response(quizData, {
		headers: { 'Content-Type': 'application/json' }
	});
}
