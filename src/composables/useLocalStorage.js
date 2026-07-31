//------------------------------------------------------------------- FUNCIÓN PRINCIPAL
const useLocalStorage = () => {
	//------------------------------------------------------------------- METHODS
	/**
	 * Función para guardar datos en el localStorage
	 * @param {String} key 
	 * @param {String} data 
	 */
	function saveDataInLocalStorage(key, data) {
		localStorage.setItem(key, JSON.stringify(data));
	}

	/**
	 * Función para obtener datos del localStorage
	 * @param {String} key 
	 * @returns 
	 */
	function getDataFromLocalStorage(key) {
		const raw = localStorage.getItem(key);
		if (raw === null || raw === 'undefined') return null;
		return JSON.parse(raw);
	}

	/**
	 * Función para remover datos del localStorage
	 * @param {String} key 
	 */
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