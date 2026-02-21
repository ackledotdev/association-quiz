import RedStar from '@/components/misc/RedStar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Answer, WeightedOption } from '@/lib/schema';
import { memo, useState } from 'react';
import { useMap } from 'usehooks-ts';
import WeightedOptionBlock from './WeightedOption';
import { Button } from '@/components/ui/button';

function AnswerBlock({
	answer,
	onChange,
	deletable,
	onDelete,
	index
}: {
	answer: Answer;
	onChange: (answer: Answer) => any;
	deletable: boolean;
	onDelete: (answer?: Answer) => any;
	index: number;
}) {
	const BlankAssociation: WeightedOption = {
		option: '',
		weight: 10
	};

	const [options, actionOptions] = useMap(
		new Map<number, WeightedOption | null>().set(0, BlankAssociation)
	);
	const [highestIndex, setHighestIndex] = useState(0);

	return (
		<div className='border-accent my-2 flex flex-col rounded-lg border-2 p-4'>
			<div className='mb-2 flex flex-row items-end justify-between'>
				<Label htmlFor={`input-answer-${index}`}>
					<RedStar />
					Answer
				</Label>
				{deletable && (
					<p
						className='text-destructive cursor-pointer self-center-safe rounded-full text-sm underline'
						onClick={() => deletable && onDelete(answer)}
					>
						Delete
					</p>
				)}
			</div>
			<Input
				id={`input-answer-${index}`}
				placeholder='Pizza'
				value={answer.response}
				onChange={(e) => onChange({ ...answer, response: e.target.value })}
			/>
			<Label
				className='mt-4 mb-2 flex items-center gap-1'
				htmlFor={`input-association-${index}`}
			>
				<RedStar />
				Association
			</Label>
			{...answer.association.map((assoc, index) => (
				<WeightedOptionBlock
					deletable={index !== 0}
					key={index}
					index={index}
					assoc={assoc}
					onChange={(newAssoc) =>
						onChange({
							...answer,
							association: answer.association.map((a, i) =>
								i === index ? newAssoc : a
							)
						})
					}
					onDelete={() => {
						onChange({
							...answer,
							association: answer.association.filter((_, i) => i !== index)
						});
					}}
				/>
			))}
			<Button
				onClick={addAssociation}
				className='mt-4 self-center-safe'
				size='sm'
				variant='secondary'
			>
				Add Association
			</Button>
		</div>
	);

	function addAssociation() {
		onChange({
			...answer,
			association: [
				...answer.association,
				options.get(highestIndex + 1) ?? BlankAssociation
			]
		});
	}
}

export default memo(AnswerBlock);
