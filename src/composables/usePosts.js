import { getFileURL, uploadFile, deleteFileByURL } from '@/services/storage.service';
import { getAllPostFromFirestore, createNewPostOnFirestore, getAllPostByUserUIDFromFirestore, getPostByIdFromFirestore, updatePostOnFirestore, deletePostFromFirestore } from '@/services/post.service';
import { deleteAllCommentsFromPost } from '@/services/comment.service';
import { ref } from 'vue';

const usePosts = () => {
	const postsList = ref([]);

	function getAllPosts(callback) {
		try {
			const unsubscribe = getAllPostFromFirestore(callback);
			return unsubscribe;
		} catch (error) {
			console.error("Error getting documents: ", error);
		}
	}

	async function createNewPost(newPost) {
		try {
			if (newPost.file) {
				newPost.file = await uploadPostFile(newPost.file, newPost.userUID);
			}
			await createNewPostOnFirestore(newPost);
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	}

	function getAllPostsByUserUID(userId) {
		try {
			const userPosts = getAllPostByUserUIDFromFirestore(userId);
			return userPosts;
		} catch (error) {
			console.error("Error getting documents: ", error);
		}
	}

	async function getPostByID(postID, callback) {
		try {
			const unsubscribe = await getPostByIdFromFirestore(postID, callback);
			return unsubscribe;
		} catch (error) {
			console.error("Error getting document: ", error);
		}
	}

	async function updatePost(postID, newDataPost, callback) {
		try {
			const unsubscribe = await updatePostOnFirestore(postID, newDataPost, callback);
			return unsubscribe;
		} catch (error) {
			console.error("Error updating document: ", error);
		}
	}

	async function uploadPostFile(file, userUID) {
		const filePath = `posts/${userUID}/postFiles/${file.name}`;
		await uploadFile(filePath, file);
		const fileURL = await getFileURL(filePath);
		return fileURL;
	}

	async function deletePost(post) {
		try {
			await deleteAllCommentsFromPost(post.id);
			if (post.file) await deleteFileByURL(post.file);
			await deletePostFromFirestore(post.id);
		} catch (error) {
			console.error("Error deleting post: ", error);
		}
	}

	return {
		postsList,
		getAllPosts,
		createNewPost,
		getAllPostsByUserUID,
		getPostByID,
		updatePost,
		deletePost,
		uploadPostFile,
	};
};

export default usePosts;
