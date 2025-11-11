import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getMyRoyaleData } from "queries/ClashRoyale";
import { getMyLastFmData } from "queries/LastFm";
export const meta: MetaFunction = () => {
  return [
    { title: "Jshoukai" },
    { name: "Johan's Website", content: "Welcome to my personal site!" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Jshoukai" },
    { property: "og:description", content: "Johan's Personal Website" },
    { property: "og:url", content: "http://jshoukai.com/" },
    { property: "og:image", content: "http://jshoukai.com/favicon.ico" },
  ];
};

export async function loader() {
  const myRoyaleData = await getMyRoyaleData();
  const myLastFmData = await getMyLastFmData();

  return {
    royaleData: myRoyaleData,
    lastFmData: {
      track: myLastFmData?.recenttracks?.track,
      artist: myLastFmData?.topartists?.artist,
    },
  };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 style={{ marginBottom: "0px", textAlign: "center" }}>
        The Personal Website of <i>Johan A. Ortega-Rios</i>
      </h1>
      <h3 style={{ textAlign: "center" }}>
        <i>
          <u>Software Engineer</u> &nbsp; <u>Civic Technologist</u> &nbsp; <u>Glitch Artist</u>
        </i>
      </h3>
      <p>
        Hi! I'm Johan. I've done a variety of work ranging from software solutions to optimize warehouse workflows, a <a href="https://github.com/IRS-Public/fact-graph">programming language</a> designed for modelling the tax code, to
  developing the U.S. government's premier tax filing tool -- <a href="https://github.com/IRS-Public/direct-file">Direct File</a>.
      </p>
      <p>
	I'm  passionate about taking complex problems and modelling them
	simply and intuitively through code.
      </p>
      <p>
	I am open to full-time and part-time roles -- you can access my resume <a>here</a>.
      </p>
      <p> If you'd like to get to know me a little more, here's some info updated live!</p>
      <h2 style={{ marginBottom: "0px" }}>What I'm Listening To </h2>
      <h4 style={{ marginTop: "0px" }}> Recently </h4>
      <ol style={{ columns: 2 }}>
        {data.lastFmData.track ? (
          data.lastFmData.track.map((track) => (
            <li>
              {track.artist["#text"]} - {track.name}
              {track["@attr"]?.nowplaying == "true"
                ? " ~Listening now!~"
                : null}
            </li>
          ))
        ) : (
          <p>
            Looks like I'm running into API issues right now. Try again later,
            or contact me and let me know!{" "}
          </p>
        )}
      </ol>
      <h4 style={{ marginTop: "0px" }}> Top Artists </h4>
      <ol style={{ columns: 2 }}>
        {data.lastFmData.artist ? (
          data.lastFmData.artist.map((artist) => (
            <li>
              {artist.name} - {artist.playcount} plays
            </li>
          ))
        ) : (
          <p>
            Looks like I'm running into API issues right now. Try again later,
            or contact me and let me know!
          </p>
        )}
      </ol>

      <h2> My current deck on Clash Royale</h2>
      {data.royaleData?.currentDeck && data?.royaleData?.clan ? (
        <div>
          <ul
            style={{
              alignItems: "center",
              columns: 2,
              paddingLeft: "10%",
              paddingRight: "10%",
            }}
          >
            {data.royaleData.currentDeck.map((card) => (
              <li>
                {card.name} ({card.level}){" "}
              </li>
            ))}
          </ul>
          <p>
            Proud member of {data.royaleData.clan.name}. Rocking{" "}
            {data.royaleData.trophies} trophies -- W:{data.royaleData.wins} L:
            {data.royaleData.losses}.
          </p>
        </div>
      ) : (
        <p>
          Looks like I'm running into API issues right now. Try again later, or
          contact me and let me know!
        </p>
      )}
    </div>
  );
}
