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
            <div class="col">
              <div class="form-check p-1">
                <label>
                  Trend Line
                </label>
                <input type="checkbox" data-onstyle="success" data-offstyle="danger"
                      checked data-toggle="toggle" v-model="areTrendLinesShown">
              </div>
            </div>
            <div class="col-8 p-2">
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
      <div class="row">
        <div class="col-11">
          <div class="graph border border-secondary ">
            <canvas id="currencyChart" class="border  border-primary">
            </canvas>
            <p class="text-center m-2">Historical Exchange Chart</p>
          </div>
        </div>
        <div class="col">
          <div class="btn-group-vertical float-right" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-primary mb-4 mr-2">12h</button>
            <button type="button" class="btn btn-outline-primary mb-4">1D</button>
            <button type="button" class="btn btn-outline-primary mb-4">1W</button>
            <button type="button" class="btn btn-outline-primary mb-4">1M</button>
            <button type="button" class="btn btn-outline-primary mb-4">1Y</button>
            <button type="button" class="btn btn-outline-primary mb-4">2Y</button>
            <button type="button" class="btn btn-outline-primary mb-4">5Y</button>
            <button type="button" class="btn btn-outline-primary mb-4">10Y</button>
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

export default {
  name: 'Main',
  data() {
    return {
      realTimeExchangeRate: 0.259754,
      pickedCurrencyFrom: 'PLN',
      pickedCurrencyTo: 'USD',
      currencies: currenciesJson,
      areTrendLinesShown: true,
    };
  },
  mounted() {
    Graph.createSampleGraph();
    this.fetchCurrentCurrencyRate();
  },
  methods: {
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
      // fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${this.pickedCurrencyFrom}&to_currency=${this.pickedCurrencyTo}&apikey=L9P96TFKML5W3CYA`)
      //   .then(response => response.json())
      //   .then(json => this.realTimeExchangeRate = (json['Realtime Currency Exchange Rate']['5. Exchange Rate']))
      //   .catch(err => console.log(`Error with your api call ${err}`));
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
}
</style>
