from django.conf.urls import include
from django.urls import path, re_path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('references', views.ReferenceViewSet, basename='references')
router.register('authors', views.AuthorViewSet, basename='authors')


urlpatterns = [
    path('', views.ReactionTableView.as_view(), name='tableContents'),
    path('reaction/<int:pk>', views.reactionContents, name='reactionContents'),
    path('reaction/<int:pk>/update', views.updateReactionContents, name='updateContents'),
    path('reaction/<int:pk>/delete', views.deleteReactionContents, name='deleteContents'),
    path('', include(router.urls))
]


