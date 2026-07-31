//------------------------------------------------------------------- FIREBASE CONFIG
import { auth } from '@/services/firebase.service';
//------------------------------------------------------------------- FIREBASE SERVICES
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
//------------------------------------------------------------------- FUNCIONES
/**
 * Funcion para registrar un nuevo usuario
 * @param {{email: String, password: String}} param0 
 * @returns Promise<{userCredential}>
 */
export async function authRegister({ email, password }) {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	return userCredential;
}

/**
 * Funcion para iniciar sesion del usuario
 * @param {{email: String, password: String}} param0 
 * @returns Promise<{userCredential}>
 */
export async function authlogin({ email, password }) {
	const userCredential = await signInWithEmailAndPassword(auth, email, password);
	return userCredential;
}

/**
 * Funcion para cerrar sesion del usuario
 * @returns Promise<void>
 */
export async function authLogout() {
	await signOut(auth);
}


/**
 * Función para obtener el estado de autenticación del usuario
 * @returns Promise<{user}>
 */
export function authState() {
	return new Promise((resolve, reject) => {
		try {
			const unsubscribe = onAuthStateChanged(auth, (user) => {
				resolve(user);
				unsubscribe();
			});
		} catch (error) {
			reject(error);
		}
	});
}