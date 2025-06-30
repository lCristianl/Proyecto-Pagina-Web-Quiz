from django.urls import path
from .views import QuizQuestionsAPIView

urlpatterns = [
    path('quizzes/<int:quiz_id>/questions/', QuizQuestionsAPIView.as_view(), name='quiz-questions'),
]