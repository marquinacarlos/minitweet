import '@styles/tailwindCSS.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                                console.log('Service Worker registered', registration);
                        })
                        .catch((error) => {
                                console.log('Service Worker registration failed', error);
                        })
        });
}
