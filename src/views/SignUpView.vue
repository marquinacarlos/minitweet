<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@composables/useAuth';
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors';
//------------------------------------------------------------------- COMPONENTS
import useLoading from '@/composables/useLoading';
import TitleComp from '@/components/TitleComp.vue';
import ContainerComp from '@/components/ContainerComp.vue';
import LoaderComp from '@/components/skeletons/LoaderComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { ref } from 'vue';
//------------------------------------------------------------------- VUE ROUTER
import { RouterLink, useRouter } from 'vue-router';
//------------------------------------------------------------------- USE COMPOSABLES
const router = useRouter();
const { registerUser, authError } = useAuth();
const { loading, startLoading, endLoading } = useLoading();
//------------------------------------------------------------------- VARIABLES
const userData = ref({
        name: '',
        username: '',
        email: '',
        password: ''
})
const errorMessage = ref(null)
const showPassword = ref(false)
//------------------------------------------------------------------- METHODS
/**
 * Registra un nuevo usuario
 */
async function handlerSubmit() {
        errorMessage.value = null;
        try {
                startLoading();
                await registerUser({ ...userData.value });
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
                        <TitleComp text="Sign up" />
                        <ContainerComp @submit.prevent="handlerSubmit" tag="form" class="flex-1">
                                <ContainerComp class="flex flex-col gap-4 items-center">
                                        <ContainerComp>
                                                <label for="name" class="sr-only">Nombre</label>
                                                <input v-model="userData.name" 
							type="text" 
							id="name" 
							name="name"
                                                        placeholder="Name"
							required
                                                        class="custom-input">
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="username" class="sr-only">Username</label>
                                                <input v-model="userData.username" 
							type="text" 
							id="username"
                                                        name="username" 
							placeholder="Username"
							required
                                                        class="custom-input">
                                        </ContainerComp>

                                        <ContainerComp>
                                                <label for="email" class="sr-only">Email</label>
                                                <input v-model="userData.email" 
							type="email" 
							id="email" 
							name="email"
                                                        placeholder="Email"
							required
                                                        class="custom-input">
                                        </ContainerComp>

                                        <ContainerComp class="relative">
                                                <label for="password" class="sr-only">Password</label>
                                                <input v-model="userData.password"
							:type="showPassword ? 'text' : 'password'"
							id="password"
                                                        name="password"
							placeholder="Password"
							required
                                                        class="custom-input pr-16">
						<button type="button" @click="showPassword = !showPassword"
							class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white">
							{{ showPassword ? 'Hide' : 'Show' }}
						</button>
                                        </ContainerComp>

                                        <p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>

                                        <ContainerComp>
                                                <button type="submit" class="btn-primary">Sign up</button>
                                        </ContainerComp>
                                </ContainerComp>
                        </ContainerComp>
                        <ContainerComp tag="p" class="text-xs text-center">
				Already have an account? <RouterLink to="/login" class="text-blue-700 hover:underline">Log in</RouterLink>
			</ContainerComp>
                </ContainerComp>
                </template>
                <template v-else>
                        <LoaderComp />
                </template>
        </div>
</template>
