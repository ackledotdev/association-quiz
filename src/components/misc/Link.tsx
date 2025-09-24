import { cn } from '@/lib/utils';
import { SquareArrowOutUpRight } from 'lucide-react';
import { HTMLAttributes, MouseEventHandler } from 'react';

import NextLink from 'next/link';

export default function Link({
	href,
	children,
	className,
	target,
	external,
	noIcon,
	iconSize = 16
}: {
	href: string;
	children: React.ReactNode;
	className?: string;
	target?: string;
	external?: boolean;
	noIcon?: boolean;
	iconSize?: number;
	onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<NextLink
			href={href}
			className={cn('link-class', className)}
			target={external ? (target ?? '_blank') : undefined}
			rel={external ? 'external noopener noreferrer' : undefined}
		>
			{children}
			{external && !noIcon ? (
				<>
					{' '}
					<SquareArrowOutUpRight className='inline' size={iconSize} />
				</>
			) : (
				<></>
			)}
		</NextLink>
	);
}
