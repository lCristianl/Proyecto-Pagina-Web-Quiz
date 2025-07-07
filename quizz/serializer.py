# serializers.py
from rest_framework import serializers
from .models import Quiz, Question

class QuizSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    questions_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = '__all__'

    def get_questions_count(self, obj):
        return obj.question_set.count()
    
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'