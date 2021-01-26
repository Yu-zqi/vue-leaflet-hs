<template>
  <div id="map"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import "leaflet-search/src/leaflet-search.css";
import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import "leaflet-search";
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
      /* leaflet default icon */
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
      //创建一个MarkerClusterGroup实例，用于聚合显示marker
      var markerClusterLayer = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      });

      //初始化设置icon，市级：iconCity，县级：iconCounty，村级：iconVillage
      var iconCity = L.icon({
        iconUrl: require("../assets/marker-city.png"),
        shadowUrl: require("../assets/marker-shadow.png"),
        shadowSize: [50, 45],
        iconSize: [32, 45],
        iconAnchor: [16, 45],
        popupAnchor: [0, -45]
      });

      var iconCounty = L.icon({
        iconUrl: require("../assets/marker-county.png"),
        shadowUrl: require("../assets/marker-shadow.png"),
        shadowSize: [50, 45],
        iconSize: [32, 45],
        iconAnchor: [16, 45],
        popupAnchor: [0, -45]
      });

      var iconVillage = L.icon({
        iconUrl: require("../assets/marker-village.png"),
        shadowUrl: require("../assets/marker-shadow.png"),
        shadowSize: [50, 45],
        iconSize: [32, 45],
        iconAnchor: [16, 45],
        popupAnchor: [0, -45]
      });

      //用GeoJSON方法解析数据，设置marker样式
      var featuresLayer = new L.GeoJSON(res, {
        //绑定marker的popup，设置popup内容
        onEachFeature: function(feature, layer) {
          let popupContent =
            "<h3>" +
            feature.properties.OName +
            "</h3><strong>地址：</strong>" +
            feature.properties.Adress +
            "<br><strong>联系电话：</strong>" +
            feature.properties.TelNum +
            "<br><strong>社会信用代码：</strong>" +
            feature.properties.CreditCode;
          layer.bindPopup(popupContent);
        },
        //设置不同类型的marker的icon样式
        pointToLayer: function(feature, latlng) {
          if (feature.properties.OType == 1) {
            return L.marker(latlng, { icon: iconCity });
          } else if (feature.properties.OType == 2) {
            return L.marker(latlng, { icon: iconCounty });
          } else {
            return L.marker(latlng, { icon: iconVillage });
          }
        }
      });

      markerClusterLayer.addLayer(featuresLayer);
      this.map.addLayer(markerClusterLayer);

      //搜索框control
      var searchControl = new L.Control.Search({
        position: "topright",
        layer: markerClusterLayer,
        propertyName: "OId",
        marker: false,
        hideMarkerOnCollapse: true,
        moveToLocation: function(latlng, title, map) {
          //map.fitBounds( latlng.layer.getBounds() );
          var zoom = map.getBoundsZoom(latlng.layer.getBounds());
          map.setView(latlng, zoom); // access the zoom
        }
      });
      this.map.addControl(searchControl);
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
.marker-cluster-large {
  background-image: url("../assets/marker-cluster-large.png");
  background-size: 40px 40px;
  background-color: transparent;
}
.marker-cluster-large div {
  font: 0px "Helvetica Neue", Arial, Helvetica, sans-serif;
  background-color: transparent;
}
.marker-cluster-medium {
  background-image: url("../assets/marker-cluster-medium.png");
  background-size: 40px 40px;
  background-color: transparent;
}
.marker-cluster-medium div {
  font: 0px "Helvetica Neue", Arial, Helvetica, sans-serif;
  background-color: transparent;
}
.marker-cluster-small {
  background-image: url("../assets/marker-cluster-small.png");
  background-size: 40px 40px;
  background-color: transparent;
}
.marker-cluster-small div {
  font: 0px "Helvetica Neue", Arial, Helvetica, sans-serif;
  background-color: transparent;
}
</style>
