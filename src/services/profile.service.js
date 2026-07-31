import { db } from '@/services/firebase.service';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function createProfileUser(newUserProfile) {
	newUserProfile.createdAt = serverTimestamp();
	newUserProfile.updateAt = serverTimestamp();
	await setDoc(doc(db, 'usersProfiles', newUserProfile.uid), { ...newUserProfile });
	return newUserProfile;
}

export async function getProfileUserByUID(uid) {
	const userDoc = await getDoc(doc(db, 'usersProfiles', uid));
	if (!userDoc.exists()) throw new Error(`User profile not found for UID: ${uid}`);
	return userDoc.data();
}

export async function updateProfileUser(userUID, data) {
	data.updateAt = serverTimestamp();
	await updateDoc(doc(db, 'usersProfiles', userUID), data);
	return data;
}
