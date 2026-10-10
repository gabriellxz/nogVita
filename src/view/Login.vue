<script setup lang="ts">
import { api } from '@/api/client';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const email = ref("");
const password = ref("");
const loading = ref(false)

async function submit() {
    loading.value = true;

    const data = {
        email: email.value,
        password: password.value
    }

    try {
        const response = await api.post("/api/v1/auth/login", data, {headers: {
            "Content-type": "application/json"
        }})

        console.log(response)
        loading.value = false;
    } catch {
        console.error("error");
        loading.value = false;
    } finally {
        loading.value = false;
    }
}

</script>

<template>
    <div class="md:flex h-screen">
        <div class="w-[60%] md:flex items-center justify-center hidden">
            <div>
                <img src="../assets/logo.svg" alt="" srcset="">
                <p>
                    Nutrição conectada, cuidado personalizado, resultados reais.
                </p>
            </div>
        </div>
        <div class="md:bg-primary md:w-[40%] w-full h-full flex items-center justify-center">
            <form @submit.prevent="submit" class="max-w-125 w-full m-5">
                <div class="flex justify-between items-center">
                    <span class="text-4xl font-bold text-primary md:text-terciary">Entrar</span>
                    <img src="../assets/logo.svg" class="w-40 md:hidden">
                </div>
                <div class="w-full mt-7">
                    <div class="w-full">
                        <input 
                            type="text" 
                            placeholder="email" 
                            class="w-full p-5 outline-none mb-5 rounded-xl md:border-none md:bg-white border border-primary"
                            v-model="email"
                        >
                    </div>
                    <div class="w-full">
                        <input 
                            type="password" 
                            placeholder="senha" 
                            class="w-full p-5 outline-none rounded-xl md:border-none md:bg-white border border-primary"
                            v-model="password"
                        >
                    </div>
                    <div class="flex justify-end mt-1 text-terciary">
                        <RouterLink to="/" class="underline">
                            Esqueci minha senha
                        </RouterLink>
                    </div>
                    <button 
                        :disabled="loading == true"
                        class="mt-5 w-full bg-primary md:bg-secondary md:text-terciary p-5 rounded-xl text-2xl text-white"
                    >
                        Entrar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>