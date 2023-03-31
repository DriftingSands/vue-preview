<script>
export default {
  name: "List",
  props: ['listContent']
}
</script>

<template>
  <ul>
    <li v-for="(item, index) in listContent" :class="`todo-item ${index}`">
      {{ item.plaintext }}
    </li>
  </ul>
</template>
