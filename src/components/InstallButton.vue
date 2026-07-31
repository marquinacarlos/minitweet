<script setup>
import { ref, onMounted } from 'vue';

let deferredPrompt = null;
const showBtnInstall = ref(false);

const installApp = async () => {
	if (deferredPrompt) {
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') {
			console.log('User accepted the install');
		} else {
			console.log('User dismissed the install');
		}
		deferredPrompt = null;
		showBtnInstall.value = false;
	}
};

onMounted(() => {
	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		deferredPrompt = e;
		showBtnInstall.value = true;
	});
});
</script>

<template>
	<button v-if="showBtnInstall" @click="installApp" id="btnInstall">
		Install Minitweet
	</button>
</template>
