import { OPENAI_API_KEY } from '$env/static/private';
import type { CreateChatCompletionRequest } from 'openai';

export const POST = async ({ request }) => {
	const { messages } = await request.json();

	const openAiBody: CreateChatCompletionRequest = {
		model: 'gpt-3.5-turbo-0613',
		messages: [{ role: 'user', content: messages }],
		stream: true
	};

	const { ok, body, status, statusText } = await fetch(
		'https://api.openai.com/v1/chat/completions',
		{
			headers: {
				Authorization: `Bearer ${OPENAI_API_KEY}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(openAiBody)
		}
	);

	console.log({ ok, status, statusText });

	return new Response(body, {
		headers: { 'Content-Type': 'text/event-stream' }
	});
};
