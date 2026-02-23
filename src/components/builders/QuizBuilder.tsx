'use client';

import { Label } from '../ui/label';
import RedStar from '../misc/RedStar';
import { Input } from '../ui/input';
import { memo, useDeferredValue, useEffect, useRef, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { useCopyToClipboard, useMap } from 'usehooks-ts';
import RawQuestionInput from './blocks/RawQuestionInput';
import { toast } from 'sonner';
import { OptionExplanationSet, Question, QuizData } from '@/lib/schema';
import { Button } from '../ui/button';
import { highlight } from 'sugar-high';
import { ScrollArea } from '../ui/scroll-area';
import { Copy, Download } from 'lucide-react';
import Link from 'next/link';
import WeightedOption from './blocks/WeightedOption';
import OptionExplanation from './blocks/OptionExplanation';

function QuizBuilder() {
	const [_, copy] = useCopyToClipboard();

	const quizRef = useRef<HTMLInputElement>(null);
	const descRef = useRef<HTMLTextAreaElement>(null);

	const [questions, setQuestions] = useState<string[]>(['']);

	const BlankOptionExplanationSet: OptionExplanationSet = {
		option: '',
		explanation: ''
	};

	const [options, setOptions] = useState<OptionExplanationSet[]>([
		BlankOptionExplanationSet
	]);

	const quizJson = JSON.stringify(
		{
			title: quizRef.current?.value ?? '',
			description: descRef.current?.value ?? '',
			questions: Array.from(questions.values()).map((question) => {
				let q;
				try {
					q = JSON.parse(question);
				} catch {}
				return q ?? undefined;
			}),
			options: Array.from(options.values()).map((option) => option.option),
			explanations: options.reduce(
				(acc, { option, explanation }) => {
					if (acc && explanation.length > 0) acc[option] = explanation;
					else return undefined;
					return acc;
				},
				{} as OptionExplanationSet | undefined
			)
		} satisfies QuizData,
		null,
		2
	);
	const deferredQuizJson = useDeferredValue(quizJson, '');
	const deferredIsStale = deferredQuizJson !== quizJson;

	const [blobUrl, setBlobUrl] = useState('');
	useEffect(() => {
		if (blobUrl) URL.revokeObjectURL(blobUrl);
		const newBlob = new Blob([quizJson], { type: 'application/json' });
		const newBlobUrl = URL.createObjectURL(newBlob);
		setBlobUrl(newBlobUrl);
		return () => {
			URL.revokeObjectURL(newBlobUrl);
		};
	}, [quizJson]);

	return (
		<div className='min-w-lg'>
			<Label htmlFor='input-quiz' className='mb-2 pl-1'>
				Title <RedStar />
			</Label>
			<Input
				id='input-quiz'
				ref={quizRef}
				placeholder='What type of person are you?'
				className='mb-4 w-full self-stretch'
			/>

			<Label htmlFor='input-description' className='mb-2 pl-1'>
				Description <RedStar />
			</Label>
			<Textarea
				id='input-description'
				ref={descRef}
				placeholder='A quiz to determine what type of person you are based on your food preferences.'
				className='mb-8 self-stretch'
			/>

			<div className='flex flex-col gap-4'>
				{questions.map((questn, index) => (
					<RawQuestionInput
						index={index}
						key={index}
						value={questn}
						onChange={(questn) =>
							setQuestions(questions.toSpliced(index, 1, questn))
						}
						deletable={index !== 0}
						onDelete={() => setQuestions(questions.toSpliced(index, 1))}
					/>
				))}
			</div>

			<Button
				className='border-muted-foreground mt-4 mb-8'
				onClick={addQuestion}
				size='sm'
				variant='outline'
			>
				Add Question
			</Button>

			<div className='flex flex-col gap-4'>
				{options.map((option, index) => (
					<OptionExplanation
						deletable={index !== 0}
						option={option.option}
						explanation={option.explanation}
						index={index}
						key={index}
						onChange={(option, explanation) =>
							setOptions(
								options.toSpliced(index, 1, {
									option,
									explanation
								})
							)
						}
						onDelete={() => setOptions(options.toSpliced(index, 1))}
					/>
				))}
			</div>

			<Button
				className='border-muted-foreground mt-4 mb-8'
				onClick={addOption}
				size='sm'
				variant='outline'
			>
				Add Option
			</Button>

			<ScrollArea className='border-muted-foreground mt-16 block h-96 max-h-64 rounded-lg border-2 p-4'>
				<Button
					className='border-muted-foreground absolute top-4 right-4 w-8'
					onClick={copyQuiz}
					size='sm'
					variant='outline'
					disabled={deferredIsStale}
				>
					<Copy size={8} />
				</Button>
				<Button
					className='border-muted-foreground absolute top-4 right-15 w-8'
					asChild
					disabled={deferredIsStale}
					size='sm'
					variant='outline'
				>
					<Link
						href={blobUrl}
						className='m-0 p-0'
						download='quiz.json'
						onClick={() => toast.success('Downloading quiz data as JSON file!')}
					>
						<Download size={8} />
					</Link>
				</Button>
				<pre
					className='rounded-lg text-left font-mono text-sm wrap-anywhere whitespace-pre-wrap'
					dangerouslySetInnerHTML={{
						__html: highlight(deferredQuizJson, {})
					}}
				/>
			</ScrollArea>
		</div>
	);

	function addQuestion() {
		setQuestions([...questions, '']);
	}

	function addOption() {
		setOptions([...options, BlankOptionExplanationSet]);
	}

	function exportQuiz() {
		// if (!question) return toast.error('Question cannot be empty.');
		// const answersArray = Array.from(questions.values()).filter(
		// 	(ans) => ans !== null
		// );
		// if (answersArray.length === 0)
		// 	return toast.error('At least one answer is required.');
		// if (answersArray.some((answer) => !answer.response))
		// 	return toast.error('All answers must have a response.');
		// if (
		// 	answersArray.some((answer) =>
		// 		answer.association.some((assoc) => !assoc.option)
		// 	)
		// )
		// return toast.error('All associations must have an option.');

		return quizJson;
	}

	function copyQuiz() {
		const text = exportQuiz();
		text &&
			toast.promise(copy(text), {
				loading: 'Copying quiz data to clipboard...',
				success: 'Quiz data copied to clipboard!',
				error: 'Failed to copy quiz data to clipboard.'
			});
	}
}

export default memo(QuizBuilder);
