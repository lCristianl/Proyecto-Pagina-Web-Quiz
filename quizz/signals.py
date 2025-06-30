from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Question, Quiz

@receiver(post_save, sender=Question)
@receiver(post_delete, sender=Question)
def update_questions_count(sender, instance, **kwargs):
    quiz = instance.quiz
    quiz.questions = quiz.question_set.count()
    quiz.save()
