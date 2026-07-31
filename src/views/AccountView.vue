<script setup>
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@/composables/useAuth';
import useProfile from '@/composables/useProfile';
import useLoading from '@/composables/useLoading';
import useModal from '@/composables/useModal';
import usePosts from '@/composables/usePosts';
//------------------------------------------------------------------- COMPONENTS
import ContainerComp from '@/components/ContainerComp.vue';
import AccountSkeleton from '@/components/skeletons/AccountSkeleton.vue';
import TitleComp from '@/components/TitleComp.vue';
import CoverPhotoComp from '@/components/CoverPhotoComp.vue';
import ProfilePhotoComp from '@/components/ProfilePhotoComp.vue';
import Modal from '@components/ModalComp.vue';
import PostListComp from '@/components/PostListComp.vue';
import { DEFAULT_PROFILE_PHOTO, DEFAULT_COVER_PHOTO } from '@/config/constants';
//------------------------------------------------------------------- VUE COMPOSITION API
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
//------------------------------------------------------------------- VUE ROUTER
import { useRouter, useRoute, RouterLink } from 'vue-router';
//------------------------------------------------------------------- USE COMPOSABLES
const route = useRoute();
const router = useRouter();
const { getAllPostsByUserUID } = usePosts();
const { openModal, closeModal } = useModal();
const { loading, startLoading, endLoading } = useLoading();
const { user, logout } = useAuth();
const { getUserById, updateProfilePhoto, updateCoverPhoto } = useProfile();
//------------------------------------------------------------------- VARIABLES
const userProfile = ref(null);
const isOwnAccount = ref(false);
const modalContent = ref(null);
const tempProfilePhotoPreview = ref(null);
const tempCoverPhotoPreview = ref(null);
const selectedFile = ref(null);
const postFromUser = ref([]);
//------------------------------------------------------------------- METHODS
/**
 * Logout user
 */
function handlerLogoutUser() {
	if (isOwnAccount.value) logout().then(() => router.push('/login'));
}

/**
 * Guarda la foto de perfil
 */
async function saveProfilePhoto() {
	if (isOwnAccount.value && selectedFile.value && tempProfilePhotoPreview.value !== userProfile.value?.photoURL && tempProfilePhotoPreview.value !== DEFAULT_PROFILE_PHOTO) {
		const userConfirmed = confirm("¿Estás seguro de que deseas cambiar la imagen?");
		if (userConfirmed) {
			await updateProfilePhoto(selectedFile.value);
			userProfile.value.photoURL = user.value.photoURL;
			closeModal();
		}
	}
}

/**
 * Cancela la subida de la foto de perfil
 */
function cancelProfilePhotoUpload() {
	tempProfilePhotoPreview.value = userProfile.value?.photoURL || DEFAULT_PROFILE_PHOTO;
	selectedFile.value = null;
	closeModal();
}

/**
 * Función para cargar la foto de perfil
 * @param {Event} e
 */
function handleProfilePhotoUpload(e) {
	if (isOwnAccount.value) {
		tempProfilePhotoPreview.value = userProfile.value?.photoURL || DEFAULT_PROFILE_PHOTO;
		const file = e.target.files[0];
		selectedFile.value = file;
		const reader = new FileReader();
		reader.onload = async () => {
			tempProfilePhotoPreview.value = reader.result;
		}
		reader.readAsDataURL(file);
	}
}

/**
 * Guarda la foto de portada
 */
async function saveCoverPhoto() {
	if (isOwnAccount.value && selectedFile.value && tempCoverPhotoPreview.value !== userProfile.value?.coverPhotoURL && tempCoverPhotoPreview.value !== DEFAULT_COVER_PHOTO) {
		const userConfirmed = confirm("¿Estás seguro de que deseas cambiar la imagen de portada?");
		if (userConfirmed) {
			await updateCoverPhoto(selectedFile.value);
			userProfile.value.coverPhotoURL = user.value.coverPhotoURL;
			closeModal();
		}
	}
}

/**
 * Cancela la subida de la foto de portada
 */
function cancelCoverPhotoUpload() {
	tempCoverPhotoPreview.value = userProfile.value?.coverPhotoURL || DEFAULT_COVER_PHOTO;
	selectedFile.value = null;
	closeModal();
}

/**
 * Función para cargar la foto de portada
 * @param {Event} e
 */
function handleCoverPhotoUpload(e) {
	if (isOwnAccount.value) {
		tempCoverPhotoPreview.value = userProfile.value?.coverPhotoURL || DEFAULT_COVER_PHOTO;
		const file = e.target.files[0];
		selectedFile.value = file;
		const reader = new FileReader();
		reader.onload = async () => {
			tempCoverPhotoPreview.value = reader.result;
		}
		reader.readAsDataURL(file);
	}
}

