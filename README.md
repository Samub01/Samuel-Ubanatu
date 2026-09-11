# CantonLink Sourcing demo site

A realistic, fully navigable demo website for a UK based China sourcing service, built as a static site for client demonstrations.

## What is in the demo

- Home page with categories, process, best sellers, services, testimonials and insights
- 10 product categories and 73 products with FOB prices, price tiers, MOQs, lead times, HS codes and duty rates
- Product pages with a live landed cost estimator (goods, freight, insurance, duty, VAT, sourcing fee)
- Category pages with filters and sorting
- Shipping calculator comparing sea, rail, air and express from Chinese ports to any UK postcode
- Verified supplier directory
- Services and pricing, plans, FAQ, case studies, insights articles, about, contact
- Three step quote request flow with confirmation reference
- Enquiry list (add products, adjust quantities, request one combined quote)
- Client login (demo account is pre-filled) and dashboard with orders, shipment tracking, quotes, documents and account
- Privacy policy and terms of business

## Running it

Open `index.html` in a browser, or serve the folder with any static file server:

```
python3 -m http.server 8080
```

then visit `http://localhost:8080`.

The site is also suitable for GitHub Pages or any static host. Navigation uses hash routes so no server configuration is needed.

## Structure

```
index.html            page shell, header and footer
assets/css/styles.css styles
assets/js/data.js     products, suppliers, articles, orders and reference data
assets/js/app.js      router and page templates
assets/img/           photography (Unsplash photos redistributed in open source packages)
```

The company, people, prices and orders are fictional and for demonstration only. The phone number uses the Ofcom drama range.
