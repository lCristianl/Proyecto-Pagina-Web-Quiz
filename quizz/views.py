from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from .models import Quiz, Question
from .serializer import QuizSerializer, QuestionSerializer

class QuizViewSet(ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def create(self, request, *args, **kwargs):
        # Extrae las preguntas del request
        questions_data = request.data.pop('questions', [])
        # Crea el quiz
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quiz = serializer.save(author=self.request.user)
        # Crea cada pregunta asociada
        for q in questions_data:
            Question.objects.create(
                quiz=quiz,
                question_text=q.get('question_text', ''),
                question_type=q.get('question_type', ''),
                options=q.get('options', []),
                correct_answer=q.get('correct_answer', ''),
                points=q.get('points', 1)
            )
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        popular_quizzes = Quiz.objects.order_by('-plays')[:10]
        return Response(self.get_serializer(popular_quizzes, many=True).data)

class QuizQuestionsAPIView(APIView):
    def get(self, request, quiz_id):
        questions = Question.objects.filter(quiz_id=quiz_id)
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)