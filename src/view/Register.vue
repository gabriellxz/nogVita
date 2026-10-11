<script setup lang="ts">
import { api } from '@/api/client';
import { registerSchema } from '@/schemas/registerSchema';
import { PhArrowsVertical, PhBarbell, PhCalendarBlank, PhEnvelope, PhEye, PhEyeSlash, PhIdentificationCard, PhLock, PhScales, PhSignIn, PhTrendUp, PhUser, PhWarningCircle } from '@phosphor-icons/vue';
import { reactive, ref } from 'vue';
import type { components } from '@/api/schema';
type RegisterPatient = components['schemas']['RegisterPatientRequest'];
type RegisterField = keyof RegisterPatient;

const showPassword = ref<boolean>(false);
const error = ref<boolean>(false);
const messageReq = ref<string>("");
const loading = ref<boolean>(false);
const fieldErrors = reactive<Partial<Record<RegisterField, string>>>({});

const form = reactive<RegisterPatient>({
    name: '',
    email: '',
    cpf: '',
    password: '',
    birthDate: '',
    biologicalSex: 0,
    heightInCm: 0,
    goal: 0
});

function clearFieldError(field: RegisterField) {
    delete fieldErrors[field];
}

async function register() {
    error.value = false;
    messageReq.value = '';

    for (const field of Object.keys(fieldErrors) as RegisterField[]) {
        delete fieldErrors[field];
    }

    const validation = registerSchema.safeParse(form);
    if (!validation.success) {
        for (const issue of validation.error.issues) {
            const field = issue.path[0] as RegisterField | undefined;
            if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
        }
        return;
    }

    loading.value = true;
    try {
        const response = await api.post<RegisterPatient>("/api/v1/auth/register/patient", validation.data);
        console.log(response);
    } catch (requestError) {
        error.value = true;
        messageReq.value = requestError instanceof Error
            ? requestError.message
            : 'Não foi possível criar sua conta. Tente novamente.';
    } finally {
        loading.value = false;
    }
}

</script>

