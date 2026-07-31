//------------------------------------------------------------------- FIREBASE SERVICES
import { getFileURL, uploadFile, deleteFileByURL } from '@/services/storage.service';
import { getAllPostFromFirestore, createNewPostOnFirestore, getAllPostByUserUIDFromFirestore, getPostByIdFromFirestore, updatePostOnFirestore, deletePostFromFirestore } from '@/services/post.service';
import { deleteAllCommentsFromPost } from '@/services/comment.service';
//------------------------------------------------------------------- VUE COMPOSITION API
import { ref } from 'vue';
//------------------------------------------------------------------- FUNCIÓN PRINCIPAL
const usePosts = () => {
	//------------------------------------------------------------------- VARIABLES
	const postsList = ref([]);
	//------------------------------------------------------------------- METHODS
	/**
	 * Función para obtener todos los posts de Firestore ordenados por fecha de creación,
	 * de forma descendente y en tiempo real
	 * @param {Function} callback 
	 * @returns 
	 */
	function getAllPosts(callback) {
		try {
			const unsubscribe = getAllPostFromFirestore(callback);
			return unsubscribe;
		} catch (error) {
			console.error("Error getting documents: ", error);

		}
	}

	/**
	 * Función para agregar un nuevo post/tweet en Firestore
	 * @param {Object} newPost 
	 */
	async function createNewPost(newPost) {
		try {
			if (newPost.file) {
				newPost.file = await uploadPostFile(newPost.file, newPost.userUID); // cargamos el archivo y retornamos el fileURL (String)
			}
			await createNewPostOnFirestore(newPost);
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	}

	/**
	 * Función para obtener todos los posts de un usuario por su UID
	 * @param {String} userId 
	 * @returns {Array} userPosts
	 */
	function getAllPostsByUserUID(userId) {
		try {
			const userPosts = getAllPostByUserUIDFromFirestore(userId);
			return userPosts;
		} catch (error) {
			console.error("Error getting documents: ", error);
		}
	}

	/**
	 * Función para obtener un post por su ID
	 * @param {String} postID 
	 * @returns 
	 */
	async function getPostByID(postID, callback) {
		try {
			const unsubscribe = await getPostByIdFromFirestore(postID, callback);
			return unsubscribe;
		} catch (error) {
			console.error("Error getting document: ", error);
		}
	}

	/**
	 * Función para actualizar un post por su ID
	 * @param {String} postID 
	 * @param {String} newDataPost 
	 */
	async function updatePost(postID, newDataPost, callback) {
		try {
			const unsubscribe = await updatePostOnFirestore(postID, newDataPost, callback);
			return unsubscribe;
		} catch (error) {
			console.error("Error updating document: ", error);
		}
	}

	/**
	 * Función para subir un archivo al storage
	 * @param {File} file
	 * @param {String} userUID 
	 * @returns {String} fileURL
	 */
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