<template>
  <div class="hello">
    <h3 class="display-4 text-center p-2">Select echange currencies</h3>
    <div class="container">
      <div class="row">
        <div class="col">
          <span class="font-weight-bold pr-1 bigFont" >From</span>
          <select id="selectFrom" @change="fetchCurrentCurrencyRate()"
                v-model="pickedCurrencyFrom" class="selectpicker" data-width="50%"
                data-live-search="true" data-style="btn-primary" data-size="4">
            <option value="" disabled selected>Select</option>
            <option v-for="(_, currency) in currencies" v-bind:key="currency" :value="currency">
              {{ currency }}
            </option>
          </select>
        </div>
        <div class="col">
          <span class="font-weight-bold pr-1 bigFont">to</span>
          <select id="selectTo" @change="fetchCurrentCurrencyRate()"
                v-model="pickedCurrencyTo" class="selectpicker" data-width="50%"
                data-live-search="true" data-style="btn-primary" data-size="4">
            <option value="" disabled selected>Select</option>
            <option v-for="(_, currency) in currencies" v-bind:key="currency" :value="currency">
              {{ currency }}
            </option>
          </select>
        </div>
        <div class="col-5 mb-3 mr-3 border rounded border-secondary container">
          <div class="row">
            <div class="col mt-4">
              <div class="pretty p-switch p-fill">
                <input type="checkbox" @change="handleChange()" v-model="areTrendLinesShown"/>
                <div class="state">
                    <label>Trend lines</label>
                </div>
              </div>
            </div>
            <div class="col-7 p-2">
              <div class="controls readonly-display">
                <ul class="list-unstyled">
                  <li><span class="font-weight-light small">Real time exchange rate</span></li>
                  <li><span class="font-weight-bold">{{realTimeExchangeRate}}</span></li>
                </ul>
              </div>
              <hr/>
              <div class="row float-right m-1">
                <div class="col-sm p-2">
                  <span class="">{{pickedCurrencyFrom}}</span>
                </div>
                <div class="col-sm">
                  <button type="button" class="btn btn-link"  v-on:click="swapCurrencies()">
                    <span class="material-icons">&#xe8d4;</span>
                  </button>
                </div>
                <div class="col-sm p-2">
                  <span class="">{{pickedCurrencyTo}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row m-0 no-gutters">
        <div class="col-11 mb-3 mr-0 p-0">
          <div class="graph">
            <canvas id="currencyChart" class="border  border-primary">
            </canvas>
          </div>
        </div>
        <div class="col">
          <div class="btn-group-vertical float-right" role="group" aria-label="Basic example">
            <button type="button" v-on:click='getCurrencyGraph("12h")'
                class="btn btn-outline-primary mb-4 mr-4">12h</button>
            <button type="button" v-on:click='getCurrencyGraph("1D")'
                class="btn btn-outline-primary mb-4">1D</button>
            <button type="button" v-on:click='getCurrencyGraph("1W")'
                class="btn btn-outline-primary mb-4">1W</button>
            <button type="button" v-on:click='getCurrencyGraph("1M")'
                class="btn btn-outline-primary mb-4">1M</button>
            <button type="button" v-on:click='getCurrencyGraph("1Y")'
                class="btn btn-outline-primary mb-4">1Y</button>
            <button type="button" v-on:click='getCurrencyGraph("2Y")'
                class="btn btn-outline-primary mb-4">2Y</button>
            <button type="button" v-on:click='getCurrencyGraph("5Y")'
                class="btn btn-outline-primary mb-4">5Y</button>
            <button type="button" v-on:click='getCurrencyGraph("10Y")'
                class="btn btn-outline-primary mb-4">10Y</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import currenciesJson from './../../static/currencies.json';
import Graph from './../utils/graph';
/* eslint-env jquery */
const API_KEY_HISTORY = 'G8DZ3D17B1TXD7RU';
const API_KEY_CURRENT = 'L9P96TFKML5W3CYA';


export default {
  name: 'Main',
  data() {
    return {
      realTimeExchangeRate: 0.259754,
      pickedCurrencyFrom: 'EUR',
      pickedCurrencyTo: 'USD',
      currencies: currenciesJson,
      areTrendLinesShown: true,
      jsonData: 0,
      interval: '12h'
    };
  },
  mounted() {
    this.getSampleGraph();
    this.fetchCurrentCurrencyRate();
  },
  methods: {
    handleChange(e) {
      Graph.createCurrencyGraph(this.jsonData, this.interval, this.areTrendLinesShown);
    },
    swapCurrencies() {
      [this.pickedCurrencyFrom, this.pickedCurrencyTo] =
          [this.pickedCurrencyTo, this.pickedCurrencyFrom];
      this.refreshSelects();
      this.fetchCurrentCurrencyRate();
    },
    refreshSelects() {
      $('#selectFrom').val(this.pickedCurrencyFrom);
      $('#selectTo').val(this.pickedCurrencyTo);
      $('#selectFrom').selectpicker('refresh');
      $('#selectTo').selectpicker('refresh');
    },
    fetchCurrentCurrencyRate() {
      // fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${this.pickedCurrencyFrom}&to_currency=${this.pickedCurrencyTo}&apikey=${API_KEY_CURRENT}`)
      //   .then(response => response.json())
      //   .then(json => this.realTimeExchangeRate =
                //(json['Realtime Currency Exchange Rate']['5. Exchange Rate']))
      //   .catch(err => console.log(`Error with your api call ${err}`));
    },
    getCurrencyGraph(interval) {
      let URL = '';
      if(interval === '12h' || interval === '1D' || interval === '1W') {
        let intervalTime;
        if(interval === '12h')
          intervalTime = '5min';
        else if(interval === '1D')
          intervalTime = '15min';
        else
          intervalTime = '60min';
        //URL = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${this.pickedCurrencyFrom}&to_symbol=${this.pickedCurrencyTo}&interval=${intervalTime}&outputsize=full&apikey=${API_KEY_HISTORY}
        URL = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&outputsize=full&apikey=demo`;
      } else if(interval === '1M') {
        //URL = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${this.pickedCurrencyFrom}&to_symbol=${this.pickedCurrencyTo}&outputsize=full&apikey=${API_KEY_HISTORY}
        URL = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&outputsize=full&apikey=demo`;  
      } else if(interval === '1Y') {
        //URL = `https://www.alphavantage.co/query?function=FX_WEEKLY&from_symbol=${this.pickedCurrencyFrom}&to_symbol=${this.pickedCurrencyTo}&apikey=${API_KEY_HISTORY}
        URL = `https://www.alphavantage.co/query?function=FX_WEEKLY&from_symbol=EUR&to_symbol=USD&apikey=demo`;
      } else {
        //URL = `https://www.alphavantage.co/query?function=FX_MONTHLY&from_symbol=${this.pickedCurrencyFrom}&to_symbol=${this.pickedCurrencyTo}&apikey=${API_KEY_HISTORY}
        URL = `https://www.alphavantage.co/query?function=FX_MONTHLY&from_symbol=EUR&to_symbol=USD&apikey=demo`;
      }
      fetch(URL)
      .then(data => data.json())
      .then(json => {
        this.jsonData = json;
        this.interval = interval;
        return Graph.createCurrencyGraph(json, interval, this.areTrendLinesShown);
      })
      .catch(err => console.log(`There was an error with your request.\nError: ${err}`));
    },
    getSampleGraph() {
      fetch(`https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&outputsize=full&apikey=demo`)
      .then(data => data.json())
      .then(json => {
        this.jsonData = json;
        this.interval = '12h';
        return Graph.createCurrencyGraph(json, this.interval, this.areTrendLinesShown);
      })
      .catch(err => console.log(`There was an error with your request.\nError: ${err}`));
    },
  },
};
</script>


<style scoped>
.bigFont {
  font-size: 1em;
}
canvas {
  width: 93.3%;
  height: auto;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
