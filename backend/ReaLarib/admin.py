from django.contrib import admin

from .models import Bed, Hospital, Patient, Task, Unit, UnitStay, User

admin.site.register(User)
admin.site.register(Hospital)
admin.site.register(Patient)
admin.site.register(Unit)
admin.site.register(UnitStay)
admin.site.register(Bed)
admin.site.register(Task)
