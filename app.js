import { getMarketPrice } from "./api.js";
import { placeSellOrder, placeBuyOrder } from "./api.js";

let isBuyMode = true;

const UPWARD_TREND_THRESHOLD = 1.0;
const DIP_THRESHOLD = -3.25;

const PROFIT_THRESHOLD = 0.65;
const STOP_LOSS_THRESHOLD = -3.0;

let lastOrderPrice = 1.160234;

const buy = async (percentageDiff) => {
  if (
    percentageDiff >= UPWARD_TREND_THRESHOLD ||
    percentageDiff <= DIP_THRESHOLD
  ) {
    lastOrderPrice = await placeBuyOrder();
    console.log(`[BUY] Bought XRP at price ${lastOrderPrice}`);
    isBuyMode = false;
  }
};

const sell = async (percentageDiff) => {
  if (
    percentageDiff >= PROFIT_THRESHOLD ||
    percentageDiff <= STOP_LOSS_THRESHOLD
  ) {
    lastOrderPrice = await placeSellOrder();
    console.log(`[SELL] Sold XRP at price ${lastOrderPrice}`);
    isBuyMode = true;
  }
};

const trade = async () => {
  const currentPrice = await getMarketPrice();
  const percentageDiff =
    ((currentPrice - lastOrderPrice) / lastOrderPrice) * 100;
  console.log(`[CURRENT PRICE] ${currentPrice}`);
  console.log(`[LAST ORDER PRICE] ${lastOrderPrice}`);
  console.log(`[PERCENTAGE DIFF] ${percentageDiff}%\n`);
  if (isBuyMode) {
    await buy(percentageDiff);
  } else {
    await sell(percentageDiff);
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const printDateTime = () => {
  const today = new Date();

  const yyyy = `${today.getFullYear()}`.padStart(2, "0");
  const mm = `${today.getMonth() + 1}`.padStart(2, "0");
  const dd = `${today.getDate()}`.padStart(2, "0");
  const date = `${yyyy}-${mm}-${dd}`;

  const hh = `${today.getHours()}`.padStart(2, "0");
  const min = `${today.getMinutes()}`.padStart(2, "0");
  const sec = `${today.getSeconds()}`.padStart(2, "0");
  const time = `${hh}:${min}:${sec}`;

  const dateTime = `==========${date} ${time}==========\n`;
  console.log(dateTime);
};

const start = async () => {
  while (true) {
    printDateTime();
    await trade();
    await sleep(30000);
  }
};

start();
