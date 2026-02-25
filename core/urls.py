from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('api/register', views.register),
    path('api/login', views.login),
    path('api/users', views.get_users),
    path('api/users/<int:pk>', views.update_profile),
    
    # Patients
    path('api/patients', views.patient_list),
    path('api/patients/<str:pk>/status', views.update_patient_status),
    
    # Assessments
    path('api/assessments', views.assessment_list),
    path('api/assessments/<str:pk>', views.assessment_detail),
    
    # Alerts
    path('api/alerts', views.alert_list),
    path('api/alerts/read-all', views.mark_all_alerts_read),
    path('api/alerts/<int:pk>/read', views.mark_alert_read),
]
