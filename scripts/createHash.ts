import { createHash } from 'crypto';

const authkey = '';

console.log(createHash('sha512').update(authkey).digest('hex'));
