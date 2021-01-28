<template>
  <div class="mapcontainer">
    <el-container class="mapcontainer">
      <el-header>黄石市政务地图</el-header>
      <el-container>
        <!--侧边栏-->
        <el-aside>
          <el-tabs type="card" v-model="activeTabName_NP" class="tasContainer">
            <!--个人主题选项卡-->
            <el-tab-pane label="个人主题" name="naturePerson">
              <el-tabs v-model="activeTabName_NP_Theme">
                <el-tab-pane
                  label="按主题分类"
                  name="serviceTheme_NP"
                  class="serviceTheme_tabpane"
                >
                  <el-button
                    v-for="item in serviceThemeList_NP.slice(
                      (currentpage - 1) * pagesize,
                      currentpage * pagesize
                    )"
                    v-bind:key="item.themeId"
                    >{{ item.themeName }}
                  </el-button>
                  <el-pagination
                    layout="prev, pager, next"
                    :current-page="currentpage"
                    :page-size="pagesize"
                    :total="serviceThemeList_NP.length"
                    @current-change="handleCurrentChange"
                  >
                  </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="按部门分类" name="serviceOrganization_LP">
                  <el-button
                    v-for="item in serviceOrganizationList_LP.slice(
                      (currentpage - 1) * pagesize,
                      currentpage * pagesize
                    )"
                    v-bind:key="item.themeId"
                    >{{ item.themeName }}
                  </el-button>
                  <el-pagination
                    layout="prev, pager, next"
                    :current-page="currentpage"
                    :page-size="pagesize"
                    :total="serviceThemeList_NP.length"
                    @current-change="handleCurrentChange"
                  >
                  </el-pagination>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <!--法人主题选项卡-->
            <el-tab-pane label="法人主题" name="legalPerson">
              <el-tabs v-model="activeTabName_LP_Theme">
                <el-tab-pane label="按主题分类" name="serviceTheme_LP">
                  <el-button
                    v-for="item in serviceThemeList_LP"
                    v-bind:key="item.themeId"
                    v-on:click="btnclick"
                    >{{ item.themeName }}
                  </el-button>
                  <el-pagination
                    layout="prev, pager, next"
                    :current-page="currentpage"
                    :page-size="pagesize"
                    :total="serviceThemeList_LP.length"
                    @current-change="handleCurrentChange"
                  >
                  </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="按部门分类" name="serviceOrganization">
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        <el-container>
          <el-main> <div id="map"></div></el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
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
      geoJsonBounds: null,
      iconCity: null,
      iconCounty: null,
      iconVillage: null,
      markerClusterLayer: null,
      currentpage: 1,
      pagesize: 16,
      activeTabName_LP: "legalPerson",
      activeTabName_NP: "naturePerson",
      activeTabName_LP_Theme: "serviceTheme_LP",
      activeTabName_NP_Theme: "serviceTheme_NP",
      serviceThemeList_NP: [
        { themeType: "1", themeId: "1", themeName: "证件办理" },
        { themeType: "1", themeId: "2", themeName: "教育科研" },
        { themeType: "1", themeId: "3", themeName: "司法公证" },
        { themeType: "1", themeId: "4", themeName: "抵押质押" },
        { themeType: "1", themeId: "5", themeName: "出境入境" },
        { themeType: "1", themeId: "6", themeName: "环保绿化" },
        { themeType: "1", themeId: "7", themeName: "住房保障" },
        { themeType: "1", themeId: "8", themeName: "准营准办" },
        { themeType: "1", themeId: "9", themeName: "死亡殡葬" },
        { themeType: "1", themeId: "10", themeName: "旅游观光" },
        { themeType: "1", themeId: "11", themeName: "社会保障" },
        { themeType: "1", themeId: "12", themeName: "优待抚恤" },
        { themeType: "1", themeId: "13", themeName: "文化体育" },
        { themeType: "1", themeId: "14", themeName: "规划建设" },
        { themeType: "1", themeId: "15", themeName: "消费维权" },
        { themeType: "1", themeId: "16", themeName: "交通出行" },
        { themeType: "1", themeId: "17", themeName: "婚姻登记" },
        { themeType: "1", themeId: "18", themeName: "知识产权" },
        { themeType: "1", themeId: "19", themeName: "行政缴费" },
        { themeType: "1", themeId: "20", themeName: "民族宗教" },
        { themeType: "1", themeId: "21", themeName: "离职退休" },
        { themeType: "1", themeId: "22", themeName: "设立变更" },
        { themeType: "1", themeId: "23", themeName: "户籍办理" },
        { themeType: "1", themeId: "24", themeName: "生育收养" },
        { themeType: "1", themeId: "25", themeName: "医疗卫生" },
        { themeType: "1", themeId: "26", themeName: "就业创业" },
        { themeType: "1", themeId: "27", themeName: "公共安全" },
        { themeType: "1", themeId: "28", themeName: "公用事业" },
        { themeType: "1", themeId: "29", themeName: "职业资格" },
        { themeType: "1", themeId: "30", themeName: "入伍服役" },
        { themeType: "1", themeId: "31", themeName: "其他" }
      ],
      serviceOrganizationList_NP: [
        { themeType: "2", themeId: "1", themeName: "市残联" },
        { themeType: "2", themeId: "2", themeName: "市教育局" },
        { themeType: "2", themeId: "3", themeName: "市人防办" },
        { themeType: "2", themeId: "4", themeName: "市住房公积金中心" },
        { themeType: "2", themeId: "5", themeName: "市审计局" },
        { themeType: "2", themeId: "6", themeName: "市委宣传部" },
        { themeType: "2", themeId: "7", themeName: "市政务和大数据管理局" },
        { themeType: "2", themeId: "8", themeName: "市文化和旅游局" },
        { themeType: "2", themeId: "9", themeName: "市民宗委" },
        { themeType: "2", themeId: "10", themeName: "市国安局" },
        { themeType: "2", themeId: "11", themeName: "市统计局" },
        { themeType: "2", themeId: "12", themeName: "市商务局" },
        { themeType: "2", themeId: "13", themeName: "市自然资源和规划局" },
        { themeType: "2", themeId: "14", themeName: "市委办公室" },
        { themeType: "2", themeId: "15", themeName: "市市场监督管理局" },
        { themeType: "2", themeId: "16", themeName: "市人社局" },
        { themeType: "2", themeId: "17", themeName: "市医疗保障局" },
        { themeType: "2", themeId: "18", themeName: "市委编办" },
        { themeType: "2", themeId: "19", themeName: "市水文局" },
        { themeType: "2", themeId: "20", themeName: "市民政局" },
        { themeType: "2", themeId: "21", themeName: "市经信局" },
        { themeType: "2", themeId: "22", themeName: "市财政局" },
        { themeType: "2", themeId: "23", themeName: "市委统战部" },
        { themeType: "2", themeId: "24", themeName: "市城市管理执法委员会" },
        { themeType: "2", themeId: "25", themeName: "市公安局" },
        { themeType: "2", themeId: "26", themeName: "市档案馆" },
        { themeType: "2", themeId: "27", themeName: "市地方金融工作局" },
        { themeType: "2", themeId: "28", themeName: "市水利和湖泊局" },
        { themeType: "2", themeId: "29", themeName: "市烟草局" },
        { themeType: "2", themeId: "30", themeName: "市科技局" },
        { themeType: "2", themeId: "31", themeName: "市发改委" },
        { themeType: "2", themeId: "32", themeName: "市应急管理局" },
        { themeType: "2", themeId: "33", themeName: "市气象局" },
        { themeType: "2", themeId: "34", themeName: "市供销社" },
        { themeType: "2", themeId: "35", themeName: "市住房和城乡建设局" },
        { themeType: "2", themeId: "36", themeName: "市司法局" },
        { themeType: "2", themeId: "37", themeName: "市退役军人事务局" },
        { themeType: "2", themeId: "38", themeName: "市农业农村局" },
        { themeType: "2", themeId: "39", themeName: "市卫生健康委员会" },
        { themeType: "2", themeId: "40", themeName: "市税务局" },
        { themeType: "2", themeId: "41", themeName: "市生态环境局" },
        { themeType: "2", themeId: "42", themeName: "市交通运输局" },
        { themeType: "2", themeId: "43", themeName: "市邮政局" }
      ],
      serviceThemeList_LP: [
        { themeType: "1", themeId: "1", themeName: "设立变更" },
        { themeType: "1", themeId: "2", themeName: "准营准办" },
        { themeType: "1", themeId: "3", themeName: "资质认证" },
        { themeType: "1", themeId: "4", themeName: "年检年审" },
        { themeType: "1", themeId: "5", themeName: "税收财务" },
        { themeType: "1", themeId: "6", themeName: "人力资源" },
        { themeType: "1", themeId: "7", themeName: "社会保障" },
        { themeType: "1", themeId: "8", themeName: "准营准办" },
        { themeType: "1", themeId: "9", themeName: "死亡殡葬" },
        { themeType: "1", themeId: "10", themeName: "旅游观光" },
        { themeType: "1", themeId: "11", themeName: "社会保障" },
        { themeType: "1", themeId: "12", themeName: "优待抚恤" },
        { themeType: "1", themeId: "13", themeName: "文化体育" },
        { themeType: "1", themeId: "14", themeName: "规划建设" },
        { themeType: "1", themeId: "15", themeName: "消费维权" },
        { themeType: "1", themeId: "16", themeName: "交通出行" },
        { themeType: "1", themeId: "17", themeName: "婚姻登记" },
        { themeType: "1", themeId: "18", themeName: "知识产权" },
        { themeType: "1", themeId: "19", themeName: "行政缴费" },
        { themeType: "1", themeId: "20", themeName: "民族宗教" },
        { themeType: "1", themeId: "21", themeName: "离职退休" },
        { themeType: "1", themeId: "22", themeName: "设立变更" },
        { themeType: "1", themeId: "23", themeName: "户籍办理" },
        { themeType: "1", themeId: "24", themeName: "生育收养" },
        { themeType: "1", themeId: "25", themeName: "医疗卫生" },
        { themeType: "1", themeId: "26", themeName: "就业创业" },
        { themeType: "1", themeId: "27", themeName: "公共安全" },
        { themeType: "1", themeId: "28", themeName: "公用事业" },
        { themeType: "1", themeId: "29", themeName: "职业资格" },
        { themeType: "1", themeId: "30", themeName: "入伍服役" },
        { themeType: "1", themeId: "31", themeName: "其他" }
      ],
      serviceOrganizationList_LP: [
        { themeType: "1", themeId: "1", themeName: "市残联" },
        { themeType: "1", themeId: "2", themeName: "市教育局" },
        { themeType: "1", themeId: "3", themeName: "市人防办" },
        { themeType: "1", themeId: "9", themeName: "市民宗委" },
        { themeType: "1", themeId: "10", themeName: "市国安局" },
        { themeType: "1", themeId: "11", themeName: "市统计局" },
        { themeType: "1", themeId: "12", themeName: "市商务局" },
        { themeType: "1", themeId: "5", themeName: "市审计局" },
        { themeType: "1", themeId: "18", themeName: "市委编办" },
        { themeType: "1", themeId: "19", themeName: "市水文局" },
        { themeType: "1", themeId: "20", themeName: "市民政局" },
        { themeType: "1", themeId: "21", themeName: "市经信局" },
        { themeType: "1", themeId: "22", themeName: "市财政局" },
        { themeType: "1", themeId: "16", themeName: "市人社局" },
        { themeType: "1", themeId: "25", themeName: "市公安局" },
        { themeType: "1", themeId: "26", themeName: "市档案馆" },
        { themeType: "1", themeId: "29", themeName: "市烟草局" },
        { themeType: "1", themeId: "6", themeName: "市委宣传部" },
        { themeType: "1", themeId: "14", themeName: "市委办公室" },
        { themeType: "1", themeId: "23", themeName: "市委统战部" },
        { themeType: "1", themeId: "43", themeName: "市邮政局" },
        { themeType: "1", themeId: "41", themeName: "市生态环境局" },
        { themeType: "1", themeId: "40", themeName: "市税务局" },
        { themeType: "1", themeId: "42", themeName: "市交通运输局" },
        { themeType: "1", themeId: "34", themeName: "市供销社" },
        { themeType: "1", themeId: "32", themeName: "市应急管理局" },
        { themeType: "1", themeId: "33", themeName: "市气象局" },
        { themeType: "1", themeId: "17", themeName: "市医疗保障局" },
        { themeType: "1", themeId: "31", themeName: "市发改委" },
        { themeType: "1", themeId: "28", themeName: "市水利和湖泊局" },
        { themeType: "1", themeId: "30", themeName: "市科技局" },
        { themeType: "1", themeId: "8", themeName: "市文化和旅游局" },
        { themeType: "1", themeId: "4", themeName: "市住房公积金中心" },
        { themeType: "1", themeId: "13", themeName: "市自然资源和规划局" },
        { themeType: "1", themeId: "7", themeName: "市政务和大数据管理局" },
        { themeType: "1", themeId: "15", themeName: "市市场监督管理局" },
        { themeType: "1", themeId: "24", themeName: "市城市管理执法委员会" },
        { themeType: "1", themeId: "27", themeName: "市地方金融工作局" },
        { themeType: "1", themeId: "35", themeName: "市住房和城乡建设局" },
        { themeType: "1", themeId: "37", themeName: "市退役军人事务局" },
        { themeType: "1", themeId: "38", themeName: "市农业农村局" },
        { themeType: "1", themeId: "39", themeName: "市卫生健康委员会" }
      ]
    };
  },
  mounted: function() {
    this.initMap();
    this.initIcon();
    this.getMarkerJson();
    this.getBoundsJson();
    this.getCoverJson();
  },
  methods: {
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
    searchMoveToLocation(markerClusterLayer, map, locationId) {
      markerClusterLayer.eachLayer(function(markerLayer) {
        if (markerLayer instanceof L.Marker)
          if (markerLayer.feature.properties.OId == locationId) {
            let latlng = L.latLng(
              markerLayer.feature.geometry.coordinates[1],
              markerLayer.feature.geometry.coordinates[0]
            );
            map.flyTo(latlng, 18, { duration: 1.5 });
            map.once("moveend", function() {
              markerLayer.openPopup();
            });
          }
      });
    },
    clickMarker() {
      this.markerClusterLayer.on("click", function(feature) {
        console.log(feature.layer.OId);
      });
    },
    createMarkers(res, map) {
      //创建一个MarkerClusterGroup实例，用于聚合显示marker
      this.markerClusterLayer = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 15
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
          layer.bindTooltip(popupContent, { offset: L.point(20, -30) });
        },
        //设置不同类型的marker的icon样式
        pointToLayer: function(feature, latlng) {
          if (feature.properties.OType == 1) {
            let marker = L.marker(latlng, { icon: iconCity });
            marker.OId = feature.properties.OId;
            return marker;
          } else if (feature.properties.OType == 2) {
            let marker = L.marker(latlng, { icon: iconCounty });
            marker.OId = feature.properties.OId;
            return marker;
          } else {
            let marker = L.marker(latlng, { icon: iconVillage });
            marker.OId = feature.properties.OId;
            return marker;
          }
        }
      });

      this.markerClusterLayer.addLayer(featuresLayer);
      map.addLayer(this.markerClusterLayer);

      //监听marker的click事件
      this.clickMarker();
    },
    createBounds(res, map) {
      var hsBounds = L.geoJSON(res, {
        //初始样式
        style: function() {
          return {
            weight: 3,
            color: "#3b3cfa",
            opacity: 1,
            fillColor: "#f5f4ee",
            fillOpacity: 0.3
          };
        },
        onEachFeature: function(feature, layer) {
          //鼠标移入显示标注
          layer.bindTooltip("<div>" + feature.properties.Name + "</div>", {
            permanent: false,
            sticky: true,
            direction: "top"
          });
          //鼠标移入要素高亮
          layer.on("mouseover", function(e) {
            const featureTarget = e.target;
            featureTarget.setStyle({
              weight: 5,
              opacity: 1,
              fillColor: "yellow",
              fillOpacity: 0.2
            });
          });
          //鼠标移出要素还原
          layer.on("mouseout", function(e) {
            const featureTarget = e.target;
            featureTarget.setStyle({
              weight: 3,
              color: "#3b3cfa",
              opacity: 1,
              fillColor: "#f5f4ee",
              fillOpacity: 0.3
            });
          });
        }
      });
      hsBounds.addTo(map);
    },
    createCover(res, map) {
      var mapCover = L.geoJSON(res, {
        //初始样式
        style: function() {
          return {
            weight: 0,
            fillColor: "#1f70c9",
            fillOpacity: 0.12
          };
        }
      });
      mapCover.addTo(map);
    },
    getMarkerJson() {
      this.$axios
        .get(
          "http://localhost:8001/geoserver/hs/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hs%3Ahspoi&maxFeatures=1020&outputFormat=application%2Fjson"
        )
        .then(response => {
          this.geoJsonPOI = response.data;
          this.createMarkers(response.data, this.map);
        });
    },
    getBoundsJson() {
      this.$axios
        .get(
          "http://localhost:8001/geoserver/hs/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hs%3AhsBounds&maxFeatures=50&outputFormat=application%2Fjson"
        )
        .then(response => {
          this.geoJsonBounds = response.data;
          this.createBounds(response.data, this.map);
        });
    },
    getCoverJson() {
      this.$axios
        .get(
          "http://localhost:8001/geoserver/hs/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hs%3Acover&maxFeatures=50&outputFormat=application%2Fjson"
        )
        .then(response => {
          this.geoJsonCover = response.data;
          this.createCover(response.data, this.map);
        });
    },
    btnclick() {
      console.log("hello");
      this.searchMoveToLocation(this.markerClusterLayer, this.map, 55);
    },
    handleCurrentChange(currentPage) {
      this.currentpage = currentPage;
    }
  }
};
</script>

<style>
.el-button {
  margin: 5px !important;
}
.tasContainer {
  padding: 20px;
}
.mapcontainer {
  width: 100%;
  height: 100%;
}
.el-header {
  background: blue;
}
.el-main {
  padding: 0px !important;
  margin: 0px !important;
}
#map {
  width: 100%;
  height: 100%;
}
#pane-serviceTheme_LP {
  padding: 20px;
}
.el-pagination {
  text-align: center;
  bottom: 0;
}

/*markercluster样式*/
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
