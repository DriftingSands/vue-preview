<script setup>
// importing editable requires setup script
import { ref } from "vue";
import { useEditable } from './editable.js'

const props = defineProps({
  teaser: Object
})

const teaserRef = ref(null)
useEditable(teaserRef)

</script>

<template>
  <div class="teaser" :data-editable-path="teaser?._path" ref="teaserRef" >
    <div class="image">
      <img
        :src="'https://publish-p54352-e854610.adobeaemcloud.com' + teaser?.image._path"
        :alt="teaser?.imageAltText?.plaintext"
        :data-editable-path="teaser?._path"
        data-inner-cf-path=".image._path"
      />
    </div>
    <div class="textContent">
      <h4 :data-editable-path="teaser?._path" data-inner-cf-path=".title">{{teaser?.title}}</h4>
      <p :data-editable-path="teaser?._path" data-inner-cf-path=".description.plaintext">{{teaser?.description?.plaintext}}</p>
      <div class="buttons">
        <a v-if="teaser?.readMoreLink" :href="teaser?.readMoreLink" target="_blank">Read More</a>
        <a v-if="teaser?.sourceLink" :href="teaser?.sourceLink" target="_blank">Source</a>
      </div>
    </div>
  </div>
</template>