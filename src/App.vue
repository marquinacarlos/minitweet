<script setup>
import useAuth from './composables/useAuth';
import NavBar from '@components/NavBarComp.vue'
import ContainerComp from '@components/ContainerComp.vue';
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router'

const router = useRouter();
const { checkAuth } = useAuth();

function updateTitle(to) {
	const defaultNameApp = 'Minitweet';
	const title = to.name ? `| ${to.name}` : '';
	document.title = `${defaultNameApp} ${title}`
}

onMounted(async () => {
	try {
		router.afterEach((to) => { updateTitle(to) })
		await checkAuth();
	} catch (error) {
		console.error(error)
	}
})
</script>

<template>
	<div class="mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg grid grid-rows-[1fr] h-[calc(100dvh-var(--navbar-height))] text-slate-200 px-2 text-sm">
		<main class="flex-1 w-full max-w-xl mx-auto flex flex-col">
			<RouterView />
		</main>
	</div>
	<div class="fixed bottom-0 left-0 right-0 w-full">
		<ContainerComp id="barTop" class="relative mx-auto w-full max-w-xl"></ContainerComp>
		<NavBar />
	</div>
</template>
