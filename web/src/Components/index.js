import axios from "axios";

const apiUrl =
  "https://a5c6y99l3g.execute-api.eu-central-1.amazonaws.com/devv/fellows/list";
const token = "f7915df19de9abe0580de9aff357e9063c4e6093";

export const fetchData = async () => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
