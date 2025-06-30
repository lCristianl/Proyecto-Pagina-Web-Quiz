import { api } from "./RefreshToken.api";

export const createQuiz = async (quizData: any) => {
  const response = await api.post("quizzes/", quizData);
  return response.data;
};