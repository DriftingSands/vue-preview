<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from "vue";
import List from "./List.vue";
import Teaser from "./Teaser.vue";

const handleClick = event => {
  const nodeList = document.elementsFromPoint(event.x, event.y);

  console.log("\x1b[31m ~ nodeList:", nodeList);
  const topMostEditableElement = nodeList.find(node => node?.dataset?.editablePath || node.attributes.path);
  console.log("\x1b[31m ~ topMostEditableElement:", topMostEditableElement);
  if (!topMostEditableElement) {
    return;
  }

  window.parent.postMessage(
    {
      type: "editablePath",
      payload: [topMostEditableElement?.dataset?.editablePath],
    },
    new URLSearchParams(window.location.search).get("iFrameHost")
  );
};

const data = ref(null);

onMounted(async () => {
  const response = await fetch(
    "https://author-p54352-e854610.adobeaemcloud.com/graphql/execute.json/sample-list/Homepage",
    { credentials: "include" }
  );
  const fetchData = await response.json();

  data.value = fetchData?.data?.pageByPath?.item;
});

const dataHandler = event => {
  if (event.data.type !== "setCfData") {
    return;
  }
  data.value = event.data.payload.data;
};
onBeforeMount(async () => {
  window.addEventListener("message", dataHandler);
  window.addEventListener("click", handleClick);
});

onBeforeUnmount(async () => {
  window.removeEventListener("message", dataHandler);
  window.removeEventListener("click", handleClick);
});
</script>

<template>
  <main v-if="data">
    <h1>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/2367px-Vue.js_Logo_2.svg.png"
        alt="svelte icon"
        height="24"
      />

      {{ data.header.toUpperCase() }}
    </h1>

    <div class="content">
      <List :listContent="data.listContent" />
    </div>
    <Teaser :teaser="data.teaser" />
  </main>

  <main v-else="data">
    <h2>
      AEM Fetch failed, log into
      <a target="_blank" href="https://author-p54352-e854610.adobeaemcloud.com"
        >https://author-p54352-e854610.adobeaemcloud.com</a
      >
    </h2>
  </main>
</template>
