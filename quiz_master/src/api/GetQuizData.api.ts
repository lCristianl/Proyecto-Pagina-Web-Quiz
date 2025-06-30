import axios from 'axios';

export const getQuizData = async (quizId: number) => {
  const response = await axios.get(`http://localhost:8000/api/quizzes/${quizId}/`);
  return response.data;
};