/**
 * Abre el modal con el contenido seleccionado
 * @param {String} content
 */
function handlerContentModal(content = null) {
	modalContent.value = content;
	if (modalContent.value) { openModal(); }
}

/**
 * Función chequear si hay un usuario autenticado.
 * Tambien resuelve y asigna el perfil del usuario.
 * @param {String} uid
 */
 async function checkUserProfile(uid) {
	try {
		startLoading();
		if(user.value) {
			const userFound = await getUserById(uid);
			if (userFound) {
				userProfile.value = userFound;
				isOwnAccount.value = user.value.uid === userProfile.value.uid;
				postFromUser.value = await getAllPostsByUserUID(uid);
			}
		}
	} catch (error) {
		console.error(error);
	} finally {
		endLoading();
	}
}

//------------------------------------------------------------------- LIFECYCLE HOOKS
onMounted(async () => {
	checkUserProfile(route.params.id);
})

onBeforeUnmount(() => closeModal());

//------------------------------------------------------------------- WATCHERS
watch([() => route.params.id, () => user.value?.photoURL, () => user.value?.coverPhotoURL], async (newId) => {
	checkUserProfile(newId[0]);
})

</script>

<template>
	<div class="grid grid-rows-[1fr] h-[calc(100dvh-var(--navbar-height))] overflow-y-auto">
		<template v-if="!loading">
			<ContainerComp class="flex-1 flex flex-col">
				<ContainerComp class="flex-1 flex flex-col gap-4">
					<TitleComp text="Cuenta" :stickyTop="true" />
					<ContainerComp class="flex flex-col">
						<CoverPhotoComp :src="userProfile?.coverPhotoURL"
							:alt="userProfile?.name" :isOwnAccount="isOwnAccount"
							@click="handlerContentModal('coverPhoto')" />
						<ContainerComp class="flex justify-between items-end -mt-10 xs:-mt-8">
							<ProfilePhotoComp :src="userProfile?.photoURL"
								:alt="userProfile?.name" :isOwnAccount="isOwnAccount"
								@click="handlerContentModal('profilePhoto')" />
							<div class="flex gap-2">
								<template v-if="isOwnAccount">
									<RouterLink to="/account/edit" class="inline-flex items-center px-2 py-1 xs:px-4 xs:py-2 border rounded-lg text-center text-xs xs:text-base transition hover:bg-white hover:text-black">
										Editar perfil
									</RouterLink>
									<button @click="handlerLogoutUser" class="inline-flex items-center px-2 py-1 xs:px-4 xs:py-2 border rounded-lg text-center text-xs xs:text-base transition hover:bg-white hover:text-black">
										Cerrar sesión
									</button>
								</template>
								<template v-else>
									<RouterLink :to="{ name: 'PrivateChat', params: { id: userProfile?.uid } }" class="inline-flex items-center px-2 py-1 xs:px-4 xs:py-2 border rounded-lg text-center text-xs xs:text-base transition hover:bg-white hover:text-black">
										Chatear
									</RouterLink>
								</template>
							</div>
						</ContainerComp>
					</ContainerComp>

					<ContainerComp class="flex flex-col gap-2 justify-center items-center">
						<ContainerComp>
							<ContainerComp class="flex flex-col items-center">
								<p class="text-gray-500 text-opacity-80 text-xs">#{{ userProfile?.uid }}</p>
								<ContainerComp class="flex">
									<ContainerComp tag="h2" class="font-bold text-base">
										{{ userProfile?.name }} <span class="font-normal text-gray-600 text-sm">@{{ userProfile?.username }}</span>
									</ContainerComp>
								</ContainerComp>
							</ContainerComp>
							<p class="text-gray-600">Mail: {{ userProfile?.email }}</p>
							<ContainerComp class="flex gap-4">
								<p class="text-gray-200">Seguidores: {{ userProfile?.followers?.length }}</p>
								<p class="text-gray-200">Siguiendo: {{ userProfile?.following?.length }}</p>
							</ContainerComp>
						</ContainerComp>
						<p class="break-words whitespace-normal">{{ userProfile?.bio }}</p>
						<ContainerComp tag="h3" text="Publicaciones" class="sticky top-12 bg-black z-10 break-words whitespace-normal w-full border-b border-gray-200 py-1 mb-4" />
						<PostListComp :posts="postFromUser" />
					</ContainerComp>
				</ContainerComp>
			</ContainerComp>
		</template>
		<template v-else>
			<AccountSkeleton />
		</template>
	</div>

	<Modal>
		<!-- COVER PHOTO -->
		<template v-if="modalContent === 'coverPhoto'">
			<ContainerComp class="max-w-96 px-2">
				<ContainerComp tag="figure" class="max-w-96 aspect-w-16 aspect-h-9">
					<img :src="tempCoverPhotoPreview || (userProfile?.coverPhotoURL || DEFAULT_COVER_PHOTO)"
						:alt="userProfile?.name || 'Foto de perfil del usuario'"
						class="object-cover">
				</ContainerComp>
				<ContainerComp tag="form" class="mt-2 flex flex-col gap-2">
					<label for="photo-upload" class="block text-sm font-medium text-gray-300 text-center">Subir nueva foto</label>
					<input @change="handleCoverPhotoUpload"
						type="file" 
						id="photo-upload" 
						accept="image/*"
						class="w-full file:w-full file:transition-all file:cursor-pointer file:mr-4 file:py-2 file:rounded-lg file:border file:border-white file:text-sm file:font-semibold file:bg-violet-50 file:text-black hover:file:bg-black hover:file:text-white">
					<ContainerComp class="flex flex-col gap-2">
						<button @click="saveCoverPhoto"
							type="button" 
							:disabled="!Boolean(tempCoverPhotoPreview) || tempCoverPhotoPreview === userProfile?.coverPhotoURL || tempCoverPhotoPreview === DEFAULT_COVER_PHOTO"
							class="w-full py-2 rounded-lg text-sm  font-semibold border disabled:border-gray-500 disabled:opacity-50 disabled:text-gray-500 disabled:cursor-not-allowed"
							:class="{ 'bg-violet-50 text-black hover:text-white hover:bg-black': !!tempCoverPhotoPreview && tempCoverPhotoPreview !== userProfile?.coverPhotoURL && tempCoverPhotoPreview !== DEFAULT_COVER_PHOTO}">
							Guardar
						</button>
						<button @click="cancelCoverPhotoUpload"
							type="button"
							class="w-full py-2 rounded-lg border border-white text-sm font-semibold bg-violet-50 text-black hover:bg-black hover:text-white">
							Cancelar
						</button>
					</ContainerComp>
				</ContainerComp>
			</ContainerComp>
		</template>
		<!-- PROFILE PHOTO -->
		<template v-if="modalContent === 'profilePhoto'">
			<ContainerComp class="max-w-96 px-2">
				<ContainerComp tag="figure" class="aspect-w-1 aspect-h-1">
					<img :src="tempProfilePhotoPreview || (userProfile?.photoURL || DEFAULT_PROFILE_PHOTO)"
						:alt="userProfile?.name || 'Foto de perfil del usuario'"
						class="w-full h-full object-cover">
				</ContainerComp>
				<ContainerComp tag="form" class="mt-2 flex flex-col gap-2">
					<label for="photo-upload" class="block text-sm font-medium text-gray-300 text-center">Subir nueva foto</label>
					<input @change="handleProfilePhotoUpload"
						type="file" 
						id="photo-upload" 
						accept="image/*"
						class="w-full file:w-full file:transition-all file:cursor-pointer file:mr-4 file:py-2 file:rounded-lg file:border file:border-white file:text-sm file:font-semibold file:bg-violet-50 file:text-black hover:file:bg-black hover:file:text-white">
					<ContainerComp class="flex flex-col gap-2">
						<button @click="saveProfilePhoto"
							type="button" 
							:disabled="!Boolean(tempProfilePhotoPreview) || tempProfilePhotoPreview === userProfile?.photoURL || tempProfilePhotoPreview === DEFAULT_PROFILE_PHOTO"
							class="w-full py-2 rounded-lg text-sm  font-semibold border disabled:border-gray-500 disabled:opacity-50 disabled:text-gray-500 disabled:cursor-not-allowed"
							:class="{ 'bg-violet-50 text-black hover:text-white hover:bg-black': !!tempProfilePhotoPreview && tempProfilePhotoPreview !== userProfile?.photoURL && tempProfilePhotoPreview !== DEFAULT_PROFILE_PHOTO, }">
							Guardar
						</button>
						<button @click="cancelProfilePhotoUpload"
							type="button" 
							class="w-full py-2 rounded-lg border border-white text-sm font-semibold bg-violet-50 text-black hover:bg-black hover:text-white">
							Cancelar
						</button>
					</ContainerComp>
				</ContainerComp>
			</ContainerComp>
		</template>
	</Modal>
</template>