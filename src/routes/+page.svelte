<script lang="ts">
	import { useChat, type Message } from 'ai/svelte';
	import { marked } from 'marked';
	import { highlight, languages } from 'prismjs';
	import 'prismjs/themes/prism-tomorrow.css';
	import 'prismjs/components/prism-typescript';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-csharp';
	import 'prismjs/components/prism-cshtml';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { readable } from 'svelte/store';
	import { onDestroy } from 'svelte';

	const { input, handleSubmit, messages, error } = useChat();

	const unsub = messages.subscribe((msgs: Message[]) =>
		msgs.length ? scrollChatBottom('smooth') : null
	);

	let elemChat: HTMLElement;

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollIntoView({ behavior });
	}

	onDestroy(() => {
		unsub();
	});

	const userMsg = { role: 'user', content: 'Hello bello', createdAt: new Date() };
	const assistantMsg = { role: 'assistant', content: 'Right back to you', createdAt: new Date() };
	const devMessages = readable([
		userMsg,
		assistantMsg,
		userMsg,
		assistantMsg,
		userMsg,
		assistantMsg,
		userMsg,
		assistantMsg,
		userMsg,
		assistantMsg,
		userMsg,
		assistantMsg
	]);
</script>

<svelte:head>
	<title>Code Whisperer</title>
	<meta name="description" content="Sveltekit app to use chatgpt" />
</svelte:head>

<section class="flex flex-col w-full h-full p-4 overflow-y-auto space-y-4">
	<div class="mt-auto">
		{#if $error}
			{$error}
		{/if}
		{#each $messages as message}
			{#if message.role === 'user'}
				<div class="grid grid-cols-[1fr_auto] gap-2">
					<div class="card p-4 rounded-tr-none space-y-2">
						<header class="flex justify-between items-center">
							<p class="font-bold">{message.role}</p>
							<small class="opacity-50">{message.createdAt}</small>
						</header>
						<p>
							{@html marked(message.content, {
								highlight: (code, lang) =>
									highlight(code, languages[lang] || languages.markup, lang),
								mangle: false
							})}
						</p>
					</div>
					<Avatar initials={message.role} background="bg-primary-500" width="w-12" />
				</div>
			{:else if message.role === 'assistant'}
				<div class="grid grid-cols-[auto_1fr] gap-2">
					<Avatar initials={message.role} background="bg-primary-500" width="w-12" />
					<div class="card p-4 variant-soft rounded-tl-none space-y-2">
						<header class="flex justify-between items-center">
							<p class="font-bold">{message.role}</p>
							<small class="opacity-50">{message.createdAt}</small>
						</header>
						<p>
							{@html marked(message.content, {
								highlight: (code, lang) => {
									console.log(code);
									highlight(code, languages[lang] || languages.markup, lang);
								},
								mangle: false
							})}
						</p>
					</div>
				</div>
			{:else}
				<li>
					{message.role}: {@html marked(message.content, {
						highlight: (code, lang) => highlight(code, languages[lang] || languages.markup, lang),
						mangle: false
					})}
				</li>
			{/if}
		{/each}

		<form on:submit={handleSubmit} bind:this={elemChat}>
			<div
				class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
			>
				<button class="input-group-shim">+</button>
				<textarea
					bind:value={$input}
					class="bg-transparent border-0 ring-0"
					name="prompt"
					id="prompt"
					placeholder="Write a message..."
					rows="1"
				/>
				<button type="submit" class="variant-filled-primary">Send</button>
			</div>
		</form>
	</div>
</section>
