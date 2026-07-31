<script setup>
import { ref, onMounted, nextTick } from 'vue';

const expanded = ref(false);
const isTruncated = ref(false);
const textContainer = ref(null);
const maxHeight = ref(0);

function toggleExpand() {
	expanded.value = !expanded.value;
	if (!expanded.value) {
		nextTick(() => {
			textContainer.value.style.maxHeight = `${maxHeight.value}px`;
		});
	} else {
		textContainer.value.style.maxHeight = `${textContainer.value.scrollHeight}px`;
	}
}

defineProps({
	text: {
		type: String,
		required: true
	},
	maxLength: {
		type: Number,
		default: 150
	},
	linkToPost: {
		type: String,
		default: ''
	}
});

onMounted(() => {
	nextTick(() => {
		const container = textContainer.value;
		const lineHeight = parseFloat(getComputedStyle(container).lineHeight);
		maxHeight.value = lineHeight * 2;
		if (container.scrollHeight > maxHeight.value) {
			isTruncated.value = true;
		}
		container.style.maxHeight = `${maxHeight.value}px`;
	});
});
</script>

<template>
	<div class="max-width-text">
		<template v-if="linkToPost.length">
			<RouterLink :to="{ name: 'Post', params: { id: linkToPost } }">
				<p ref="textContainer"
					class="text-pretty break-words whitespace-pre-wrap overflow-hidden transition-max-height duration-300 ease-in-out"
					:style="{ maxHeight: expanded ? 'none' : `${maxHeight}px` }">
					{{ text }}
				</p>
			</RouterLink>
		</template>
		<template v-else>
			<p ref="textContainer"
				class="text-pretty break-words whitespace-pre-wrap overflow-hidden transition-max-height duration-300 ease-in-out"
				:style="{ maxHeight: expanded ? 'none' : `${maxHeight}px` }">
				{{ text }}
			</p>
		</template>
		<button v-if="isTruncated" type="button" @click="toggleExpand"
			class="text-blue-500 hover:underline w-full text-start">
			{{ expanded ? 'Show less' : 'Show more' }}
		</button>
	</div>
</template>

<style scoped>
.transition-max-height {
	transition: max-height 0.3s ease-in-out;
}

.max-width-text {
	max-width: calc(100dvw - 56px);
}
</style>
