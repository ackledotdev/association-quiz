import { QuizResponse } from './schema';

export class ResponseCollector {
	responses: QuizResponse;

	constructor() {
		this.responses = [];
	}

	collectResponse(option: string, weight: number) {
		this.responses.push({ option, weight });
	}

	length() {
		return this.responses.length;
	}

	toQuizResponse() {
		return this.responses;
	}
}
