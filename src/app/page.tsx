import QuizzesGrid from '@/components/blocks/QuizzesGrid';
import Link from '@/components/misc/Link';
import { Suspense } from 'react';

export default function HomePage() {
	return (
		<>
			<main className='flex min-h-[calc(100vh-3rem-20rem)] flex-col items-center justify-center px-12 lg:px-16 xl:px-24'>
				<h1 className='mb-12 text-3xl'>All Quizzes</h1>
				<Suspense fallback={<p>Loading quizzes...</p>}>
					<QuizzesGrid />
				</Suspense>
				<h2 className='mt-16 mb-8 text-xl'>Quiz Builder</h2>
				<p className='text-center'>
					Use the <Link href='/builder/'>quiz builder</Link> to create your own
					quizzes and share them with others. Create individual questions with
					the question builder, then add them all to the main quiz builder and
					save your quiz!
				</p>
			</main>
		</>
	);
}
