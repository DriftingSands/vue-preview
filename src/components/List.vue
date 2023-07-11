<script>
export default {
  name: "List",
  props: ['listContent', 'path']
}
</script>

<template>
  <ul>
    <li :data-editable-path="path" :data-inner-cf-path="`.listContent.${index}.plaintext`" data-cf-add-new="true" v-for="(item, index) in listContent" :class="`todo-item ${index}`">
      {{ item.plaintext }}
    </li>
  </ul>
</template>
