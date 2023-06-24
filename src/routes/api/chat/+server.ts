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
	console.log(messages);

	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		stream: true,
		messages: messages.map((message: any) => ({
			content: `${message.content}. If you give code example, specify the language in the markdown.`,
			role: message.role
		}))
	});

	const stream = OpenAIStream(response);

	return new StreamingTextResponse(stream);
}) satisfies RequestHandler;
