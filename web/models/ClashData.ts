import util from "util";
const ROYALEPLAYERFIELDS = [
  "name",
  "expLevel",
  "trophies",
  "bestTrophies",
  "wins",
  "losses",
  "clan",
  "currentDeck",
  "donations",
  "donationsReceived",
];

const ROYALECLANFIELDS = [
  "name",
  "clanRank",
  "donations",
  "donationsReceived",
  "trophies",
];

const ROYALECLANDATAFIELDS = [
  "clanRank",
  "donations",
  "donationsReceived",
  "trophies",
];

function clanMemberToGraphjsData(clanMembers: object[]) {
  const nameLabels = clanMembers.map((obj) => obj.name);
  const datasets = ROYALECLANDATAFIELDS.reduce((acc, field) => {
    return {
      ...acc,
      [field]: {
        label: field,
        data: nameLabels.map((name, idx) => clanMembers[idx][field]),
        hoverOffset: 4,
      },
    };
  }, {});
  return { labels: nameLabels, datasets: datasets };
}

export async function makeClashRoyaleClanMembers(apiResponse: object) {
  const clanMemberStruct: object = await apiResponse.items.map(
    (member) =>
      ROYALECLANFIELDS.reduce(
        (fieldData, currentField) => ({
          [currentField]: member[currentField],
          ...fieldData,
        }),
        {},
      ),
    [],
  );
  const graphjsMemberData = clanMemberToGraphjsData(clanMemberStruct);

  // console.log(util.inspect(graphjsMemberData, false, null, true));
  return graphjsMemberData;
}

export async function makeClashRoyalePlayer(apiResponse: object) {
  const clashStruct: object = ROYALEPLAYERFIELDS.reduce(
    (acc, cur) => ({ [cur]: apiResponse[cur], ...acc }),
    {},
  );
  const currentDeck = Object.values(clashStruct.currentDeck).reduce(
    (acc, cur) =>
      acc.concat([
        { name: cur.name, level: cur.level},
      ]),
    [],
  );
  clashStruct["currentDeck"] = currentDeck;


  return clashStruct;
}
