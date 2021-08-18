import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.TOKEN;

const BASE_URL = "https://api.swyftx.com.au";

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
