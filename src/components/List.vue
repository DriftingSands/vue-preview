<script setup>
const props = defineProps({
  data: Object,
})
</script>

<template>
  <ul>
    <li v-for="(item, index) in data.pageContent" :class="`todo-item ${index}`">
      {{ item.plaintext }}
    </li>
  </ul>
</template>
