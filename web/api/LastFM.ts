const APIKEY: string = process.env.LAST_FM_KEY;
const BASEURL: string = `http://ws.audioscrobbler.com/2.0/?user=kreitmire&api_key=${APIKEY}&format=json`;

// There is an @attr: { "nowplaying": true} if yuo're listening to it rn
export default class LastfmAPI {
  static async getLatestListens(): object {
    const requestURL = BASEURL + "&method=user.getrecenttracks&limit=9";
    const listenInfo: object = await fetch(requestURL).then((res) =>
      res.json(),
    );
    return listenInfo;
  }

  static async getWeeklyArtists(): object {
      const requestURL = BASEURL + "&method=user.gettopartists&limit=25";
    const artistInfo: object = await fetch(requestURL).then((res) =>
      res.json(),
    );
    return artistInfo;
  }
}
