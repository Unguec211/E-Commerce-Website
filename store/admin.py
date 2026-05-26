from django.contrib import admin

from .models import Collection, Order, OrderItem, Product


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ("name", "sort_order")
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "rating", "is_active")
    list_filter = ("category", "is_active")
    search_fields = ("name", "category", "tag")


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product_name", "unit_price", "quantity", "line_total")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_number", "email", "total", "created_at")
    list_filter = ("delivery", "payment", "created_at")
    search_fields = ("order_number", "email", "first_name", "last_name")
    inlines = [OrderItemInline]
