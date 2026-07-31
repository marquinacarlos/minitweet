import { getCommentsFromFirestore, saveCommentToFirestore, deleteCommentFromFirestore } from '@/services/comment.service';
import { ref } from 'vue';

function useComments() {
	const comments = ref([]);

	async function getCommentsByPostID(postID, callback) {
		try {
			const unsubscribe = getCommentsFromFirestore(postID, callback);
			return unsubscribe;
		} catch (error) {
			console.error('Error getting comments:', error);
		}
	}

	async function saveComment({ postID, comment, userUID }) {
		try {
			await saveCommentToFirestore({ postID, comment, userUID });
		} catch (error) {
			console.error('Error saving comment:', error);
		}
	}

	async function deleteComment(postID, commentID) {
		try {
			await deleteCommentFromFirestore(postID, commentID);
		} catch (error) {
			console.error('Error deleting comment:', error);
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
