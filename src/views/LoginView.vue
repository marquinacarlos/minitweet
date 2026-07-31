<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@composables/useAuth';
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors';
import useLoading from '@/composables/useLoading';
//------------------------------------------------------------------- COMPONENTS
import ContainerComp from '@components/ContainerComp.vue';
import TitleComp from '@/components/TitleComp.vue';
import LoaderComp from '@/components/skeletons/LoaderComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { ref } from 'vue';
//------------------------------------------------------------------- VUE ROUTER
import { RouterLink, useRouter } from 'vue-router';
//------------------------------------------------------------------- USE COMPOSABLES
const { loading, startLoading, endLoading } = useLoading();
const router = useRouter();
const { login, authError } = useAuth();
//------------------------------------------------------------------- VARIABLES
const userToLog = ref({
	email: '',
	password: ''
});
const errorMessage = ref(null);
const showPassword = ref(false);
//------------------------------------------------------------------- METHODS
/**
 * Funcion para iniciar sesión
 */
async function handlerSubmit() {
	errorMessage.value = null;
	try {
		startLoading();
		const { email, password } = userToLog.value;
		await login({ email, password });
		router.push({ name: 'Feed' });
	} catch (error) {
		errorMessage.value = getFirebaseErrorMessage(authError.value);
	} finally {
		endLoading();
	}
}
</script>

<template>
	<div class="grid place-items-center grid-rows-[1fr] h-[calc(100dvh-var(--navbar-height))]">
		<template v-if="!loading">
			<ContainerComp class="flex flex-col gap-6 max-w-96">
				<TitleComp text="Login" />
				<ContainerComp tag="form" @submit.prevent="handlerSubmit" class="flex-1" action="#">
					<ContainerComp class="flex flex-col gap-4 items-center">
						<ContainerComp>
							<label for="email" class="sr-only">Email</label>
							<input v-model="userToLog.email" type="email" id="email"
								name="email" placeholder="Email"
								class="custom-input" required>
						</ContainerComp>

						<ContainerComp class="relative">
							<label for="password" class="sr-only">Password</label>
							<input v-model="userToLog.password" :type="showPassword ? 'text' : 'password'"
								id="password" name="password" placeholder="Password"
								class="custom-input pr-16" required>
							<button type="button" @click="showPassword = !showPassword"
								class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white">
								{{ showPassword ? 'Hide' : 'Show' }}
							</button>
						</ContainerComp>

						<p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>

						<ContainerComp>
							<button type="submit" class="btn-primary">Log in</button>
						</ContainerComp>
					</ContainerComp>
				</ContainerComp>

				<ContainerComp tag="p" class="text-xs text-center">
					Don't have an account? <RouterLink to="/signup" class="text-blue-700 hover:underline">Sign up here</RouterLink>
				</ContainerComp>
			</ContainerComp>
		</template>
		<template v-else>
			<LoaderComp />
		</template>
	</div>
</template>