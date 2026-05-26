from decimal import Decimal

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Collection",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=80, unique=True)),
                ("text", models.CharField(max_length=160)),
                ("image", models.URLField(max_length=500)),
                ("sort_order", models.PositiveIntegerField(default=0)),
            ],
            options={"ordering": ["sort_order", "name"]},
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("sku", models.SlugField(max_length=80, unique=True)),
                ("name", models.CharField(max_length=120)),
                ("category", models.CharField(max_length=80)),
                ("price", models.DecimalField(decimal_places=2, max_digits=8)),
                ("rating", models.DecimalField(decimal_places=1, default=Decimal("0.0"), max_digits=3)),
                ("tag", models.CharField(blank=True, max_length=40)),
                ("image", models.CharField(max_length=500)),
                ("is_active", models.BooleanField(default=True)),
                ("sort_order", models.PositiveIntegerField(default=0)),
            ],
            options={"ordering": ["sort_order", "name"]},
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("order_number", models.CharField(max_length=24, unique=True)),
                ("first_name", models.CharField(max_length=80)),
                ("last_name", models.CharField(max_length=80)),
                ("email", models.EmailField(max_length=254)),
                ("address", models.CharField(max_length=240)),
                ("city", models.CharField(max_length=120)),
                ("zip", models.CharField(max_length=20)),
                ("delivery", models.CharField(max_length=40)),
                ("payment", models.CharField(max_length=80)),
                ("subtotal", models.DecimalField(decimal_places=2, max_digits=10)),
                ("discount", models.DecimalField(decimal_places=4, default=Decimal("0.0000"), max_digits=5)),
                ("shipping", models.DecimalField(decimal_places=2, max_digits=10)),
                ("tax", models.DecimalField(decimal_places=2, max_digits=10)),
                ("total", models.DecimalField(decimal_places=2, max_digits=10)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("product_sku", models.CharField(max_length=80)),
                ("product_name", models.CharField(max_length=120)),
                ("unit_price", models.DecimalField(decimal_places=2, max_digits=8)),
                ("quantity", models.PositiveIntegerField()),
                ("line_total", models.DecimalField(decimal_places=2, max_digits=10)),
                ("order", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="store.order")),
                ("product", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to="store.product")),
            ],
        ),
    ]
