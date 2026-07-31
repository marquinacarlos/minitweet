<script setup>
import useModal from '@/composables/useModal';
import { computed } from 'vue';

const { modal, closeModal } = useModal();

const props = defineProps({
	fn: {
		type: Function,
		required: false,
		default: null
	}
});

function handleClick() {
	(props.fn || closeModal)();
}
</script>

<template>
	<Teleport v-if="modal" to="#modal">
		<div @click.self="handleClick"
			class="fixed inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm flex justify-center items-center z-[1000]">
			<slot></slot>
		</div>
	</Teleport>
</template>
