import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PhosphorIcons from '@phosphor-icons/vue'

import App from './App.vue'
import router from './router/index.ts'

const app = createApp(App)

app.use(createPinia())
app.use(PhosphorIcons)
app.use(router)

app.mount('#app')
