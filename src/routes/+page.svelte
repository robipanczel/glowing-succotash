<script lang="ts">
	const DATA_PREFIX = 'data: ';
	const DONE_MESSAGE = '[DONE]';

	let currentMessage = 'Tell me a 100 word story!';
	let response = '...';

	const processMessage = (message: string): any | 'DONE' | null => {
		if (message === `${DATA_PREFIX}${DONE_MESSAGE}`) {
			return 'DONE';
		} else if (message.startsWith(DATA_PREFIX)) {
			const data = JSON.parse(message.substring(DATA_PREFIX.length));
			return data;
		}

		return null;
	};

	const postPrompt = async () => {
		const { body, status, ok } = await fetch('/api/chat', {
			method: 'POST',
			body: JSON.stringify({ messages: currentMessage })
		});

		if (!ok) {
			throw new Error(`HTTP error ${status}`);
		}

		if (!body) {
			return;
		}

		const decodedBody = body.pipeThrough(new TextDecoderStream());
		const reader = decodedBody.getReader();

		let chunk;
		while ((chunk = await reader.read())) {
			if (chunk.done) {
				break;
			}

			const messages = chunk.value.split('\n');
			for (const message of messages) {
				const result = processMessage(message);
				console.log(result);

				if (result) {
					if (result !== 'DONE') {
						response += result.choices[0].delta.content ?? '';
					}
				}
			}
		}
	};
</script>

<svelte:head>
	<title>Code Whisperer</title>
	<meta name="description" content="Sveltekit app to use chatgpt" />
</svelte:head>

<section class="flex flex-col w-full h-full p-4 overflow-y-auto space-y-4">
	{response}
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
		<button class="input-group-shim">+</button>
		<textarea
			bind:value={currentMessage}
			class="bg-transparent border-0 ring-0"
			name="prompt"
			id="prompt"
			placeholder="Write a message..."
			rows="1"
		/>
		<button on:click={postPrompt} class="variant-filled-primary">Send</button>
	</div>
</section>
