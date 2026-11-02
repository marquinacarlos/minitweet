import { authRegister, authlogin, authLogout, authState, authDeleteCurrentUser } from '@/services/auth.service';
import { createProfileUser, getProfileUserByUID, ProfileNotFoundError } from '@/services/profile.service';
import useLocalStorage from './useLocalStorage';
import { ref } from 'vue';

const { saveDataInLocalStorage, getDataFromLocalStorage, removeDataFromLocalStorage } = useLocalStorage();

const user = ref(null);
const authError = ref(null);

const useAuth = () => {
	async function checkAuth() {
		const storedUser = getDataFromLocalStorage('user');
		if (storedUser) {
			user.value = storedUser;
		} else {
			const currentUser = await authState();
			if (currentUser) {
				try {
					user.value = await getProfileUserByUID(currentUser.uid);
					saveDataInLocalStorage('user', user.value);
				} catch (error) {
					if (!(error instanceof ProfileNotFoundError)) throw error;
					await authLogout();
					user.value = null;
				}
			}
		}
	}

	async function registerUser({ name, username, email, password }) {
		authError.value = null;
		try {
			const userCredential = await authRegister({ email, password });
			const newUser = {
				uid: userCredential.user.uid,
				name,
				username,
				email,
				bio: null,
				photoURL: null,
				coverPhotoURL: null,
				followers: [],
				following: [],
				posts: [],
			}
			try {
				user.value = await createProfileUser(newUser);
			} catch (profileError) {
				await authDeleteCurrentUser().catch((e) => console.error('Rollback failed:', e));
				throw profileError;
			}
			saveDataInLocalStorage('user', user.value);
		} catch (error) {
			authError.value = error.code;
			throw error;
		}
	}

	async function login({ email, password }) {
		authError.value = null;
		try {
			const userCredential = await authlogin({ email, password });
			try {
				user.value = await getProfileUserByUID(userCredential.user.uid);
			} catch (profileError) {
				if (profileError instanceof ProfileNotFoundError) await authLogout();
				throw profileError;
			}
			saveDataInLocalStorage('user', user.value);
		} catch (error) {
			authError.value = error.code || 'profile/not-found';
			throw error;
		}
	}

	async function logout() {
		await authLogout();
		removeDataFromLocalStorage('user');
		user.value = null;
	}

	return {
		user,
		authError,
		checkAuth,
		registerUser,
		login,
		logout,
	};
};

export default useAuth;
