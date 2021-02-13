<template>
  <v-app>
    <v-col sm="8" lg="10" xl="10" md="12" class="mt-4 mx-auto">
      <v-row>
        <v-col cols="12" class="">
          <v-autocomplete
            v-model="select"
            :loading="loading"
            :items="items"
            :search-input.sync="search"
            item-text="complete"
            item-value="id"
            flat
            :hide-no-data="cityData"
            hide-details
            label="What state are you from?"
            solo-inverted
            :no-filter="false"
          ></v-autocomplete>
        </v-col>
        <v-col xs="12" sm="12" md="12" lg="8" xl="8" class="pb-0">
          <v-col xs="12" sm="12" lg="12" xl="12" md="12">
            <span class="headline1">Weather </span>
            <span class="headline1 font-weight-bold">Forecast</span>
            <div class="my-3">
              <v-btn
                rounded
                :outlined="!showJapan"
                active
                color="primary"
                class="mx-2"
                small
                @click="showJapan = true"
                dark
              >
                Japan places
              </v-btn>
              <v-btn
                rounded
                :outlined="showJapan"
                color="primary"
                class="mx-2"
                dark
                small
                @click="showJapan = false"
              >
                Favorite place
              </v-btn>
            </div>
          </v-col>
          <v-row>
            <v-col v-if="showJapan == true" xs="12" sm="12" lg="12" xl="12" md="12">
              <v-row>
                <v-col
                  v-for="item in JapanForecast"
                  :key="item.id"
                  xs="4"
                  sm="4"
                  lg="2"
                  xl="2"
                  md="4"
                >
                  <v-card
                    elevation="1"
                    min-height="230"
                    @click="getCityForecast(item.coord)"
                  >
                    <v-img
                      :src="`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`"
                    ></v-img>
                    <v-card-title class="headline4 pt-0 pb-0"
                      >{{ item.name }}, {{ item.sys.country }}</v-card-title
                    >
                    <v-card-text>{{ item.weather[0].description }}</v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="showJapan == false" xs="12" sm="12" lg="12" xl="12" md="12">
              <v-row>
                <v-col
                  v-for="item in FavoriteForecast"
                  :key="item.id"
                  xs="4"
                  sm="4"
                  lg="2"
                  xl="2"
                  md="4"
                >
                  <v-card
                    elevation="1"
                    min-height="230"
                    @click="getCityForecast(item.details.coord)"
                  >
                    <v-img
                      :src="`http://openweathermap.org/img/wn/${item.details.weather[0].icon}@2x.png`"
                    ></v-img>
                    <v-btn
                      elevation="2"
                      color="red"
                      x-small
                      absolute
                      top
                      right
                      fab
                      @click="deleteCity(item.id)"
                      ><v-icon color="white">mdi-delete</v-icon></v-btn
                    >
                    <v-card-title class="headline4 pt-0 pb-0"
                      >{{ item.details.name }},
                      {{ item.details.sys.country }}</v-card-title
                    >
                    <v-card-text>{{
                      item.details.weather[0].description
                    }}</v-card-text>
                  </v-card>
                </v-col>
                <v-col
                  v-if="FavoriteForecast.length != 6"
                  sm="2"
                  lg="2"
                  xl="2"
                  md="2"
                >
                  <v-card
                    elevation="1"
                    align="center"
                    min-height="230"
                    class="pt-15"
                    @click="addCityDialog = !!true"
                  >
                    <v-img
                      height="70"
                      width="70"
                      src="./assets/add.png"
                    ></v-img>
                    <v-card-text>add city</v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="SelectedForecast !== null" xs="12" sm="12" lg="12" xl="12" md="12">
              <div>
                <p class="mb-0">{{ SelectedForecast.timezone }}</p>
                <h4>
                  {{ getTimeZone("MMMM") }} {{ getTimeZone("DD") }},
                  {{ getTimeZone("YYYY") }}
                </h4>
                <h1>
                  {{ getTimeZone("hh") }}:{{ getTimeZone("mm") }}
                  {{ getTimeZone("a") }}
                </h1>
              </div>

              <v-simple-table fixed-header height="300px">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Day</th>
                      <th></th>
                      <th class="text-left">Rain Chance</th>
                      <th class="text-left">Status</th>
                      <th class="text-left">Highest Temp</th>
                      <th class="text-left">Lowest Temp</th>
                      <th class="text-left">Wind</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in SelectedForecast.daily"
                      :key="index"
                    >
                      <td class="font-weight-bold">
                        {{ unixTimeConvert(item.dt) }}
                      </td>
                      <td>
                        <v-img
                          height="40"
                          width="40"
                          :src="`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`"
                        ></v-img>
                      </td>
                      <td>{{ item.humidity }}%</td>
                      <td>{{ item.weather[0].description }}</td>
                      <td>{{ item.temp.max }}&#8451;</td>
                      <td>{{ item.temp.min }}&#8451;</td>
                      <td>{{ item.wind_speed }} mph</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="SearchedForecast != null" xs="12" sm="12" md="12"  lg="4" xl="4" class="pb-0">
          <v-card class="mx-auto">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="headline">
                  {{ SearchedForecast.current.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ getSearchedCityTimezone("hh") }}:{{
                    getSearchedCityTimezone("mm")
                  }}
                  {{ getSearchedCityTimezone("a") }},
                  {{ getSearchedCityTimezone("MMMM") }}
                  {{ getSearchedCityTimezone("DD") }}
                  {{ getSearchedCityTimezone("YYYY") }},
                  {{
                    SearchedForecast.current.weather[0].description
                  }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>

            <v-card-text>
              <v-row align="center">
                <v-col class="display-2" cols="6">
                  {{ SearchedForecast.current.main.temp }}&deg;C
                </v-col>
                <v-col cols="6">
                  <v-img
                    :src="`http://openweathermap.org/img/wn/${SearchedForecast.current.weather[0].icon}@2x.png`"
                    width="92"
                  ></v-img>
                </v-col>
              </v-row>
            </v-card-text>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-send</v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle
                >{{
                  SearchedForecast.current.wind.speed
                }}
                mph</v-list-item-subtitle
              >
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-cloud-download</v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle
                >{{ SearchedForecast.current.main.humidity }}%
                chance</v-list-item-subtitle
              >
            </v-list-item>

            <v-list class="transparent">
              <v-list-item
                v-for="(item, index) in SearchedForecast.daily.daily"
                :key="index"
              >
                <v-list-item-title>{{
                  unixTimeConvert(item.dt)
                }}</v-list-item-title>

                <v-list-item-icon>
                  <v-img
                    :src="`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`"
                  ></v-img>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{ item.temp.max }}&deg;/{{ item.temp.min }}&deg;
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <AddCity :prodialog="addCityDialog" @dialogValue="getDialogValue" />
      </v-row>
    </v-col>
  </v-app>
