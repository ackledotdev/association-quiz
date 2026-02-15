import QuizContainer from '@/components/blocks/QuizContainer';
import Link from '@/components/misc/Link';
import { KEYS } from '@/lib/constants';
import { Quiz as _Quiz } from '@/lib/Quiz';
import { QuizData } from '@/lib/schema';
import { Suspense } from 'react';
import { createClient } from 'redis';

export default async function QuizPage({
	params
}: {
	params: Promise<{ hash: string }>;
}) {
	const { hash } = await params;
	const redis = await createClient({
		url: process.env.REDIS_URL
	}).connect();
	const quizData = await redis.hGet(KEYS.QUIZ_HASHSET_DATA, hash);

	if (!quizData) {
		return (
			<main className='m-8 flex flex-col items-center gap-8 px-4 *:text-center lg:m-16'>
				<h1 className='text-4xl font-bold'>Quiz Not Found</h1>
				<p className='text-lg'>The quiz you are looking for does not exist.</p>
				<Link href='/' className='block text-center'>
					Go Back
				</Link>
			</main>
		);
	}

	const json = JSON.parse(quizData) as QuizData;

	return (
		<Suspense
			fallback={
				<>
					<Link href='/' className='block text-center'>
						Go Back
					</Link>
					<div>Loading quiz...</div>
				</>
			}
		>
			<QuizContainer data={json} />
		</Suspense>
	);
}
