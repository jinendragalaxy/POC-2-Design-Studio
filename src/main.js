// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // ✅ make sure this file exists

createApp(App).use(router).mount('#app')
