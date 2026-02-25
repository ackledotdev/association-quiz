'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PersonalRootUrl } from '@/lib/constants';
import { Copy, Share2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';

export default function QuizPublishDialog() {
	const [_, copy] = useCopyToClipboard();
	const searchParams = useSearchParams();

	const pathname = usePathname();
	const url = `${PersonalRootUrl}${pathname}`;
	const urlPayload = {
		url
	} satisfies ShareData;

	const router = useRouter();

	if (!searchParams.has('created')) return null;

	router.prefetch(pathname);
	return (
		<>
			<Dialog defaultOpen onOpenChange={() => router.replace(pathname)}>
				<DialogContent className='max-w-xl sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Quiz Published</DialogTitle>
						<DialogDescription>
							Your quiz has been published successfully. You can now share the
							link with others.
						</DialogDescription>
					</DialogHeader>
					<Field className='flex flex-row items-center justify-stretch gap-2'>
						<Input className='grow' value={url} readOnly />
						<Button
							className='grow-0 basis-1'
							variant='secondary'
							onClick={() =>
								// Do not add Toaster component; it is added in a sibling's child component (QuizContainer).
								toast.promise(copy(url), {
									loading: 'Copying link...',
									success: 'Link copied to clipboard!',
									error: 'Failed to copy link.'
								})
							}
						>
							<Copy size={8} />
						</Button>
						<Button
							className='grow-0 basis-1'
							variant='secondary'
							onClick={() => {
								if (
									(window.navigator.canShare as
										| typeof window.navigator.canShare
										| undefined) &&
									(window.navigator.share as
										| typeof window.navigator.share
										| undefined) &&
									window.navigator.canShare(urlPayload)
								)
									toast.promise(window.navigator.share(urlPayload), {
										loading: 'Sharing...',
										success: 'Quiz shared successfully!',
										error: 'Failed to share quiz.'
									});
								else
									toast.promise(copy(url), {
										loading: 'Cannot share, copying link...',
										success: 'Cannot share. Link copied to clipboard!',
										error: 'Cannot share, and failed to copy link.'
									});
							}}
						>
							<Share2 size={8} />
						</Button>
					</Field>
					<DialogFooter>
						<DialogClose asChild>
							<Button>Close</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
