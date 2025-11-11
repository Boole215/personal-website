import { createRequestHandler } from "@remix-run/express";
import express from "express";
import cors from "cors";
import redis from "redis";
import dotenv from "dotenv";
dotenv.config();
import * as build from "./build/index.js";

import ClashRoyaleAPI from "./api/ClashRoyale.ts";
import LastfmAPI from "./api/LastFM.ts";
import {
  makeClashRoyaleClanMembers,
  makeClashRoyalePlayer,
} from "./models/ClashData.ts";

const CLASHDATA = "clashroyaledata";
const LASTFMDATA = "lastfmdata";
const inProduction = process.env.DOCKER == "true";

const app = express();
const api = express();

if (!inProduction) {
  api.use(cors());
}

let redisClient;

// Starts Redis on port 6379
(async () => {
  redisClient = inProduction
    ? redis.createClient({
        url: "redis://redis:6379",
      })
    : redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

app.use(express.static("public"));

app.all("*", createRequestHandler({ build }));

api.get("/clashroyale", async (req, res) => {
  let response;
  let isCached = false;

  try {
    const cachedResponse = await redisClient.get(CLASHDATA);
    if (cachedResponse) {
      isCached = true;
      response = JSON.parse(cachedResponse);
    } else {
      response = await ClashRoyaleAPI.getPlayerInformation();

      response = await makeClashRoyalePlayer(response);

      if (response.length == 0) {
        throw "API returned an empty array";
      }
      await redisClient.set(CLASHDATA, JSON.stringify(response), {
        EX: 604800,
        NX: true,
      });
    }

    res.send({ fromCache: isCached, ...response });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.send({ status: 403 });
  }
  return;
});

api.get("/royaleclan/", async (req, res) => {
  try {
    let clanMemberInfo = await ClashRoyaleAPI.getClanInformation(
      req.query.clantag,
    );
    clanMemberInfo = await makeClashRoyaleClanMembers(clanMemberInfo);
    return res.json(clanMemberInfo);
  } catch (error) {
    return res.json({ error: error });
  }
});

api.get("/lastfm", async (req, res) => {
  let response;
  let artistResponse;
  let isCached = false;

  try {
    const cachedResponse = await redisClient.get(LASTFMDATA);
    if (cachedResponse) {
      isCached = true;
      response = JSON.parse(cachedResponse);
    } else {
      response = await LastfmAPI.getLatestListens();
      artistResponse = await LastfmAPI.getWeeklyArtists();
      response = { ...response, ...artistResponse };
      await redisClient.set(
        LASTFMDATA,
        JSON.stringify({ ...response, ...artistResponse }),
        {
          EX: 3600,
          NX: true,
        },
      );
    }

    res.send(response);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.send({ status: 403 });
  }
  return;
});

api.get("/clashofclans", (req, res) => {
  return res.send(
    `Received a Clash of Clans GET request ${req.socket.remoteAddress}`,
  );
});

if (inProduction) {
  app.listen(80, () => {
    console.log("App listening on http://localhost:80");
  });
}

api.listen(81, () => {
  console.log("APIs are listening on port 81");
});
