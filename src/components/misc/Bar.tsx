import './bar.css';

import { cn } from '@/lib/utils';

export default function Bar({
	colorStart,
	colorEnd,
	bgColor,
	className,
	radius = '9999px',
	width
}: {
	colorStart: string;
	colorEnd: string;
	bgColor: string;
	className?: string;
	radius?: string;
	width: number;
}) {
	return (
		<div
			className={cn('bar-outside h-4 w-full p-0', className)}
			style={{ backgroundColor: bgColor, borderRadius: radius }}
		>
			<div
				className='bar-inside m-0 h-full p-0'
				style={{
					borderRadius: radius,
					width: `${width}%`,
					// @ts-expect-error
					'--color-start': colorStart,
					'--color-end': colorEnd
				}}
			></div>
		</div>
	);
}
