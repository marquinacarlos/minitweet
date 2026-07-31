<script setup>
defineProps({
	tag: {
		type: String,
		default: 'div'
	}
})
</script>

<template>
	<component :is="tag" class="mx-auto w-full">
		<slot></slot>
	</component>
</template>
