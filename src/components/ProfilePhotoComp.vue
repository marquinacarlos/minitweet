<script setup>
const defaultAlt = 'User profile photo';

defineProps({
	isOwnAccount: {
		type: Boolean,
		required: false,
		default: false
	},
	src: String,
	alt: String,
	width: {
		type: String,
		default: 'w-20'
	},
	height: {
		type: String,
		default: 'h-20'
	}
});

const emit = defineEmits(['click']);
</script>

<template>
	<figure :class="[width, height, 'ml-2 rounded-full border-4 border-black overflow-hidden z-20']">
		<img :src="src || '/perfilPhotoDefault.png'"
			:alt="alt || defaultAlt"
			class="object-cover w-full h-full"
			:class="{ 'cursor-pointer': isOwnAccount }"
			@click="isOwnAccount && emit('click')">
	</figure>
</template>
