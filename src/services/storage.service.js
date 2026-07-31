//------------------------------------------------------------------- FIREBASE CONFIG
import { storage } from '@/services/firebase.service';
//------------------------------------------------------------------- FIREBASE SERVICES
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
//------------------------------------------------------------------- FUNCIONES
/**
 * Función que sube un archivo al storage
 * @param {string} path 
 * @param {File} file 
 */
export const uploadFile = async (path, file) => {
	const storageRef = ref(storage, path); // Referencia al archivo en el storage
	await uploadBytes(storageRef, file); // Subir el archivo (representado como objeto File o Blob) al storage
}

/**
 * Retorna la URL absoluta de un archivo en el storage
 * @param {string} file 
 * @returns {Promise<string>} URL del archivo
 */
export const getFileURL = async (file) => {
	const storageRef = ref(storage, file); // Referencia al archivo en el storage
	return await getDownloadURL(storageRef); // Obtener la URL del archivo
}

/**
 * @param {string} path 
 * @returns 
 */
export const deleteFile = async (path) => {
	const storageRef = ref(storage, path);
	return await deleteObject(storageRef);
}

export const deleteFileByURL = async (url) => {
	const storageRef = ref(storage, url);
	return await deleteObject(storageRef);
}