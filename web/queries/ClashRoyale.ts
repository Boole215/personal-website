import * as constants from "./constants";

export async function getMyRoyaleData() {
  const queryUrl = constants.API_URL + "/clashroyale";
  try {
    const response = await fetch(queryUrl).then((res) => res.json());
    return response;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
}

export async function getRoyaleClanData(clantag: string) {
  const queryUrl = constants.API_URL + "/royaleclan/?clantag=" + clantag;
  const response = await fetch(queryUrl).then((res) => res.json());
  return response;
}
