<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount, onBeforeMount } from "vue";
import List from "./List.vue"

const data = ref(null);

onMounted(async () => {
  const response = await fetch(
    "https://author-p54352-e854610.adobeaemcloud.com/graphql/execute.json/sample-list/Homepage",
    {credentials: 'include'}
  );
  const fetchData = await response.json();

  data.value = fetchData?.data?.pageByPath?.item;
});

const dataHandler = (event) => {
  console.log("\x1b[31m ~ event:", event)
  if (event.data.type !== 'setCfData') {return}
  data.value = event.data.payload.data
}
onBeforeMount(async () => {
  window.addEventListener('message', dataHandler)
})

onBeforeUnmount(async () => {
  window.removeEventListener('message', dataHandler)
})
</script>

<template>
  <main v-if="data">
    <h1>{{ data.header }}</h1>

    <div class="content">
      <List :data="data" />
    </div>
  </main>
</template>


