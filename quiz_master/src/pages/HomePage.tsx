import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Play, Trophy, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import { getPopularQuizzes } from "../api/GetQuizPopular.api"
import { useState, useEffect } from "react"

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  author: string;
  rating: number; 
  questions: number;
  plays: number;
  questions_count: number;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Fácil":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Intermedio":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Avanzado":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "Experto":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export function HomePage() {
  const [popularQuizzes, setPopularQuizzes] = useState<Quiz[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));

  useEffect(() => {
    async function loadPopularQuizzes() {
      try {
        const response = await getPopularQuizzes();
        setPopularQuizzes(response.data);
      } catch (error) {
        console.error("Error al cargar quizzes populares", error);
      }
    }
    loadPopularQuizzes();
  }, []);

  useEffect(() => {
    // Escucha cambios en el localStorage (por ejemplo, logout en otra pestaña)
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem("access_token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QuizMaster</h1>
            </div>
            <div className="flex items-center space-x-4">
              {!isLoggedIn && (
                <>
                  <Link to="/login">
                    <Button variant="outline">Iniciar Sesión</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Registrarse</Button>
                  </Link>
                </>
              )}
              {isLoggedIn && (
                <>
                  <Link to="/profile">
                    <Button variant="outline">Mi Perfil</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      localStorage.removeItem("access_token");
                      setIsLoggedIn(false);
                    }}
                  >
                    Cerrar Sesión
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Crea y Juega Quizzes Increíbles</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Desafía tu conocimiento con miles de quizzes creados por la comunidad. Crea tus propios quizzes y comparte
            tu expertise con el mundo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={isLoggedIn ? "/create" : "/login"}>
              <Button size="lg" className="w-full sm:w-auto">
                Crear Quiz
              </Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explorar Quizzes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Quizzes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Quizzes Más Populares</h3>
            <p className="text-gray-600 dark:text-gray-300">Descubre los quizzes favoritos de nuestra comunidad</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                  </div>
                  <CardDescription className="text-sm">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Por: {quiz.author}</span>
                      <span>⭐ {quiz.rating}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{quiz.questions_count} preguntas</span>
                      <span>{quiz.plays.toLocaleString()} jugadas</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link to={`/quiz/${quiz.id}`} className="flex-1">
                        <Button className="w-full" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Jugar
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        Vista Previa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/browse">
              <Button variant="outline" size="lg">
                Ver Todos los Quizzes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="h-6 w-6" />
                <span className="text-xl font-bold">QuizMaster</span>
              </div>
              <p className="text-gray-400">
                La plataforma definitiva para crear y jugar quizzes educativos y divertidos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explorar</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/browse" className="hover:text-white">
                    Todos los Quizzes
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-white">
                    Categorías
                  </Link>
                </li>
                <li>
                  <Link to="/trending" className="hover:text-white">
                    Tendencias
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Crear</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/create" className="hover:text-white">
                    Nuevo Quiz
                  </Link>
                </li>
                <li>
                  <Link to="/templates" className="hover:text-white">
                    Plantillas
                  </Link>
                </li>
                <li>
                  <Link to="/guide" className="hover:text-white">
                    Guía de Creación
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/help" className="hover:text-white">
                    Centro de Ayuda
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white">
                    Acerca de
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QuizMaster. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}