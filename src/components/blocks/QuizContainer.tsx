'use client';

import Bar from '@/components/misc/Bar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { dataUrlToFile, useScreenshot } from '@/hooks/useScreenshot';
import { PersonalRootUrl } from '@/lib/constants';
import { Quiz as _Quiz } from '@/lib/Quiz';
import { QuizData, QuizResponse, QuizScore } from '@/lib/schema';
import { RefObject, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function QuizContainer({ data }: { data: QuizData }) {
	const Quiz = new _Quiz(data);

	const [responses, setResponses] = useState<QuizResponse>([]);

	const [descHidden, setDescHidden] = useState(false);
	const [questionsHidden, setQuestionsHidden] = useState(true);
	const [resultsHidden, setResultsHidden] = useState(true);

	const [qIndex, setQIndex] = useState(-1);

	const [checkboxes, setCheckboxes] = useState<boolean[]>([]);

	const [grade, setGrade] = useState<QuizScore>();

	const resultsRef = useRef<HTMLDivElement>(null);
	const { captureScreenshot, isCapturing } = useScreenshot();

	return (
		<>
			<main className='m-8 flex flex-col items-center gap-8 px-4 *:text-center lg:m-16'>
				<h1 className='text-4xl font-bold'>{Quiz.title}</h1>
				<div
					id='quiz-container'
					className='min-h-72 self-stretch md:px-12 lg:px-24 xl:px-36 2xl:px-48'
				>
					<p
						id='quiz-description'
						style={{ display: descHidden ? 'none' : 'block' }}
						className='self-stretch'
					>
						{Quiz.description}
					</p>

					<div
						id='quiz-questions'
						style={{ display: questionsHidden ? 'none' : 'grid' }}
						className='grid-cols-2 gap-4 self-stretch lg:grid-cols-3'
					>
						<h2 className='col-span-full text-2xl font-bold'>
							Question {qIndex + 1} of {Quiz.length()}:
						</h2>
						<p className='col-span-full text-lg'>
							{Quiz.getQuestionResponseSet(qIndex)?.question}
						</p>
						{Quiz.getQuestionResponseSet(qIndex)?.answers.map((ans, i) => {
							return (
								<Label
									key={i}
									className='hover:bg-accent/50 flex items-start gap-3 rounded-lg border-2 border-gray-500 p-3 has-aria-checked:border-lime-600'
								>
									<Checkbox
										id={`cb-${i}`}
										className='data-[state=checked]:border-lime-600 data-[state=checked]:bg-lime-300'
										checked={checkboxes[i]}
										onCheckedChange={(checked) => {
											const newCheckboxes = [...checkboxes];
											newCheckboxes[i] = checked as boolean;
											setCheckboxes(newCheckboxes);
										}}
									/>
									<span className='block'>{ans.response}</span>
								</Label>
							);
						})}
					</div>

					<div
						id='quiz-results'
						style={{
							display: resultsHidden ? 'none' : 'flex'
						}}
						className='flex-col gap-2'
					>
						<div
							id='quiz-results-shareable'
							className='bg-background text-foreground grid grid-cols-[8em_auto_4em] gap-2 self-stretch md:gap-4 lg:grid-cols-[12em_auto_8em] lg:gap-6'
							ref={resultsRef}
						>
							<h2 className='col-span-full text-2xl font-bold'>Your Results</h2>
							<p className='text-right text-sm leading-loose lg:text-base'>
								{...grade?.map((g) => (
									<>
										<span>{g.option}</span>
										<br />
									</>
								)) ?? []}
							</p>
							<div className='flex flex-col gap-3 pt-2 lg:gap-4'>
								{grade?.map((g, i) => (
									<Bar
										key={i}
										colorStart='#ffaaaa'
										colorEnd='#ff0000'
										bgColor='#88888890'
										width={Math.round(g.weight)}
									/>
								))}
							</div>
							<p className='text-left text-sm leading-loose lg:text-base'>
								{...grade?.map((g) => (
									<>
										<span>{Math.round(g.weight)}%</span>
										<br />
									</>
								)) ?? []}
							</p>
							<p className='col-span-full text-sm lg:pt-4 lg:text-base'>
								You are a{' '}
								<span className='font-bold'>{grade?.at(0)!.option}</span>!
								<br />
								(Matched{' '}
								<span className='font-bold'>
									{grade?.at(0)!.weight.toFixed(2)}%
								</span>
								)
							</p>
							<p className='col-span-full text-sm lg:pt-4 lg:text-base'>
								{Quiz.explanations?.[grade?.at(0)!.option ?? ''] ?? ''}
							</p>
							<p className='col-span-full text-sm text-neutral-400 italic lg:text-base'>
								* Results may not be 100% accurate and are for entertainment
								purposes only.
							</p>
						</div>
						<div className='flex flex-row justify-center gap-4'>
							<Button
								onClick={() => {
									captureScreenshot(resultsRef as RefObject<HTMLElement>).then(
										(dataUrl) => {
											const file = dataUrlToFile(dataUrl, 'quiz-results.png');
											const payload: ShareData = {
												files: [file],
												text: 'My Literary Criticism Quiz Results!',
												url: PersonalRootUrl
											};
											if (
												navigator.canShare &&
												navigator.share &&
												navigator.canShare(payload)
											)
												navigator.share(payload);
											else {
												// copy file
												navigator.clipboard.write([
													new ClipboardItem({
														[file.type]: file
													})
												]);
												toast.success(
													'Results screenshot copied to clipboard!'
												);
											}
										}
									);
								}}
								disabled={isCapturing}
							>
								Share Results
							</Button>
							<Button
								onClick={() => {
									setDescHidden(false);
									setQuestionsHidden(true);
									setResultsHidden(true);
									setQIndex(-1);
									setResponses([]);
									setCheckboxes([]);
									setGrade(undefined);
								}}
							>
								Retake Quiz
							</Button>
						</div>
					</div>
				</div>
				<Button
					onClick={advance}
					style={{ display: resultsHidden ? 'block' : 'none' }}
				>
					{qIndex < 0
						? 'Start'
						: qIndex === Quiz.length() - 1
							? 'Finish'
							: 'Next'}
				</Button>
			</main>
			<Toaster position='top-right' />
		</>
	);

	async function advance() {
		const q = Quiz.getQuestionResponseSet(qIndex);

		// first click, quiz loaded but questions have not started
		if (!descHidden) {
			setDescHidden(true);
			setQuestionsHidden(false);
		}
		// last question
		else if (qIndex === Quiz.length() - 1) {
			for (let i = 0; i < q!.answers.length; i++)
				if (checkboxes[i])
					for (const association of q!.answers[i].association)
						setResponses((prev) => [
							...prev,
							{ option: association.option, weight: association.weight }
						]);

			setGrade(Quiz.evaluateScore(responses));
			setQuestionsHidden(true);
			setResultsHidden(false);
		} else
			for (let i = 0; i < q!.answers.length; i++) {
				if (checkboxes[i]) {
					for (const association of q!.answers[i].association)
						setResponses((prev) => [
							...prev,
							{ option: association.option, weight: association.weight }
						]);
				}
			}

		setQIndex(qIndex + 1);
		setCheckboxes(
			new Array(
				Quiz.getQuestionResponseSet(qIndex + 1)?.answers.length ?? 0
			).fill(false)
		);
	}
}
