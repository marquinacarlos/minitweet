<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@composables/useAuth';
import useProfile from '@/composables/useProfile';
//------------------------------------------------------------------- COMPONENTS
import ContainerComp from '@/components/ContainerComp.vue';
import TitleComp from '@/components/TitleComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { ref } from 'vue';
//------------------------------------------------------------------- VUE ROUTER
import { useRouter } from 'vue-router';

//------------------------------------------------------------------- USE COMPOSABLES
const router = useRouter();
const { user } = useAuth();
const { updateUser } = useProfile();
//------------------------------------------------------------------- VARIABLES
const userLogged = ref({
	uid: user.value.uid,
	name: user.value.name,
	email: user.value.email,
	username: user.value.username,
	bio: user.value.bio,
	photoURL: user.value.photoURL,
	coverPhotoURL: user.value.coverPhotoURL,
});
//------------------------------------------------------------------- METHODS
/**
 * Funcion para actualizar los datos del usuario
 */
async function handlerSubmit() {
	try {
		await updateUser(userLogged.value);
		router.push({ name: 'Account', params: { id: user.value.uid } });
	} catch (error) {
		console.error(error);
	}
}
</script>

<template>
	<div class="grid grid-rows-[1fr] h-[calc(100dvh-var(--navbar-height))] place-items-center overflow-y-auto">
		<ContainerComp class="flex flex-col gap-6">
			<ContainerComp>
				<TitleComp text="Editar cuenta" :stickyTop="true" />
				<ContainerComp class="text-xs text-center font-bold text-gray-300 text-opacity-40 mt-2">#{{ userLogged.uid }}</ContainerComp>
			</ContainerComp>
			<ContainerComp @submit.prevent="handlerSubmit" tag="form" class="flex-1" action="#">
				<ContainerComp class="flex flex-col gap-4 items-center">
					<ContainerComp>
						<label for="name" class="sr-only">Nombre</label>
						<input v-model="userLogged.name" 
							type="text" 
							id="name" 
							name="name"
							placeholder="Nombre"
							required
							class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input">
					</ContainerComp>

					<ContainerComp>
						<label for="username" class="sr-only">Username</label>
						<input v-model="userLogged.username" 
							type="text" 
							id="username"
							name="username" 
							placeholder="Username"
							required
							class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input">
					</ContainerComp>

					<ContainerComp>
						<label for="email" class="sr-only">Email</label>
						<input type="email" 
							id="email" 
							name="email" 
							:placeholder="`${userLogged.email} Email (proximamente)`"
							required
							disabled
							class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input opacity-30 cursor-not-allowed">
					</ContainerComp>

					<ContainerComp>
						<label for="password" class="sr-only">Password</label>
						<input v-model="userLogged.password" 
							type="password" 
							id="password"
							name="password"
							placeholder="Contraseña (proximamente)"
							required
							disabled
							class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input opacity-30 cursor-not-allowed">
					</ContainerComp>

					<!-- TODO: Agregar aquí tambien las funcion de cambio de foto de perfil -->

					<ContainerComp>
						<label for="bio" class="sr-only">Biografía</label>
						<textarea v-model="userLogged.bio" 
							type="text" 
							id="bio"
							name="bio"
							placeholder="Biografía"
							required
							class="w-full p-2 bg-transparent border-b focus:outline-none focus:border-blue-600 custom-input resize-none">
                                                </textarea>
					</ContainerComp>

					<ContainerComp class="flex flex-col gap-2">
						<button type="submit" class="btn-primary">Guardar cambios</button>
						<button type="button" @click="router.back()" class="btn-secondary">Cancelar</button>
					</ContainerComp>
				</ContainerComp>
			</ContainerComp>
		</ContainerComp>
	</div>
</template>