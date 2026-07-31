<script setup>
import { computed } from 'vue';

const props = defineProps({
	tag: {
		type: String,
		default: 'h1'
	},
	text: {
		type: String,
		required: true
	},
	stickyTop: {
		type: Boolean,
		default: false
	},
	icon: {
		type: Boolean,
		default: true
	}
});

const sizeClass = computed(() => {
	const sizes = { h1: 'text-3xl font-bold', h2: 'text-2xl', h3: 'text-xl', h4: 'text-lg', h5: 'text-md', h6: 'text-base' };
	return sizes[props.tag] || '';
});
</script>

<template>
	<div class="w-full py-1 bg-black" :class="{ 'sticky top-0 z-[900]': stickyTop }">
		<div class="container mx-auto flex items-center gap-2">
			<figure v-if="icon" class="w-16 p-1 pl-2 shrink-0">
				<img src="/minitweet.svg" alt="Minitweet">
			</figure>
			<component :is="tag" :class="sizeClass">
				{{ text }}
			</component>
		</div>
	</div>
</template>
