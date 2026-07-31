import { getProfileUserByUID, updateProfileUser } from '@/services/profile.service';
import { uploadFile, getFileURL } from '@/services/storage.service';
import useLocalStorage from './useLocalStorage';
import useAuth from './useAuth';

const { saveDataInLocalStorage } = useLocalStorage();

const useProfile = () => {
	const { user } = useAuth();

	async function getUserById(userId) {
		if (user.value?.uid === userId) return user.value;
		const fetchedUser = await getProfileUserByUID(userId);
		return fetchedUser;
	}

	async function updateUser(updatedData) {
		const updatedUser = await updateProfileUser(user.value.uid, updatedData);
		user.value = { ...user.value, ...updatedUser };
		saveDataInLocalStorage('user', user.value);
	}

	async function updateProfilePhoto(filePhoto) {
		const fileExtension = filePhoto.name.split('.').pop();
		const filePath = `users/${user.value?.uid}/profilePhoto/profilePhoto.${fileExtension}`;
		await uploadFile(filePath, filePhoto);
		const photoURL = await getFileURL(filePath);
		await updateUser({ photoURL });
	}

	async function updateCoverPhoto(filePhoto) {
		const fileExtension = filePhoto.name.split('.').pop();
		const filePath = `users/${user.value?.uid}/coverPhoto/coverPhoto.${fileExtension}`;
		await uploadFile(filePath, filePhoto);
		const coverPhotoURL = await getFileURL(filePath);
		await updateUser({ coverPhotoURL });
	}

	return {
		getUserById,
		updateUser,
		updateProfilePhoto,
		updateCoverPhoto,
	};
};

export default useProfile;
