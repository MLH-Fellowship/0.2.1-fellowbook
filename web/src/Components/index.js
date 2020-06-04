import axios from "axios";

const apiUrl =
  "https://a5c6y99l3g.execute-api.eu-central-1.amazonaws.com/devv/fellows/list";
const token = "19301c6083bac73cde74bf4d39fbcd6f79934713";

export const fetchData = async () => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: token,
      },
    });

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
