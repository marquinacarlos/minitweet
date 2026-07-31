//------------------------------------------------------------------- FIREBASE CONFIG
import { db } from '@/services/firebase.service';
//------------------------------------------------------------------- FIREBASE SERVICES
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
//------------------------------------------------------------------- FUNCIONES
/**
 * Función para crear un nuevo perfil de usuario
 * @param {Object} newUserProfile 
 * @returns Promise<{Object}>
 */
export async function createProfileUser(newUserProfile) {
	newUserProfile.createdAt = serverTimestamp();
	newUserProfile.updateAt = serverTimestamp();
	await setDoc(doc(db, 'usersProfiles', newUserProfile.uid), { ...newUserProfile });
	return newUserProfile;
}

/**
 * Función para obtener el perfil de usuario por UID
 * @param {String} uid 
 * @returns Object<{userProfile}>
 */
export async function getProfileUserByUID(uid) {
	const userDoc = await getDoc(doc(db, 'usersProfiles', uid));
	if (!userDoc.exists()) throw new Error(`User profile not found for UID: ${uid}`);
	return userDoc.data();
}

/**
 * Función para actualizar el perfil de usuario
 * @param {String} userUID 
 * @param {Object} data 
 * @returns Object<{userProfile}>
 */
export async function updateProfileUser(userUID, data) {
	data.updateAt = serverTimestamp();
	await updateDoc(doc(db, 'usersProfiles', userUID), data);
	return data;
}