import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OPENAI_API_KEY } from '$env/static/private';

import type { RequestHandler } from './$types';

const config = new Configuration({
	apiKey: OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

export const POST = (async ({ request }) => {
	const { messages } = await request.json();

	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		stream: true,
		messages: messages.map((message: any) => ({
			content: `${message.content} (if you give code example, in the markdown specify the language)`,
			role: message.role
		}))
	});

	const stream = OpenAIStream(response);

	return new StreamingTextResponse(stream);
}) satisfies RequestHandler;
