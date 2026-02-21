'use client';

import { memo, useDeferredValue, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import RedStar from '../misc/RedStar';
import AnswerBlock from './blocks/Answer';
import { useCopyToClipboard, useLocalStorage, useMap } from 'usehooks-ts';
import { Answer, Question } from '@/lib/schema';
import { toast } from 'sonner';
import { ScrollArea } from '../ui/scroll-area';
import { Copy } from 'lucide-react';
import { highlight } from 'sugar-high';

function QuestionBuilder() {
	const [, copy] = useCopyToClipboard();

	const [question, setQuestion] = useState('');
	const questionRef = useRef<HTMLInputElement>(null);

	const BlankAnswer: Answer = {
		response: '',
		association: [
			{
				option: '',
				weight: 10
			}
		]
	};

	const [answers, actionAnswers] = useMap(
		new Map<number, Answer | null>().set(0, BlankAnswer)
	);
	const [highestIndex, setHighestIndex] = useState(0);

	const questionJson = JSON.stringify(
		{
			question,
			answers: Array.from(answers.values()).filter(
				(answer): answer is Answer => answer !== null
			)
		} satisfies Question,
		null,
		4
	);
	const deferredQuestionJson = useDeferredValue(questionJson, '');
	const deferredIsStale = deferredQuestionJson !== questionJson;

	return (
		<div className='my-4 py-4'>
			<Label htmlFor='input-question' className='mb-2'>
				<RedStar /> Question
			</Label>
			<Input
				id='input-question'
				ref={questionRef}
				placeholder="What's your favorite food?"
				className='mb-4 w-full self-stretch'
				onChange={() => setQuestion(questionRef.current!.value)}
			/>

			{...Array.from(
				answers.entries().map(
					([index, answer]) =>
						answer && (
							<AnswerBlock
								index={index}
								key={index}
								answer={answer}
								onChange={(newAnswer) => {
									actionAnswers.set(index, newAnswer);
									setHighestIndex((prev) => Math.max(prev, index));
								}}
								deletable={index !== 0}
								onDelete={() => {
									actionAnswers.set(index, null);
									if (index === highestIndex) lowerHighestIndex();
								}}
							/>
						)
				)
			)}

			<Button
				onClick={addAnswer}
				className='mt-4'
				size='sm'
				variant='secondary'
			>
				Add Answer
			</Button>

			<ScrollArea className='border-muted-foreground mt-16 block h-96 max-h-64 rounded-lg border-2 p-4'>
				<Button
					className='border-muted-foreground absolute top-4 right-4 w-10'
					onClick={exportQuestion}
					size='lg'
					variant='outline'
					disabled={deferredIsStale}
				>
					<Copy size={20} />
				</Button>
				<pre
					className='rounded-lg text-left font-mono wrap-break-word whitespace-pre-wrap'
					dangerouslySetInnerHTML={{
						__html: highlight(deferredQuestionJson, {})
					}}
				>
					{/* {deferredQuestionJson} */}
				</pre>
			</ScrollArea>
		</div>
	);

	function addAnswer() {
		actionAnswers.set(answers.size, BlankAnswer);
	}

	function lowerHighestIndex() {
		setHighestIndex((prev) => {
			let newHighest = prev - 1;
			while (newHighest >= 0 && !answers.has(newHighest)) {
				newHighest--;
			}
			return newHighest >= 0 ? newHighest : 0;
		});
	}

	function exportQuestion() {
		if (!question) return toast.error('Question cannot be empty.');
		const answersArray = Array.from(answers.values()).filter(
			(ans) => ans !== null
		);
		if (answersArray.length === 0)
			return toast.error('At least one answer is required.');
		if (answersArray.some((answer) => !answer.response))
			return toast.error('All answers must have a response.');
		if (
			answersArray.some((answer) =>
				answer.association.some((assoc) => !assoc.option)
			)
		)
			return toast.error('All associations must have an option.');

		toast.promise(copy(questionJson), {
			loading: 'Copying question data to clipboard...',
			success: 'Question data copied to clipboard!',
			error: 'Failed to copy question data to clipboard.'
		});
	}
}

export default memo(QuestionBuilder);
