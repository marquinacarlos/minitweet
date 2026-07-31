<script setup>
import { ref, onMounted } from 'vue';

let deferredPrompt = null;
const showBtnInstall = ref(false);

const installApp = async () => {
	if (deferredPrompt) {
		// Muestra el prompt de instalación
		deferredPrompt.prompt();
		// Espera a que el usuario responda al prompt
		const { outcome } = await deferredPrompt.userChoice;
		// Si el usuario aceptó la instalación
		if (outcome === 'accepted') {
			console.log('El usuario aceptó la instalación');
		} else {
			console.log('El usuario canceló la instalación');
		}
		// Resetea deferredPrompt para que no se pueda instalar más de una vez
		deferredPrompt = null;
		// Oculta el botón de instalación
		showBtnInstall.value = false;
	}
};

onMounted(() => {
	/**
	 * Evento que se dispara cuando el navegador detecta que la app es instalable
	 */
	window.addEventListener('beforeinstallprompt', (e) => {
		// console.log('Evento beforeinstallprompt disparado');
		// Previene que el navegador muestre el prompt de instalación automáticamente
		e.preventDefault();
		// Guarda el evento para usarlo más tarde
		deferredPrompt = e;
		// Muestra el botón de instalación
		showBtnInstall.value = true;
	});
});
</script>

<template>
	<button v-if="showBtnInstall" @click="installApp" id="btnInstall">
		Install Minitweet
	</button>
</template>
