import { RefObject, useCallback, useState } from 'react';
import html2canvas from 'html2canvas-pro'; // there was an issue 'Attempting to parse an unsupported color function "lab"' when using `html2canvas` alone

interface UseScreenshotOptions {
	backgroundColor?: string;
	scale?: number;
	useCORS?: boolean;
	allowTaint?: boolean;
}

export function useScreenshot() {
	const [isCapturing, setIsCapturing] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const captureScreenshot = useCallback(
		async (
			ref: RefObject<HTMLElement>,
			options: UseScreenshotOptions = {}
		): Promise<string> => {
			setIsCapturing(true);
			setError(null);

			try {
				if (!ref.current) {
					const errorMessage = 'Invalid ref: ref.current is null';
					setError(errorMessage);
					throw new Error(errorMessage);
				}
				const canvas = await html2canvas(ref.current, {
					backgroundColor: options.backgroundColor || '#ffffff',
					scale: options.scale || 2,
					useCORS: options.useCORS || true,
					allowTaint: options.allowTaint || false,
					...options
				});

				const dataUrl = canvas.toDataURL('image/png');
				setIsCapturing(false);
				return dataUrl;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Failed to capture screenshot';
				setError(errorMessage);
				throw new Error(errorMessage);
			} finally {
				setIsCapturing(false);
			}
		},
		[]
	);

	return {
		captureScreenshot,
		isCapturing,
		error
	};
}

export function dataUrlToFile(
	dataUrl: string,
	filename: string = 'screenshot.png'
): File {
	const arr = dataUrl.split(',');
	const mimeMatch = arr[0].match(/:(.*?);/);
	const mime = mimeMatch ? mimeMatch[1] : 'image/png';
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) u8arr[n] = bstr.charCodeAt(n);
	return new File([u8arr], filename, { type: mime });
}
