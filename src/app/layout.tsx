import { type Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Footer from '@/components/layout/footer';
import { Analytics } from '@vercel/analytics/next';
import { PersonalRootUrl, RootUrl } from '@/lib/constants';
import { fontSans } from './fonts';

const Title = 'Association Quizzes';
const Description = 'Take various assocative quizzes to determine which alignment you fit the best';

export const metadata: Metadata = {
	title: {
		absolute: Title,
		default: Title,
		template: `%s | ${Title}`
	},
	description: Description,
	openGraph: {
		type: 'website',
		locale: 'en-US',
		url: PersonalRootUrl,
		title: {
			absolute: Title,
			default: Title,
			template: `%s | ${Title}`
		},
		description: Description,
		countryName: 'United States',
		siteName: Title,
		images: [
			/**
			`${RootUrl}/logo.svg`
		*/
		]
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
		title: {
			absolute: Title,
			default: Title,
			template: `%s | ${Title}`
		}
	},
	icons: [
		/**
		`${RootUrl}/logo.svg`
	*/
	]
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en-us'>
			<head />
			<body
				className={cn('bg-background font-sans antialiased', fontSans.variable)}
			>
				{children}
				<Footer />
				<Analytics />
			</body>
		</html>
	);
}
