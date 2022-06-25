from django.core.management import call_command


# create DB backup periodically
def backup():
    try: 
        print('backup created.')
        call_command('dbbackup')
    except:
        pass
