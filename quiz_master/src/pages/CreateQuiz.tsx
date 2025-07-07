"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Trophy, Plus, Trash2, Save, Eye, ArrowLeft, Settings } from "lucide-react"
import { createQuiz } from "@/api/CreateQuiz.api"
import { Link, useNavigate } from "react-router-dom"

interface Question {
  id: number
  question: string
  type: "multiple-choice" | "true-false" | "short-answer"
  options: string[]
  correctAnswer: string | number
  explanation?: string
  points: number
}

interface QuizData {
  title: string
  description: string
  category: string
  difficulty: string
  timeLimit: number
  isPublic: boolean
  allowRetakes: boolean
  showCorrectAnswers: boolean
  questions: Question
}

export function CreateQuizPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [quizData, setQuizData] = useState<QuizData>({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    timeLimit: 0,
    isPublic: true,
    allowRetakes: true,
    showCorrectAnswers: true,
    questions: {
      id: 1,
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      points: 1,
    },
  })

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      points: 1,
    },
  ])

  const [currentQuestion, setCurrentQuestion] = useState(0)

  const addQuestion = () => {
    const newQuestion: Question = {
      id: questions.length + 1,
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      points: 1,
    }
    setQuestions([...questions, newQuestion])
    setCurrentQuestion(questions.length)
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index)
      setQuestions(newQuestions)
      if (currentQuestion >= newQuestions.length) {
        setCurrentQuestion(newQuestions.length - 1)
      }
    }
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
  }

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const handleSave = () => {
    console.log("Guardando quiz:", { quizData, questions })
    alert("Quiz guardado exitosamente!")
  }

  const [token, setToken] = useState(localStorage.getItem('access_token') || '');
  
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    const quizPayload = {
      title: quizData.title,
      description: quizData.description,
      difficulty: quizData.difficulty,
      category: quizData.category,
      is_public: quizData.isPublic,
      allow_retakes: quizData.allowRetakes,
      show_correct_answers: quizData.showCorrectAnswers,
      time_limit: quizData.timeLimit,
      questions: questions.map(q => ({
        question_text: q.question,
        question_type: q.type,
        options: q.type === "multiple-choice" ? q.options.filter(opt => opt.trim() !== "") : null,
        correct_answer: q.correctAnswer,
        points: q.points,
      })),
    };

    try {
      const result = await createQuiz(quizPayload);
      console.log('Quiz creado:', result);
      alert('Quiz creado correctamente');
      navigate("/");
    } catch (error) {
      console.error('Error al crear el quiz:', error);
      alert('Error al crear el quiz');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Borrador
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </Button>
              <Button onClick={handlePublish}>Publicar Quiz</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? "text-indigo-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                1
              </div>
              <span className="ml-2 font-medium">Información Básica</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep >= 2 ? "text-indigo-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Preguntas</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep >= 3 ? "text-indigo-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                3
              </div>
              <span className="ml-2 font-medium">Configuración</span>
            </div>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-indigo-600" />
                Información Básica del Quiz
              </CardTitle>
              <CardDescription>Proporciona los detalles principales de tu quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Quiz *</Label>
                <Input
                  id="title"
                  placeholder="Ej: Historia de México"
                  value={quizData.title}
                  onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe de qué trata tu quiz..."
                  value={quizData.description}
                  onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select
                    value={quizData.category}
                    onValueChange={(value: string) => setQuizData({ ...quizData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="historia">Historia</SelectItem>
                      <SelectItem value="ciencias">Ciencias</SelectItem>
                      <SelectItem value="matematicas">Matemáticas</SelectItem>
                      <SelectItem value="geografia">Geografía</SelectItem>
                      <SelectItem value="literatura">Literatura</SelectItem>
                      <SelectItem value="deportes">Deportes</SelectItem>
                      <SelectItem value="tecnologia">Tecnología</SelectItem>
                      <SelectItem value="arte">Arte</SelectItem>
                      <SelectItem value="musica">Música</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dificultad</Label>
                  <Select
                    value={quizData.difficulty}
                    onValueChange={(value: string) => setQuizData({ ...quizData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona dificultad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fácil">Fácil</SelectItem>
                      <SelectItem value="Intermedio">Intermedio</SelectItem>
                      <SelectItem value="Avanzado">Avanzado</SelectItem>
                      <SelectItem value="Experto">Experto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep(2)}>Siguiente: Agregar Preguntas</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Questions */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Questions List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preguntas</CardTitle>
                    <Button onClick={addQuestion} size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Pregunta
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {questions.map((_, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            currentQuestion === index
                              ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                          onClick={() => setCurrentQuestion(index)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Pregunta {index + 1}</span>
                            {questions.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeQuestion(index)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {questions[index].question || "Sin título"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Question Editor */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Pregunta {currentQuestion + 1}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Label>Tipo:</Label>
                        <Select
                          value={questions[currentQuestion]?.type}
                          onValueChange={(value: string) => updateQuestion(currentQuestion, "type", value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">Opción Múltiple</SelectItem>
                            <SelectItem value="true-false">Verdadero/Falso</SelectItem>
                            <SelectItem value="short-answer">Respuesta Corta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Question Text */}
                    <div className="space-y-2">
                      <Label>Pregunta *</Label>
                      <Textarea
                        placeholder="Escribe tu pregunta aquí..."
                        value={questions[currentQuestion]?.question || ""}
                        onChange={(e) => updateQuestion(currentQuestion, "question", e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Multiple Choice Options */}
                    {questions[currentQuestion]?.type === "multiple-choice" && (
                      <div className="space-y-4">
                        <Label>Opciones de Respuesta</Label>
                        <RadioGroup
                          value={questions[currentQuestion]?.correctAnswer?.toString()}
                          onValueChange={(value: string) =>
                            updateQuestion(currentQuestion, "correctAnswer", Number.parseInt(value))
                          }
                        >
                          {questions[currentQuestion]?.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-3">
                              <RadioGroupItem value={optionIndex.toString()} id={`option-${optionIndex}`} />
                              <Input
                                placeholder={`Opción ${optionIndex + 1}`}
                                value={option}
                                onChange={(e) => updateQuestionOption(currentQuestion, optionIndex, e.target.value)}
                                className="flex-1"
                              />
                              <Label htmlFor={`option-${optionIndex}`} className="text-sm text-gray-500">
                                {questions[currentQuestion]?.correctAnswer === optionIndex ? "Correcta" : ""}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {/* True/False Options */}
                    {questions[currentQuestion]?.type === "true-false" && (
                      <div className="space-y-4">
                        <Label>Respuesta Correcta</Label>
                        <RadioGroup
                          value={questions[currentQuestion]?.correctAnswer?.toString()}
                          onValueChange={(value: string) => updateQuestion(currentQuestion, "correctAnswer", value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="true" />
                            <Label htmlFor="true">Verdadero</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="false" />
                            <Label htmlFor="false">Falso</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                    {/* Short Answer */}
                    {questions[currentQuestion]?.type === "short-answer" && (
                      <div className="space-y-2">
                        <Label>Respuesta Correcta</Label>
                        <Input
                          placeholder="Respuesta esperada..."
                          value={questions[currentQuestion]?.correctAnswer?.toString() || ""}
                          onChange={(e) => updateQuestion(currentQuestion, "correctAnswer", e.target.value)}
                        />
                      </div>
                    )}

                    {/* Explanation */}
                    <div className="space-y-2">
                      <Label>Explicación (Opcional)</Label>
                      <Textarea
                        placeholder="Explica por qué esta es la respuesta correcta..."
                        value={questions[currentQuestion]?.explanation || ""}
                        onChange={(e) => updateQuestion(currentQuestion, "explanation", e.target.value)}
                        rows={2}
                      />
                    </div>

                    {/* Points */}
                    <div className="space-y-2">
                      <Label>Puntos</Label>
                      <Select
                        value={questions[currentQuestion]?.points?.toString()}
                        onValueChange={(value: string) => updateQuestion(currentQuestion, "points", Number.parseInt(value))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 punto</SelectItem>
                          <SelectItem value="2">2 puntos</SelectItem>
                          <SelectItem value="3">3 puntos</SelectItem>
                          <SelectItem value="5">5 puntos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Anterior: Información Básica
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>Siguiente: Configuración</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {currentStep === 3 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-6 w-6 mr-2 text-indigo-600" />
                Configuración del Quiz
              </CardTitle>
              <CardDescription>Ajusta las opciones avanzadas de tu quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Límite de Tiempo (minutos)</Label>
                <Select
                  value={quizData.timeLimit.toString()}
                  onValueChange={(value: string) => setQuizData({ ...quizData, timeLimit: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin límite de tiempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sin límite</SelectItem>
                    <SelectItem value="5">5 minutos</SelectItem>
                    <SelectItem value="10">10 minutos</SelectItem>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={quizData.isPublic}
                    onCheckedChange={(checked: boolean | "indeterminate") => setQuizData({ ...quizData, isPublic: checked as boolean })}
                  />
                  <Label htmlFor="isPublic">Quiz público</Label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                  Los quizzes públicos aparecerán en la página principal y podrán ser jugados por cualquier usuario
                </p>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowRetakes"
                    checked={quizData.allowRetakes}
                    onCheckedChange={(checked: boolean | "indeterminate") => setQuizData({ ...quizData, allowRetakes: checked as boolean })}
                  />
                  <Label htmlFor="allowRetakes">Permitir reintentos</Label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                  Los usuarios podrán jugar el quiz múltiples veces
                </p>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showCorrectAnswers"
                    checked={quizData.showCorrectAnswers}
                    onCheckedChange={(checked: boolean | "indeterminate") => setQuizData({ ...quizData, showCorrectAnswers: checked as boolean })}
                  />
                  <Label htmlFor="showCorrectAnswers">Mostrar respuestas correctas</Label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                  Al finalizar, se mostrarán las respuestas correctas y explicaciones
                </p>
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Anterior: Preguntas
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleSave}>
                    Guardar Borrador
                  </Button>
                  <Button onClick={handlePublish}>Publicar Quiz</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
