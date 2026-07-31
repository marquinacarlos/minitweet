const useLocalStorage = () => {
	function saveDataInLocalStorage(key, data) {
		localStorage.setItem(key, JSON.stringify(data));
	}

	function getDataFromLocalStorage(key) {
		const raw = localStorage.getItem(key);
		if (raw === null || raw === 'undefined') return null;
		return JSON.parse(raw);
	}

	function removeDataFromLocalStorage(key) {
		localStorage.removeItem(key);
	}

	return {
		saveDataInLocalStorage,
		getDataFromLocalStorage,
		removeDataFromLocalStorage
	}
}

export default useLocalStorage;
