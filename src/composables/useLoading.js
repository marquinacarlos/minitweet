import { ref } from "vue"

const loading = ref(false);

const useLoading = () => {
	const startLoading = () => loading.value = true;
	const endLoading = () => loading.value = false;

	return {
		loading,
		startLoading,
		endLoading
	}
}

export default useLoading
