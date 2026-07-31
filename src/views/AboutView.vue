<script setup>
import ContainerComp from '@components/ContainerComp.vue';
import TitleComp from '@/components/TitleComp.vue';
import InstallButton from '@/components/InstallButton.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
	<ContainerComp class="flex flex-col gap-6 max-w-xl pb-20 overflow-y-auto">
		<ContainerComp tag="section" class="flex flex-col gap-4">
			<TitleComp text="About Minitweet" />
			<ContainerComp class="flex flex-col gap-4">
				<ContainerComp tag="p"
					text="Minitweet is a microblogging social network that lets you share your thoughts, ideas, and opinions in just 280 characters."
					class="text-pretty" />
				<ContainerComp tag="p"
					text="Created by a tech enthusiast, Minitweet is the perfect platform for those looking for a simpler and more direct social media experience."
					class="text-pretty" />
			</ContainerComp>
			<ContainerComp tag="section" class="flex flex-col gap-4">
				<ContainerComp tag="h2" text="Online mode"
					class="font-bold text-center text-xl text-orange-400 text-pretty" />
			</ContainerComp>
			<ContainerComp tag="section" class="flex flex-col gap-4 items-center justify-center">
				<InstallButton />
			</ContainerComp>
		</ContainerComp>

		<ContainerComp tag="section" class="flex flex-col gap-4">
			<ContainerComp tag="h2" text="Why Minitweet?" class="font-bold text-center text-xl" />
			<ul class="grid grid-cols-12 gap-2 w-full max-w-96 mx-auto justify-items-center">
				<li class="col-span-12 w-full">
					<details class="bg-stone-900 p-2 rounded-md">
						<summary class="font-bold">Simplicity:</summary>
						<p class="text-pretty max-w-64 text-center mx-auto">
							Enjoy a clean and straightforward experience, perfect for those
							who value quick communication.
						</p>
					</details>
				</li>
				<li class="col-span-12 w-full">
					<details class="bg-stone-900 p-2 rounded-md">
						<summary class="font-bold">Community:</summary>
						<p class="text-pretty max-w-64 text-center mx-auto">
							Connect with like-minded people and share your passions.
						</p>
					</details>
				</li>
				<li class="col-span-12 w-full">
					<details class="bg-stone-900 p-2 rounded-md">
						<summary class="font-bold">Fun:</summary>
						<p class="text-pretty max-w-64 text-center mx-auto">
							From memes to deep thoughts, there's room for everything here.
						</p>
					</details>
				</li>
			</ul>
		</ContainerComp>
		<ContainerComp tag="section" class="flex flex-col gap-4">
			<ContainerComp tag="h2" text="Ready to join the conversation?"
				class="font-bold text-center text-xl" />
			<p class="text-pretty text-center">
				Log in or sign up now and be part of the microcontent revolution.
			</p>
			<ContainerComp class="w-full flex flex-col gap-4 items-center">
				<RouterLink to="/login"
					class="transition bg-slate-50 text-black font-bold py-2 px-4 rounded-lg w-full max-w-96 text-center border border-transparent hover:bg-black hover:text-white hover:border-white">
					Log in
				</RouterLink>
				<RouterLink to="/signup"
					class="transition bg-slate-50 text-black font-bold py-2 px-4 rounded-lg w-full max-w-96 text-center border border-transparent hover:bg-black hover:text-white hover:border-white">
					Sign up
				</RouterLink>
			</ContainerComp>
		</ContainerComp>
	</ContainerComp>
</template>

<style scoped>
summary::marker {
	color: rgb(92, 228, 98);
}
</style>
