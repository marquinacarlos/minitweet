<script setup>
import useAuth from '@/composables/useAuth';
import useProfile from '@/composables/useProfile';
import useModal from '@/composables/useModal';
import usePosts from '@composables/usePosts.js';
import useLoading from '@/composables/useLoading';
import useComments from '@/composables/useComments';
import TitleComp from '@/components/TitleComp.vue';
import ModalComp from '@/components/ModalComp.vue';
import ContainerComp from '@/components/ContainerComp.vue';
import ExpandableText from '@/components/ExpandableText.vue';
import LoaderComp from '@/components/skeletons/LoaderComp.vue';
import PostItemComp from '@/components/PostItemComp.vue';
import { formatRelativeDate } from '@/utils/date';
import { DEFAULT_PROFILE_PHOTO } from '@/config/constants';
import { deleteFileByURL } from '@/services/storage.service';
import { useRoute, useRouter } from 'vue-router';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const route = useRoute();
const router = useRouter();
const { user } = useAuth();
const { getUserById } = useProfile();
const { getPostByID, updatePost, deletePost } = usePosts();
const { modal, closeModal } = useModal();
const { loading, startLoading, endLoading } = useLoading();
const { comments, getCommentsByPostID, saveComment, deleteComment } = useComments();

const post = ref(null);
const unsubscribeToPost = ref(null);
const unsubscribeTocomment = ref(null);
const newComment = ref({
	postID: route.params.id,
	userUID: user.value.uid,
	comment: ''
});
const updatePostData = ref({
	title: '',
	body: '',
	file: null
});
const tempEditFilePreview = ref(null);
const editFileAction = ref(null);

async function handlerSubmitComment() {
	try {
		await saveComment({ ...newComment.value });
		newComment.value.comment = '';
	} catch (error) {
		console.error(error);
	}
}

function handleEditFileChange(e) {
	const file = e.target.files[0];
	if (!file) return;
	updatePostData.value.file = file;
	editFileAction.value = 'change';
	const reader = new FileReader();
	reader.onload = () => { tempEditFilePreview.value = reader.result; };
	reader.readAsDataURL(file);
}

function removeEditFile() {
	updatePostData.value.file = null;
	tempEditFilePreview.value = null;
	editFileAction.value = 'remove';
}

async function handlerSubmitEdit() {
	const dataToUpdate = {
		title: updatePostData.value.title,
		body: updatePostData.value.body,
	};

	const oldFileURL = post.value?.file;

	if (editFileAction.value === 'change' && updatePostData.value.file) {
		if (oldFileURL) await deleteFileByURL(oldFileURL);
		const { uploadPostFile } = usePosts();
		dataToUpdate.file = await uploadPostFile(updatePostData.value.file, user.value.uid);
	} else if (editFileAction.value === 'remove') {
		if (oldFileURL) await deleteFileByURL(oldFileURL);
		dataToUpdate.file = '';
	}

	unsubscribeTocomment.value = await updatePost(post.value.id, dataToUpdate, (postUpdated) => {
		post.value = postUpdated;
	});
	tempEditFilePreview.value = null;
	editFileAction.value = null;
	closeModal();
}

async function handleDeleteComment(commentId) {
	if (!confirm('Are you sure you want to delete this comment?')) return;
	try {
		await deleteComment(route.params.id, commentId);
	} catch (error) {
		console.error(error);
	}
}

async function handleDeletePost() {
	if (!confirm('Are you sure you want to delete this post? All comments will be removed.')) return;
	try {
		await deletePost(post.value);
		router.push({ name: 'Feed' });
	} catch (error) {
		console.error(error);
	}
}

function cancelEdit() {
	updatePostData.value = {
		title: post.value?.title,
		body: post.value?.body,
		file: null
	};
	tempEditFilePreview.value = null;
	editFileAction.value = null;
	closeModal();
}

onMounted(async () => {
	try {
		startLoading();
		await Promise.all([
			(async () => {
				unsubscribeToPost.value = await getPostByID(route.params.id, async (postFromDB) => {
					post.value = postFromDB;
					if (post.value.userUID === user.value.uid) {
						updatePostData.value = {
							title: post.value?.title,
							body: post.value?.body,
							file: null
						};
					}
				});
			})(),
			(async () => {
				unsubscribeTocomment.value = await getCommentsByPostID(route.params.id, async (commentsFromDB) => {
					const commentsWithUser = await Promise.all(commentsFromDB.map(async (comment) => {
						const userFromComment = await getUserById(comment.userUID);
						return { ...comment, user: userFromComment };
					}));
					comments.value = commentsWithUser;
				});
			})()
		]);
	} catch (error) {
		console.error(error);
	} finally {
		endLoading();
	}
});

onBeforeUnmount(() => {
	if (unsubscribeTocomment.value) {
		unsubscribeTocomment.value();
	}
	if (unsubscribeToPost.value) {
		unsubscribeToPost.value();
	}
});
</script>