<template>
    <div class="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6">
        <div class="flex flex-col items-center text-center">
            <img src="../assets/logo.svg" alt="NogVita" class="w-44 sm:w-52">
            <div class="mt-3 max-w-xl">
                <p class="mb-1 text-2xl font-bold text-tertiary sm:text-3xl">
                    Crie sua conta NogVita
                </p>
                <p class="text-zinc-600">
                    Comece sua jornada de saúde e nutrição.
                </p>
            </div>
        </div>
        <form @submit.prevent="register" class="form w-full" novalidate>

            <div class="mt-5">

                <div v-if="error" class="flex items-center gap-2 rounded-lg bg-red-600/10 p-4 text-red-600 mb-7">
                    <PhWarningCircle :size="24" class="shrink-0" />
                    <span>{{ messageReq }}</span>
                </div>

                <div class="form-section">
                    <div class="flex justify-between items-center">
                        <div class="flex gap-3 font-bold">
                            <span class="bg-primary p-1 rounded-xl"></span>
                            <span>1. Dados Pessoais</span>
                        </div>
                        <span class="bg-zinc-200 text-zinc-700 font-semibold px-3 rounded-xl">
                            Essencial
                        </span>
                    </div>

                    <div class="mt-5">
                        <label for="register-name" class="field-label">
                            Nome completo
                        </label>
                        <div class="relative">
                            <PhUser :size="24" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                            <input id="register-name" v-model="form.name" type="text" autocomplete="name" placeholder="Ex: Maria da Silva"
                                class="field-input field-input-with-icon" :class="fieldErrors.name && 'field-input-error'" :aria-invalid="!!fieldErrors.name" aria-describedby="name-error" @input="clearFieldError('name')" />
                        </div>
                        <p v-if="fieldErrors.name" id="name-error" class="field-error">{{ fieldErrors.name }}</p>
                    </div>

                    <div class="mt-5">
                        <label for="register-email" class="field-label">
                            E-mail
                        </label>
                        <div class="relative">
                            <PhEnvelope :size="24" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                            <input id="register-email" v-model="form.email" type="email" autocomplete="email" placeholder="seu.email@exemplo.com"
                                class="field-input field-input-with-icon" :class="fieldErrors.email && 'field-input-error'" :aria-invalid="!!fieldErrors.email" aria-describedby="email-error" @input="clearFieldError('email')" />
                        </div>
                        <p v-if="fieldErrors.email" id="email-error" class="field-error">{{ fieldErrors.email }}</p>
                    </div>

                    <div class="mt-5 md:flex gap-3">
                        <div class="md:w-[50%]">
                            <label for="register-cpf" class="field-label">
                                CPF
                            </label>
                            <div class="relative">
                                <PhIdentificationCard :size="24"
                                    class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                                <input id="register-cpf" v-model="form.cpf" type="text" inputmode="numeric" autocomplete="off" placeholder="000.000.000-00"
                                    class="field-input field-input-with-icon" :class="fieldErrors.cpf && 'field-input-error'" :aria-invalid="!!fieldErrors.cpf" aria-describedby="cpf-error" @input="clearFieldError('cpf')" />
                            </div>
                            <p v-if="fieldErrors.cpf" id="cpf-error" class="field-error">{{ fieldErrors.cpf }}</p>
                        </div>
                        <div class="mt-5 md:mt-0 md:w-[50%]">
                            <label for="register-birth-date" class="field-label">
                                Nascimento
                            </label>
                            <div class="relative">
                                <PhCalendarBlank :size="24"
                                    class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                                <input id="register-birth-date" v-model="form.birthDate" type="date" autocomplete="bday"
                                    class="field-input field-input-with-icon" :class="fieldErrors.birthDate && 'field-input-error'" :aria-invalid="!!fieldErrors.birthDate" aria-describedby="birth-date-error" @input="clearFieldError('birthDate')" />
                            </div>
                            <p v-if="fieldErrors.birthDate" id="birth-date-error" class="field-error">{{ fieldErrors.birthDate }}</p>
                        </div>
                    </div>

                    <div class="mt-5 md:flex gap-3">
                        <div class="md:w-[50%]">
                            <span class="field-label">
                                Sexo biológico
                            </span>
                            <div class="segment-group" role="group" aria-label="Sexo biológico">
                                <button type="button" :aria-pressed="form.biologicalSex === 1" @click="form.biologicalSex = 1; clearFieldError('biologicalSex')" :class="[
                                    'segment-option',
                                    form.biologicalSex === 1 ? 'segment-option-selected' : ''
                                ]">
                                    Masculino
                                </button>

                                <button type="button" :aria-pressed="form.biologicalSex === 2" @click="form.biologicalSex = 2; clearFieldError('biologicalSex')" :class="[
                                    'segment-option',
                                    form.biologicalSex === 2 ? 'segment-option-selected' : ''
                                ]">
                                    Feminino
                                </button>
                            </div>
                            <p v-if="fieldErrors.biologicalSex" class="field-error">{{ fieldErrors.biologicalSex }}</p>
                        </div>
                        <div class="mt-5 md:mt-0 md:w-[50%]">
                            <label for="register-height" class="field-label">
                                Altura
                            </label>
                            <div class="relative">
                                <PhArrowsVertical :size="24"
                                    class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                                <input id="register-height" v-model.number="form.heightInCm" type="number" min="80" max="250" step="1" inputmode="numeric" placeholder="170"
                                    class="field-input field-input-with-icon" :class="fieldErrors.heightInCm && 'field-input-error'" :aria-invalid="!!fieldErrors.heightInCm" aria-describedby="height-error" @input="clearFieldError('heightInCm')" />
                            </div>
                            <p v-if="fieldErrors.heightInCm" id="height-error" class="field-error">{{ fieldErrors.heightInCm }}</p>
                        </div>
                    </div>
                </div>

                <div class="form-section mt-5">
                    <div>
                        <div class="flex gap-3 font-bold">
                            <span class="bg-primary p-1 rounded-xl"></span>
                            <span>2. Objetivo nutricional</span>
                        </div>
                        <p class="mt-3 text-zinc-600">Qual é sua principal meta de saúde no momento?</p>
                    </div>
                    <div class="mt-4 grid gap-3 sm:grid-cols-3" role="group" aria-label="Objetivo nutricional">
                        <button type="button" :aria-pressed="form.goal === 1" @click="form.goal = 1; clearFieldError('goal')" :class="['goal-option', form.goal === 1 && 'goal-option-selected']">
                            <span class="goal-icon text-primary bg-primary/15"><PhTrendUp :size="28" /></span>
                            <span>Emagrecimento</span>
                        </button>
                        <button type="button" :aria-pressed="form.goal === 2" @click="form.goal = 2; clearFieldError('goal')" :class="['goal-option', form.goal === 2 && 'goal-option-selected']">
                            <span class="goal-icon text-emerald-700 bg-emerald-700/10"><PhScales :size="28" /></span>
                            <span>Manutenção</span>
                        </button>
                        <button type="button" :aria-pressed="form.goal === 3" @click="form.goal = 3; clearFieldError('goal')" :class="['goal-option', form.goal === 3 && 'goal-option-selected']">
                            <span class="goal-icon text-sky-700 bg-sky-700/10"><PhBarbell :size="28" /></span>
                            <span>Ganho de massa</span>
                        </button>
                    </div>
                    <p v-if="fieldErrors.goal" class="field-error">{{ fieldErrors.goal }}</p>
                </div>

                <div class="form-section mt-5">
                    <div>
                        <div class="flex gap-3 font-bold">
                            <span class="bg-primary p-1 rounded-xl"></span>
                            <span>3. Senha & Segurança</span>
                        </div>
                    </div>
                    <div class="flex flex-col w-full mt-5">
                        <div class="flex justify-between">
                            <label for="register-password" class="field-label">
                                Senha segura
                            </label>
                            <span class="text-sm font-semibold text-zinc-500">
                                {{ form.password.length }}/15 mín.
                            </span>
                        </div>
                        <div class="relative">
                            <PhLock :size="24" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                            <input id="register-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Crie sua frase-senha"
                                class="field-input field-input-with-icon field-input-password" :class="fieldErrors.password && 'field-input-error'" :aria-invalid="!!fieldErrors.password" aria-describedby="password-error password-hint" @input="clearFieldError('password')">

                            <button v-if="form.password.length > 0" type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'" @click="showPassword = !showPassword">
                                <PhEyeSlash v-if="showPassword" :size="24" />
                                <PhEye v-else :size="24" />
                            </button>
                        </div>
                        <p v-if="fieldErrors.password" id="password-error" class="field-error">{{ fieldErrors.password }}</p>
                        <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-nogVita" aria-hidden="true">
                            <div class="h-full rounded-full bg-primary transition-[width]" :style="{ width: `${Math.min(form.password.length / 15, 1) * 100}%` }"></div>
                        </div>
                        <div id="password-hint" class="mt-3 rounded-lg bg-gray-nogVita p-4 text-sm leading-relaxed text-zinc-600">
                            <p>
                                <span class="font-bold">Dica NogVita:</span> Use uma frase longa e fácil de lembrar, com
                                no mínimo 15 caracteres. Não é necessário usar símbolos.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="w-full mt-5">
                    <button type="submit" :disabled="loading" class="flex w-full items-center justify-center gap-3 rounded-lg bg-primary p-4 font-semibold text-white transition hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60">
                        <span>{{ loading ? 'Criando conta...' : 'Criar conta' }}</span>
                        <PhSignIn :size="24" />
                    </button>
                </div>
                <div class="mt-5 text-center text-sm">
                    Ao prosseguir, você concorda com os <span class="text-nogvita-primary">Termos de Uso</span> e a
                    <span class="text-nogvita-primary">Política de Privacidade</span> do NogVita.
                </div>
                <div class="text-center mt-10">
                    Já tem uma conta de paciente? <RouterLink to="/" class="text-nogvita-primary">Entrar
                    </RouterLink>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
