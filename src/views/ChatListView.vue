<script setup>
//------------------------------------------------------------------- FIREBASE SERVICES
import { getUserChats } from '@/services/privateChat.service';
//------------------------------------------------------------------- COMPOSABLES
import useAuth from '@/composables/useAuth';
import useProfile from '@/composables/useProfile';
import useLoading from '@/composables/useLoading';
//------------------------------------------------------------------- COMPONENTS
import TitleComp from '@/components/TitleComp.vue';
import ContainerComp from '@/components/ContainerComp.vue';
import ProfilePhotoComp from '@/components/ProfilePhotoComp.vue';
import LoaderComp from '@/components/skeletons/LoaderComp.vue';
//------------------------------------------------------------------- VUE COMPOSITION API
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { RouterLink } from 'vue-router';
//------------------------------------------------------------------- USE COMPOSABLES
const { user } = useAuth();
const { getUserById } = useProfile();
const { loading, startLoading, endLoading } = useLoading();
//------------------------------------------------------------------- VARIABLES
const chatContacts = ref([]);
const unsubscribe = ref(null);
//------------------------------------------------------------------- LIFECYCLE
onMounted(() => {
	startLoading();
	unsubscribe.value = getUserChats(user.value.uid, async (chats) => {
		const contacts = await Promise.all(
			chats.map(async (chat) => {
				const otherUID = Object.keys(chat.users).find((uid) => uid !== user.value.uid);
				const profile = await getUserById(otherUID);
				return { chatId: chat.id, ...profile };
			})
		);
		chatContacts.value = contacts;
		endLoading();
	});
});

onBeforeUnmount(() => {
	if (unsubscribe.value) unsubscribe.value();
});
</script>

<template>
	<div class="grid grid-rows-[auto_1fr] h-[calc(100dvh-var(--navbar-height))]">
		<TitleComp text="Chats" :stickyTop="true" />
		<template v-if="!loading">
			<ContainerComp v-if="chatContacts.length" tag="ul" class="flex flex-col overflow-y-auto">
				<li v-for="contact in chatContacts" :key="contact.chatId">
					<RouterLink :to="{ name: 'PrivateChat', params: { id: contact.uid } }"
						class="flex items-center gap-3 p-3 border-b border-gray-800 transition hover:bg-gray-900 rounded-lg">
						<ProfilePhotoComp :src="contact.photoURL" :alt="contact.name" width="w-12" height="h-12" />
						<div class="flex flex-col">
							<span class="font-bold">{{ contact.name }}</span>
							<span class="text-xs text-gray-400">@{{ contact.username }}</span>
						</div>
					</RouterLink>
				</li>
			</ContainerComp>
			<ContainerComp v-else class="flex flex-col justify-center items-center">
				<p class="text-gray-400 text-sm">No conversations yet.</p>
			</ContainerComp>
		</template>
		<template v-else>
			<div class="flex justify-center items-center">
				<LoaderComp />
			</div>
		</template>
	</div>
</template>