<template>
	<div class="grid grid-rows-[1fr] h-[calc(100dvh-var(--navbar-height)-40px)] w-full">
		<template v-if="!loading">
			<ContainerComp v-if="post" class="flex flex-col overflow-y-scroll">
				<TitleComp text="Post" :stickyTop="true" />
				<PostItemComp :post="post" class="sticky top-14" :editPost="post.userUID === user.uid" />
				<div v-if="comments.length" class="w-full flex">
					<ContainerComp tag="ul" class="pb-1 flex flex-col">
						<li v-for="comment in comments" :key="comment.id" class="border-b border-gray-800 pb-2 mt-2 bg-gray-900 bg-opacity-35 rounded-lg pl-4 py-2 min-h-[57px] w-full">
							<div class="flex gap-2 items-start">
								<figure class="w-10 h-10 min-w-10 rounded-full overflow-hidden">
									<RouterLink :to="{ name: 'Account', params: { id: comment.user.uid } }">
										<img :src="comment.user.photoURL || DEFAULT_PROFILE_PHOTO"
											:alt="comment.user.name"
											class="w-full h-full object-cover rounded-full border-2 border-black cursor-pointer transition hover:border-blue-700">
									</RouterLink>
								</figure>
								<h2 class="flex-1 break-words whitespace-normal flex gap-1 items-center min-h-6">
									<RouterLink :to="{ name: 'Account', params: { id: comment.user.uid } }" class="transition hover:text-blue-700">
										{{ comment.user.name }}
									</RouterLink>
									<RouterLink :to="{ name: 'Account', params: { id: comment.user.uid } }" class="text-gray-400 text-xs transition hover:text-blue-700">
										@{{ comment.user.username }}
									</RouterLink>
								</h2>
							</div>
							<div class="ml-12 -mt-4 flex flex-col">
									<ExpandableText :text="comment.comment" class="text-xs" />
								<div class="flex justify-between items-center mt-2 mr-2">
									<button v-if="comment.userUID === user.uid" @click="handleDeleteComment(comment.id)"
										type="button" class="text-xs text-red-400 hover:text-red-300 transition">
										Delete
									</button>
									<span v-else></span>
									<p v-if="comment?.createdAt" class="text-xs text-gray-500">
										{{ formatRelativeDate(comment.createdAt) }}
									</p>
								</div>
							</div>
						</li>
					</ContainerComp>
				</div>
				<div v-else class="flex flex-col justify-center items-center">
					<p class="mt-4 text-gray-400 text-sm">No comments yet...</p>
				</div>
			</ContainerComp>
		</template>
		<template v-else>
			<ContainerComp class="flex flex-col">
				<div class="flex-1 flex justify-center items-center">
					<LoaderComp />
				</div>
			</ContainerComp>
		</template>
	</div>

	<Teleport to="#barTop">
		<form @submit.prevent="handlerSubmitComment" class="flex rounded-lg shadow-sm shadow-black/[.04] absolute bottom-1 w-full px-2">
			<label for="comment" class="sr-only">Comment</label>
			<input v-model="newComment.comment"
				type="text"
				id="comment"
				placeholder="Comment"
				class="text-slate-200 bg-gray-600 bg-opacity-40 flex h-9 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground shadow-black/[.04] placeholder:text-muted-foreground/70 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-1 -me-px flex-1 rounded-e-none focus-visible:z-10" />
			<button :disabled="newComment.comment.length === 0" class="text-slate-200 bg-gray-600 bg-opacity-40 inline-flex items-center rounded-e-lg border border-input px-3 text-sm text-foreground hover:bg-accent hover:text-foreground focus:z-10 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-1 disabled:text-gray-700 disabled:cursor-not-allowed">
				Send
			</button>
		</form>
	</Teleport>

	<ModalComp v-if="modal" :fn="cancelEdit">
		<ContainerComp @submit.prevent="handlerSubmitEdit" tag="form" class="flex-1 bg-black rounded-lg p-4 max-w-md">
			<ContainerComp class="flex flex-col gap-4 items-center">
				<ContainerComp>
					<label for="title" class="sr-only">Title</label>
					<input v-model="updatePostData.title"
						type="text"
						id="title"
						name="title"
						placeholder="Title"
						class="custom-input">
				</ContainerComp>

				<ContainerComp>
					<label for="body" class="sr-only">Tweet</label>
					<input v-model="updatePostData.body"
						type="text"
						id="body"
						name="body"
						placeholder="Write your post"
						required
						class="custom-input">
				</ContainerComp>

				<ContainerComp v-if="tempEditFilePreview || (post?.file && editFileAction !== 'remove')">
					<figure class="max-w-40 rounded-lg overflow-hidden">
						<img :src="tempEditFilePreview || post?.file" alt="Post image">
					</figure>
					<button type="button" @click="removeEditFile"
						class="mt-1 text-xs text-red-400 hover:text-red-300">
						Remove image
					</button>
				</ContainerComp>

				<ContainerComp>
					<label for="edit-photo-upload" class="block text-sm text-gray-400 mb-1">
						{{ post?.file ? 'Change image' : 'Add image' }}
					</label>
					<input @change="handleEditFileChange"
						type="file"
						id="edit-photo-upload"
						accept="image/*"
						class="w-full file:w-full file:transition-all file:cursor-pointer file:mr-4 file:py-2 file:rounded-lg file:border file:border-white file:text-sm file:font-semibold file:bg-violet-50 file:text-black hover:file:bg-black hover:file:text-white">
				</ContainerComp>

				<ContainerComp class="flex flex-col gap-2">
					<button type="submit"
						:disabled="!updatePostData.title && !updatePostData.body"
						class="btn-primary text-sm disabled:cursor-not-allowed disabled:bg-gray-900 disabled:hover:border-transparent disabled:text-gray-600">
						Update post
					</button>
					<button @click="handleDeletePost" type="button"
						class="w-full py-2 text-sm text-red-400 rounded-lg border border-red-400 transition hover:bg-red-400 hover:text-black">
						Delete post
					</button>
					<button @click="cancelEdit" type="button" class="btn-secondary text-sm border border-white">
						Cancel
					</button>
				</ContainerComp>
			</ContainerComp>
		</ContainerComp>
	</ModalComp>
</template>
