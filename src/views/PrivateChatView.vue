<script setup>
//------------------------------------------------------------------- FIREBASE SERVICES
import { getPrivateMessages, savePrivateMessage } from '@/services/privateChat.service';
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@/composables/useAuth.js';
import useProfile from '@/composables/useProfile';
import useLoading from '@/composables/useLoading';
//------------------------------------------------------------------- COMPONENTS
import ContainerComp from '@/components/ContainerComp.vue';
import LoaderComp from '@/components/skeletons/LoaderComp.vue';
import ProfilePhotoComp from '@/components/ProfilePhotoComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue';
//------------------------------------------------------------------- VUE ROUTER
import { useRoute } from 'vue-router';
//------------------------------------------------------------------- USE COMPOSABLES
const route = useRoute();
const { user } = useAuth();
const { getUserById } = useProfile();
const { loading, startLoading, endLoading } = useLoading();
//------------------------------------------------------------------- DATA
const userToChat = ref(null);
const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null); // Referencia al contenedor de mensajes
const unsubscribe = ref(null);
//------------------------------------------------------------------- METHODS
/**
 * Envía un mensaje privado
 */
async function sendMessage() {
	try {
		await savePrivateMessage(user.value.uid, userToChat.value.uid, newMessage.value);
		newMessage.value = '';
		scrollToBottom();
	} catch (error) {
		console.error(error.message);
	}
}

/**
 * Desplaza el contenedor de mensajes al final
 */
function scrollToBottom() {
	if (messagesContainer.value) {
		// Disclaimer: dejé los console.log para que se entienda el uso de cada propiedad. (Solo por fines educativos)
		// console.log('scrollTop:', messagesContainer.value.scrollTop); // -> Descripción: Representa la cantidad de píxeles que el contenido de un elemento ha sido desplazado hacia arriba. -> Uso: Se utiliza para obtener o establecer la posición de desplazamiento vertical de un elemento.
		// console.log('scrollHeight:', messagesContainer.value.scrollHeight); // -> Descripción: Representa la altura total de un elemento, incluido el contenido que no es visible debido al desbordamiento. -> Uso: Se utiliza para obtener la altura total de un elemento, incluido el contenido que no es visible debido al desbordamiento.
		// console.log('clientHeight:', messagesContainer.value.clientHeight); // -> Descripción: Representa la altura de un elemento, incluido el relleno, pero sin bordes ni barras de desplazamiento. -> Uso: Se utiliza para obtener la altura de un elemento, incluido el relleno, pero sin bordes ni barras de desplazamiento.
		messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight + 100;
	}
}
//------------------------------------------------------------------- LIFECYCLE
onMounted(async () => {
	startLoading();
	const { id } = route.params;
	userToChat.value = await getUserById(id);

	unsubscribe.value = getPrivateMessages(
		user.value.uid,
		userToChat.value.uid,
		async (newMessages) => {
			messages.value = newMessages;
			endLoading();
			await nextTick(); // Espera a que el DOM se actualice
			scrollToBottom();
		}
	);
});

onBeforeUnmount(() => {
	if (unsubscribe.value) {
		unsubscribe.value();
	}
});
</script>

<template>
	<div class="grid grid-rows-[auto_1fr] custom-height">
		<h1 class="sr-only">Private chat</h1>
		<!-- HEADER -->
		<ContainerComp class="p-4 bg-black flex items-center gap-4 shadow">
			<ProfilePhotoComp :src="userToChat?.photoURL" :alt="userToChat?.name" width="w-12" height="h-12" />
			<h1 class="text-xl">{{ userToChat?.name }} <span class="text-xs text-gray-400">(Private Chat)</span></h1>
		</ContainerComp>
		<!-- CHAT -->
		<template v-if="!loading">
			<ul ref="messagesContainer" class="p-4 flex flex-col items-start gap-2 overflow-y-scroll">
				<template v-if="messages.length">
					<li v-for="message in messages" 
						:key="message.id" 
						class="text-white p-3 max-w-xs message-bubble" 
						:class="{
							'self-end rounded-l-lg rounded-br-lg sent': message.userID === user.uid,
							'rounded-r-lg rounded-bl-lg received': message.userID !== user.uid
						}">
						<p>{{ message.message }}</p>
					</li>
				</template>
				<template v-else>
					<li class="flex-1 w-full p-4 flex flex-col items-center justify-center">
						<p class="text-gray-400 text-xs">No messages yet...</p>
					</li>
				</template>
			</ul>
		</template>
		<template v-else>
			<div class="flex flex-col justify-center items-center">
				<LoaderComp />
			</div>
		</template>
	</div>

	<!-- INPUT -->
	<Teleport to="#barTop" v-if="!loading">
		<ContainerComp class="flex gap-1">
			<div class="space-y-2 w-full">
				<form @submit.prevent="sendMessage" class="flex rounded-lg shadow-sm shadow-black/[.04] absolute bottom-1 w-full px-2">
					<label for="message" class="sr-only">Mensaje</label>
					<input v-model="newMessage"
						type="text"
						id="message"
						placeholder="Message"
						class="bg-gray-600 bg-opacity-40 text-slate-200 flex h-9 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground shadow-black/[.04] placeholder:text-muted-foreground/70 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-1 -me-px flex-1 rounded-e-none focus-visible:z-10" />
					<button :disabled="!newMessage && !newMessage.length" class="text-slate-200 bg-gray-600 bg-opacity-40 inline-flex items-center rounded-e-lg border border-input px-3 text-sm text-foreground hover:bg-accent hover:text-foreground focus:z-10 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-1 disabled:text-gray-700 disabled:cursor-not-allowed">
						Send
					</button>
				</form>
			</div>
		</ContainerComp>
	</Teleport>
</template>

<style scoped>
/* dvh -> Dinamic viewport height */
.custom-height {
	height: calc(100dvh - var(--navbar-height) - 40px);
}

.message-bubble {
	position: relative;
	padding: 10px;
}

.received {
	background-color: #303133;
}

.received::before {
	content: '';
	position: absolute;
	top: 0;
	left: -10px;
	width: 0;
	height: 0;
	border-bottom: 10px solid transparent;
	border-right: 16px solid #303133;
}

.sent {
	background-color: #06305c;
}

.sent::after {
	content: '';
	position: absolute;
	top: 0;
	right: -10px;
	width: 0;
	height: 0;
	border-bottom: 10px solid transparent;
	border-left: 16px solid #06305c;
}
</style>
