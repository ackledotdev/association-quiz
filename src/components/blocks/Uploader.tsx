'use client';

import { BuilderContext } from '@/app/contexts/BuilderContext';
import { ScrollArea } from '../ui/scroll-area';
import { useContext, useRef, useState } from 'react';
import { highlight } from 'sugar-high';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import RedStar from '../misc/RedStar';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { QuizSchema } from '@/lib/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { createHash } from 'crypto';
import { useRouter } from 'next/navigation';

export default function Uploader() {
	const router = useRouter();

	const contextData = useContext(BuilderContext);

	const [localContextData, setLocalContextData] = useState<string | null>(
		contextData
	);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [textLength, setTextLength] = useState(0);

	const [files, setFiles] = useState<FileList | null>(null);

	const [tab, setTab] = useState<'file' | 'text'>('file');

	const [processing, setProcessing] = useState(false);

	const uploadKeyRef = useRef<HTMLInputElement>(null);
	const [uploadKeyLength, setUploadKeyLength] = useState(0);

	const [uploading, setUploading] = useState(false);

	return (
		<BuilderContext value={localContextData}>
			<div className='flex min-w-32 flex-col items-center'>
				{localContextData ? (
					<>
						<ScrollArea className='border-muted-foreground mt-16 block h-96 max-h-64 rounded-lg border-2 p-4'>
							<pre
								className='rounded-lg text-left font-mono text-sm wrap-anywhere whitespace-pre-wrap'
								dangerouslySetInnerHTML={{
									__html: highlight(localContextData, {})
								}}
							/>
						</ScrollArea>
						<Dialog>
							<DialogTrigger asChild>
								<Button className='mt-4' disabled={uploading}>
									Upload
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-2xl sm:max-w-md lg:max-w-xl'>
								<DialogHeader>
									<DialogTitle>Authenticate</DialogTitle>
									<DialogDescription>
										Please enter your upload key
									</DialogDescription>
								</DialogHeader>

								<div className='flex flex-col items-start justify-start gap-2'>
									<Label htmlFor='upload-key-input'>
										Upload Key <RedStar />
									</Label>
									<Input
										ref={uploadKeyRef}
										id='upload-key-input'
										type='password'
										placeholder='quirkypassphrase'
										onChange={() =>
											setUploadKeyLength(uploadKeyRef.current!.value.length)
										}
										className='w-full'
									/>
								</div>

								<DialogFooter className='justify-start'>
									<DialogClose asChild>
										<Button
											onClick={handleUpload}
											disabled={uploadKeyLength === 0}
										>
											Confirm
										</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</>
				) : (
					<>
						<Tabs
							defaultValue='file'
							className='h-56'
							onValueChange={(v) => setTab(v as 'file' | 'text')}
						>
							<TabsList className='mb-4 self-center'>
								<TabsTrigger value='file'>Upload File</TabsTrigger>
								<TabsTrigger value='text'>Paste data</TabsTrigger>
							</TabsList>
							<TabsContent
								value='file'
								className='flex flex-col items-start gap-2'
							>
								<Label
									className='pl-1 text-base'
									htmlFor='quiz-json-file-upload'
								>
									Upload a JSON file <RedStar />
								</Label>
								<Input
									ref={fileInputRef}
									onChange={() => setFiles(fileInputRef.current!.files)}
									id='quiz-json-file-upload'
									type='file'
									accept='.json,application/json'
									className='file-input file-input-bordered w-full max-w-xs text-base'
								/>
							</TabsContent>
							<TabsContent value='text'>
								<div className='flex flex-col items-start gap-2'>
									<Label
										className='pl-1 text-base'
										htmlFor='quiz-json-textarea'
									>
										Paste quiz JSON data <RedStar />
									</Label>
									<Textarea
										id='quiz-json-textarea'
										ref={textareaRef}
										onChange={() =>
											setTextLength(textareaRef.current!.value.length)
										}
										className='h-32 max-h-32 font-mono text-sm'
										rows={1}
									/>
								</div>
							</TabsContent>
						</Tabs>
						<Button
							variant='secondary'
							className='mt-8'
							disabled={
								processing ||
								(!localContextData &&
									(!files || files.length !== 1) &&
									textLength === 0)
							}
							onClick={uploadContext}
						>
							Validate
						</Button>
					</>
				)}

				<Button
					variant='outline'
					className='mt-4'
					onClick={() => {
						setLocalContextData(null);
						if (fileInputRef.current) {
							fileInputRef.current.value = '';
						}
						setFiles(null);
					}}
				>
					Clear
				</Button>
			</div>
		</BuilderContext>
	);

	async function handleUpload() {
		setUploading(true);

		if (!localContextData) {
			toast.error('No quiz data to upload. This may be an internal error.');
			setUploading(false);
			return;
		}

		const uploadKey = uploadKeyRef.current?.value;
		if (!uploadKey) {
			toast.error('Upload key is required');
			return;
		}

		const fetchRes = await fetch('/api/quizzes/upload/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Custom ${createHash('sha512').update(uploadKey).digest('hex')}`
			},
			body: localContextData
		});
		if (fetchRes.ok) {
			const hash = await fetchRes.text();
			const url = `/quiz/${hash}/?created`;
			router.prefetch(url);
			toast.success(`Quiz uploaded successfully! Redirecting now...`);
			router.push(url);
		} else if (fetchRes.status === 403) {
			toast.error('Upload key is invalid or expired');
		} else {
			const errorText = await fetchRes.text();
			toast.error('Upload failed: ' + errorText);
		}

		setUploading(false);
	}

	async function uploadContext() {
		setProcessing(true);

		let text: string;
		try {
			text = tab === 'file' ? await processFile() : textareaRef.current!.value;
		} catch (e) {
			toast.error('Failed to process input data');
			setProcessing(false);
			return;
		}

		let data;
		try {
			data = JSON.parse(text);
		} catch (e) {
			toast.error('Invalid JSON format: ' + (e as Error).message);
			setProcessing(false);
			return;
		}

		const parseResult = QuizSchema.safeParse(data);

		if (!parseResult.success) {
			const err = parseResult.error.issues
				.map((issue) => issue.message)
				.join('\n');
			toast.error('Invalid quiz file: ' + err);
			setProcessing(false);
			return;
		}

		toast.success('Stored quiz data, refreshing...');
		setLocalContextData(JSON.stringify(JSON.parse(text) as unknown, null, 2));
		setProcessing(false);
	}

	async function processFile() {
		if (!files) {
			toast.error('No file selected');
			setProcessing(false);
			throw new Error('No file selected');
		}

		const file = files[0];
		return await file.text();
	}
}
