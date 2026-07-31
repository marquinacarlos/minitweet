import { db } from '@/services/firebase.service';
import { collection, addDoc, query, serverTimestamp, onSnapshot, orderBy, limit, doc, deleteDoc, getDocs } from 'firebase/firestore';

export function getCommentsFromFirestore(postID, callback) {
	const q = query(collection(db, 'posts', postID, 'comments'), orderBy('createdAt', 'asc'), limit(20));
	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		const comments = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));
		callback(comments);
	});
	return unsubscribe;
}

export async function deleteCommentFromFirestore(postID, commentID) {
	await deleteDoc(doc(db, 'posts', postID, 'comments', commentID));
}

export async function deleteAllCommentsFromPost(postID) {
	const commentsSnapshot = await getDocs(collection(db, 'posts', postID, 'comments'));
	const deletePromises = commentsSnapshot.docs.map((commentDoc) =>
		deleteDoc(doc(db, 'posts', postID, 'comments', commentDoc.id))
	);
	await Promise.all(deletePromises);
}

export async function saveCommentToFirestore({ postID, comment, userUID }) {
	try {
		await addDoc(collection(db, 'posts', postID, 'comments'), {
			userUID,
			comment,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		})
	} catch (error) {
		console.error('Error saving comment:', error);
	}
}
