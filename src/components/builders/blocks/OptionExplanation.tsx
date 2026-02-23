import RedStar from '@/components/misc/RedStar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { memo, useRef } from 'react';

function OptionExplanationBlock({
	option,
	explanation,
	index,
	onChange,
	deletable,
	onDelete
}: {
	option: string;
	explanation: string;
	index: number;
	onChange: (option: string, explanation: string) => any;
	deletable: boolean;
	onDelete: () => any;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	return (
		<div className='flex flex-col gap-2 rounded-md border p-4'>
			<Label htmlFor={`option-explanation-option-${index}`} className='pl-1'>
				Result {index + 1} <RedStar />
			</Label>
			<Input
				id={`option-explanation-option-${index}`}
				ref={inputRef}
				onChange={() =>
					onChange(inputRef.current!.value, textareaRef.current!.value)
				}
				value={option}
				placeholder='Pizza lover'
			/>
			<Label
				htmlFor={`option-explanation-explanation-${index}`}
				className='pl-1'
			>
				Explanation
				{/* <RedStar /> */}
			</Label>
			<Textarea
				id={`option-explanation-explanation-${index}`}
				ref={textareaRef}
				onChange={() =>
					onChange(inputRef.current!.value, textareaRef.current!.value)
				}
				value={explanation}
				placeholder='You are the sort of person who likes pizza!'
				rows={3}
			/>
		</div>
	);
}

export default memo(OptionExplanationBlock);
