import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.TOKEN;

const BASE_URL = "https://api.swyftx.com.au";

export const getBalances = () => {
  const endpoint = BASE_URL + "/user/balance/";
  return fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};
