import QuizzesGrid from '@/components/blocks/QuizzesGrid';
import { Suspense } from 'react';

export default function HomePage() {
	return (
		<>
			<main className='flex min-h-[calc(100vh-3rem-20rem)] flex-col items-center justify-center gap-12 px-12 lg:px-16 xl:px-24'>
				<h1 className='text-3xl'>All Quizzes</h1>
				<Suspense fallback={<p>Loading quizzes...</p>}>
					<QuizzesGrid />
				</Suspense>
			</main>
		</>
	);
}
