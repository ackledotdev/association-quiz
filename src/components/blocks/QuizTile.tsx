import { QuizDisplayData } from '@/lib/redisSchema';
import Link from 'next/link';

export default function QuizTile({ data }: { data: QuizDisplayData }) {
	return (
		<Link
			prefetch
			className='flex h-32 w-full cursor-pointer items-center gap-4 rounded-lg bg-gray-100 p-4 transition hover:bg-gray-200'
			href={`/quiz/${data.hash}`}
		>
			<div className='flex flex-col gap-1'>
				<p className='text-sm font-semibold'>{data.title}</p>
				<p className='text-xs text-gray-600'>{data.description}</p>
			</div>
		</Link>
	);
}
