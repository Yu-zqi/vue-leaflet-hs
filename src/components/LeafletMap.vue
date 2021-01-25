<template>
  <div id="map"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
export default {
  data() {
    return {
      map: null,
      geoJsonPOI: null,
      iconCity: null,
      iconCounty: null,
      iconVillage: null
    };
  },
  mounted: function() {
    this.initMap();
    this.initIcon();
  },
  methods: {
    //初始化marker的图标
    initIcon() {
      this.iconCity = L.icon({
        iconUrl: require("../assets/marker-city.png"),
        shadowUrl: require("../assets/marker-shadow.png"),
        shadowSize: [50, 45],
        iconSize: [32, 45],
        iconAnchor: [16, 45],
        popupAnchor: [0, -45]
      });
      this.iconCounty = L.icon({
        iconUrl: require("../assets/marker-county.png"),
        shadowUrl: require("../assets/marker-shadow.png"),
        shadowSize: [50, 45],
        iconSize: [32, 45],
        iconAnchor: [16, 45],
        popupAnchor: [0, -45]
      });
      this.iconVillage = L.icon({
        iconUrl: require("../assets/marker-village.png"),
        shadowUrl: require("../assets/marker-shadow.png"),
        shadowSize: [50, 45],
        iconSize: [32, 45],
        iconAnchor: [16, 45],
        popupAnchor: [0, -45]
      });
      /* leaflet icon */
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png")
      });
    },
    initMap() {
      const key = "6d7b4cc72e9a1373d1a5fb474ad47a4b";
      this.map = L.map("map", {
        center: [29.92, 114.94],
        zoom: 10,
        attributionControl: false
      });
      const tiandituVec = L.tileLayer(
        "https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" +
          key
      );
      const tiandituCva = L.tileLayer(
        "https://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" +
          key
      );
      var tianditu = L.layerGroup([tiandituVec, tiandituCva]);
      tianditu.addTo(this.map);
    },
    //通过地图服务器的response创建marker
    createMarkers(res) {
      var markerClusterLayer = new L.MarkerClusterGroup();
      for (let i = 0; i < res.features.length; i++) {
        let poiMarkers = L.latLng(
          res.features[i].geometry.coordinates[1],
          res.features[i].geometry.coordinates[0]
        );
        if (res.features[i].properties.OType == 1) {
          poiMarkers = L.marker(poiMarkers, { icon: this.iconCity }).bindPopup(
            res.features[i].properties.OName +
              "<br>联系电话：" +
              res.features[i].properties.TelNum +
              "<br>地址：" +
              res.features[i].properties.Adress +
              "<br>社会信用代码：" +
              res.features[i].properties.CreditCode
          );
        } else if (res.features[i].properties.OType == 2) {
          poiMarkers = L.marker(poiMarkers, {
            icon: this.iconCounty
          }).bindPopup(
            res.features[i].properties.OName +
              "<br>联系电话：" +
              res.features[i].properties.TelNum +
              "<br>地址：" +
              res.features[i].properties.Adress +
              "<br>社会信用代码：" +
              res.features[i].properties.CreditCode
          );
        } else {
          poiMarkers = L.marker(poiMarkers, {
            icon: this.iconVillage
          }).bindPopup(
            res.features[i].properties.OName +
              "<br>联系电话：" +
              res.features[i].properties.TelNum +
              "<br>地址：" +
              res.features[i].properties.Adress +
              "<br>社会信用代码：" +
              res.features[i].properties.CreditCode
          );
        }

        markerClusterLayer.addLayer(poiMarkers);
      }
      this.map.addLayer(markerClusterLayer);
    }
  },
  created() {
    this.$axios
      .get(
        "http://localhost:8001/geoserver/hs/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hs%3Ahspoi&maxFeatures=1020&outputFormat=application%2Fjson"
      )
      .then(response => {
        this.geoJsonPOI = response.data;
        this.createMarkers(this.geoJsonPOI);
      });
  }
};
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
</style>
