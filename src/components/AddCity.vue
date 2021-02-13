<template>
  <v-dialog v-model="dialog" persistent max-width="490">
    <v-card>
      <v-card-title class="headline"> Search to add city </v-card-title>
      <v-autocomplete
        class="mx-5"
        v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        item-text="complete"
        item-value="id"
        flat
        hide-no-data
        hide-details
        label="What state are you from?"
        :error="checkDialError"
        outlined
        :no-filter="false"
      ></v-autocomplete>
      <v-card-text v-if="checkDialError" class="red--text"
        >Make sure this field is valid</v-card-text
      >
      <v-card-text
        >You can add city by means of searching. Take note that you can only add
        6 cities at once.</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="closeDialog(false)">
          Cancel
        </v-btn>
        <v-btn color="blue darken-1" text @click="addCity"> Add city </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import store from "../store";
export default {
  name: "AddCity",
  data() {
    return {
      items: [],
      search: null,
      select: null,
      loading: false,
      search_time: null,
      city_search: null,
      checkDialError: false,
    };
  },
  computed: {
    selectedCities() {
      return "list of all cities selected something";
    },
    dialog: {
      get: function () {
        return this.prodialog;
      },
      set: function () {},
    },
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
    },
  },

  props: ["prodialog"],
  methods: {
    querySelections(val) {
      this.search_time = setTimeout(async () => {
        await store.dispatch("callCities", val);
        this.items = store.getters.getCities;
      }, 1000);
    },
    closeDialog(val) {
      this.$emit("dialogValue", val);
      this.dialog = val;
    },
    addCity() {
      if (this.select == null || this.select == "") {
        this.checkDialError = true;
      } else {
        store.dispatch("addFaveCity", this.select);
        this.$emit("dialogValue", false);
        this.items = [];
      }
    },
  },
};
</script>

<style scoped>
</style>