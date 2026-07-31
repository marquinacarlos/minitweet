import { ref } from 'vue';

const modal = ref(false);

const useModal = () => {
	const openModal = () => modal.value = true;
	const closeModal = () => modal.value = false;

	return {
		modal,
		openModal,
		closeModal
	}
}

export default useModal;
