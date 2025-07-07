import { BrowserRouter, Routes, Route} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { CreateQuizPage } from "./pages/CreateQuiz";
import { LoginPage } from "./pages/Login";
import { PlayQuizPage } from "./pages/PlayQuizPage";

function App() {
  return (
    <>
      <BrowserRouter> 
        <Routes>  
          <Route path="/" element={<HomePage/>} />
          <Route path="/create" element={<CreateQuizPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/quiz/:quizId" element={<PlayQuizPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
