import { createRequestHandler } from "@remix-run/express";
import express from "express";
import cors from "cors";
import redis from "redis";

import * as build from "./build/index.js";

import ClashRoyaleAPI from "./api/ClashRoyale.ts";
import makeClashStruct from "./models/ClashData.ts";

const CLASHDATA = "clashroyaledata"

const app = express();
const api = express();
api.use(cors());

let redisClient;
// Starts Redis on port 6379
(async () => {
    redisClient = process.env.DOCKER == "true" ? redis.createClient({
	url: 'redis://redis:6379'
    }) : redis.createClient();

    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
})();

app.use(express.static("public"));

app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});

// Get real IP even when behind proxy
api.set("trust proxy", true);

api.get("/api/clashroyale", async (req, res) => {
    let response;
    let isCached = false;

    try {
	const cachedResponse = await redisClient.get(CLASHDATA);
	if(cachedResponse){
	    isCached = true;
	    response = JSON.parse(cachedResponse);
	} else {
	    response = await ClashRoyaleAPI.getPlayerInformation().then(res => makeClashStruct(res));	    
	    if (response.length == 0) {
		throw "API returned an empty array"
	    }
	    await redisClient.set(CLASHDATA, JSON.stringify(response), {
		EX: 180,
		NX: true,
	    });
	}
	res.send({fromCache: isCached,
		  ...response,
		 });
    } catch (error) {
	console.log(`Error: ${error}`)
	res.send({status: 403})
    }
    return;
});

api.get("/lastfm", (req, res) => {
  return res.send("Received a LastFM GET request");
});

api.get("/clashofclans", (req, res) => {
  return res.send(
    `Received a Clash of Clans GET request ${req.socket.remoteAddress}`,
  );
});

api.listen(3001, "localhost", () => {
  console.log("APIs are listening on port 3001");
});
