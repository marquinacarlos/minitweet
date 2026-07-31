//------------------------------------------------------------------- FIREBASE SERVICES
import { getCommentsFromFirestore, saveCommentToFirestore, deleteCommentFromFirestore } from '@/services/comment.service';
//------------------------------------------------------------------- VUE COMPOSITION API
import { ref } from 'vue';
//------------------------------------------------------------------- FUNCIÓN PRINCIPAL
function useComments() {
	//------------------------------------------------------------------- VARIABLES
	const comments = ref([]);
	//------------------------------------------------------------------- METHODS
	/**
	 * Función que obtiene los comentarios de un post en Firestore, se almacenan en un array reactivo.
	 * y se asignan a una variable posteriormente mediante un callback.
	 * @param {String} postID 
	 * @param {Function} callback 
	 * @returns 
	 */
	async function getCommentsByPostID(postID, callback) {
		try {
			const unsubscribe = getCommentsFromFirestore(postID, callback);
			return unsubscribe;
		} catch (error) {
			console.error('Error obteniendo comentarios:', error);
		}
	}

	/**
	 * Función que guarda un comentario en Firestore.
	 * @param {{ postID: String, comment: String, userUID: String }} param0 
	 */
	async function saveComment({ postID, comment, userUID }) {
		try {
			await saveCommentToFirestore({ postID, comment, userUID });
		} catch (error) {
			console.error('Error guardando comentario:', error);
		}
	}

	async function deleteComment(postID, commentID) {
		try {
			await deleteCommentFromFirestore(postID, commentID);
		} catch (error) {
			console.error('Error eliminando comentario:', error);
		}
	}

	return {
		comments,
		getCommentsByPostID,
		saveComment,
		deleteComment,
	}
}

export default useComments;