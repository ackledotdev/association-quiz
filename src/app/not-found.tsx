'use client';

import { useEffect } from 'react';

export default function NotFound() {
	useEffect(() => {
		setTimeout(() => window.location.replace('/'), 3000);
	}, []);

	return (
		<>
			<main className='full-content-class gap-6 px-16 lg:px-24'>
				<h1 className='text-3xl'>Not Found</h1>
				<p className='text-center leading-loose lg:mb-0 lg:w-full lg:max-w-5xl'>
					Redirecting in 3 seconds...
				</p>
			</main>
		</>
	);
}
