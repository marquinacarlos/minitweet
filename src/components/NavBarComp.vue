<script setup>
import useAuth from '@/composables/useAuth';
import { RouterLink } from 'vue-router';

const { user } = useAuth();
</script>

<template>
	<nav class="borderFinito bg-black w-full text-xs md:text-sm text-slate-200">
		<ul class="min-h-16 flex gap-8 justify-center items-center">
			<li>
				<RouterLink to="/" class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
					About
				</RouterLink>
			</li>
			<template v-if="user">
				<li>
					<RouterLink to="/feed" title="Feed" class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
						Feed
					</RouterLink>
				</li>
				<li>
					<RouterLink :to="{ name: 'Account', params: { id: user.uid } }" title="Profile" class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
						Profile
					</RouterLink>
				</li>
				<li>
					<RouterLink to="/chat" title="Chat" class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
						Chat
					</RouterLink>
				</li>
			</template>
			<template v-else>
				<li>
					<RouterLink to="/login" class="transition duration-300 ease-in-out transform hover:scale-110 hover:underline">
						Log in
					</RouterLink>
				</li>
			</template>
		</ul>
	</nav>
</template>

<style scoped>
.borderFinito {
	border-top-width: 0.2px;
	border-image: linear-gradient(to right, transparent, rgb(255, 255, 255), transparent);
	border-image-slice: 1;
}
</style>
