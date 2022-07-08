from django.conf.urls import include
from django.urls import path, re_path
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

router = DefaultRouter()
router.register('references', views.ReferenceViewSet, basename='references')
router.register('single', views.ReactionViewSingle, basename='singleReaction')
router.register('synthetases', views.SynthetaseView, basename='synthetases')
router.register('mutations', views.MutationView, basename='mutations')
router.register('flexizymes', views.FlexizymeView, basename='flexizymes')
router.register('assays', views.AssayView, basename='microhelixAssays')
router.register('organisms', views.OrganismView, basename='organisms')
router.register('drafts', views.ReactionDraftView, basename='reaction_drafts')
router.register('monomers', views.MonomerView, basename='monomers')
router.register('flags', views.FlagView, basename='reaction_flags')
# note for later: when deleting a reaction, will need to use assay view to also delete the associated assay.


urlpatterns = [
    path('', views.ReactionTableView.as_view(), name='tableContents'),
    path('', include(router.urls)),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('myreactions/', views.UserReactionsView.as_view(), name="my_reactions"),
    path('account/', include('account.urls', 'account')),
]


