import axios from 'axios';

export const getToken = async (username: string, password: string) => {
  const response = await axios.post("http://localhost:8000/api/token/", {
        username,
        password,
      });
  return response.data;
};