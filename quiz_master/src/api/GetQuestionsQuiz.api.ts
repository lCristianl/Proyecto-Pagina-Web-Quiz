import axios from 'axios';

export const getQuestionsQuiz = async (quizId: number) => {
  const response = await axios.get(`http://localhost:8000/api/quizzes/${quizId}/questions/`);
  return response.data;
};