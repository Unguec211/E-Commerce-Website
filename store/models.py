from decimal import Decimal

from django.db import models


class Collection(models.Model):
    name = models.CharField(max_length=80, unique=True)
    text = models.CharField(max_length=160)
    image = models.URLField(max_length=500)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    sku = models.SlugField(max_length=80, unique=True)
    name = models.CharField(max_length=120)
    category = models.CharField(max_length=80)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=Decimal("0.0"))
    tag = models.CharField(max_length=40, blank=True)
    image = models.CharField(max_length=500)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name


class Order(models.Model):
    order_number = models.CharField(max_length=24, unique=True)
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80)
    email = models.EmailField()
    address = models.CharField(max_length=240)
    city = models.CharField(max_length=120)
    zip = models.CharField(max_length=20)
    delivery = models.CharField(max_length=40)
    payment = models.CharField(max_length=80)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=4, default=Decimal("0.0000"))
    shipping = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL)
    product_sku = models.CharField(max_length=80)
    product_name = models.CharField(max_length=120)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField()
    line_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"
