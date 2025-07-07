"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, User, Star, ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { getQuestionsQuiz } from "../api/GetQuestionsQuiz.api"
import { getQuizData } from "../api/GetQuizData.api"
import { ClipLoader } from 'react-spinners';

export function PlayQuizPage() {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Otros estados...
  const [gameState, setGameState] = useState<"intro" | "playing" | "finished">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(string | number)[]>([])
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0);

  // 1. Carga datos del quiz y preguntas
  useEffect(() => {
    async function fetchQuizAndQuestions() {
      setLoading(true)
      try {
        // Datos generales del quiz
        const quizRes = await getQuizData(Number(quizId))
        setQuizData(quizRes)

        // Preguntas del quiz
        const questionsRes = await getQuestionsQuiz(Number(quizId))
        setQuestions(questionsRes)
      } catch (error) {
        alert("No se pudo cargar el quiz")
      } finally {
        setLoading(false)
      }
    }
    fetchQuizAndQuestions()
  }, [quizId])

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === "playing") {
      finishQuiz();
    }
    // Si timeLeft es -1, no hace nada (sin límite)
  }, [timeLeft, gameState])

  const startQuiz = () => {
    setGameState("playing");
    setAnswers(new Array(questions.length).fill(""));
    if (quizData.time_limit > 0) {
      setTimeLeft(quizData.time_limit * 60);
    } else {
      setTimeLeft(-1); // Usar -1 para indicar "sin límite"
    }
  }

  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishQuiz()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const finishQuiz = () => {
    // Calcular puntuación
    let totalScore = 0
    questions.forEach((question, index) => {
      const userAnswer = answers[index]
      if (question.question_type === "short-answer" || "true-false") {
        if (userAnswer?.toString().toLowerCase() === question.correct_answer.toString().toLowerCase()) {
          totalScore += question.points
        }
      } else {
        if (Number(userAnswer) === Number(question.correct_answer)) {
          totalScore += question.points
        }
      }
    })
    setScore(totalScore)
    setGameState("finished")
  }

  const restartQuiz = () => {
    setGameState("intro")
    setCurrentQuestion(0)
    setAnswers([])
    setTimeLeft(quizData.time_limit * 60)
    setScore(0)
    setShowResults(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScorePercentage = () => {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
    return Math.round((score / totalPoints) * 100)
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) return <div className="flex flex-col items-center justify-center h-screen"><ClipLoader color="#1400ff" size={80} /><h2 className="mt-4 text-2xl font-semibold text-gray-700">Cargando...</h2></div>;
  if (!quizData) return <div>No se encontró el quiz.</div>;

  // Intro Screen
  if (gameState === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver al inicio
              </Link>
            </div>

            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Trophy className="h-16 w-16 text-indigo-600" />
                </div>
                <CardTitle className="text-3xl">{quizData.title}</CardTitle>
                <CardDescription className="text-lg">{quizData.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <p className="font-semibold">{quizData.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Creador</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="font-semibold">{quizData.rating}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Calificación</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="font-medium">Preguntas:</span>
                    <Badge>{questions.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <span className="font-medium">Dificultad:</span>
                    <Badge variant="secondary">{quizData.difficulty}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="font-medium">Tiempo límite:</span>
                    <Badge variant="outline">
                      <Clock className="h-4 w-4 mr-1" />
                      {quizData.time_limit} min
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="font-medium">Jugadas:</span>
                    <Badge variant="outline">{quizData.plays.toLocaleString()}</Badge>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button size="lg" onClick={startQuiz} className="w-full">
                    Comenzar Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Playing Screen
  if (gameState === "playing") {
    const currentQ = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header with timer and progress */}
        <div className="bg-white dark:bg-gray-800 border-b p-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">{quizData.title}</h1>
              <div className="flex items-center space-x-4">
                {quizData.time_limit > 0 && (
                  <div className="flex items-center text-red-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                  </div>
                )}
                <Badge variant="outline">
                  {currentQuestion + 1} de {questions.length}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Pregunta {currentQuestion + 1}</CardTitle>
                <CardDescription className="text-lg">{currentQ.question_text}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Multiple Choice */}
                {currentQ.question_type === "multiple-choice" && (
                  <RadioGroup
                    value={answers[currentQuestion]?.toString()}
                    onValueChange={(value) => handleAnswer(Number.parseInt(value))}
                  >
                    {currentQ.options?.map((option: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {/* True/False */}
                {currentQ.question_type === "true-false" && (
                  <RadioGroup
                    value={answers[currentQuestion]?.toString() || ""}
                    onValueChange={(value) => handleAnswer(value)}
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800">
                      <RadioGroupItem value="true" id="true" />
                      <Label htmlFor="true" className="flex-1 cursor-pointer">
                        Verdadero
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800">
                      <RadioGroupItem value="false" id="false" />
                      <Label htmlFor="false" className="flex-1 cursor-pointer">
                        Falso
                      </Label>
                    </div>
                  </RadioGroup>
                )}

                {/* Short Answer */}
                {currentQ.question_type === "short-answer" && (
                  <div className="space-y-2">
                    <Label>Tu respuesta:</Label>
                    <Input
                      placeholder="Escribe tu respuesta..."
                      value={answers[currentQuestion]?.toString() || ""}
                      onChange={(e) => handleAnswer(e.target.value)}
                    />
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                  <Button onClick={nextQuestion} disabled={!answers[currentQuestion] && answers[currentQuestion] !== 0}>
                    {currentQuestion === questions.length - 1 ? "Finalizar" : "Siguiente"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Results Screen
  if (gameState === "finished") {
    const percentage = getScorePercentage()
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Trophy className={`h-16 w-16 ${getScoreColor(percentage)}`} />
                </div>
                <CardTitle className="text-3xl">¡Quiz Completado!</CardTitle>
                <CardDescription>Has terminado "{quizData.title}"</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(percentage)} mb-2`}>{percentage}%</div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {score} de {totalPoints} puntos
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Preguntas</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {
                        questions.filter((q, i) => {
                          const userAnswer = answers[i]
                          if (q.question_type === "short-answer" || "true-false") {
                            return userAnswer?.toString().toLowerCase() === q.correct_answer.toString().toLowerCase()
                          }
                          return Number(userAnswer) === Number(q.correct_answer)
                        }).length
                      }
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Correctas</p>
                  </div>
                </div>

                {!showResults && (
                  <div className="text-center">
                    <Button onClick={() => setShowResults(true)} variant="outline">
                      Ver Respuestas Detalladas
                    </Button>
                  </div>
                )}

                {showResults && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Revisión de Respuestas</h3>
                    {questions.map((question, index) => {
                      const userAnswer = answers[index]
                      const isCorrect =
                        question.question_type === "short-answer" || "true-false"
                          ? userAnswer?.toString().toLowerCase() === question.correct_answer.toString().toLowerCase()
                          : Number(userAnswer) === Number(question.correct_answer)

                      return (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-start space-x-3">
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 mt-1" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium mb-2">{question.question_text}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Tu respuesta:{" "}
                                {question.question_type === "multiple-choice"
                                  ? question.options?.[userAnswer as number] || "Sin respuesta"
                                  : question.question_type === "true-false"
                                    ? userAnswer === "true"
                                      ? "Verdadero"
                                      : userAnswer === "false"
                                        ? "Falso"
                                        : "Sin respuesta"
                                    : userAnswer || "Sin respuesta"}
                              </p>
                              <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                                Respuesta correcta:{" "}
                                {question.question_type === "multiple-choice"
                                  ? question.options?.[question.correct_answer as number]
                                  : question.question_type === "true-false"
                                    ? question.correct_answer === "true"
                                      ? "Verdadero"
                                      : "Falso"
                                    : question.correct_answer}
                              </p>
                              {question.explanation && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                  {question.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button onClick={restartQuiz} variant="outline" className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Jugar de Nuevo
                  </Button>
                  <Link to="/" className="flex-1">
                    <Button className="w-full">Explorar Más Quizzes</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return null
}
