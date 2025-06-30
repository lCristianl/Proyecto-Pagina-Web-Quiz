from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    bio = models.TextField(blank=True)
    
class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=50)
    difficulty = models.CharField(max_length=20)
    is_public = models.BooleanField(default=True)
    time_limit = models.IntegerField(default=30)
    created_at = models.DateTimeField(auto_now_add=True)
    plays = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question_text = models.TextField()
    question_type = models.CharField(max_length=20)
    options = models.JSONField(blank=True, null=True)
    correct_answer = models.TextField()
    points = models.IntegerField(default=1)
    
    def __str__(self):
        return f"Question {self.id} for {self.quiz.title}"