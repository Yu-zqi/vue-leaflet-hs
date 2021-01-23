<template>
  <div id="app">
    <l-map :center="center" :zoom="zoom" :options="mapOptions">
      <l-tile-layer :url="vecUrl"></l-tile-layer>
      <l-tile-layer :url="cvaUrl"></l-tile-layer
    ></l-map>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "vue2-leaflet";
export default {
  components: {
    "l-map": LMap,
    "l-tile-layer": LTileLayer
  },
  data() {
    return {
      vecUrl:
        "https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=6d7b4cc72e9a1373d1a5fb474ad47a4b",
      cvaUrl:
        "https://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=6d7b4cc72e9a1373d1a5fb474ad47a4b",
      center: [29.92, 115.05],
      zoom: 10,
      mapOptions: { attributionControl: false }
    };
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
