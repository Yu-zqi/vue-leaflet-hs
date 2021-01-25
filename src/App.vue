<template>
  <div id="app">
    <l-map></l-map>
  </div>
</template>

<script>
import LeafletMap from "./components/LeafletMap.vue";
export default {
  components: {
    "l-map": LeafletMap
  }
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
  padding: 0%;
  margin: 0%;
}
</style>
