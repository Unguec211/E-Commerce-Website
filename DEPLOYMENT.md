# Deployment, Domain, and Security

Suggested domain: `northnestcommerce.com`.

## Local setup

1. Create a MySQL database and user:

```sql
CREATE DATABASE northnest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'northnest_user'@'localhost' IDENTIFIED BY 'replace-this-password';
GRANT ALL PRIVILEGES ON northnest.* TO 'northnest_user'@'localhost';
FLUSH PRIVILEGES;
```

2. Copy `.env.example` to `.env` and update the secret key and MySQL password.
3. Install dependencies:

```powershell
pip install -r requirements.txt
```

4. Run migrations and start Django:

```powershell
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Open `http://127.0.0.1:8000`.

## Production checklist

1. Register `northnestcommerce.com` with a registrar.
2. Point DNS `A` records for `@` and `www` to your hosting server.
3. Set these production environment values:

```env
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=northnestcommerce.com,www.northnestcommerce.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://northnestcommerce.com,https://www.northnestcommerce.com
DJANGO_SECURE_SSL_REDIRECT=True
DJANGO_SESSION_COOKIE_SECURE=True
DJANGO_CSRF_COOKIE_SECURE=True
DJANGO_SECURE_HSTS_SECONDS=31536000
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=True
DJANGO_SECURE_HSTS_PRELOAD=True
```

4. Put Django behind Nginx or Apache and issue an SSL certificate with Let's Encrypt:

```bash
sudo certbot --nginx -d northnestcommerce.com -d www.northnestcommerce.com
```

5. Run:

```bash
python manage.py collectstatic
python manage.py migrate
```

The checkout is still a mock payment flow. Add Stripe, PayPal, or another provider before accepting real card payments.
