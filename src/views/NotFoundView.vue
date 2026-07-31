<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
	<div class="flex-1 flex flex-col items-center justify-center gap-4">
		<p class="text-center text-9xl">404</p>
		<p class="text-center text-gray-400">The page you're looking for doesn't exist.</p>
		<button @click="router.back()" class="btn-primary max-w-48">Go back</button>
	</div>
</template>
