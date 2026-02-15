import { config as envConfig } from 'dotenv';
envConfig({ path: '.env.local' });

import { KEYS } from '@/lib/constants';
import { createClient } from 'redis';

const redis = await createClient({
	url: process.env.REDIS_URL
}).connect();

console.log('Connected to Redis.');

while (!redis.isReady) {}

console.log('Redis client is ready.');

await redis.set(KEYS.QUIZ_UPLOAD_KEY, process.env.QUIZ_UPLOAD_KEY!);

await redis.close();
console.log('Disconnected from Redis.');
