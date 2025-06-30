from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from quizz.views import QuizViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # 👈 Import JWT views

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include('quizz.urls')),
    path('api/auth/', include('rest_framework.urls')),
    
    #JWT endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
