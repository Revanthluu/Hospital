from rest_framework import serializers
from .models import User, Patient, Assessment, Alert

class UserSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name')
    visitCount = serializers.IntegerField(source='visit_count')
    lastLogin = serializers.DateTimeField(source='last_login', allow_null=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'fullName', 'role', 'created_at', 'lastLogin', 'visitCount']

class PatientSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    admissionDate = serializers.DateField(source='admission_date', allow_null=True)
    
    class Meta:
        model = Patient
        fields = ['id', 'mrn', 'firstName', 'lastName', 'dob', 'gender', 'admissionDate', 'ward', 'room', 'diagnosis', 'status', 'created_at']

class AssessmentSerializer(serializers.ModelSerializer):
    patientId = serializers.PrimaryKeyRelatedField(source='patient', queryset=Patient.objects.all())
    woundLocation = serializers.CharField(source='wound_location', allow_blank=True, allow_null=True)
    woundType = serializers.CharField(source='wound_type', allow_blank=True, allow_null=True)
    woundStage = serializers.CharField(source='wound_stage', allow_blank=True, allow_null=True)
    lengthCm = serializers.DecimalField(source='length_cm', max_digits=5, decimal_places=2, allow_null=True)
    widthCm = serializers.DecimalField(source='width_cm', max_digits=5, decimal_places=2, allow_null=True)
    depthCm = serializers.DecimalField(source='depth_cm', max_digits=5, decimal_places=2, allow_null=True)
    painLevel = serializers.IntegerField(source='pain_level', allow_null=True)
    granulationPct = serializers.IntegerField(source='granulation_pct', allow_null=True)
    epithelialPct = serializers.IntegerField(source='epithelial_pct')
    sloughPct = serializers.IntegerField(source='slough_pct')
    escharPct = serializers.IntegerField(source='eschar_pct')
    markerData = serializers.CharField(source='marker_data', allow_blank=True, allow_null=True)
    doctorSuggestion = serializers.CharField(source='doctor_suggestion', allow_blank=True, allow_null=True)
    imageData = serializers.CharField(source='image_data', allow_blank=True, allow_null=True)
    
    class Meta:
        model = Assessment
        fields = [
            'id', 'patientId', 'date', 'woundLocation', 'woundType', 'woundStage', 
            'lengthCm', 'widthCm', 'depthCm', 'painLevel', 'notes', 
            'granulationPct', 'epithelialPct', 'sloughPct', 'escharPct', 
            'markerData', 'doctorSuggestion', 'status', 'imageData', 'created_at'
        ]

class AlertSerializer(serializers.ModelSerializer):
    patientId = serializers.PrimaryKeyRelatedField(source='patient', queryset=Patient.objects.all())
    assessmentId = serializers.PrimaryKeyRelatedField(source='assessment', queryset=Assessment.objects.all())
    isRead = serializers.BooleanField(source='is_read')
    
    class Meta:
        model = Alert
        fields = ['id', 'patientId', 'assessmentId', 'message', 'isRead', 'created_at']
