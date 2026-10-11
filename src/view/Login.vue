<script setup lang="ts">
import { api } from '@/api/client';
import { loginSchema } from '@/schemas/loginSchema';
import { PhEnvelope, PhEye, PhEyeSlash, PhLock, PhSignIn, PhWarningCircle } from '@phosphor-icons/vue';
import axios from 'axios';
import { reactive, ref } from 'vue';

const showPassword = ref(false);

const email = ref("");
const password = ref("");
const error = ref(false);
const messageReq = ref("");
const loading = ref(false);
const fieldErrors = reactive<{ email?: string; password?: string }>({});

function clearFieldError(field: 'email' | 'password') {
    delete fieldErrors[field];
}

async function submit() {
    error.value = false;
    messageReq.value = '';
    clearFieldError('email');
    clearFieldError('password');

    const validation = loginSchema.safeParse({
        email: email.value,
        password: password.value
    });

    if (!validation.success) {
        for (const issue of validation.error.issues) {
            const field = issue.path[0];
            if ((field === 'email' || field === 'password') && !fieldErrors[field]) {
                fieldErrors[field] = issue.message;
            }
        }
        return;
    }

    loading.value = true;

    try {
        const response = await api.post("/api/v1/auth/login", validation.data)

        console.log(response);
    } catch (erro: any) {
        if (axios.isAxiosError(erro)) {
            messageReq.value =
                erro.response?.data?.title ??
                'Não foi possível realizar o login.';
        } else {
            messageReq.value = 'Ocorreu um erro inesperado.';
        }

        error.value = true;
        console.error('Erro no login:', erro);
    } finally {
        loading.value = false;
    }
}

</script>

<template>
    <div class="flex justify-center h-screen">
        <form @submit.prevent="submit" class="bg-white m-5 rounded-xl w-full form p-10">
            <div class="flex items-center flex-col">
                <img src="../assets/logo.svg" class="w-52">
                <div class="text-center mt-3">
                    <p class="text-[30px] font-bold text-tertiary mb-1">
                        Bem-vindo(a) de volta ao NogVita
                    </p>
                    <p class="text-zinc-600">
                        Acesse sua conta para continuar sua jornada de saúde e nutrição.
                    </p>
                </div>
            </div>

            <div class="mt-5">

                <div class="flex gap-3 bg-primary/25 text-font-nogVita p-5 rounded-xl mb-8">
                    <PhWarningCircle :size="24" class="shrink-0 font-semibold" />
                    <div class="flex flex-col gap-3">
                        <span class="font-semibold">Confirmação pendente</span>
                        <p>
                            Confirme seu e-mail antes de entrar. Enviamos um link para seu endereço de cadastrado.
                        </p>
                        <div class="flex justify-end">
                            <button class="flex items-center gap-2 outline-none border-none font-semibold bg-white p-1 rounded-xl">
                                <PhEnvelope :size="24" />
                                Reenviar link de confirmação
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="error" class="flex items-center gap-2 rounded-lg bg-red-600/10 p-4 text-red-600 mb-7">
                    <PhWarningCircle :size="24" class="shrink-0" />
                    <span>{{ messageReq }}</span>
                </div>

                <div class="flex flex-col w-full">
                    <label for="login-email" class="font-bold">
                        E-mail
                    </label>
                    <div class="relative">
                        <PhEnvelope :size="24" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                        <input id="login-email" v-model="email" type="email" autocomplete="email" placeholder="E-mail"
                            class="w-full rounded-lg p-5 pl-14 outline-none" :aria-invalid="!!fieldErrors.email"
                            aria-describedby="login-email-error" @input="clearFieldError('email')" />
                    </div>
                    <p v-if="fieldErrors.email" id="login-email-error" class="mt-1 text-sm text-red-700">{{
                        fieldErrors.email }}</p>
                </div>
                <div class="flex flex-col w-full mt-5">
                    <label for="login-password" class="font-bold">
                        Senha
                    </label>
                    <div class="relative">
                        <PhLock :size="24" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                        <input id="login-password" v-model="password" :type="showPassword ? 'text' : 'password'"
                            autocomplete="current-password" placeholder="Senha"
                            class="w-full rounded-lg p-5 pl-14 outline-none" :aria-invalid="!!fieldErrors.password"
                            aria-describedby="login-password-error" @input="clearFieldError('password')">

                        <div v-if="password.length > 0">
                            <span @click="showPassword = true">
                                <PhEye :size="24"
                                    class="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                    v-if="!showPassword" />
                            </span>
                            <span @click="showPassword = false">
                                <PhEyeSlash :size="24"
                                    class="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                    v-if="showPassword" />
                            </span>
                        </div>
                    </div>
                    <p v-if="fieldErrors.password" id="login-password-error" class="mt-1 text-sm text-red-700">{{
                        fieldErrors.password }}</p>
                    <span class="text-nogvita-primary flex justify-end mt-3">
                        Esqueci minha senha
                    </span>
                </div>
                <div class="w-full mt-5">
                    <button type="submit" :disabled="loading"
                        class="bg-primary flex items-center p-5 rounded-lg w-full justify-center text-white gap-3 disabled:cursor-wait disabled:opacity-60">
                        <span>{{ loading ? 'Entrando...' : 'Entrar na plataforma' }}</span>
                        <PhSignIn :size="24" />
                    </button>
                </div>
                <div class="text-center mt-10">
                    Ainda não tem conta? <RouterLink to="/register" class="text-nogvita-primary">Criar conta de paciente
                    </RouterLink>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
.form {
    max-width: 600px;
}
</style>