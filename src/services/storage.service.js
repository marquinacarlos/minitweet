import { storage } from '@/services/firebase.service';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const uploadFile = async (path, file) => {
	const storageRef = ref(storage, path);
	await uploadBytes(storageRef, file);
}

export const getFileURL = async (file) => {
	const storageRef = ref(storage, file);
	return await getDownloadURL(storageRef);
}

export const deleteFile = async (path) => {
	const storageRef = ref(storage, path);
	return await deleteObject(storageRef);
}

export const deleteFileByURL = async (url) => {
	const storageRef = ref(storage, url);
	return await deleteObject(storageRef);
}
