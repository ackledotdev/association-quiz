'use client';

import Bar from '@/components/misc/Bar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PersonalDomain, PersonalRootUrl } from '@/lib/constants';
import { Quiz as _Quiz } from '@/lib/Quiz';
import { ResponseCollector } from '@/lib/ResponseCollector';
import { QuizResponse, QuizScore } from '@/lib/schema';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
	useEffect(() => {
		if (window.location.host != PersonalDomain)
			window.location.href = PersonalRootUrl;
	});

	const [Quiz, setQuiz] = useState<_Quiz>();

	const [responses, setResponses] = useState<QuizResponse>([]);

	const [importHidden, setImportHidden] = useState(false);
	const [descHidden, setDescHidden] = useState(true);
	const [questionsHidden, setQuestionsHidden] = useState(true);
	const [resultsHidden, setResultsHidden] = useState(true);

	const [qIndex, setQIndex] = useState(-1);

	const [checkboxes, setCheckboxes] = useState<boolean[]>([]);

	const [grade, setGrade] = useState<QuizScore>();

	return (
		<main className='m-8 flex flex-col items-center gap-8 px-4 *:text-center lg:m-16'>
			<h1 className='text-4xl font-bold'>{Quiz?.title ?? 'Load Quiz'}</h1>
			<div
				id='quiz-container'
				className='min-h-72 self-stretch md:px-12 lg:px-24 xl:px-36 2xl:px-48'
			>
				<div
					id='quiz-import'
					style={{ display: importHidden ? 'none' : 'flex' }}
					className='flex-col items-center gap-2'
				>
					<Label htmlFor='quiz-url'>Quiz URL</Label>
					<Input
						id='quiz-url'
						type='url'
						className='w-full max-w-lg'
						placeholder='https://quiz.ackle.dev/literary-criticism-quiz.json'
					/>
				</div>

				<p
					id='quiz-description'
					style={{ display: descHidden ? 'none' : 'block' }}
					className='self-stretch'
				>
					{Quiz?.description}
				</p>

				<div
					id='quiz-questions'
					style={{ display: questionsHidden ? 'none' : 'grid' }}
					className='grid-cols-2 gap-4 self-stretch lg:grid-cols-3'
				>
					<h2 className='col-span-full text-2xl font-bold'>
						Question {qIndex + 1} of {Quiz?.length()}:
					</h2>
					<p className='col-span-full text-lg'>
						{Quiz?.getQuestionResponseSet(qIndex)?.question}
					</p>
					{Quiz?.getQuestionResponseSet(qIndex)?.answers.map((ans, i) => {
						return (
							<Label
								key={i}
								className='hover:bg-accent/50 flex items-start gap-3 rounded-lg border border-black p-3 has-[[aria-checked=true]]:border-lime-600 has-[[aria-checked=true]]:bg-lime-50'
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
						display: resultsHidden ? 'none' : 'grid'
					}}
					className='grid-cols-[8em_auto_4em] gap-2 self-stretch md:gap-4 lg:grid-cols-[12em_auto_8em] lg:gap-6'
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
								colorStart='#aaffff'
								colorEnd='#00ffff'
								bgColor='#dddddd'
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
						You are a <span className='font-bold'>{grade?.at(0)!.option}</span>!
						<br />
						(Matched{' '}
						<span className='font-bold'>
							{grade?.at(0)!.weight.toFixed(2)}%
						</span>
						)
					</p>
					<p className='col-span-full text-sm lg:pt-4 lg:text-base'>
						{Quiz?.explanations?.[grade?.at(0)!.option ?? ''] ?? ''}
					</p>
					<p className='col-span-full text-sm text-neutral-500 italic lg:text-base'>
						* Results may not be 100% accurate and are for entertainment
						purposes only.
					</p>
				</div>
			</div>
			<Button
				onClick={advance}
				style={{ display: resultsHidden ? 'block' : 'none' }}
			>
				{Quiz
					? qIndex < 0
						? 'Start'
						: qIndex === Quiz.length() - 1
							? 'Finish'
							: 'Next'
					: 'Load'}
			</Button>
		</main>
	);

	async function advance() {
		if (!Quiz) {
			const urlInput = document.getElementById('quiz-url') as HTMLInputElement;
			if (!urlInput.value) return alert('Please enter a URL to quiz data.');
			try {
				const Url = new URL(urlInput.value);
				const res = await fetch(Url);
				if (!res.ok)
					return alert(
						'Failed to fetch quiz data. Please check the URL and try again.'
					);

				const json = (await res.json()) as unknown;
				if (!_Quiz.validateQuizData(json)) return alert('Invalid quiz data.');

				setQuiz(new _Quiz(json));
				setImportHidden(true);
				setDescHidden(false);
			} catch {
				return alert(
					'Failed to load quiz data. Please check the URL and try again.'
				);
			}
			return;
		}

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
