import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

const apiCall = {
    url: 'http://127.0.0.1:8000',
    fetchCities: function (city) {
        const call = axios({
            method: 'get',
            url: this.url + '/api/listofcities/',
            headers: {
                'Content-Type': ' application/json'
            },
            params: { city: city }
        }).then((response) => {
            return response
        }).catch(error => {
            if (error) {
                if (error.response) {
                    return error.response
                } else {
                    return error
                }
            }
        });
        return call
    },
    fetchCityWeather: function (city_id) {
        const call = axios({
            method: 'get',
            url: this.url + '/api/currentweather/',
            headers: {
                'Content-Type': ' application/json'
            },
            params: { city_id: city_id }
        }).then((response) => {
            return response
        }).catch(error => {
            if (error) {
                if (error.response) {
                    return error.response
                } else {
                    return error
                }
            }
        });
        return call
    },
    fetchSubWeather: function (city_id) {
        const call = axios({
            method: 'get',
            url: this.url + '/api/subweather/',
            headers: {
                'Content-Type': ' application/json'
            },
            params: { city_id: city_id }
        }).then((response) => {
            return response
        }).catch(error => {
            if (error) {
                if (error.response) {
                    return error.response
                } else {
                    return error
                }
            }
        });
        return call
    },
    fetchJapanForecast: function () {
        const call = axios({
            method: 'get',
            url: this.url + '/api/japanforecast/',
            headers: {
                'Content-Type': ' application/json'
            },
        }).then((response) => {
            return response
        }).catch(error => {
            if (error) {
                if (error.response) {
                    return error.response
                } else {
                    return error
                }
            }
        });
        return call
    },

    fetchSelectedCityForecast: function(data){
        const call = axios({
            method: 'get',
            url: this.url + '/api/forecast7days/',
            headers: {
                'Content-Type': ' application/json'
            },
            params:{
                lon:data['lon'],
                lat:data['lat']
            }
        }).then((response) => {
            return response
        }).catch(error => {
            if (error) {
                if (error.response) {
                    return error.response
                } else {
                    return error
                }
            }
        });
        return call
    }
}

const main = {
    state: {
        sample: 'sample bitch',
        cities: [],
        cityWeather: null,
        japanForecast: [],
        faveCity: [],
        selectedCityForecast:null
    },
    mutations: {
        setCities: function (state, data) {
            state.cities = data;
        },
        setCityWeather: function (state, data) {
            state.cityWeather = data;
        },
        setJapanForecast: function (state, data) {
            state.japanForecast = data;
        },
        setFaveCity: function (state, data) {
            switch (data['kind']) {
                case 'add':

                    for (var i = 0; i < state.faveCity.length; i++) {
                        if (state.faveCity[i].id === data["city_id"]) {
                            state.faveCity.splice(i, 1);
                        }
                    }
                    state.faveCity.push({
                        id: data['city_id'],
                        details: data['details']
                    })
                    break;
                case 'remove':
                    for (var c = 0; c < state.faveCity.length; c++) {
                        if (state.faveCity[c].id === data["city_id"]) {
                            state.faveCity.splice(c, 1);
                        }
                    }
                    break;
                case 'replace':
                    state.faveCity.splice(state.faveCity.indexOf(data['city_id']), 1);
                    state.faveCity.push(data['city_id'])
                    break;
                case 'clear':
                    // code block
                    break;
                default:
                // code block
            }
        },
        setSelectedCityForecast: function(state, data){
            state.selectedCityForecast = data
        }
    },
    actions: {
        callCities: async function (context, city) {
            const call = await apiCall.fetchCities(city);
            context.commit("setCities", call.data)
        },
        clearCities: function (context) {
            context.commit("setCities", [])
        },
        callCityWeather: async function (context, city_id) {
            const call = await apiCall.fetchCityWeather(city_id);
            context.commit("setCityWeather", call.data)
        },
        callJapanForecast: async function (context) {
            const call = await apiCall.fetchJapanForecast();
            context.commit("setJapanForecast", call.data)
        },

        //faorite City here

        addFaveCity: async function (context, city_id) {
            const call = await apiCall.fetchSubWeather(city_id);
            context.commit("setFaveCity", { city_id: city_id, details: call.data, kind: 'add' })
        },

        removeFaveCity: async function (context, city_id) {
            context.commit("setFaveCity", { city_id: city_id, kind: 'remove' })
        },

        //Selected City

        callCityForecast: async function(context, data){
            const call = await apiCall.fetchSelectedCityForecast(data);
            context.commit("setSelectedCityForecast", call.data)
        }


    },
    getters: {
        getSample: function (state) {
            return state.sample;
        },
        getCities: function (state) {
            return state.cities;
        },
        getJapanForecast: function (state) {
            return state.japanForecast;
        },
        getFavorteForecast: function (state) {
            return state.faveCity
        },
        getSelectedCityForecast: function (state) {
            return state.selectedCityForecast
        },
        getCityWeather:function(state){
            return state.cityWeather
        }
    }
}

Vue.use(Vuex);


const store = new Vuex.Store({
    state: {},
    modules: {
        main: main
    }
})

export default store