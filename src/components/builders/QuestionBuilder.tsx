import { z } from 'zod';

export default function QuestionBuilder() {
	const FormSchema = z.object({
		question: z
			.string()
			.min(2, { message: 'Question must be at least 2 characters.' }),
		choices: z.string().refine(
			(val) => {
				try {
					Array.isArray(JSON.parse(val));
				} catch {
					return false;
				}
			},
			{
				message: 'Choices must be a valid JSON array.'
			}
		)
	});

	return <></>;
}
