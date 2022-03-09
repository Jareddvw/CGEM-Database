from django.conf.urls import include
from django.urls import path, re_path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('references', views.ReferenceViewSet, basename='references')
router.register('authors', views.AuthorViewSet, basename='authors')
router.register('single', views.ReactionViewSingle, basename='singleReaction')
router.register('synthetases', views.SynthetaseView, basename='synthetases')
router.register('mutations', views.MutationView, basename='mutations')
router.register('flexizymes', views.FlexizymeView, basename='flexizymes')
router.register('assays', views.AssayView, basename='microhelixAssays')
# note for later: when deleting a reaction, will need to use assay view to also delete the associated assay.


urlpatterns = [
    path('', views.ReactionTableView.as_view(), name='tableContents'),
    path('', include(router.urls)),
]


