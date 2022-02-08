from django.urls import path
from . import views

urlpatterns = [
    path('', views.getData),
    path('<int:pk>', views.tableContents, name='reactionTableContents')
]
    

