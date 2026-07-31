<script setup>
import useProfile from '@/composables/useProfile';
import useModal from '@/composables/useModal';
import ContainerComp from './ContainerComp.vue';
import ExpandableText from './ExpandableText.vue';
import { formatRelativeDate } from '@/utils/date';
import { DEFAULT_PROFILE_PHOTO } from '@/config/constants';
import { RouterLink } from 'vue-router';
import { onMounted, ref } from 'vue';

const { getUserById } = useProfile();
const { openModal } = useModal();
const userFromPost = ref(null);

onMounted(async () => {
	try {
		if (props.post.userUID) userFromPost.value = await getUserById(props.post.userUID);
	} catch (error) {
		console.error(error);
	}
});

const props = defineProps({
	post: {
		type: Object,
		required: true
	},
	editPost: {
		type: Boolean,
		default: false
	}
})
</script>

<template>
	<article class="bg-zinc-950 rounded-t-lg border-b border-gray-800 pb-4 pt-2 ">
		<header class="flex gap-2 items-start pl-2">
			<figure v-if="post.userUID" class="w-10 h-10">
				<router-link :to="{ name: 'Account', params: { id: post.userUID } }">
					<img :alt="userFromPost?.name"
						:src="userFromPost?.photoURL || DEFAULT_PROFILE_PHOTO"
						class="w-10 h-10 object-cover rounded-full border-2 border-black cursor-pointer hover:border-blue-700">
				</router-link>
			</figure>

			<h2 v-if="post.userUID" class="flex-1 flex gap-1 items-center">
				<router-link :to="{ name: 'Account', params: { id: post.userUID } }"
					class="font-bold transition hover:text-blue-700">
					{{ userFromPost?.name }}
				</router-link>
				<router-link :to="{ name: 'Account', params: { id: post.userUID } }"
					class="text-sm text-gray-400 transition hover:text-blue-700">
					@{{ userFromPost?.username }}
				</router-link>
			</h2>
			<button v-if="editPost" @click="openModal" type="button"
				class="text-gray-400 text-xs px-2 py-1 transition hover:text-white">
				Edit
			</button>
		</header>
		<section class="bg-opacity-50 w-full pl-14 pr-2 -mt-5">
			<RouterLink v-if="post?.title" :to="{ name: 'Post', params: { id: post?.id } }">
				<h3 class="font-bold break-words whitespace-normal">{{ post.title }}</h3>
			</RouterLink>
			<ExpandableText :text="post.body" :linkToPost="post?.id" />
			<RouterLink v-if="post?.file" :to="{ name: 'Post', params: { id: post?.id } }">
				<div class="w-full mt-2">
					<figure class="max-w-60 rounded-lg overflow-hidden">
						<img alt="Post image" :src="post?.file">
					</figure>
				</div>
			</RouterLink>
		</section>
		<ContainerComp class="flex justify-end pr-4">
			<p v-if="post?.createdAt" class="text-xs text-gray-500 -mb-3">
				{{ formatRelativeDate(post.createdAt) }}
			</p>
		</ContainerComp>
	</article>
</template>
