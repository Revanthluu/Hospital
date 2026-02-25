from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import User, Patient, Assessment, Alert
from .serializers import UserSerializer, PatientSerializer, AssessmentSerializer, AlertSerializer
import hashlib
import jwt
import datetime
from django.conf import settings
from django.shortcuts import get_object_or_404

# Auth Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    # Map frontend 'password' to 'password_hash' later
    password = data.get('password')
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    user = User.objects.create(
        email=data.get('email'),
        password_hash=hashed_password,
        full_name=data.get('fullName'),
        role=data.get('role', 'DOCTOR')
    )
    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    try:
        user = User.objects.get(email=email, password_hash=hashed_password)
        user.visit_count += 1
        user.last_login = datetime.datetime.now()
        user.save()
        
        token = jwt.encode({
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, settings.SECRET_KEY, algorithm='HS256')
        
        return Response({
            'token': token,
            'user': UserSerializer(user).data
        })
    except User.DoesNotExist:
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
def update_profile(request, pk):
    user = get_object_or_404(User, pk=pk)
    data = request.data
    
    user.full_name = data.get('fullName', user.full_name)
    user.email = data.get('email', user.email)
    
    if data.get('password'):
        user.password_hash = hashlib.sha256(data.get('password').encode()).hexdigest()
    
    user.save()
    return Response({'message': 'Profile updated successfully', 'user': UserSerializer(user).data})

# Patient Views
@api_view(['GET', 'POST'])
def patient_list(request):
    if request.method == 'GET':
        patients = Patient.objects.all().order_by('-created_at')
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        # Hand-mapping since serializers with 'source' are primarily for output/DRF complexity
        # and it's safer to handle the incoming data properly.
        data = request.data
        serializer = PatientSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_patient_status(request, pk):
    patient = get_object_or_404(Patient, pk=pk)
    status_val = request.data.get('status')
    
    if not status_val or status_val not in ['Active', 'Recovered']:
        return Response({'message': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
    patient.status = status_val
    patient.save()
    return Response({'message': 'Patient status updated successfully.', 'status': status_val})

# Assessment Views
@api_view(['GET', 'POST'])
def assessment_list(request):
    if request.method == 'GET':
        # Node.js was excluding image_data in the list view for performance
        assessments = Assessment.objects.all().defer('image_data').order_by('-date')
        # We use a custom response to exclude image data
        serializer = AssessmentSerializer(assessments, many=True)
        data = serializer.data
        for item in data:
            if 'imageData' in item: del item['imageData']
        return Response(data)
    elif request.method == 'POST':
        serializer = AssessmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def assessment_detail(request, pk):
    assessment = get_object_or_404(Assessment, pk=pk)
    serializer = AssessmentSerializer(assessment)
    return Response(serializer.data)

# Alert Views
@api_view(['GET', 'POST'])
def alert_list(request):
    if request.method == 'GET':
        alerts = Alert.objects.all().order_by('-created_at')
        serializer = AlertSerializer(alerts, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = AlertSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def mark_alert_read(request, pk):
    alert = get_object_or_404(Alert, pk=pk)
    alert.is_read = True
    alert.save()
    return Response({'message': 'Alert marked as read'})

@api_view(['PUT'])
def mark_all_alerts_read(request):
    Alert.objects.filter(is_read=False).update(is_read=True)
    return Response({'message': 'All alerts marked as read'})
