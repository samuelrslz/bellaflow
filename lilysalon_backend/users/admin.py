from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


# Register your models here.
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
   model = CustomUser
   fieldsets = UserAdmin.fieldsets + (
       ('Role', {'fields': ('role',)}),
   )
   add_fieldsets = UserAdmin.add_fieldsets + (
       ('Role', {'fields': ('role',)}),
   )
