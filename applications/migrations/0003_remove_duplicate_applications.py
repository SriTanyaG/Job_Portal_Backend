# Generated manually to remove duplicates before adding unique constraint

from django.db import migrations

def remove_duplicate_applications(apps, schema_editor):
    Application = apps.get_model('applications', 'Application')
    
    # Find duplicates and keep only the most recent one for each (applicant, job) pair
    seen = {}
    duplicates = []
    
    # Order by applied_at descending to keep the most recent
    applications = Application.objects.all().order_by('applicant_id', 'job_id', '-applied_at')
    
    for app in applications:
        key = (app.applicant_id, app.job_id)
        if key in seen:
            # This is a duplicate, mark for deletion
            duplicates.append(app.id)
        else:
            seen[key] = app.id
    
    # Delete duplicates
    if duplicates:
        Application.objects.filter(id__in=duplicates).delete()

def reverse_remove_duplicates(apps, schema_editor):
    # Cannot reverse this operation
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0002_alter_application_options_application_cover_letter_and_more'),
    ]

    operations = [
        migrations.RunPython(remove_duplicate_applications, reverse_remove_duplicates),
    ]

