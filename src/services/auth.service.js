import { auth } from '@/services/firebase.service';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export async function authRegister({ email, password }) {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	return userCredential;
}

export async function authlogin({ email, password }) {
	const userCredential = await signInWithEmailAndPassword(auth, email, password);
	return userCredential;
}

export async function authLogout() {
	await signOut(auth);
}

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
