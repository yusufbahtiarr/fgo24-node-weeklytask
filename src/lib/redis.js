const { createClient } = require("redis");

const REDIS_ADDRESS = process.env.RDADDRESS;
const REDIS_PASSWORD = process.env.RDPASSWORD;
const REDIS_DB = process.env.RDDB;

let redisUrl = `redis://${REDIS_ADDRESS}`;
if (REDIS_PASSWORD) {
  redisUrl = `redis://:${REDIS_PASSWORD}@${REDIS_ADDRESS}`;
}
if (REDIS_DB && parseInt(REDIS_DB) !== 0) {
  redisUrl += `/${REDIS_DB}`;
}

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("Terhubung ke Redis!");
});

redisClient.on("end", () => {
  console.log("Koneksi Redis terputus.");
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Gagal terhubung ke Redis:", err);
  }
})();

module.exports = redisClient;
