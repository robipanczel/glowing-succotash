<script lang="ts">
	import { useChat } from 'ai/svelte';
	import { marked } from 'marked';
	import { highlight, languages } from 'prismjs';
	import 'prismjs/themes/prism-tomorrow.css';
	import 'prismjs/components/prism-typescript';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-csharp';
	import 'prismjs/components/prism-cshtml';

	const { input, handleSubmit, messages } = useChat();
</script>

<svelte:head>
	<title>Code Whisperer</title>
	<meta name="description" content="Sveltekit app to use chatgpt" />
</svelte:head>

<section>
	<ul>
		{#each $messages as message}
			<li>
				{message.role}: {@html marked(message.content, {
					highlight: (code, lang) => highlight(code, languages[lang] || languages.markup, lang)
				})}
			</li>
		{/each}
	</ul>
	<form on:submit={handleSubmit}>
		<input bind:value={$input} />
		<button type="submit">Send</button>
	</form>
</section>
