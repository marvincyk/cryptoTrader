import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.SWYFTX_TOKEN;

const BASE_URL = "https://api.demo.swyftx.com.au";

/* GET request to Swyftx API for account balances. */
export const getBalances = async () => {
  const endpoint = BASE_URL + "/user/balance/";
  return fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};

/* GET request to Swyftx API for current mid price of the asset. */
export const getMarketPrice = async () => {
  // 1 = AUD; 3 = BTC; 36 = USD
  const endpoint = BASE_URL + "/live-rates/36/";
  const rates = await fetch(endpoint).then((res) => res.json());
  return rates["3"]["midPrice"];
};

/*
  1. Calculate amount to sell.
  2. POST request to Swyftx API to do a SELL operation.
*/
export const placeSellOrder = async () => {
  const balances = await getBalances();
  const BTC = balances.find((asset) => asset.assetId === 3).availableBalance;
  const sellAmount = 0.5 * BTC;

  const endpoint = BASE_URL + "/orders/";
  const order = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      primary: "USD",
      secondary: "BTC",
      quantity: sellAmount,
      assetQuantity: "BTC",
      orderType: 2,
    }),
  }).then((res) => res.json());
  return order.order.rate;
};

/*
  1. Calculate amount to buy.
  2. POST request to Swyftx API to do a BUY operation.
*/
export const placeBuyOrder = async () => {
  const balances = await getBalances();
  const USD = balances.find((asset) => asset.assetId === 36).availableBalance;
  const buyAmount = 0.5 * USD;

  const endpoint = BASE_URL + "/orders/";
  const order = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      primary: "USD",
      secondary: "BTC",
      quantity: buyAmount,
      assetQuantity: "USD",
      orderType: 1,
    }),
  }).then((res) => res.json());
  return order.order.rate;
};
