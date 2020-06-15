import axios from "axios";

const apiUrl =
  "https://ld48eii9kk.execute-api.eu-central-1.amazonaws.com/dev/fellows";

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
