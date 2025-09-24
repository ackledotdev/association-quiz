import { Poppins as FontSans } from 'next/font/google';

export const fontSans = FontSans({
	variable: '--font-sans',
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
	display: 'swap'
});
