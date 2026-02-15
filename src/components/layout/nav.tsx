import Link from 'next/link';

export default function Nav() {
	return (
		<header className='z-1m border-foreground bg-background fixed top-0 h-12 w-screen border-b-2 p-0'>
			<nav className='flex h-12 flex-row justify-between'>
				<Link
					href='/'
					className='flex flex-row items-center justify-start gap-2 p-4'
				>
					<span className={`text-foreground font-mono text-2xl font-bold`}>
						Association Quizzes
					</span>
				</Link>

				{/* end links */}
				<div className='flex flex-row items-stretch justify-end'></div>
			</nav>
		</header>
	);
}
