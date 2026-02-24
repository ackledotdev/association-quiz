import Uploader from '@/components/blocks/Uploader';
import { Toaster } from '@/components/ui/sonner';
import { PersonalRootUrl } from '@/lib/constants';
import { Metadata } from 'next';

const Title = 'Upload',
	Description = 'Upload your quiz';

export const metadata: Metadata = {
	title: Title,
	description: Description,
	openGraph: {
		type: 'website',
		locale: 'en-US',
		url: `${PersonalRootUrl}/upload/`,
		title: Title,
		description: Description,
		countryName: 'United States',
		siteName: 'Upload | Associative Quiz'
	},
	authors: [
		{
			name: 'Akhil Pillai',
			url: 'https://ackle.dev/'
		}
	],
	twitter: {
		card: 'summary_large_image',
		description: Description,
		title: 'Upload | Associative Quiz'
	}
};

export default function BuilderPage() {
	return (
		<>
			<main className='flex min-h-[calc(100vh-3rem-20rem)] flex-col items-center justify-center px-12 pt-12 lg:px-16 xl:px-24'>
				<h1 className='mb-8 text-center text-4xl font-bold'>Upload Quiz</h1>
				<Uploader />
			</main>
			<Toaster />
		</>
	);
}
