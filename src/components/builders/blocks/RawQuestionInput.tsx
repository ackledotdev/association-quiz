import RedStar from '@/components/misc/RedStar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { memo, useRef } from 'react';

function RawQuestionInput({
	value,
	onChange,
	onDelete,
	deletable,
	index
}: {
	value: string;
	onChange: (value: string) => any;
	onDelete: (value?: string) => any;
	deletable: boolean;
	index: number;
}) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	return (
		<div className='flex items-center gap-4'>
			<Label htmlFor={`input-question-${index}`} className='pl-1'>
				Question&nbsp;{index + 1}
				<RedStar />
			</Label>
			<Textarea
				id={`input-question-${index}`}
				ref={textareaRef}
				value={value}
				placeholder={'Paste JSON data'}
				className='w-full self-stretch'
				onChange={() => onChange(textareaRef.current!.value)}
			/>
			<Button
				variant='destructive'
				className='px-2'
				size='sm'
				onClick={() => onDelete()}
				disabled={!deletable}
				style={{
					opacity: !deletable ? 0.25 : 1
				}}
			>
				Delete
			</Button>
		</div>
	);
}

export default memo(RawQuestionInput);
