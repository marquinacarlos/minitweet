<script setup>
import { DEFAULT_COVER_PHOTO } from '@/config/constants';

const defaultAlt = 'Foto de portada';

defineProps({
	isOwnAccount: {
		type: Boolean,
		required: false,
		default: false
	},
	src: String,
	alt: String,
});

const emit = defineEmits(['click']);
</script>

<template>
	<figure class="mx-auto w-full aspect-w-16 aspect-h-9 overflow-hidden z-10">
		<img :src="src || DEFAULT_COVER_PHOTO"
			:alt="alt || defaultAlt"
			class="object-cover"
			:class="{ 'cursor-pointer': isOwnAccount }"
			@click="isOwnAccount && emit('click')">
	</figure>
</template>
