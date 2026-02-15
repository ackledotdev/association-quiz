import { QuizDisplayData } from '@/lib/redisSchema';
// import { useState } from 'react';
import QuizTile from './QuizTile';
import { KEYS } from '@/lib/constants';
import { createClient } from 'redis';

export default async function QuizzesGrid() {
	// const [quizzes, setQuizzes] = useState<QuizDisplayData[]>([]);
	// const data = (await fetch('/api/quizzes/all/').then((res) =>
	// 	res.json()
	// )) as QuizDisplayData[];
	// setQuizzes(data);

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

	return (
		<div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
			{quizStack.map((quiz) => (
				<QuizTile key={quiz.hash} data={quiz} />
			))}
		</div>
	);
}
