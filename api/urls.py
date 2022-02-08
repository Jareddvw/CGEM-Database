from django.urls import path
from . import views

urlpatterns = [
    path('', views.getData),
    path('<int:pk>', views.reactionContents, name='reactionContents'),
    path('<int:pk>/table', views.tableContents, name='tableContents'),
    path('<int:pk>/update', views.updateReactionContents, name='updateContents'),
    path('<int:pk>/delete', views.deleteReactionContents, name='deleteContents')
]


