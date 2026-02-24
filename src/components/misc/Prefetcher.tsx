'use client';

import { useRouter } from 'next/navigation';

export default function Prefetcher({ url }: { url: string }) {
	useRouter().prefetch(url);
	return null;
}
