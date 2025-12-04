import QuestionBuilder from '@/components/builders/QuestionBuilder';
import QuizBuilder from '@/components/builders/QuizBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalRootUrl, RootUrl } from '@/lib/constants';
import { Metadata } from 'next';

const Title = 'Builder',
	Description = 'Build your own quizzes';

export const metadata: Metadata = {
	title: Title,
	description: Description,
	openGraph: {
		type: 'website',
		locale: 'en-US',
		url: `${PersonalRootUrl}/builder/`,
		title: Title,
		description: Description,
		countryName: 'United States',
		siteName: 'Builder | Associative Quiz'
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
		title: 'Builder | Associative Quiz'
	}
};

export default function BuilderPage() {
	return (
		<main className='m-8 flex flex-col items-center gap-8 px-4 *:text-center lg:m-16'>
			<Tabs defaultValue='question'>
				<TabsList>
					<TabsTrigger value='quiz'>Quiz</TabsTrigger>
					<TabsTrigger value='question'>Question</TabsTrigger>
				</TabsList>
				<TabsContent value='question'>
					<QuestionBuilder />
				</TabsContent>
				<TabsContent value='quiz'>
					<QuizBuilder />
				</TabsContent>
			</Tabs>
		</main>
	);
}
