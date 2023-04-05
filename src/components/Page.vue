<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from "vue";
import List from "./List.vue";
import Teaser from "./Teaser.vue";
const data = ref(null);

let searchParams;
let topMostEditableElement;

const handleClick = (event) => {
  const nodeList = document.elementsFromPoint(event.x, event.y);

  topMostEditableElement = nodeList.find((node) => node?.dataset?.editablePath || node.attributes.path);
  if (!topMostEditableElement) {
    return;
  }

  const boundingBox = topMostEditableElement.getBoundingClientRect();
  window.parent.postMessage(
    {
      type: "editableBoundingRect",
      payload: [
        boundingBox.top + document.documentElement.scrollTop,
        boundingBox.left,
        boundingBox.height,
        boundingBox.width,
      ],
    },
    searchParams.get("iFrameHost")
  );

  window.parent.postMessage(
    {
      type: "editablePath",
      payload: [topMostEditableElement?.dataset?.editablePath],
    },
    searchParams.get("iFrameHost")
  );
};

const handleResize = () => {
  if (topMostEditableElement) {
    const boundingBox = topMostEditableElement.getBoundingClientRect();
    if (boundingBox) {
      window.parent.postMessage(
        {
          type: "editableBoundingRect",
          payload: [
            boundingBox.top + document.documentElement.scrollTop,
            boundingBox.left,
            boundingBox.height,
            boundingBox.width,
          ],
        },
        searchParams.get("iFrameHost")
      );
    }
  }
};

const handleScroll = () => {
  window.parent.postMessage(
    {
      type: "scrollTop",
      payload: document.documentElement.scrollTop,
    },
    searchParams.get("iFrameHost")
  );
};

const dataHandler = (event) => {
  if (event.data.type !== "setCfData") {
    return;
  }
  data.value = event.data.payload.data;
};

onMounted(async () => {
  const response = await fetch(
    "https://author-p54352-e854610.adobeaemcloud.com/graphql/execute.json/sample-list/Homepage",
    { credentials: "include" }
  );
  const fetchData = await response.json();

  data.value = fetchData?.data?.pageByPath?.item;
});

onBeforeMount(() => {
  searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get("editMode") === "HOC") {
    window.addEventListener("message", dataHandler);
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
  } else if (searchParams.get("editMode") !== 'false') {
    window.cfEditorDataFunction = (newData) => {
      data.value = newData
    }
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("message", dataHandler);
  window.removeEventListener("click", handleClick);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
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
