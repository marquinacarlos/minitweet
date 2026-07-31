import { db } from '@/services/firebase.service';
import { addDoc, collection, doc, deleteDoc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

const postsCollection = collection(db, 'posts');

export async function createNewPostOnFirestore(newPost) {
	try {
		newPost.createdAt = serverTimestamp();
		newPost.updatedAt = serverTimestamp();
		await addDoc(postsCollection, { ...newPost });
	} catch (error) {
		console.error("Error adding document: ", error.message);
	}
}

export function getAllPostFromFirestore(callback) {
	try {
		const q = query(postsCollection, orderBy('createdAt', 'desc'));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
			callback(posts);
		});
		return unsubscribe;
	} catch (error) {
		console.error("Error getting documents: ", error);
	}
}

export async function getAllPostByUserUIDFromFirestore(userId) {
	try {
		const q = query(postsCollection, where('userUID', '==', userId), orderBy('createdAt', 'desc'));
		const querySnapshot = await getDocs(q);
		const userPosts = [];
		querySnapshot.forEach((doc) => {
			userPosts.push({ ...doc.data(), id: doc.id });
		});
		return userPosts;
	} catch (error) {
		console.error("Error getting documents: ", error);
		throw error;
	}
}

export async function getPostByIdFromFirestore(postId, callback) {
	let unsubscribe = null;
	const docRef = doc(postsCollection, postId);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		unsubscribe = onSnapshot(docRef, (doc) => {
			const currentData = { ...doc.data(), id: doc.id };
			callback(currentData);
		});
		return unsubscribe;
	} else {
		throw new Error(`Post with ID "${postId}" not found`);
	}
}

export async function deletePostFromFirestore(postID) {
	await deleteDoc(doc(postsCollection, postID));
}

export async function updatePostOnFirestore(postID, data, callback) {
	try {
		data.updatedAt = serverTimestamp();
		await updateDoc(doc(postsCollection, postID), data);
		const unsubscribe = onSnapshot(doc(postsCollection, postID), (doc) => {
			const currentData = { ...doc.data(), id: doc.id };
			callback(currentData);
		});
		return unsubscribe;
	} catch (error) {
		console.error("Error updating document: ", error);
	}
}
