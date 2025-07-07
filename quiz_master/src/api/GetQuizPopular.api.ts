import axios from 'axios';

export const getPopularQuizzes = () => {
  return axios.get('http://localhost:8000/api/quizzes/popular/')
}