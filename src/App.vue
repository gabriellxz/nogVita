<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from './api/client';
import { RouterView } from 'vue-router';

const loading = ref(true);
const error = ref(false);

async function startApi() {
  try {
    const response = await api.get("/health")

    console.log("serviço iniciado: ", response);
    loading.value = false;

  } catch {
    loading.value = false;
    error.value = true
    console.error("erro");
  }
}

onMounted(() => {
  startApi();
})

</script>

<template>
  <main>
    <div v-if="loading">
      <h1>Iniciando aplicação</h1>
      <p>Aguarde enquanto conectamos ao servidor.</p>
    </div>

    <div v-if="error">
      <h1>Não foi possível conectar ao servidor</h1>
      <button @click="loading = true; error = false; startApi()">Tentar novamente</button>
    </div>

    <main v-if="!loading && !error">
      <RouterView/>
    </main>
  </main>
</template>

<style scoped></style>
