from django.urls import path
from . import views

urlpatterns = [
    path('', views.getData),
    path('reaction/<int:pk>', views.reactionContents, name='reactionContents'),
    path('table', views.ReactionTableView.as_view(), name='tableContents'),
    path('reaction/<int:pk>/update', views.updateReactionContents, name='updateContents'),
    path('reaction/<int:pk>/delete', views.deleteReactionContents, name='deleteContents')
]