.form {
    max-width: 720px;
}

.form-section {
    display: flex;
    width: 100%;
    flex-direction: column;
    border: 1px solid rgb(29 42 36 / 8%);
    border-radius: 0.75rem;
    background: white;
    padding: 1.25rem;
    box-shadow: 0 8px 24px rgb(29 42 36 / 4%);
}

.field-label {
    display: block;
    margin-bottom: 0.5rem;
    color: #71717a;
    font-weight: 600;
}

.field-input {
    width: 100%;
    border: 1px solid transparent;
    border-radius: 0.5rem;
    background: var(--color-gray-nogVita);
    padding: 0.875rem 1rem;
    outline: none;
    transition: border-color 150ms, box-shadow 150ms;
}

.field-input-with-icon {
    padding-left: 3.25rem;
}

.field-input-password {
    padding-right: 3.25rem;
}

.field-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(242 140 40 / 16%);
}

.field-input-error {
    border-color: #dc2626;
}

.field-error {
    margin-top: 0.375rem;
    color: #b91c1c;
    font-size: 0.875rem;
}

.segment-group {
    display: flex;
    height: 3.5rem;
    width: 100%;
    gap: 0.25rem;
    border-radius: 0.5rem;
    background: var(--color-gray-nogVita);
    padding: 0.25rem;
}

.segment-option {
    flex: 1;
    cursor: pointer;
    border-radius: 0.375rem;
    color: #52525b;
    transition: background-color 150ms, color 150ms, box-shadow 150ms;
}

.segment-option-selected {
    background: white;
    color: var(--color-nogvita-primary);
    box-shadow: 0 1px 3px rgb(29 42 36 / 12%);
}

.goal-option {
    display: flex;
    min-height: 8rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    border: 1px solid transparent;
    border-radius: 0.625rem;
    background: var(--color-gray-nogVita);
    padding: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
    transition: border-color 150ms, background-color 150ms, transform 150ms;
}

.goal-option:hover {
    transform: translateY(-2px);
}

.goal-option-selected {
    border-color: var(--color-primary);
    background: white;
    box-shadow: 0 0 0 2px rgb(242 140 40 / 12%);
}

.goal-icon {
    display: flex;
    width: 3rem;
    height: 3rem;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
}

@media (min-width: 640px) {
    .form-section {
        padding: 2rem;
    }
}
</style>