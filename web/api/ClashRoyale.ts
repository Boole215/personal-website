const BASEURL: string = "https://api.clashroyale.com/v1/";
const PLAYERTAG: string = "%23UL88G0YGU";
const APITOKEN: string = process.env.CLASH_ROYALE_KEY;
const HEADERS = {
  authorization: "Bearer " + APITOKEN,
};

export default class ClashRoyaleAPI {
  static async getPlayerInformation(): object {
    const requestURL = BASEURL + "players/" + PLAYERTAG;
    const playerInfo: object = await fetch(requestURL, {
      headers: HEADERS,
    }).then((res) => res.json());

    return playerInfo;
  }

  static async getClanInformation(clantag: string): object {
    const requestURL = `${BASEURL}clans/${encodeURIComponent(clantag)}/members`;
    const clanInfo: object = await fetch(requestURL, { headers: HEADERS }).then(
      async (res) => {
        switch (res.status) {
          case 200:
            return await res.json();
            break;
          case 404:
            throw "Invalid Clantag";
            break;
          default:
            throw await res.json()?.reason;
        }
      },
    );
    return clanInfo;
  }
}
