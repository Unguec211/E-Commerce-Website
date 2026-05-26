from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("api/products/", views.products_api, name="products-api"),
    path("api/collections/", views.collections_api, name="collections-api"),
    path("api/orders/", views.orders_api, name="orders-api"),
]
