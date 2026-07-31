//------------------------------------------------------------------- FIREBASE CONFIG
import { db } from '@/services/firebase.service';
//------------------------------------------------------------------- FIREBASE SERVICES
import { addDoc, collection, doc, deleteDoc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
//------------------------------------------------------------------- VARIABLES GLOBALES
const postsCollection = collection(db, 'posts');
//------------------------------------------------------------------- FUNCIONES
/**
 * Función para agregar un nuevo post/tweet en Firestore
 * @param {Object} newPost 
 */
export async function createNewPostOnFirestore(newPost) {
	try {
		newPost.createdAt = serverTimestamp();
		newPost.updatedAt = serverTimestamp();
		await addDoc(postsCollection, { ...newPost });
	} catch (error) {
		console.error("Error adding document: ", error.message);
	}
}

/**
 * Función para obtener todos los posts de Firestore ordenados por fecha de creación,
 * de forma descendente y en tiempo real
 * @param {Function} callback
 * @returns {Function} unsubscribe
 */
export function getAllPostFromFirestore(callback) {
	try {
		const q = query(postsCollection, orderBy('createdAt', 'desc'));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
			callback(posts); // Llama al callback con los posts actualizados
		});
		return unsubscribe; // Devuelve la función de desuscripción directamente
	} catch (error) {
		console.error("Error getting documents: ", error);
	}
}

/**
 * Función para obtener todos los posts de Firestore ordenados por fecha de creación
 * de forma descendente, de un usuario específico por su UID
 * @param {String} userId 
 * @returns {Array} userPosts
 */
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
		throw error; // Lanza el error para que pueda ser manejado por el llamador
	}
}

/**
 * Función para obtener un post de Firestore por su ID
 * (Disclaimer: ID del post,no del usuario)
 * @param {String} postId 
 * @returns {Object} post
 */
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

/**
 * Función para actualizar un post del usuario de Firestore por su ID
 * @param {String} postID 
 * @param {Object} data 
 * @returns 
 */
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
