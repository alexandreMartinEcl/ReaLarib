from django.db import models
from django.db.models.deletion import CASCADE, SET_NULL, PROTECT
from datetime import datetime
import json

from django.utils import timezone

from .tools.CustomFields import StateField


class Hospital(models.Model):
    auto_increment_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=False, null=False)
    address = models.CharField(max_length=100, blank=True, null=False, default='')

    def __str__(self):
        return self.name


class User(models.Model):
    aphp_id = models.CharField(primary_key=True, blank=False, null=False, max_length=10)
    first_name = models.CharField(max_length=100, blank=False, null=False)
    family_name = models.CharField(max_length=100, blank=False, null=False)
    email = models.EmailField('email address', max_length=254, unique=True, blank=True, null=False, default='')
    main_hospital = models.ForeignKey(Hospital, related_name='users', on_delete=SET_NULL, blank=True, null=True)
    # Médical, Kiné, Aide soignant, Autre
    title = models.CharField(blank=True, null=True, choices=[('M', 'Médical'), ('K', 'Kinésithérapeute'),
                                                 ('AS', 'Aide soignant'), ('I', 'Infirmier')], max_length=30)

    #  units = models.CharField(blank=False, null=False)
    #  patients = models.CharField(blank=False, null=False)

    #  def set_units(self, array_input=[]):
    #     self.units = json.dump(array_input)

    #  def get_units(self):
    #     return json.loads(self.units)

    #  def set_patients(self, array_input=[]):
    #      self.patients = json.dump(array_input)

    #  def get_patients(self):
    #    return json.loads(self.patients)

    def __str__(self):
        return f"{self.first_name} - {self.family_name} ({self.title}) (Hôpital {self.main_hospital})"


class Unit(models.Model):
    auto_increment_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20, blank=False, null=False)
    hospital = models.ForeignKey(Hospital, on_delete=PROTECT, blank=False, null=False)
    caregivers = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return f"Unité {self.name} (Hôpital {self.hospital})"


class Bed(models.Model):
    auto_increment_id = models.AutoField(primary_key=True)
    unit = models.ForeignKey(Unit, related_name='beds', on_delete=CASCADE, blank=False, null=False)
    # quel numéro ce lit porte dans l'unité
    unit_index = models.IntegerField(blank=False, null=False)
    state = models.CharField(max_length=20, default="usable")

    def __str__(self):
        return f"Lit {self.unit_index} - Unité {self.unit}"


class Patient(models.Model):
    NIP_id = models.CharField(primary_key=True, max_length=20, blank=False, null=False)
    first_name = models.CharField(max_length=100, blank=False, null=False)
    family_name = models.CharField(max_length=100, blank=False, null=False)
    birth_date = models.DateField(blank=True, null=True)
    weight_kg = models.FloatField(blank=True, null=True)
    height_cm = models.FloatField(blank=True, null=True)
    assigned_caregivers = models.ManyToManyField(User, related_name='patients_assigned_to', blank=True)

    # diagnostic
    depistage_covid = models.BooleanField(default=False)
    depistage_orlEntree = models.BooleanField(default=False)
    depistage_ERentree = models.BooleanField(default=False)
    depistage_ERpremierMardi = models.BooleanField(default=False)
    depistage_ERsecondMardi = models.BooleanField(default=False)
    antecedents = models.TextField(blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    severity = models.CharField(max_length=15, choices=[('R', 'à risque'), ('I', 'instable'), ('S', 'stable')], default='stable')
    recent_disease_history = models.TextField(blank=True, null=False, default='')
    evolution = models.TextField(blank=True, null=False, default='')

    pressure_inspired_fraction_ratios = StateField(state_instance=int)
    noradrenaline = StateField(state_instance=float)
    creatinemie = StateField(state_instance=float)
    decubitus_ventral = StateField(state_instance=float)
    ventilatory_mode = StateField(state_choices=['VPC', 'VAC', 'VSAI', 'VS', 'opti', 'CPAP'])
    sedation = StateField(state_instance=str)
    antibiotics = StateField(state_instance=str)
    sample_type = StateField(state_instance=str)
    germs = StateField(state_instance=str)

    # format de antecedents: [{type: string, statut: string}]
    def set_antecedents(self, array_input=None):
        if array_input is None:
            array_input = []
        self.antecedents = json.dumps(array_input)

    def get_antecedents(self):
        return json.loads(self.antecedents)

    # format de allergies: [{type: string, statut: string}]
    def set_allergies(self, array_input=None):
        if array_input is None:
            array_input = []
        self.allergies = json.dumps(array_input)

    def get_allergies(self):
        return json.loads(self.allergies)

    def get_antecedents(self):
        return json.loads(self.antecedents)

    def get_pressure_inspired_fraction_ratios(self):
        return json.loads(self.pressure_inspired_fraction_ratios)

    def get_noradrenaline(self):
        return json.loads(self.noradrenaline)

    def get_creatinemie(self):
        return json.loads(self.creatinemie)

    def get_decubitus_ventral(self):
        return json.loads(self.decubitus_ventral)

    def get_ventilatory_mode(self):
        return json.loads(self.ventilatory_mode)

    def get_state_choices(self):
        return json.loads(self.state_choices)

    def get_sedation(self):
        return json.loads(self.sedation)

    def get_antibiotics(self):
        return json.loads(self.antibiotics)

    def get_sample_type(self):
        return json.loads(self.sample_type)

    def get_germs(self):
        return json.loads(self.germs)

    def __str__(self):
        return f"{str(self.first_name).title()} {str(self.family_name).title()} ({str(self.birth_date)})"


class Task(models.Model):
    auto_increment_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, related_name='tasks', on_delete=CASCADE, blank=False, null=False)
    creator = models.ForeignKey(User, related_name='tasks_created', on_delete=PROTECT, blank=False, null=False)
    created_date = models.DateTimeField(default=timezone.now)
    assigned_caregivers = models.ManyToManyField(User, related_name='tasks_assigned', blank=True)
    content = models.TextField(blank=False, null=False)
    is_done = models.BooleanField(default=False)
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.content}"


class UnitStay(models.Model):
    auto_increment_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, related_name='beds', on_delete=CASCADE, blank=False, null=False)
    bed = models.ForeignKey(Bed, related_name='stays', on_delete=PROTECT, blank=False, null=False)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        date_format = '%d-%m-%Y'
        if self.is_finished():
            date_info = 'entre le ' + self.start_date.strftime(date_format) \
                        + ' et le ' + self.end_date.strftime(date_format)
        else:
            date_info = 'depuis le ' + self.start_date.strftime(date_format)
        return f"Patient {str(self.patient)}, {str(self.bed.unit)} ({date_info})"

    def is_finished(self):
        return self.end_date and self.end_date < datetime.now()