</template>

<script>
import store from "./store";
import AddCity from "./components/AddCity";

const moment_zone = require("moment-timezone");
export default {
  name: "App",
  components: {
    AddCity: AddCity,
  },
  data() {
    return {
      moment_zone: moment_zone,
      loading: false,
      items: [],
      search: null,
      select: null,
      showJapan: true,
      search_time: null,
      city_search: null,
      addCityDialog: false,
      cityData: true,
      cityDetails: [],
      labels: ["SU", "MO", "TU", "WED", "TH", "FR", "SA"],
      time: 0,
      forecast: [
        {
          day: "Tuesday",
          icon: "mdi-white-balance-sunny",
          temp: "24\xB0/12\xB0",
        },
        {
          day: "Wednesday",
          icon: "mdi-white-balance-sunny",
          temp: "22\xB0/14\xB0",
        },
        { day: "Thursday", icon: "mdi-cloud", temp: "25\xB0/15\xB0" },
      ],
    };
  },
  computed: {
    JapanForecast() {
      return store.getters.getJapanForecast;
    },
    FavoriteForecast() {
      return store.getters.getFavorteForecast;
    },
    SelectedForecast() {
      return store.getters.getSelectedCityForecast;
    },
    SearchedForecast() {
      return store.getters.getCityWeather;
    },
  },
  mounted() {
    store.dispatch("callJapanForecast");
    store.dispatch("callCityWeather", 1850144);
  },
  watch: {
    search(val) {
      if (this.items.length != 1) {
        if (this.search_time) {
          this.loading = false;
          clearTimeout(this.search_time);
          this.items = [];
          store.dispatch("clearCities");
        }
      }
      val && val !== this.select && this.querySelections(val);
    },
    select(val) {
      this.items = [];
      var selectedData = store.getters.getCities.find((x) => x.id === val);
      this.items = [
        {
          complete: selectedData.complete,
          country: selectedData.country,
          country_code: selectedData.country_code,
          findname: selectedData.findname,
          id: selectedData.id,
          lat: selectedData.lat,
          lon: selectedData.long,
          name: selectedData.name,
        },
      ];
      this.cityWeather(val);

      //call a method here
    },
  },
  methods: {
    querySelections(val) {
      this.loading = true;
      this.search_time = setTimeout(async () => {
        await store.dispatch("callCities", val);
        this.items = store.getters.getCities;
        this.loading = false;
      }, 1500);
    },
    cityWeather(val) {
      store.dispatch("callCityWeather", val);
    },
    getDialogValue(value) {
      this.addCityDialog = value;
    },
    getCityForecast(val) {
      const data = [];

      data["lon"] = val["lon"];
      data["lat"] = val["lat"];

      store.dispatch("callCityForecast", data);
    },

    deleteCity(value) {
      store.dispatch("removeFaveCity", value);
    },

    //utility function
    unixTimeConvert(value) {
      var date = new Date(value * 1000);
      return date.toDateString();
    },
    getTimeZone(value) {
      var timezone = this.SelectedForecast.timezone;
      return moment_zone.tz(timezone).format(value);
    },
    getSearchedCityTimezone(value) {
      var timezone = this.SearchedForecast.daily.timezone;
      return moment_zone.tz(timezone).format(value);
    },
  },
};
</script>

<style scoped>
.headline1 {
  font-size: 40px;
}
.headline4 {
  font-size: 14px;
  padding-top: 0%;
  padding-bottom: 0%;
}
</style>
