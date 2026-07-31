import useAuth from '@composables/useAuth'
import AboutView from '@views/AboutView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const { user, checkAuth } = useAuth();

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', 			name: 'About', 		component: AboutView },
		{ path: '/feed', 		name: 'Feed', 		component: () => import('../views/FeedView.vue'), 		meta: { requiresAuth: true } },
		{ path: '/post/:id', 		name: 'Post', 		component: () => import('../views/PostView.vue'), 		meta: { requiresAuth: true } },
		{ path: '/account/edit', 	name: 'EditAccount', 	component: () => import('../views/EditAccountView.vue'), 	meta: { requiresAuth: true } },
		{ path: '/account/:id', 	name: 'Account', 	component: () => import('../views/AccountView.vue'), 		meta: { requiresAuth: true } },
		{ path: '/chat',		name: 'ChatList',	component: () => import('../views/ChatListView.vue'),		meta: { requiresAuth: true } },
		{ path: '/chat/:id', 		name: 'PrivateChat', 	component: () => import('../views/PrivateChatView.vue'), 	meta: { requiresAuth: true } },
		{ path: '/login', 		name: 'Login', 		component: () => import('../views/LoginView.vue') },
		{ path: '/signup', 		name: 'Signup', 	component: () => import('../views/SignUpView.vue') },
		{ path: '/:catchAll(.*)', 	name: 'NotFound', 	component: () => import('../views/NotFoundView.vue') },
	]
})

router.beforeEach(async (to, from, next) => {
	await checkAuth();
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth === true);
	const isAuthenticated = !!user.value;

	if (requiresAuth && !isAuthenticated) {
		next({ name: 'Login' });
	} else if (isAuthenticated && (to.name === 'Login' || to.name === 'Signup')) {
		if (from.fullPath === '/') next({ name: 'Feed' });
		next(from.fullPath);
	} else {
		next();
	}
});

export default router;
