from django.apps import AppConfig

class QuizzConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'quizz'

def ready(self):
    import quizz.signals