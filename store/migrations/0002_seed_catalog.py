from decimal import Decimal

from django.db import migrations


PRODUCTS = [
    ("linen-throw", "Washed Linen Throw", "Home", Decimal("68.00"), Decimal("4.8"), "New", "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80", 1),
    ("ceramic-mug", "Speckled Ceramic Mug", "Kitchen", Decimal("24.00"), Decimal("4.7"), "Best seller", "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80", 2),
    ("canvas-tote", "Canvas Market Tote", "Carry", Decimal("42.00"), Decimal("4.6"), "Organic", "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80", 3),
    ("walnut-tray", "Walnut Catchall Tray", "Desk", Decimal("54.00"), Decimal("4.9"), "Handmade", "https://images.unsplash.com/photo-1513519683267-4ee6761728ac?auto=format&fit=crop&w=900&q=80", 4),
    ("amber-candle", "Amber Woods Candle", "Home", Decimal("32.00"), Decimal("4.5"), "Soy wax", "/static/images/amber-woods-candle.svg", 5),
    ("steel-bottle", "Insulated Steel Bottle", "Carry", Decimal("38.00"), Decimal("4.4"), "Leakproof", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80", 6),
    ("desk-lamp", "Pivot Desk Lamp", "Desk", Decimal("96.00"), Decimal("4.8"), "LED", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80", 7),
    ("glass-carafe", "Ribbed Glass Carafe", "Kitchen", Decimal("46.00"), Decimal("4.3"), "Limited", "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=80", 8),
]

COLLECTIONS = [
    ("Home", "Soft textiles and warm light", "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1000&q=80", 1),
    ("Kitchen", "Everyday pieces for better rituals", "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1000&q=80", 2),
    ("Desk", "Objects that keep work grounded", "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80", 3),
]


def seed_catalog(apps, schema_editor):
    Product = apps.get_model("store", "Product")
    Collection = apps.get_model("store", "Collection")
    for sku, name, category, price, rating, tag, image, sort_order in PRODUCTS:
        Product.objects.update_or_create(
            sku=sku,
            defaults={
                "name": name,
                "category": category,
                "price": price,
                "rating": rating,
                "tag": tag,
                "image": image,
                "sort_order": sort_order,
                "is_active": True,
            },
        )
    for name, text, image, sort_order in COLLECTIONS:
        Collection.objects.update_or_create(
            name=name,
            defaults={"text": text, "image": image, "sort_order": sort_order},
        )


class Migration(migrations.Migration):
    dependencies = [("store", "0001_initial")]

    operations = [migrations.RunPython(seed_catalog, migrations.RunPython.noop)]
