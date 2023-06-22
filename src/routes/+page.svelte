<script lang="ts">
	import { useChat } from 'ai/svelte';

	const { input, handleSubmit, messages } = useChat();
</script>

<svelte:head>
	<title>Code Whisperer</title>
	<meta name="description" content="Sveltekit app to use chatgpt" />
</svelte:head>

<section>
	<ul>
		{#each $messages as message}
			<li>{message.role}: {message.content}</li>
		{/each}
	</ul>
	<form on:submit={handleSubmit}>
		<input bind:value={$input} />
		<button type="submit">Send</button>
	</form>
</section>