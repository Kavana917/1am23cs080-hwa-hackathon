# Rime™ — prototype storefront

A React + Vite landing page for Rime, a concept frozen lick and hydration column for dogs.
The site is a prototype storefront: orders are test orders and nothing is charged or shipped.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` produces the production bundle in `dist/`.

## Order endpoint

`POST /api/orders` accepts:

```json
{
  "items": [{ "sku": "RIME-STD", "qty": 1, "color": "sage" }],
  "customer": {
    "name": "Full Name",
    "email": "you@example.com",
    "phone": "9876543210",
    "address": "12 Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "shippingMethod": "standard"
}
```

The endpoint validates SKUs, colours and quantities against `catalog.json`, recalculates
subtotal, shipping and total on the server, and returns an order id. `GET /api/orders`
returns service health and the catalog; `GET /api/orders?id=RIME-…` looks up an order
placed on the current server instance. Orders are kept in memory only.

## Notes

- Prices are in INR, inclusive of GST. MRP, launch price and savings are shown for every SKU.
- Session claims always say **3–4 hour session**.
- Dog safety guidance appears on the product page, in the cart and in order confirmation.
- Product imagery is AI-generated and illustrative.
