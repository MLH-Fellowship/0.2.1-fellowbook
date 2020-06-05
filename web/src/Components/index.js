import axios from "axios";

const apiUrl =
  "https://a5c6y99l3g.execute-api.eu-central-1.amazonaws.com/devv/fellows/list";

export const fetchData = async (accessToken) => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: accessToken,
      },
    });

    return response.data;
  } catch (error) {
    return [];
    console.log(error);
  }
};
