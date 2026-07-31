<script setup>
import PostSkeleton from './PostSkeleton.vue';
</script>

<template>
	<div class="flex flex-col gap-4 pt-4 animate-pulse">
		<div class="h-8 bg-slate-700 rounded my-4"></div>
		<PostSkeleton />
		<PostSkeleton />
		<PostSkeleton />
		<PostSkeleton />
		<PostSkeleton />
		<PostSkeleton />
		<PostSkeleton />
		<PostSkeleton />
		<PostSkeleton />
		<PostSkeleton />
	</div>
</template>
