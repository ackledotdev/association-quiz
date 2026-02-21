import { Input } from '@/components/ui/input';
import { WeightedOption } from '@/lib/schema';
import { memo, useRef } from 'react';

function WeightedOptionBlock({
	assoc,
	onChange,
	deletable,
	onDelete,
	index
}: {
	assoc: WeightedOption;
	onChange: (assoc: WeightedOption) => any;
	deletable: boolean;
	onDelete: (assoc?: WeightedOption) => any;
	index: number;
}) {
	const textRef = useRef<HTMLInputElement>(null);
	const numRef = useRef<HTMLInputElement>(null);

	return (
		<div
			className='flex flex-row items-center-safe justify-stretch gap-2'
			style={{
				marginTop: index === 0 ? '0' : '0.5rem'
			}}
		>
			<Input
				ref={textRef}
				className='grow'
				placeholder='Pizza lover'
				value={assoc.option}
				onChange={() => onChange({ ...assoc, option: textRef.current!.value })}
			/>
			<Input
				ref={numRef}
				className='grow-0'
				type='number'
				placeholder='Weight'
				value={assoc.weight}
				onChange={() =>
					onChange({ ...assoc, weight: parseInt(numRef.current!.value) || 0 })
				}
			/>
			<p
				className='text-destructive w-8 cursor-pointer'
				onClick={() => deletable && onDelete(assoc)}
			>
				{deletable && 'X'}
			</p>
		</div>
	);
}

export default memo(WeightedOptionBlock);
