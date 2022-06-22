from django.core.management import call_command


# create DB backup periodically
def backup():
    try: 
        call_command('dbbackup')
    except:
        pass
