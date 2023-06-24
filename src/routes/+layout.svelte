<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-hamlindigo.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
</script>

<div class="app">
	<main>
		<slot />
	</main>

	<footer>
		<p>This is a footer</p>
	</footer>
</div>
