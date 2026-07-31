<script setup>
//------------------------------------------------------------------- COMPOSABLES
import usePosts from '@/composables/usePosts';
import useLoading from '@/composables/useLoading';
import useAuth from '@composables/useAuth';
import useModal from '@/composables/useModal'
//------------------------------------------------------------------- COMPONENTS
import TitleComp from '@/components/TitleComp.vue';
import PostList from '@/components/PostListComp.vue';
import FeedSkeleton from '@/components/skeletons/FeedSkeleton.vue';
import ContainerComp from '@components/ContainerComp.vue';
import ModalComp from '@components/ModalComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { onMounted, onBeforeUnmount, ref } from 'vue';
//------------------------------------------------------------------- USE COMPOSABLES
const { user } = useAuth();
const { openModal, closeModal } = useModal();
const { loading, startLoading, endLoading } = useLoading();
const { postsList, getAllPosts, createNewPost } = usePosts();
//------------------------------------------------------------------- VARIABLES
import { DEFAULT_POST_IMAGE } from '@/config/constants';
const newPost = ref({
	userUID: user.value?.uid,
	title: '',
	body: '',
	file: ''
});
const unsubscribe = ref(null);
const tempFileToPost = ref(null);


//------------------------------------------------------------------- METHODS
/**
 * Funcion para crear una nueva publicación
 */
async function handlerSubmit() {
	try {
		await createNewPost(newPost.value);
		newPost.value = {
			userUID: user.value.uid,
			title: '',
			body: '',
			file: ''
		};
		tempFileToPost.value = null;
	} catch (error) {
		console.error(error.message);
	}
	closeModal();
}

/**
 * Funcion para cancelar la creación de una nueva publicación
 */
function cancelNewPost() {
	newPost.value = {
		userUID: user.value.uid,
		title: '',
		body: '',
		file: ''
	};
	tempFileToPost.value = null;
	closeModal();
}

function removeFileToPost() {
	newPost.value.file = '';
	tempFileToPost.value = null;
}

/**
 * Funcion para manejar el cambio de input file
 * @param e Evento de cambio de input file
 */
function handlerFileToPost(e) {
	const file = e.target.files[0];
	const reader = new FileReader();
	reader.onload = () => {
		tempFileToPost.value = reader.result;
		newPost.value.file = file;
	};
	reader.readAsDataURL(file);
}

//------------------------------------------------------------------- LIFECYCLE
onMounted(() => {
	startLoading();
	unsubscribe.value = getAllPosts((posts) => {
		postsList.value = posts;
		endLoading();
	});
});

onBeforeUnmount(() => {
	if (typeof unsubscribe.value === 'function') {
		unsubscribe.value();
	}
});
</script>

<template>
	<template v-if="!loading">
		<TitleComp text="Feed" :stickyTop="true" />
		<PostList :posts="postsList" />
	</template>
	<template v-else>
		<FeedSkeleton />
	</template>

	<Teleport to="#barTop" v-if="!loading">
		<button @click="openModal"
			class="absolute bottom-1 right-0 bg-white text-black px-4 py-2 rounded-lg transition border border-transparent hover:bg-black hover:border-white hover:text-white">
			Post
		</button>
	</Teleport>

	<ModalComp :fn="cancelNewPost">
		<ContainerComp class="bg-black rounded-lg p-4 max-w-md">
			<ContainerComp v-if="tempFileToPost" class="max-w-72 mb-2">
				<ContainerComp tag="figure" class="max-w-72 rounded-lg overflow-hidden">
					<img :src="tempFileToPost" alt="Imagen del post">
				</ContainerComp>
				<button type="button" @click="removeFileToPost"
					class="mt-1 text-xs text-red-400 hover:text-red-300 transition">
					Remove image
				</button>
			</ContainerComp>
			<form @submit.prevent="handlerSubmit()"
				action="#" 
				class="flex flex-col gap-4">
				<label for="title" class="sr-only">Title</label>
				<input v-model="newPost.title" 
					type="text" 
					placeholder="Title" 
					class="custom-input">
				<label for="body" class="sr-only">Content</label>
				<textarea v-model="newPost.body" 
					placeholder="Content" 
					required 
					class="custom-input resize-none"></textarea>
				<label for="photo-upload" class="sr-only">Upload photo</label>
				<input @change="handlerFileToPost"
					type="file" 
					id="photo-upload"  
					accept="image/*"
					class="w-full file:w-full file:transition-all file:cursor-pointer file:mr-4 file:py-2 file:rounded-lg file:border file:border-white file:text-sm file:font-semibold file:bg-violet-50 file:text-black hover:file:bg-black hover:file:text-white">
				<ContainerComp class="flex flex-col gap-2">
					<button type="submit" class="btn-primary text-sm">Publish</button>
					<button @click="cancelNewPost" type="button" class="btn-secondary text-sm">Cancel</button>
				</ContainerComp>
			</form>
		</ContainerComp>
	</ModalComp>
</template>