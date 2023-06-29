<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from "vue";
import List from "./List.vue";
import Teaser from "./Teaser.vue";
import Logo from "./Logo.vue";
const data = ref(null);
const fetchComplete = ref(false);
const onlyExternalData = ref(false);

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
      payload: {
        path: [topMostEditableElement?.dataset?.editablePath],
        content: {
          textContent: topMostEditableElement.textContent,
          src: topMostEditableElement.src || topMostEditableElement.querySelector("img").src,
        },
      },
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
  if (searchParams.get("onlyExternalData") === "true") {
    onlyExternalData.value = true;
    return;
  }
  try {
    const response = await fetch(
      "https://author-p54352-e854610.adobeaemcloud.com/graphql/execute.json/sample-list/Homepage",
      { credentials: "include" }
    );
    const fetchData = await response.json();

    data.value = fetchData?.data?.pageByPath?.item;
    fetchComplete.value = true;
  } catch (error) {
    fetchComplete.value = true;
  }
});

onBeforeMount(() => {
  searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get("editMode") === "HOC") {
    window.addEventListener("message", dataHandler);
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
  } else if (searchParams.get("editMode") !== "false") {
    window.cfEditorDataFunction = (newData) => {
      data.value = newData;
    };
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
  <main v-if="data?.header || data?.listContent?.length || data?.teaser">
    <h1>
      <Logo />
      {{ data.header.toUpperCase() }}
    </h1>

    <div class="content">
      <List :listContent="data.listContent" />
    </div>
    <Teaser :teaser="data.teaser" />
  </main>

  <main v-else-if="onlyExternalData">
    <h2>
      <Logo />
      Waiting for data...
    </h2>
  </main>

  <main v-else-if="fetchComplete">
    <h2>
      <Logo />
      AEM Fetch failed, log into
      <a target="_blank" href="https://author-p54352-e854610.adobeaemcloud.com"
        >https://author-p54352-e854610.adobeaemcloud.com</a
      >
    </h2>
  </main>

  <main v-else>
    <h2>
      <Logo />
      Fetching data...
    </h2>
  </main>
</template>
