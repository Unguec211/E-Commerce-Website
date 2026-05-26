import json
import uuid
from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .models import Collection, Order, OrderItem, Product


MONEY = Decimal("0.01")
PROMO_CODES = {"NEST10": Decimal("0.10")}


@ensure_csrf_cookie
def index(request):
    return render(request, "store/index.html")


@require_GET
def products_api(request):
    products = Product.objects.filter(is_active=True)
    return JsonResponse(
        {
            "products": [
                {
                    "id": product.sku,
                    "name": product.name,
                    "category": product.category,
                    "price": float(product.price),
                    "rating": float(product.rating),
                    "tag": product.tag,
                    "image": product.image,
                }
                for product in products
            ]
        }
    )


@require_GET
def collections_api(request):
    return JsonResponse(
        {
            "collections": [
                {"name": collection.name, "text": collection.text, "image": collection.image}
                for collection in Collection.objects.all()
            ]
        }
    )


@require_POST
def orders_api(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    customer = payload.get("customer") or {}
    cart = payload.get("cart") or {}
    delivery = str(customer.get("delivery", "standard"))
    promo_code = str(payload.get("promoCode", "")).upper()
    discount = PROMO_CODES.get(promo_code, Decimal("0.00"))

    required = ["firstName", "lastName", "email", "address", "city", "zip"]
    missing = [field for field in required if not str(customer.get(field, "")).strip()]
    if missing:
        return JsonResponse({"error": f"Missing required fields: {', '.join(missing)}."}, status=400)

    order_rows = []
    subtotal = Decimal("0.00")
    products = {product.sku: product for product in Product.objects.filter(sku__in=cart.keys(), is_active=True)}

    for sku, quantity in cart.items():
        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            quantity = 0
        product = products.get(sku)
        if not product or quantity <= 0:
            continue
        line_total = (product.price * quantity).quantize(MONEY)
        subtotal += line_total
        order_rows.append((product, quantity, line_total))

    if not order_rows:
        return JsonResponse({"error": "Add at least one product before checkout."}, status=400)

    discounted_subtotal = (subtotal - subtotal * discount).quantize(MONEY, rounding=ROUND_HALF_UP)
    shipping = _shipping_for(discounted_subtotal, delivery)
    tax = (discounted_subtotal * Decimal("0.0825")).quantize(MONEY, rounding=ROUND_HALF_UP)
    total = (discounted_subtotal + shipping + tax).quantize(MONEY, rounding=ROUND_HALF_UP)

    with transaction.atomic():
        order = Order.objects.create(
            order_number=f"NN-{uuid.uuid4().hex[:8].upper()}",
            first_name=customer["firstName"].strip(),
            last_name=customer["lastName"].strip(),
            email=customer["email"].strip(),
            address=customer["address"].strip(),
            city=customer["city"].strip(),
            zip=customer["zip"].strip(),
            delivery=delivery,
            payment=str(customer.get("payment", "Demo payment")),
            subtotal=subtotal,
            discount=discount,
            shipping=shipping,
            tax=tax,
            total=total,
        )
        OrderItem.objects.bulk_create(
            [
                OrderItem(
                    order=order,
                    product=product,
                    product_sku=product.sku,
                    product_name=product.name,
                    unit_price=product.price,
                    quantity=quantity,
                    line_total=line_total,
                )
                for product, quantity, line_total in order_rows
            ]
        )

    return JsonResponse(
        {
            "order": {
                "id": order.order_number,
                "total": float(order.total),
                "subtotal": float(order.subtotal),
                "shipping": float(order.shipping),
                "tax": float(order.tax),
            }
        },
        status=201,
    )


def _shipping_for(subtotal, delivery):
    if subtotal == 0 or delivery == "pickup":
        return Decimal("0.00")
    if delivery == "express":
        return Decimal("14.95")
    return Decimal("6.95")
