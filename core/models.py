from django.db import models

class User(models.Model):
    ROLES = [
        ('DOCTOR', 'Doctor'),
        ('NURSE', 'Nurse'),
        ('PATIENT', 'Patient'),
    ]
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLES, default='DOCTOR')
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)
    visit_count = models.IntegerField(default=0)

    class Meta:
        db_table = 'users'

class Patient(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    mrn = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    dob = models.DateField()
    gender = models.CharField(max_length=20, null=True, blank=True)
    admission_date = models.DateField(null=True, blank=True)
    ward = models.CharField(max_length=50, null=True, blank=True)
    room = models.CharField(max_length=50, null=True, blank=True)
    diagnosis = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=50, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'patients'

class Assessment(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='assessments', db_column='patient_id')
    date = models.DateTimeField()
    wound_location = models.CharField(max_length=100, null=True, blank=True)
    wound_type = models.CharField(max_length=100, null=True, blank=True)
    wound_stage = models.CharField(max_length=50, null=True, blank=True)
    length_cm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    width_cm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    depth_cm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    pain_level = models.IntegerField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    granulation_pct = models.IntegerField(null=True, blank=True)
    epithelial_pct = models.IntegerField(default=0)
    slough_pct = models.IntegerField(default=0)
    eschar_pct = models.IntegerField(default=0)
    marker_data = models.TextField(null=True, blank=True)
    doctor_suggestion = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=50, null=True, blank=True)
    image_data = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'assessments'

class Alert(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='alerts', db_column='patient_id')
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='alerts', db_column='assessment_id')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'alerts'
