import { onMounted, onUnmounted } from "vue";

export function useEditable(teaserRef) {
  function scrollTo(event) {
    console.log("\x1b[31m ~ teaserRef:", teaserRef);
    const box = teaserRef.value.getBoundingClientRect();
    // ignoring message if already inside panel
    if (box.top <= 0 && box.bottom >= window.innerHeight) {
      return;
    }
    // scrollTo clashes with gsap snap
    window.scrollBy({ top: box.top, left: 0, behavior: "smooth" });
  }

  onMounted(() => window.addEventListener("message", scrollTo));
  onUnmounted(() => window.removeEventListener("message", scrollTo));

  return null;
}
