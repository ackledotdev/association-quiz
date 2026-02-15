import { QuizData } from './schema';

export type QuizDisplayData = Omit<
	Omit<Omit<QuizData, 'questions'>, 'options'>,
	'explanations'
> & {
	hash: string;
};
