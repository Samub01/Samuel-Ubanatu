/* CantonLink Sourcing - front end application */
(function () {
  "use strict";
  var C = window.CL;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- helpers ---------- */
  function gbp(n, dp) { dp = dp === undefined ? 2 : dp; return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function img(name) { return "assets/img/" + name + ".jpg"; }
  function catOf(slug) { return C.categories.filter(function (c) { return c.slug === slug; })[0]; }
  function supOf(id) { return C.suppliers.filter(function (s) { return s.id === id; })[0]; }
  function prodOf(slug) { return C.products.filter(function (p) { return p.slug === slug; })[0]; }
  function store(key, val) {
    try { if (val === undefined) { var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } localStorage.setItem(key, JSON.stringify(val)); } catch (e) { return null; }
  }
  function session(key, val) {
    try { if (val === undefined) { var v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null; } sessionStorage.setItem(key, JSON.stringify(val)); } catch (e) { return null; }
  }
  var I = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>',
    ship: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M4 16l-1-5h18l-1 5M6 11V7h12v4M10 7V4h4v3"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    factory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l6 4V9l6 4V9l6 4v8H3zM7 21v-4h4v4M13 21v-4h4v4"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z"/><path d="M14 3v6h6M8 13h8M8 17h8"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12 12 20 3 11V3h8l9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
    warehouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-5 9 5v12H3z"/><path d="M7 21v-8h10v8M7 17h10"/></svg>',
    customs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M8 12h8M12 8v8"/></svg>',
    amazon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h13l3 4v6H3z"/><circle cx="7" cy="18" r="2"/><circle cx="16" cy="18" r="2"/><path d="M16 11h5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    chev: '<svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
  };

  /* ---------- state ---------- */
  var enquiry = store("cl_enquiry") || [];
  var loggedIn = !!session("cl_user");
  var quoteDraft = {};

  function saveEnquiry() { store("cl_enquiry", enquiry); updateBadge(); }
  function updateBadge() {
    var n = enquiry.reduce(function (a, b) { return a + 1; }, 0);
    $$(".js-enq-count").forEach(function (el) { el.textContent = n; el.hidden = n === 0; });
  }
  function addToEnquiry(slug, qty) {
    var p = prodOf(slug); if (!p) return;
    var ex = enquiry.filter(function (e) { return e.slug === slug; })[0];
    if (ex) { ex.qty = qty || ex.qty; } else { enquiry.push({ slug: slug, qty: qty || p.moq }); }
    saveEnquiry();
    toast(p.name + " added to your enquiry list");
  }
  var toastT;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ---------- shared fragments ---------- */
  function vbadge(text) { return '<span class="vbadge">' + I.shield + (text || "Verified") + "</span>"; }
  function stars() { return '<span class="stars" aria-label="4.8 out of 5">&#9733;&#9733;&#9733;&#9733;&#9733;</span>'; }
  function pcard(p) {
    var cat = catOf(p.cat), s = supOf(p.sup);
    return '<article class="pcard">' +
      '<a class="img" href="#/product/' + p.slug + '"><img src="' + img(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">' +
      (p.tag ? '<span class="flag' + (p.tag === "Best seller" ? " hot" : "") + '">' + p.tag + "</span>" : "") + "</a>" +
      '<div class="body"><span class="cat">' + cat.short + "</span>" +
      '<h3><a href="#/product/' + p.slug + '">' + esc(p.name) + "</a></h3>" +
      '<div class="price">' + gbp(p.price) + ' <small>FOB per ' + unitSing(p.unit) + "</small></div>" +
      '<div class="meta"><span>MOQ ' + p.moq.toLocaleString("en-GB") + " " + p.unit + "</span><span>" + p.lead + " days</span></div>" +
      '<div class="sup">' + vbadge() + "<span>" + esc(s.city) + ", " + esc(s.prov) + "</span></div>" +
      "</div></article>";
  }
  function unitSing(u) { return { pcs: "unit", sets: "set", pairs: "pair", tubes: "tube" }[u] || "unit"; }
  function crumbs(items) {
    return '<nav class="crumbs" aria-label="Breadcrumb"><span><a href="#/">Home</a></span>' + items.map(function (i) {
      return "<span>" + (i[1] ? '<a href="' + i[1] + '">' + esc(i[0]) + "</a>" : esc(i[0])) + "</span>";
    }).join("") + "</nav>";
  }
  function pageHead(title, sub, crumbItems) {
    return '<div class="page-head"><div class="container">' + (crumbItems ? crumbs(crumbItems) : "") + "<h1>" + title + "</h1>" + (sub ? "<p>" + sub + "</p>" : "") + "</div></div>";
  }
  function ctaBand() {
    return '<section class="cta-band"><div class="container"><div><h2>Send us a product brief today</h2><p>Quotes from verified factories within three working days, with a landed cost to your door.</p></div><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-light btn-lg" href="#/quote">Request a quote</a><a class="btn btn-lg on-dark" href="#/contact">Talk to the team</a></div></div></section>';
  }
  function routeMap() {
    return '<div class="map"><svg viewBox="0 0 1000 440" role="img" aria-label="Shipping route from Chinese ports to the UK">' +
      '<defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0v40" fill="none" stroke="#d6dee8" stroke-width="1"/></pattern></defs>' +
      '<rect width="1000" height="440" fill="#eef2f7"/><rect width="1000" height="440" fill="url(#g)"/>' +
      '<path d="M120 120 C 300 20, 700 40, 880 300" fill="none" stroke="#14213d" stroke-width="2.5" stroke-dasharray="7 7"/>' +
      '<path d="M120 120 C 280 260, 620 330, 880 300" fill="none" stroke="#b8232a" stroke-width="2.5" stroke-dasharray="3 6"/>' +
      '<path d="M120 120 C 360 120, 640 200, 900 250" fill="none" stroke="#1f7a5c" stroke-width="2.5"/>' +
      '<g font-family="IBM Plex Mono, monospace" font-size="13" fill="#14213d">' +
      '<circle cx="120" cy="120" r="8" fill="#b8232a"/><text x="140" y="112">Manchester, Trafford Park</text><text x="140" y="130" fill="#5d6270">UK hub, Felixstowe and Heathrow clearance</text>' +
      '<circle cx="880" cy="300" r="8" fill="#14213d"/><text x="700" y="335">Guangzhou and Shenzhen</text><text x="700" y="353" fill="#5d6270">Sourcing office, Yantian port</text>' +
      '<circle cx="900" cy="250" r="7" fill="#1f7a5c"/><text x="760" y="235">Yiwu warehouse</text>' +
      '<circle cx="520" cy="50" r="6" fill="#14213d"/><text x="535" y="46">Rail: Xi\'an to Duisburg, 22 to 28 days</text>' +
      '<circle cx="420" cy="262" r="6" fill="#b8232a"/><text x="330" y="292">Sea: Yantian to Felixstowe, 35 to 45 days</text>' +
      '<text x="560" y="180" fill="#1f7a5c">Air: Baiyun to Heathrow, 5 to 8 days</text>' +
      "</g></svg></div>";
  }

  /* ---------- pages ---------- */
  var pages = {};

  pages.home = function () {
    var featured = C.products.filter(function (p) { return p.tag === "Best seller"; }).slice(0, 8);
    var newest = C.products.filter(function (p) { return p.tag === "New"; }).slice(0, 4);
    return '<section class="hero"><div class="container">' +
      '<div><span class="eyebrow">UK based China sourcing agent</span><h1>Source products from China without the guesswork</h1>' +
      '<p class="lede">We find the factory, check it, manage samples and inspection, and deliver to your door in the UK with duty and VAT handled. You deal with an office in Manchester and a team on the ground in Guangzhou.</p>' +
      '<div class="hero-cta"><a class="btn btn-primary btn-lg" href="#/quote">Request a quote</a><a class="btn btn-outline btn-lg" href="#/categories">Browse verified products</a></div>' +
      '<div class="hero-proof"><div><strong>2,400+</strong>UK businesses supplied</div><div><strong>£38m</strong>goods landed since 2016</div><div><strong>96.4%</strong>on-time delivery rate</div><div><strong>4.8/5</strong>' + stars() + " 612 reviews</div></div></div>" +
      '<div class="hero-grid">' +
      '<div class="hero-tag tall"><img src="' + img("stripe-dress") + '" alt="Satin stripe midi dress"><span>CL-WF-3206</span></div>' +
      '<div class="hero-tag"><img src="' + img("pendant-lamp") + '" alt="Enamel pendant light"><span>CL-HK-1048</span></div>' +
      '<div class="hero-tag"><img src="' + img("knit-trainer") + '" alt="Knit running trainer"><span>CL-FW-4101</span></div>' +
      '<div class="hero-tag wide"><img src="' + img("linen-sofa") + '" alt="Grey linen sofa"><span>CL-FN-2105</span></div>' +
      '<div class="hero-tag"><img src="' + img("planters-set") + '" alt="Ceramic planters"><span>CL-HK-1041</span></div>' +
      '<div class="hero-tag"><img src="' + img("satchel") + '" alt="Tan satchel"><span>CL-BA-3401</span></div>' +
      '<div class="hero-tag"><img src="' + img("mech-keyboard") + '" alt="Mechanical keyboard"><span>CL-EL-6102</span></div>' +
      "</div></div></section>" +

      '<div class="trust"><div class="container">' +
      '<div class="item">' + stars() + ' <strong>Excellent</strong> 4.8 out of 5 on Trustpilot</div>' +
      '<div class="item">' + vbadge("Companies House 10482917") + "</div>" +
      '<div class="item"><strong>BIFA</strong> member freight partner</div>' +
      '<div class="item"><strong>Segregated</strong> client account for deposits</div>' +
      '<div class="item"><strong>Offices</strong> in Manchester, Guangzhou and Yiwu</div>' +
      "</div></div>" +

      '<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">What we source</span><h2>Categories our UK clients order most</h2></div><a class="btn btn-ghost" href="#/categories">All categories</a></div>' +
      '<div class="cat-grid">' + C.categories.slice(0, 8).map(function (c) {
        var n = C.products.filter(function (p) { return p.cat === c.slug; }).length;
        return '<a class="cat-tile" href="#/category/' + c.slug + '"><img src="' + img(c.img) + '" alt="" loading="lazy"><div class="lbl">' + esc(c.name) + "<small>" + n + " verified products</small></div></a>";
      }).join("") + "</div></div></section>" +

      '<section class="section alt"><div class="container"><div class="section-head"><div><span class="eyebrow">How it works</span><h2>From brief to delivery in four stages</h2></div><a class="btn btn-ghost" href="#/how-it-works">See the full process</a></div>' +
      '<div class="steps">' +
      '<div class="step"><span class="n">Stage 1</span><h3>Send a brief</h3><p>Tell us what you need, the quantity and your target price. A photo or a link to a similar product is enough.</p><div class="t">Same day acknowledgement</div></div>' +
      '<div class="step"><span class="n">Stage 2</span><h3>Quotes and samples</h3><p>We shortlist verified factories, negotiate in Mandarin and send you a landed cost comparison. Samples follow by courier.</p><div class="t">3 working days for quotes</div></div>' +
      '<div class="step"><span class="n">Stage 3</span><h3>Production and inspection</h3><p>We place the order, track production weekly and inspect before the balance is paid. You get the report with photos.</p><div class="t">20 to 60 days depending on product</div></div>' +
      '<div class="step"><span class="n">Stage 4</span><h3>Freight and delivery</h3><p>Sea, rail or air to the UK, cleared on your EORI number with duty and VAT itemised. Delivered to your door or to Amazon.</p><div class="t">5 to 45 days depending on mode</div></div>' +
      "</div></div></section>" +

      '<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Best sellers</span><h2>Products UK clients reorder most</h2><p>Every listing shows the real FOB price, the factory minimum order and the current lead time. Prices are updated each month with the supplier.</p></div><a class="btn btn-ghost" href="#/categories">Browse all 73 products</a></div>' +
      '<div class="grid-products">' + featured.map(pcard).join("") + "</div></div></section>" +

      '<section class="section alt"><div class="container"><div class="split">' +
      '<img src="' + img("scene-city-night") + '" alt="Guangzhou street at night">' +
      '<div><span class="eyebrow">On the ground in China</span><h2>Our own team in Guangzhou and Yiwu, not an agent of an agent</h2>' +
      '<p>Fourteen staff in China visit factories, sit in on production and run inspections. They are CantonLink employees, paid by us, which is why quotes are not marked up and problems get fixed the same day.</p>' +
      '<ul class="checks"><li>' + I.check + "<span>Factory audits with photos, machine counts and licence checks before you pay a deposit</span></li>" +
      "<li>" + I.check + "<span>Pre-shipment inspection to AQL 2.5 with a written report on every order over £5,000</span></li>" +
      "<li>" + I.check + "<span>Consolidation warehouse in Yiwu so you can combine several suppliers in one shipment</span></li>" +
      "<li>" + I.check + "<span>Canton Fair accompanied visits every April and October</span></li></ul>" +
      '<a class="btn btn-ink" href="#/about">Meet the team</a></div></div></div></section>' +

      '<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Services</span><h2>Everything between the factory gate and your warehouse</h2></div><a class="btn btn-ghost" href="#/services">All services and prices</a></div>' +
      '<div class="svc-grid">' +
      svc(I.search, "Product sourcing", "Factory shortlist, negotiation, sampling and order management in one place.", "5% of order value, min £150") +
      svc(I.factory, "Supplier verification", "Licence checks, on-site audit with photos and reference calls.", "From £180 per factory") +
      svc(I.shield, "Quality inspection", "Pre-shipment and during-production inspection to AQL standards.", "From £210 per man-day") +
      svc(I.ship, "Freight forwarding", "Sea, rail, air and express from any Chinese port to any UK postcode.", "Live rates in the calculator") +
      svc(I.customs, "Customs and VAT", "Clearance on your EORI, commodity codes, postponed VAT accounting.", "£55 per entry") +
      svc(I.amazon, "Amazon FBA prep", "FNSKU labelling, carton labels, palletisation and direct delivery.", "From £0.18 per unit") +
      "</div></div></section>" +

      '<section class="section ink"><div class="container"><div class="stats">' +
      '<div class="stat"><strong>10 yrs</strong><span>Trading since 2016</span></div>' +
      '<div class="stat"><strong>318</strong><span>Verified factories on our list</span></div>' +
      '<div class="stat"><strong>1,940</strong><span>Containers and consignments landed in 2025</span></div>' +
      '<div class="stat"><strong>0.6%</strong><span>Orders with a post-delivery claim</span></div>' +
      "</div></div></section>" +

      '<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Client stories</span><h2>What UK buyers say</h2></div><a class="btn btn-ghost" href="#/case-studies">Read case studies</a></div>' +
      '<div class="testi-grid">' + C.testimonials.map(function (t) {
        return '<div class="testi">' + stars() + "<blockquote>" + esc(t.q) + '</blockquote><div class="who"><img src="' + img(t.img) + '" alt=""><div><strong>' + esc(t.who) + "</strong><span>" + esc(t.co) + "</span></div></div></div>";
      }).join("") + "</div></div></section>" +

      '<section class="section alt"><div class="container"><div class="section-head"><div><span class="eyebrow">New this month</span><h2>Recently added to the catalogue</h2></div></div><div class="grid-products">' + newest.map(pcard).join("") + "</div></div></section>" +

      '<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Insights</span><h2>Guides for UK importers</h2></div><a class="btn btn-ghost" href="#/insights">All articles</a></div>' +
      '<div class="art-grid">' + C.articles.slice(0, 3).map(artCard).join("") + "</div></div></section>" +
      ctaBand();
  };
  function svc(icon, title, text, from) {
    return '<div class="svc"><div class="ico">' + icon + "</div><h3>" + title + "</h3><p>" + text + '</p><div class="from">' + from + "</div></div>";
  }
  function artCard(a) {
    return '<article class="art"><a href="#/insights/' + a.slug + '"><img src="' + img(a.img) + '" alt="" loading="lazy"></a><div class="b"><span class="eyebrow" style="margin:0">' + a.cat + '</span><h3><a href="#/insights/' + a.slug + '">' + esc(a.title) + "</a></h3><p>" + esc(a.excerpt) + '</p><div class="d">' + a.date + " &middot; " + a.read + "</div></div></article>";
  }

  pages.howItWorks = function () {
    return pageHead("How CantonLink works", "A fixed process for every order, whether it is 300 T-shirts or a container of furniture.", [["How it works"]]) +
      '<section class="section"><div class="container"><div class="steps" style="grid-template-columns:repeat(2,1fr)">' +
      [["1", "Brief", "Send us a product description, a photo, a link, or a sample. Tell us the quantity, your target landed price and when you need stock. We confirm within one working day whether it is a product we can source at your numbers, and we will say if it is not."],
       ["2", "Sourcing", "A sourcing manager in Guangzhou shortlists three to five factories from our verified list, or finds new ones if the product is unusual. We negotiate price, MOQ, payment terms and lead time in Mandarin and send you a comparison with a landed cost to your postcode."],
       ["3", "Sampling", "You choose one or two suppliers to sample. Samples are checked in our Guangzhou office against your spec, photographed, then couriered to the UK in one bag. Sample fees are usually credited against the bulk order."],
       ["4", "Order and deposit", "We issue a pro forma in pounds. You pay CantonLink, we pay the factory in RMB. Standard terms are 30 percent deposit, 70 percent after inspection. Funds sit in a segregated client account until milestones are met."],
       ["5", "Production", "The factory sends weekly progress photos which you see in your dashboard. For tooled or complex products we run a during-production inspection at around 30 percent completion to catch problems early."],
       ["6", "Inspection", "Our QC team inspects the finished goods at the factory to an AQL 2.5 sampling plan. You receive a report with measurements, photos and any defects found. Nothing ships until you approve it."],
       ["7", "Freight", "We book sea, rail, air or express, consolidate with other suppliers at Yiwu if needed, and handle export documents. You get a tracking link and a bill of lading."],
       ["8", "Customs and delivery", "Goods are cleared on your EORI number with postponed VAT accounting. We deliver to your door, your 3PL or directly into Amazon FBA. You receive an itemised invoice showing goods, freight, duty, VAT and our fee separately."]
      ].map(function (s) { return '<div class="step"><span class="n">Stage ' + s[0] + "</span><h3>" + s[1] + "</h3><p>" + s[2] + "</p></div>"; }).join("") +
      "</div></div></section>" +
      '<section class="section alt"><div class="container"><div class="section-head"><div><span class="eyebrow">Timelines</span><h2>Typical time from brief to delivery</h2></div></div>' +
      '<div class="compare"><div class="c"><h3>Stock products, sea freight</h3><div class="big">8 to 10 weeks</div><p>Existing catalogue items with no customisation beyond a logo. Example: 1,000 ceramic planter sets to Leeds.</p></div>' +
      '<div class="c"><h3>Customised products, sea freight</h3><div class="big">12 to 16 weeks</div><p>Your colours, print or packaging. Includes a sampling round. Example: 600 pairs of trainers in your colourway.</p></div>' +
      '<div class="c"><h3>Urgent replenishment, air freight</h3><div class="big">4 to 6 weeks</div><p>Repeat orders of an approved product flown to Heathrow. Example: 3,000 wireless mice to an Amazon fulfilment centre.</p></div></div>' +
      "</div></section>" + ctaBand();
  };

  pages.categories = function () {
    return pageHead("Product categories", "73 products from 12 verified factories. Every price is the factory FOB quote in pounds, refreshed monthly.", [["Categories"]]) +
      '<section class="section"><div class="container"><div class="cat-grid">' + C.categories.map(function (c) {
        var n = C.products.filter(function (p) { return p.cat === c.slug; }).length;
        return '<a class="cat-tile" href="#/category/' + c.slug + '"><img src="' + img(c.img) + '" alt="" loading="lazy"><div class="lbl">' + esc(c.name) + "<small>" + n + " products</small></div></a>";
      }).join("") + "</div>" +
      '<p class="muted" style="margin-top:28px;max-width:70ch">Not seeing your product? The catalogue shows products we have already sourced for UK clients. Most of our work is bespoke. <a href="#/quote">Send a brief</a> and we will source it.</p></div></section>';
  };

  var catState = { sort: "popular", verified: true, maxMoq: 0, maxPrice: 0, tag: "" };
  pages.category = function (slug) {
    var c = catOf(slug); if (!c) return pages.notFound();
    var list = C.products.filter(function (p) { return p.cat === slug; });
    return '<div class="page-head"><div class="container">' + crumbs([["Categories", "#/categories"], [c.name]]) + "</div></div>" +
      '<section class="section tight"><div class="container">' +
      '<div class="cat-banner"><img src="' + img(c.banner) + '" alt=""><div class="ov"><h1>' + esc(c.name) + "</h1><p>" + esc(c.blurb) + "</p></div></div>" +
      '<div class="cat-layout"><aside class="filters" id="filters">' +
      '<h4>Supplier</h4><label><input type="checkbox" id="f-verified" checked> Verified factories only</label><label><input type="checkbox" id="f-audit"> Audited in the last 6 months</label>' +
      '<h4>Minimum order</h4><label><input type="radio" name="moq" value="0" checked> Any</label><label><input type="radio" name="moq" value="300"> Up to 300 units</label><label><input type="radio" name="moq" value="1000"> Up to 1,000 units</label>' +
      '<h4>Lead time</h4><label><input type="radio" name="lead" value="0" checked> Any</label><label><input type="radio" name="lead" value="30"> 30 days or less</label><label><input type="radio" name="lead" value="45"> 45 days or less</label>' +
      '<h4>Customisation</h4><label><input type="checkbox" id="f-logo"> Logo or print</label><label><input type="checkbox" id="f-pack"> Custom packaging</label>' +
      '<h4>Certification</h4><label><input type="checkbox" id="f-ukca"> UKCA or CE</label><label><input type="checkbox" id="f-bsci"> BSCI audited</label>' +
      "</aside><div>" +
      '<div class="toolbar"><span id="count">' + list.length + ' products</span><label>Sort by <select id="sort"><option value="popular">Most ordered</option><option value="price-asc">FOB price, low to high</option><option value="price-desc">FOB price, high to low</option><option value="moq">Lowest MOQ</option><option value="lead">Shortest lead time</option></select></label></div>' +
      '<div class="grid-products" id="plist">' + list.map(pcard).join("") + "</div>" +
      "</div></div></div></section>";
  };
  function bindCategory(slug) {
    var base = C.products.filter(function (p) { return p.cat === slug; });
    function apply() {
      var moq = +($('input[name="moq"]:checked') || {}).value || 0;
      var lead = +($('input[name="lead"]:checked') || {}).value || 0;
      var ukca = $("#f-ukca").checked, bsci = $("#f-bsci").checked, audit = $("#f-audit").checked;
      var list = base.filter(function (p) {
        var s = supOf(p.sup);
        if (moq && p.moq > moq) return false;
        if (lead && p.lead > lead) return false;
        if (ukca && !/UKCA|CE/.test(s.certs.join(" "))) return false;
        if (bsci && s.certs.indexOf("BSCI") < 0) return false;
        if (audit && !/2026/.test(s.audit)) return false;
        return true;
      });
      var sort = $("#sort").value;
      if (sort === "price-asc") list.sort(function (a, b) { return a.price - b.price; });
      if (sort === "price-desc") list.sort(function (a, b) { return b.price - a.price; });
      if (sort === "moq") list.sort(function (a, b) { return a.moq - b.moq; });
      if (sort === "lead") list.sort(function (a, b) { return a.lead - b.lead; });
      $("#plist").innerHTML = list.length ? list.map(pcard).join("") : '<p class="muted" style="grid-column:1/-1">No products match these filters. <a href="#/quote">Send a brief</a> and we will source it for you.</p>';
      $("#count").textContent = list.length + " product" + (list.length === 1 ? "" : "s");
    }
    $$("#filters input, #sort").forEach(function (el) { el.addEventListener("change", apply); });
  }

  pages.product = function (slug) {
    var p = prodOf(slug); if (!p) return pages.notFound();
    var c = catOf(p.cat), s = supOf(p.sup);
    var related = C.products.filter(function (x) { return x.cat === p.cat && x.slug !== p.slug; }).slice(0, 4);
    return '<div class="page-head" style="padding-block:18px"><div class="container">' + crumbs([["Categories", "#/categories"], [c.name, "#/category/" + c.slug], [p.name]]) + "</div></div>" +
      '<section class="section tight"><div class="container"><div class="pd">' +
      '<div class="pd-gallery"><div class="main"><img id="pd-main" src="' + img(p.imgs[0]) + '" alt="' + esc(p.name) + '"></div><div class="thumbs">' + p.imgs.map(function (i, n) {
        return '<button type="button" class="' + (n === 0 ? "active" : "") + '" data-img="' + i + '" aria-label="View image ' + (n + 1) + '"><img src="' + img(i) + '" alt=""></button>';
      }).join("") + "</div>" +
      '<div class="calc"><h3>Landed cost estimate to the UK</h3><div class="row"><div><label for="lc-qty">Quantity (' + p.unit + ")</label><input id=\"lc-qty\" type=\"number\" min=\"" + p.moq + '" step="' + (p.moq >= 1000 ? 100 : 10) + '" value="' + p.moq + '"></div><div><label for="lc-mode">Freight mode</label><select id="lc-mode"><option value="sea">Sea freight</option><option value="rail">Rail</option><option value="air">Air freight</option><option value="express">Express courier</option></select></div></div>' +
      '<div class="out" id="lc-out"></div><p class="note">Estimate only. Duty at ' + p.duty + '% under commodity code ' + p.hs + ', VAT at 20%, freight from our current rate card, sourcing fee at 5%. Delivery to a mainland UK business address.</p></div></div>' +

      '<div class="pd-info"><span class="eyebrow">' + esc(c.name) + "</span><h1>" + esc(p.name) + "</h1>" +
      '<div class="sku"><span>SKU ' + p.id + "</span><span>HS " + p.hs + "</span><span>" + p.unit.toUpperCase() + "</span>" + (p.tag ? "<span>" + p.tag.toUpperCase() + "</span>" : "") + "</div>" +
      "<p>" + esc(p.desc) + "</p>" +
      '<table class="tiers"><thead><tr><th>Quantity</th><th>FOB price per ' + unitSing(p.unit) + "</th><th>Order value</th></tr></thead><tbody>" + p.tiers.map(function (t, i) {
        var nxt = p.tiers[i + 1];
        return "<tr><td>" + t[0].toLocaleString("en-GB") + (nxt ? " to " + (nxt[0] - 1).toLocaleString("en-GB") : "+") + ' ' + p.unit + '</td><td class="p num">' + gbp(t[1]) + '</td><td class="num">' + gbp(t[0] * t[1], 0) + "</td></tr>";
      }).join("") + "</tbody></table>" +
      '<dl class="kv"><dt>Minimum order</dt><dd>' + p.moq.toLocaleString("en-GB") + " " + p.unit + "</dd><dt>Lead time</dt><dd>" + p.lead + " days after deposit</dd><dt>Incoterm</dt><dd>FOB " + (s.prov === "Fujian" ? "Xiamen" : s.prov === "Zhejiang" ? "Ningbo" : s.prov === "Jiangsu" ? "Shanghai" : "Shenzhen") + "</dd><dt>Payment</dt><dd>30% deposit, 70% after inspection</dd><dt>Packed volume</dt><dd>" + p.cbm.toFixed(4) + " m³ per " + unitSing(p.unit) + ", " + p.weight + " kg</dd><dt>Sample</dt><dd>Available, fee credited against order</dd></dl>" +
      '<div class="sup-card"><div class="av">' + s.initials + '</div><div><strong>' + esc(s.name) + '</strong><div class="s"><span>' + esc(s.city) + ", " + esc(s.prov) + "</span><span>" + s.years + " years exporting</span><span>" + s.otRate + "% on time</span><span>Replies " + s.resp + '</span></div><div class="s" style="margin-top:4px">' + vbadge(s.audit) + "</div></div><a class=\"btn btn-sm btn-light\" href=\"#/suppliers\">Profile</a></div>" +
      '<div class="pd-actions"><a class="btn btn-primary btn-lg" href="#/quote?product=' + p.slug + '">Request a quote</a><button type="button" class="btn btn-outline btn-lg" id="add-enq">Add to enquiry list</button><a class="btn btn-ghost btn-lg" href="#/contact">Ask a question</a></div>' +
      '<p class="small muted">Sourcing fee 5% of order value applies. Inspection included on orders over £5,000. Quotes are valid for 30 days and are subject to raw material and exchange rate movements.</p>' +
      "</div></div>" +

      '<div class="tabs" role="tablist"><button type="button" class="active" data-tab="spec">Specification</button><button type="button" data-tab="custom">Customisation</button><button type="button" data-tab="ship">Shipping and compliance</button><button type="button" data-tab="qc">Quality control</button></div>' +
      '<div class="tab-panel" id="tab-spec"><table class="spec"><tbody>' + Object.keys(p.specs).map(function (k) { return "<tr><td>" + esc(k) + "</td><td>" + esc(p.specs[k]) + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      '<div class="tab-panel" id="tab-custom" hidden><p>' + esc(p.specs.Customisation || "Logo and packaging customisation available on request.") + ".</p><p>Artwork should be supplied as vector (AI, EPS or PDF) with Pantone references. We produce a digital proof for approval, then a physical pre-production sample where colour or print is critical. Custom packaging is quoted separately by the supplier's packaging partner and usually adds 5 to 12 days to the lead time.</p></div>" +
      '<div class="tab-panel" id="tab-ship" hidden><p>Commodity code ' + p.hs + " with UK Global Tariff duty of " + p.duty + "%. Import VAT is 20% and is handled through postponed VAT accounting on your EORI number.</p><p>Packed volume per " + unitSing(p.unit) + " is " + p.cbm.toFixed(4) + " m³ at " + p.weight + " kg. A minimum order of " + p.moq.toLocaleString("en-GB") + " " + p.unit + " is approximately " + (p.cbm * p.moq).toFixed(2) + " m³ and " + Math.round(p.weight * p.moq).toLocaleString("en-GB") + " kg, which " + ((p.cbm * p.moq) > 25 ? "fills a 40 ft container" : (p.cbm * p.moq) > 12 ? "suits a 20 ft container" : "ships as LCL sea freight") + ".</p><p>" + (s.certs.length ? "The factory holds " + s.certs.join(", ") + " certification, verified against the issuing body's register. " : "") + "Product specific test reports are listed in the specification above.</p></div>" +
      '<div class="tab-panel" id="tab-qc" hidden><p>Every order over £5,000 includes a pre-shipment inspection by CantonLink QC staff to ISO 2859-1, general inspection level II, AQL 2.5 for major defects and 4.0 for minor defects. The report includes packed quantity check, carton drop test, measurements against the approved sample, function tests and at least 40 photographs.</p><p>This supplier\'s last three inspections passed first time. Their on-time delivery rate over the last 12 months is ' + s.otRate + "%.</p></div>" +

      '<div class="section-head" style="margin-top:48px"><div><h2>More from ' + esc(c.name) + '</h2></div><a class="btn btn-ghost" href="#/category/' + c.slug + '">View category</a></div>' +
      '<div class="grid-products">' + related.map(pcard).join("") + "</div>" +
      "</div></section>";
  };
  function landed(p, qty, mode) {
    var goods = qty * tierPrice(p, qty);
    var cbm = qty * p.cbm, kg = qty * p.weight;
    var freight, ukLeg = 0, transit;
    if (mode === "sea") {
      if (cbm > 25) { freight = 3400 * Math.ceil(cbm / 65); } else if (cbm > 12) { freight = 2150; } else { freight = Math.max(cbm, 1) * 95 + 120; }
      ukLeg = cbm > 12 ? 420 : 165; transit = "35 to 45 days";
    } else if (mode === "rail") { freight = Math.max(cbm, 1) * 180 + 120; ukLeg = 165; transit = "22 to 28 days"; }
    else if (mode === "air") { var ch = Math.max(kg, cbm * 167, 100); freight = ch * 4.2 + 85; ukLeg = 95; transit = "5 to 8 days"; }
    else { var ck = Math.max(kg, cbm * 200); freight = Math.max(ck * 7.2, 45); ukLeg = 0; transit = "3 to 5 days"; }
    var ins = goods * 0.004;
    var duty = (goods + freight + ins) * p.duty / 100;
    var vat = (goods + freight + ins + duty) * 0.2;
    var fee = Math.max(goods * 0.05, 150);
    var customs = 55;
    var total = goods + freight + ins + duty + vat + fee + customs + ukLeg;
    return { goods: goods, freight: freight + ukLeg, ins: ins, duty: duty, vat: vat, fee: fee, customs: customs, total: total, unit: total / qty, exVat: total - vat, transit: transit };
  }
  function tierPrice(p, qty) { var pr = p.tiers[0][1]; p.tiers.forEach(function (t) { if (qty >= t[0]) pr = t[1]; }); return pr; }
  function bindProduct(slug) {
    var p = prodOf(slug); if (!p) return;
    $$(".thumbs button").forEach(function (b) { b.addEventListener("click", function () { $("#pd-main").src = img(b.dataset.img); $$(".thumbs button").forEach(function (x) { x.classList.remove("active"); }); b.classList.add("active"); }); });
    $$(".tabs button").forEach(function (b) { b.addEventListener("click", function () { $$(".tabs button").forEach(function (x) { x.classList.remove("active"); }); b.classList.add("active"); $$(".tab-panel").forEach(function (x) { x.hidden = x.id !== "tab-" + b.dataset.tab; }); }); });
    $("#add-enq").addEventListener("click", function () { addToEnquiry(slug, +$("#lc-qty").value || p.moq); });
    function calc() {
      var qty = Math.max(+$("#lc-qty").value || p.moq, 1); var r = landed(p, qty, $("#lc-mode").value);
      $("#lc-out").innerHTML = "<span>Goods, " + qty.toLocaleString("en-GB") + " × " + gbp(tierPrice(p, qty)) + "</span><span>" + gbp(r.goods, 0) + "</span>" +
        "<span>Freight and UK delivery (" + r.transit + ")</span><span>" + gbp(r.freight, 0) + "</span>" +
        "<span>Marine insurance</span><span>" + gbp(r.ins, 0) + "</span>" +
        "<span>Import duty at " + p.duty + "%</span><span>" + gbp(r.duty, 0) + "</span>" +
        "<span>Customs entry</span><span>" + gbp(r.customs, 0) + "</span>" +
        "<span>CantonLink sourcing fee</span><span>" + gbp(r.fee, 0) + "</span>" +
        "<span>Import VAT at 20% (reclaimable)</span><span>" + gbp(r.vat, 0) + "</span>" +
        '<span class="tot">Landed cost</span><span class="tot">' + gbp(r.total, 0) + "</span>" +
        '<span class="muted">Per ' + unitSing(p.unit) + " including VAT</span><span class=\"muted\" style=\"text-align:right\">" + gbp(r.unit) + "</span>" +
        '<span class="muted">Per ' + unitSing(p.unit) + " excluding VAT</span><span class=\"muted\" style=\"text-align:right\">" + gbp(r.exVat / qty) + "</span>";
    }
    $("#lc-qty").addEventListener("input", calc); $("#lc-mode").addEventListener("change", calc); calc();
  }

  pages.services = function () {
    var rows = [
      ["Product sourcing and order management", "Brief review, factory shortlist, negotiation, pro forma, production tracking and weekly updates.", "5% of ex-factory order value, minimum £150. 3% on the Growth plan."],
      ["Supplier verification", "Business licence and export licence check, on-site visit with photo report, machine and staff count, two reference calls.", "£180 per factory in Guangdong, Fujian and Zhejiang. £260 elsewhere."],
      ["Sampling service", "Sample collection from up to five factories, checking against your spec, photographs and one consolidated courier bag to the UK.", "£45 handling plus courier at cost (typically £38 to £65 for a 2 kg bag)."],
      ["Pre-shipment inspection", "ISO 2859-1 sampling, AQL 2.5 / 4.0, written report with measurements, function tests and 40 or more photos.", "£210 per man-day. Included on orders over £5,000."],
      ["During-production inspection", "Check at around 30 percent completion to confirm materials, colour and construction before the bulk is made.", "£210 per man-day."],
      ["Factory audit (social compliance)", "Full BSCI style audit covering working hours, wages, health and safety, and environment, with corrective action plan.", "£620 per audit."],
      ["Consolidation at Yiwu", "Receive goods from several suppliers, re-label, re-pack and combine into one shipment.", "£18 per cubic metre, first 14 days storage free."],
      ["Sea freight, LCL", "Port to door from Shenzhen, Ningbo, Shanghai or Xiamen to any mainland UK address.", "From £95 per cubic metre plus £120 documentation and £165 UK haulage."],
      ["Sea freight, FCL", "20 ft and 40 ft high cube containers, port to door.", "20 ft from £2,150, 40 ft HC from £3,400 to Felixstowe. UK haulage from £420."],
      ["Rail freight", "China to Europe rail via Duisburg, then road and ferry to the UK.", "From £180 per cubic metre."],
      ["Air freight", "Airport to door, Guangzhou or Shenzhen to Heathrow or Manchester.", "From £4.20 per chargeable kilo, minimum 100 kg."],
      ["Express courier", "DHL, FedEx and UPS door to door for samples and small orders.", "From £7.20 per kilo."],
      ["Customs clearance", "Import entry on your EORI, commodity code confirmation, postponed VAT accounting, duty and VAT statement.", "£55 per entry."],
      ["Product compliance and testing", "UKCA, CE, REACH, EN 71, BS 5852 and other testing through SGS, Intertek or TÜV. Technical file compilation.", "Lab fees at cost plus £120 coordination."],
      ["Amazon FBA preparation", "FNSKU labels, polybag warnings, carton labels, manifest and delivery to fulfilment centre.", "£0.18 per unit, £4.50 per carton, £9.50 per pallet."],
      ["Canton Fair accompanied visit", "Full day with a Mandarin speaking sourcing manager, pre-booked meetings and a same-day summary.", "£320 per day."]
    ];
    return pageHead("Services and pricing", "Every service is priced separately and shown on your invoice. No markup is added to the factory price.", [["Services"]]) +
      '<section class="section"><div class="container"><div class="table-wrap"><table class="ship-table"><thead><tr><th style="width:26%">Service</th><th>What is included</th><th style="width:30%">Price</th></tr></thead><tbody>' +
      rows.map(function (r) { return "<tr><td><strong>" + r[0] + "</strong></td><td>" + r[1] + '</td><td class="num">' + r[2] + "</td></tr>"; }).join("") +
      "</tbody></table></div><p class=\"small muted\" style=\"margin-top:14px\">All prices exclude VAT. Freight rates are indicative and confirmed at booking. Rates last reviewed 1 September 2026.</p></div></section>" +
      '<section class="section alt"><div class="container"><div class="split"><div><span class="eyebrow">Compliance</span><h2>UK product compliance handled before goods leave China</h2><p>Since UKCA replaced CE marking for most products in Great Britain, the paperwork on electrical goods, toys and PPE has become the most common reason shipments are held at the border. Our compliance lead reviews every new product against the relevant regulations and arranges testing at an accredited lab in Guangdong before bulk production starts.</p><ul class="checks"><li>' + I.check + "<span>UKCA and CE for electrical, lighting and electronic products</span></li><li>" + I.check + "<span>EN 71 toy safety, BS 5852 furniture fire regulations, EN 5912 tents</span></li><li>" + I.check + "<span>REACH, RoHS and battery regulations including UN38.3 for lithium cells</span></li><li>" + I.check + '<span>Technical file, declaration of conformity and labelling artwork checks</span></li></ul></div><img src="' + img("scene-meeting") + '" alt="Compliance meeting"></div></div></section>' + ctaBand();
  };

  pages.pricing = function () {
    return pageHead("Plans", "Pay per order, or take a monthly plan if you import regularly. Either way you see the factory price with no markup.", [["Pricing"]]) +
      '<section class="section"><div class="container"><div class="plans">' +
      plan("Pay as you go", "5%", "of ex-factory value, min £150 per order", ["Sourcing, negotiation and order management", "Sample coordination", "Pre-shipment inspection on orders over £5,000", "Freight and customs at published rates", "Client dashboard and weekly production updates", "Email and phone support, Manchester office hours"], "Start with a brief", false) +
      plan("Growth", "£390", "per month plus 3% of ex-factory value", ["Everything in Pay as you go", "Named sourcing manager in Guangzhou", "Inspection included on every order", "Two supplier verifications per month included", "Consolidation at Yiwu with 30 days free storage", "Priority sampling, samples within 7 days", "Quarterly range review call"], "Book a call", true) +
      plan("Enterprise", "Custom", "for importers over £1m a year", ["Everything in Growth", "Dedicated QC staff in your factories", "Tooling and product development management", "Open book pricing with factory contracts in your name", "Onsite visits with you in China twice a year", "Trade finance introductions"], "Contact sales", false) +
      "</div>" +
      '<h2 style="margin-top:56px">Compare plans</h2><div class="table-wrap"><table class="ship-table"><thead><tr><th>Feature</th><th>Pay as you go</th><th>Growth</th><th>Enterprise</th></tr></thead><tbody>' +
      [["Sourcing fee", "5%", "3%", "Negotiated"], ["Minimum fee per order", "£150", "None", "None"], ["Pre-shipment inspection", "Orders over £5,000", "All orders", "All orders plus in-line"], ["Supplier verification", "£180 each", "2 per month included", "Unlimited"], ["Sample turnaround", "7 to 12 days", "7 days", "5 days"], ["Yiwu storage", "14 days free", "30 days free", "60 days free"], ["Account management", "Shared team", "Named manager", "Dedicated team"], ["Contract", "None", "Monthly rolling", "12 months"]].map(function (r) { return "<tr>" + r.map(function (c, i) { return "<td" + (i === 0 ? "><strong>" + c + "</strong>" : ">" + c) + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div></div></section>" +
      '<section class="section alt"><div class="container"><div class="section-head"><div><span class="eyebrow">Questions about fees</span><h2>Frequently asked</h2></div></div><div class="faq">' + C.faqs.slice(0, 3).map(faqItem).join("") + '</div><a class="btn btn-ghost" href="#/faq">All questions</a></div></section>' + ctaBand();
  };
  function plan(name, price, sub, feats, cta, featured) {
    return '<div class="plan' + (featured ? " featured" : "") + '"><h3>' + name + '</h3><div class="pr">' + price + "</div><small class=\"muted\">" + sub + "</small><ul>" + feats.map(function (f) { return "<li>" + I.check + "<span>" + f + "</span></li>"; }).join("") + '</ul><a class="btn ' + (featured ? "btn-primary" : "btn-outline") + '" href="#/' + (cta === "Start with a brief" ? "quote" : "contact") + '">' + cta + "</a></div>";
  }
  function faqItem(f) { return "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>"; }

  pages.shipping = function () {
    return pageHead("Shipping calculator", "Compare sea, rail, air and express from China to any UK postcode. Rates come from our live rate card, reviewed weekly.", [["Shipping calculator"]]) +
      '<section class="section"><div class="container"><div class="calc-page"><form class="form" id="ship-form">' +
      '<div class="row"><div class="field"><label for="s-origin">Origin</label><select id="s-origin"><option value="shenzhen">Shenzhen / Guangzhou (Yantian)</option><option value="ningbo">Ningbo / Yiwu</option><option value="shanghai">Shanghai</option><option value="xiamen">Xiamen / Jinjiang</option><option value="qingdao">Qingdao</option></select></div>' +
      '<div class="field"><label for="s-postcode">UK delivery postcode</label><input id="s-postcode" value="M17 1SH" placeholder="e.g. LS10 1AB"></div></div>' +
      '<div class="row"><div class="field"><label for="s-cartons">Number of cartons</label><input id="s-cartons" type="number" min="1" value="40"></div><div class="field"><label for="s-weight">Weight per carton <small>(kg)</small></label><input id="s-weight" type="number" min="0.1" step="0.1" value="11.4"></div></div>' +
      '<div class="row"><div class="field"><label for="s-l">Carton length <small>(cm)</small></label><input id="s-l" type="number" value="52"></div><div class="field"><label for="s-w">Width <small>(cm)</small></label><input id="s-w" type="number" value="38"></div></div>' +
      '<div class="row"><div class="field"><label for="s-h">Height <small>(cm)</small></label><input id="s-h" type="number" value="30"></div><div class="field"><label for="s-value">Goods value <small>(£, for duty and VAT)</small></label><input id="s-value" type="number" value="3200"></div></div>' +
      '<div class="field"><label for="s-duty">Duty rate</label><select id="s-duty"><option value="0">0% (furniture, most electronics, paper)</option><option value="2">2% (sports goods, hats)</option><option value="4">4% (artificial flowers, tripods)</option><option value="6">6% (plastic articles, earthenware)</option><option value="8">8% (bags and cases)</option><option value="12" selected>12% (clothing, ceramics, tents)</option><option value="16">16% (footwear)</option></select></div>' +
      '<div class="field"><label class="check"><input type="checkbox" id="s-fba"> Deliver to an Amazon fulfilment centre (adds FBA prep)</label></div>' +
      '<button type="submit" class="btn btn-primary btn-block">Calculate</button></form>' +
      '<div><div class="route"><span id="r-from">Yantian</span><span class="line"></span><span id="r-to">M17 1SH</span></div><div id="ship-summary" class="small muted" style="margin-bottom:12px"></div><div class="quote-cards" id="ship-out"></div>' +
      '<div class="aside-card" style="margin-top:18px"><h3>How the estimate works</h3><ul><li>Sea LCL is charged per cubic metre with a one cubic metre minimum. Over 12 m³ we quote a 20 ft container, over 25 m³ a 40 ft high cube.</li><li>Air is charged on the greater of actual and volumetric weight (length × width × height ÷ 6000).</li><li>Express uses a divisor of 5000 and includes clearance.</li><li>Duty is charged on goods plus freight plus insurance. VAT at 20% is charged on that total plus duty and is reclaimable if you are VAT registered.</li><li>Rates exclude VAT on the freight service itself and assume a business address with a loading bay or tail lift access.</li></ul></div></div>' +
      "</div></div></section>";
  };
  function bindShipping() {
    var names = { shenzhen: "Yantian", ningbo: "Ningbo", shanghai: "Shanghai", xiamen: "Xiamen", qingdao: "Qingdao" };
    function run(e) {
      if (e) e.preventDefault();
      var n = +$("#s-cartons").value || 1, kg = (+$("#s-weight").value || 1) * n;
      var cbm = (+$("#s-l").value * +$("#s-w").value * +$("#s-h").value) / 1e6 * n;
      var val = +$("#s-value").value || 0, duty = +$("#s-duty").value, fba = $("#s-fba").checked;
      var origin = $("#s-origin").value, pc = $("#s-postcode").value.toUpperCase().trim() || "UK";
      var far = /^(AB|IV|KW|PA|PH|HS|ZE|KA2[78]|BT|IM|GY|JE|TR)/.test(pc);
      var adj = { shenzhen: 1, ningbo: 1.02, shanghai: 1.03, xiamen: 1.04, qingdao: 1.06 }[origin];
      var uk = (far ? 1.35 : 1);
      $("#r-from").textContent = names[origin]; $("#r-to").textContent = pc;
      var vol = Math.max(cbm, 1);
      var opts = [];
      var seaBase, seaName;
      if (cbm > 25) { seaBase = 3400 * adj; seaName = "Sea freight, 40 ft high cube"; }
      else if (cbm > 12) { seaBase = 2150 * adj; seaName = "Sea freight, 20 ft container"; }
      else { seaBase = vol * 95 * adj + 120; seaName = "Sea freight, LCL"; }
      opts.push({ name: seaName, t: "35 to 45 days port to door", cost: seaBase + (cbm > 12 ? 420 : 165) * uk, note: "Departs weekly from " + names[origin] + ". Next sailing 18 September, ETA Felixstowe 25 October." });
      opts.push({ name: "Rail freight", t: "22 to 28 days", cost: vol * 180 * adj + 120 + 165 * uk, note: "Via Duisburg. Insurance cover confirmed at booking." });
      var chA = Math.max(kg, cbm * 1e6 / 6000, 100);
      opts.push({ name: "Air freight", t: "5 to 8 days airport to door", cost: chA * 4.2 * adj + 85 + 95 * uk, note: "Chargeable weight " + Math.round(chA).toLocaleString("en-GB") + " kg. Guangzhou Baiyun to Heathrow." });
      var chE = Math.max(kg, cbm * 1e6 / 5000);
      opts.push({ name: "Express courier", t: "3 to 5 days door to door", cost: Math.max(chE * 7.2, 45) * (far ? 1.15 : 1), note: "DHL or FedEx. Chargeable weight " + Math.round(chE).toLocaleString("en-GB") + " kg. Best for under 30 kg." });
      var minCost = Math.min.apply(null, opts.map(function (o) { return o.cost; }));
      $("#ship-summary").textContent = n + " cartons, " + cbm.toFixed(2) + " m³, " + Math.round(kg).toLocaleString("en-GB") + " kg gross" + (far ? ". Remote area surcharge applied for this postcode." : ".");
      $("#ship-out").innerHTML = opts.map(function (o) {
        var ins = val * 0.004, d = (val + o.cost + ins) * duty / 100, v = (val + o.cost + ins + d) * 0.2, fbaC = fba ? n * 4.5 + Math.ceil(cbm / 1.7) * 9.5 : 0;
        var landed = o.cost + ins + d + 55 + fbaC;
        return '<div class="qc' + (o.cost === minCost ? " best" : "") + '"><div><h3>' + o.name + '</h3><div class="t">' + o.t + '</div></div><div class="p">' + gbp(o.cost, 0) + "<small>freight and delivery</small></div>" +
          '<div class="tagline muted">' + o.note + " Landed with insurance, duty at " + duty + "%, customs entry" + (fba ? " and FBA prep" : "") + ": <strong>" + gbp(landed, 0) + "</strong> plus " + gbp(v, 0) + " import VAT (reclaimable).</div></div>";
      }).join("");
    }
    $("#ship-form").addEventListener("submit", run); run();
  }

  pages.suppliers = function () {
    return pageHead("Verified suppliers", "Every factory on this list has passed a document check, an on-site visit by CantonLink staff and reference calls. We revisit at least once a year.", [["Suppliers"]]) +
      '<section class="section"><div class="container"><div class="chips" id="sup-chips"><button type="button" class="chip active" data-cat="">All</button>' + C.categories.map(function (c) { return '<button type="button" class="chip" data-cat="' + c.slug + '">' + esc(c.short) + "</button>"; }).join("") + "</div>" +
      '<div class="sup-grid" id="sup-grid">' + C.suppliers.map(supCard).join("") + "</div>" +
      '<div class="aside-card" style="margin-top:28px;max-width:760px"><h3>How verification works</h3><p class="small">A verified badge means the business licence has been checked on the national enterprise credit system, a CantonLink sourcing manager has visited the factory in person, the quality system has been reviewed and two customer references have been taken. Read <a href="#/insights/how-we-verify-a-factory">how we verify a factory</a> for the detail.</p></div></div></section>';
  };
  function supCard(s) {
    var n = C.products.filter(function (p) { return p.sup === s.id; }).length;
    return '<div class="sup"><div class="av">' + s.initials + "</div><div><h3>" + esc(s.name) + '</h3><div class="loc">' + esc(s.city) + ", " + esc(s.prov) + " &middot; " + s.staff + " staff &middot; " + s.area + '</div><div class="kpis"><div><strong>' + s.years + " yrs</strong>exporting</div><div><strong>" + s.otRate + "%</strong>on-time delivery</div><div><strong>" + n + "</strong>products listed</div></div>" +
      '<div class="tags"><span class="tag ok">' + s.audit + "</span>" + s.certs.map(function (c) { return '<span class="tag">' + c + "</span>"; }).join("") + "</div>" +
      '<div style="margin-top:12px"><a class="btn btn-sm btn-light" href="#/category/' + s.cats[0] + '">View products</a></div></div></div>';
  }
  function bindSuppliers() {
    $$("#sup-chips .chip").forEach(function (b) { b.addEventListener("click", function () {
      $$("#sup-chips .chip").forEach(function (x) { x.classList.remove("active"); }); b.classList.add("active");
      var cat = b.dataset.cat; $("#sup-grid").innerHTML = C.suppliers.filter(function (s) { return !cat || s.cats.indexOf(cat) >= 0; }).map(supCard).join("");
    }); });
  }

  pages.caseStudies = function () {
    return pageHead("Case studies", "Three UK businesses, three different routes to market, one process.", [["Case studies"]]) +
      '<section class="section"><div class="container">' + C.cases.map(function (c) {
        return '<div class="case"><img src="' + img(c.img) + '" alt=""><div class="b"><span class="eyebrow">' + esc(c.type) + "</span><h2>" + esc(c.name) + "</h2><p>" + esc(c.text) + "</p><blockquote style=\"margin:0;padding-left:14px;border-left:3px solid var(--red);color:var(--muted)\">" + esc(c.quote) + '</blockquote><div class="who" style="display:flex;align-items:center;gap:10px;margin-top:12px;font-size:.9rem"><img src="' + img(c.person) + '" alt="" style="width:36px;height:36px;border-radius:50%;object-fit:cover"><strong>' + esc(c.who) + '</strong></div><div class="res">' + c.results.map(function (r) { return "<div><strong>" + r[0] + "</strong><span>" + r[1] + "</span></div>"; }).join("") + "</div></div></div>";
      }).join("") + "</div></section>" + ctaBand();
  };

  pages.insights = function () {
    return pageHead("Insights", "Practical guides on importing from China to the UK, written by the CantonLink team.", [["Insights"]]) +
      '<section class="section"><div class="container"><div class="art-grid">' + C.articles.map(artCard).join("") + "</div></div></section>";
  };
  pages.article = function (slug) {
    var a = C.articles.filter(function (x) { return x.slug === slug; })[0]; if (!a) return pages.notFound();
    var others = C.articles.filter(function (x) { return x.slug !== slug; }).slice(0, 3);
    return '<div class="page-head" style="padding-block:18px"><div class="container">' + crumbs([["Insights", "#/insights"], [a.title]]) + "</div></div>" +
      '<section class="section"><div class="container"><div class="article"><span class="eyebrow">' + a.cat + "</span><h1>" + esc(a.title) + '</h1><div class="meta">' + a.date + " &middot; " + a.read + ' &middot; CantonLink team</div><img class="lead" src="' + img(a.img) + '" alt="">' +
      a.body.map(function (b) { return b.charAt(0) === "<" ? b : "<p>" + b + "</p>"; }).join("") +
      '</div></div></section><section class="section alt"><div class="container"><h2>More insights</h2><div class="art-grid">' + others.map(artCard).join("") + "</div></div></section>";
  };

  pages.about = function () {
    return pageHead("About CantonLink", "A Manchester sourcing company with its own staff in Guangzhou and Yiwu, trading since 2016.", [["About"]]) +
      '<section class="section"><div class="container"><div class="split"><div><span class="eyebrow">Our story</span><h2>Started by a buyer who was tired of being the last to know</h2><p>James Ashworth spent eight years as a homeware buyer for a Manchester retail chain, flying to Guangdong four times a year and managing suppliers through agents who took a cut on both sides. In 2016 he set up CantonLink with Li Wenjing, a Guangzhou sourcing manager he had worked with for most of that time, on one principle: the client sees the factory price.</p><p>Ten years on, the company has 11 staff in Manchester and 14 in China, a consolidation warehouse in Yiwu and a freight partnership that moved 1,940 consignments last year. Clients range from a single Etsy seller ordering 300 planters to a national retailer with a 40 ft container every fortnight.</p></div><img src="' + img("scene-office") + '" alt="CantonLink Manchester office"></div></div></section>' +
      '<section class="section alt"><div class="container"><div class="section-head"><div><span class="eyebrow">Team</span><h2>People you will deal with</h2></div></div><div class="team">' + C.team.map(function (t) { return '<div class="member"><img src="' + img(t.img) + '" alt="' + esc(t.name) + '"><strong>' + esc(t.name) + "</strong><span>" + esc(t.role) + "</span></div>"; }).join("") + "</div></div></section>" +
      '<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Offices</span><h2>Where we are</h2></div></div><div class="offices">' +
      office("Manchester, head office", C.company.ukOffice, C.company.phone, "Monday to Friday, 8.30 am to 5.30 pm") +
      office("Guangzhou, sourcing office", C.company.cnOffice, "+86 20 8550 2261", "Monday to Saturday, 9 am to 6 pm China time") +
      office("Yiwu, consolidation warehouse", C.company.ywOffice, "+86 579 8530 7742", "Monday to Saturday, 8 am to 6 pm China time") +
      "</div></div></section>" +
      '<section class="section alt"><div class="container"><div class="split"><img src="' + img("scene-china") + '" alt="Summer Palace, Beijing"><div><span class="eyebrow">Accreditations</span><h2>Registered, insured and audited</h2><ul class="checks"><li>' + I.check + "<span>CantonLink Sourcing Ltd, registered in England and Wales, company number " + C.company.companyNo + "</span></li><li>" + I.check + "<span>VAT registration " + C.company.vat + ", EORI " + C.company.eori + "</span></li><li>" + I.check + "<span>Professional indemnity and cargo liability insurance to £2m through Hiscox</span></li><li>" + I.check + "<span>Freight moved through a BIFA member forwarder under BIFA standard trading conditions</span></li><li>" + I.check + "<span>Guangzhou office registered as a wholly foreign owned enterprise</span></li><li>" + I.check + "<span>Member of the Greater Manchester Chamber of Commerce and the China-Britain Business Council</span></li></ul></div></div></div></section>";
  };
  function office(title, lines, phone, hours) { return '<div class="office"><h3>' + title + "</h3><address>" + lines.join("<br>") + "</address><p style=\"margin:8px 0 0\"><strong>" + phone + "</strong><br><span class=\"muted\">" + hours + "</span></p></div>"; }

  pages.contact = function () {
    return pageHead("Contact", "Call the Manchester office, or send a message and a sourcing manager will reply within one working day.", [["Contact"]]) +
      '<section class="section"><div class="container"><div class="two-col"><form class="form" id="contact-form"><div class="row"><div class="field"><label for="c-name">Your name</label><input id="c-name" required></div><div class="field"><label for="c-co">Company</label><input id="c-co"></div></div><div class="row"><div class="field"><label for="c-email">Email</label><input id="c-email" type="email" required></div><div class="field"><label for="c-phone">Phone</label><input id="c-phone" type="tel"></div></div><div class="field"><label for="c-topic">What is it about?</label><select id="c-topic"><option>New product brief</option><option>Existing order</option><option>Freight or customs question</option><option>Canton Fair visit</option><option>Something else</option></select></div><div class="field"><label for="c-msg">Message</label><textarea id="c-msg" required placeholder="Tell us about the product, quantity and timing."></textarea></div><div class="field"><label class="check"><input type="checkbox" required> I agree to CantonLink storing my details to respond to this enquiry, as set out in the <a href="#/privacy">privacy policy</a>.</label></div><button type="submit" class="btn btn-primary btn-lg">Send message</button></form>' +
      '<div><div class="aside-card"><h3>Manchester office</h3><address style="font-style:normal;color:var(--muted)">' + C.company.ukOffice.join("<br>") + '</address><p style="margin:10px 0 0"><strong style="font-size:1.2rem">' + C.company.phone + '</strong><br><a href="mailto:' + C.company.email + '">' + C.company.email + '</a><br><span class="muted small">Monday to Friday, 8.30 am to 5.30 pm</span></p></div>' +
      '<div class="aside-card"><h3>Guangzhou office</h3><address style="font-style:normal;color:var(--muted)">' + C.company.cnOffice.join("<br>") + '</address><p style="margin:10px 0 0"><strong>+86 20 8550 2261</strong><br><span class="muted small">Mandarin, Cantonese and English spoken</span></p></div>' +
      '<div class="aside-card"><h3>Existing clients</h3><p class="small" style="margin:0">Log in to the <a href="#/dashboard">client dashboard</a> to message your sourcing manager directly about an order.</p></div></div></div>' +
      '<div style="margin-top:36px">' + routeMap() + "</div></div></section>";
  };
  function bindContact() {
    $("#contact-form").addEventListener("submit", function (e) { e.preventDefault(); toast("Message sent. We will reply within one working day."); e.target.reset(); });
  }

  pages.faq = function () {
    return pageHead("Frequently asked questions", "", [["FAQ"]]) + '<section class="section"><div class="container"><div class="faq">' + C.faqs.map(faqItem).join("") + '</div><p style="margin-top:24px">Not answered here? <a href="#/contact">Ask the team</a>.</p></div></section>';
  };

  /* Quote flow */
  var quoteStep = 1;
  pages.quote = function (params) {
    var p = params.product ? prodOf(params.product) : null;
    if (p && !quoteDraft.product) { quoteDraft.product = p.name + " (" + p.id + ")"; quoteDraft.cat = p.cat; quoteDraft.qty = p.moq; }
    if (params.from === "enquiry" && enquiry.length && !quoteDraft.product) {
      quoteDraft.product = enquiry.map(function (e) { var x = prodOf(e.slug); return x.name + " (" + x.id + ") × " + e.qty; }).join("\n");
      quoteDraft.cat = prodOf(enquiry[0].slug).cat; quoteDraft.qty = enquiry.reduce(function (a, e) { return a + e.qty; }, 0);
    }
    var d = quoteDraft;
    var head = pageHead("Request a quote", "Three short steps. We reply with factory quotes and a landed cost within three working days.", [["Request a quote"]]);
    var prog = '<div class="progress"><span class="' + (quoteStep >= 1 ? "done" : "") + '"></span><span class="' + (quoteStep >= 2 ? "done" : "") + '"></span><span class="' + (quoteStep >= 3 ? "done" : "") + '"></span></div>';
    var side = '<div><div class="aside-card"><h3>What happens next</h3><ul><li>A sourcing manager reviews your brief within one working day and calls if anything is unclear.</li><li>We shortlist verified factories and negotiate in Mandarin.</li><li>You receive a comparison with FOB prices, MOQs, lead times and a landed cost to your postcode.</li><li>No fee until you place an order.</li></ul></div><div class="aside-card"><h3>Prefer to talk?</h3><p class="small" style="margin:0">Call <strong>' + C.company.phone + "</strong>, Monday to Friday 8.30 am to 5.30 pm.</p></div></div>";
    var form;
    if (quoteStep === 1) {
      form = '<form class="form" id="q-form"><h2 style="font-size:1.3rem">Step 1 of 3: the product</h2><div class="field"><label for="q-cat">Category</label><select id="q-cat">' + C.categories.map(function (c) { return '<option value="' + c.slug + '"' + (d.cat === c.slug ? " selected" : "") + ">" + esc(c.name) + "</option>"; }).join("") + '<option value="other">Something else</option></select></div>' +
        '<div class="field"><label for="q-product">Describe the product <small>(or paste a link, or a catalogue SKU)</small></label><textarea id="q-product" required placeholder="e.g. Ribbed roll neck jumper in three colours, sizes 8 to 16, our woven label">' + esc(d.product || "") + "</textarea></div>" +
        '<div class="row"><div class="field"><label for="q-qty">Quantity</label><input id="q-qty" type="number" min="1" value="' + (d.qty || "") + '" required></div><div class="field"><label for="q-target">Target landed price per unit <small>(optional, £)</small></label><input id="q-target" type="number" step="0.01" value="' + (d.target || "") + '"></div></div>' +
        '<div class="field"><label for="q-when">When do you need stock?</label><select id="q-when"><option>Within 6 weeks (air freight)</option><option selected>8 to 12 weeks (sea freight)</option><option>No fixed date, exploring costs</option></select></div>' +
        '<div class="field"><label class="check"><input type="checkbox" id="q-sample" ' + (d.sample ? "checked" : "") + "> I would like samples before ordering</label></div>" +
        '<button type="submit" class="btn btn-primary btn-lg">Continue</button></form>';
    } else if (quoteStep === 2) {
      form = '<form class="form" id="q-form"><h2 style="font-size:1.3rem">Step 2 of 3: requirements</h2><fieldset><legend>Customisation</legend><div class="radio-cards"><label><input type="radio" name="cust" value="none" checked> <span><strong>Stock item</strong><br>As the factory makes it</span></label><label><input type="radio" name="cust" value="logo"> <span><strong>Branded</strong><br>Logo, labels, packaging</span></label><label><input type="radio" name="cust" value="full"> <span><strong>Own design</strong><br>Our spec or sample</span></label></div></fieldset>' +
        '<fieldset><legend>Delivery</legend><div class="radio-cards"><label><input type="radio" name="del" value="door" checked> <span><strong>To our address</strong><br>Business premises in the UK</span></label><label><input type="radio" name="del" value="fba"> <span><strong>Amazon FBA</strong><br>Labelled and delivered to fulfilment</span></label><label><input type="radio" name="del" value="3pl"> <span><strong>Third party warehouse</strong><br>Our 3PL or fulfilment partner</span></label></div></fieldset>' +
        '<div class="field"><label for="q-postcode">Delivery postcode</label><input id="q-postcode" placeholder="e.g. LS10 1AB" value="' + esc(d.postcode || "") + '" required></div>' +
        '<div class="field"><label for="q-cert">Certifications or testing you know you need <small>(optional)</small></label><input id="q-cert" placeholder="e.g. UKCA, EN 71, BS 5852" value="' + esc(d.cert || "") + '"></div>' +
        '<div class="field"><label for="q-notes">Anything else</label><textarea id="q-notes" placeholder="Packaging, colours, materials, reference products, previous suppliers">' + esc(d.notes || "") + "</textarea></div>" +
        '<div style="display:flex;gap:10px"><button type="button" class="btn btn-light btn-lg" id="q-back">Back</button><button type="submit" class="btn btn-primary btn-lg">Continue</button></div></form>';
    } else {
      form = '<form class="form" id="q-form"><h2 style="font-size:1.3rem">Step 3 of 3: your details</h2><div class="row"><div class="field"><label for="q-name">Your name</label><input id="q-name" required value="' + esc(d.name || "") + '"></div><div class="field"><label for="q-co">Company</label><input id="q-co" required value="' + esc(d.co || "") + '"></div></div>' +
        '<div class="row"><div class="field"><label for="q-email">Work email</label><input id="q-email" type="email" required value="' + esc(d.email || "") + '"></div><div class="field"><label for="q-phone">Phone</label><input id="q-phone" type="tel" value="' + esc(d.phone || "") + '"></div></div>' +
        '<div class="row"><div class="field"><label for="q-type">Business type</label><select id="q-type"><option>Online retailer</option><option>Amazon or marketplace seller</option><option>High street retailer</option><option>Wholesaler or distributor</option><option>Brand or product startup</option><option>Other</option></select></div><div class="field"><label for="q-vat">VAT registered?</label><select id="q-vat"><option>Yes</option><option>No</option><option>Not yet, planning to</option></select></div></div>' +
        '<div class="field"><label class="check"><input type="checkbox" required> I agree to the <a href="#/terms">terms of business</a> and <a href="#/privacy">privacy policy</a>.</label></div>' +
        '<div style="display:flex;gap:10px"><button type="button" class="btn btn-light btn-lg" id="q-back">Back</button><button type="submit" class="btn btn-primary btn-lg">Send brief</button></div></form>';
    }
    return head + '<section class="section"><div class="container"><div class="two-col"><div>' + prog + form + "</div>" + side + "</div></div></section>";
  };
  function bindQuote() {
    var f = $("#q-form"); if (!f) return;
    var back = $("#q-back"); if (back) back.addEventListener("click", function () { quoteStep--; render(); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (quoteStep === 1) { quoteDraft.cat = $("#q-cat").value; quoteDraft.product = $("#q-product").value; quoteDraft.qty = $("#q-qty").value; quoteDraft.target = $("#q-target").value; quoteDraft.sample = $("#q-sample").checked; quoteStep = 2; render(); }
      else if (quoteStep === 2) { quoteDraft.postcode = $("#q-postcode").value; quoteDraft.cert = $("#q-cert").value; quoteDraft.notes = $("#q-notes").value; quoteStep = 3; render(); }
      else { quoteDraft.name = $("#q-name").value; quoteDraft.co = $("#q-co").value; quoteDraft.email = $("#q-email").value; quoteDraft.phone = $("#q-phone").value; quoteStep = 1; var ref = "Q-26-" + (2251 + Math.floor(Math.random() * 40)); var draft = quoteDraft; quoteDraft = {}; enquiry = []; saveEnquiry(); session("cl_lastquote", { ref: ref, draft: draft }); location.hash = "#/quote/sent"; }
    });
  }
  pages.quoteSent = function () {
    var q = session("cl_lastquote") || { ref: "Q-26-2251", draft: {} };
    return '<section class="section"><div class="container" style="max-width:820px"><div class="ok-panel">' + I.check + "<div><h2>Brief received. Reference " + q.ref + "</h2><p>Thanks" + (q.draft.name ? ", " + esc(q.draft.name.split(" ")[0]) : "") + ". A confirmation has been sent to " + (q.draft.email ? "<strong>" + esc(q.draft.email) + "</strong>" : "your email") + ". A sourcing manager will review the brief today and you will receive factory quotes with a landed cost within three working days.</p><div class=\"ref\">" + q.ref + '</div><p class="small muted" style="margin:10px 0 0">Quote reference for your records. Reply to the confirmation email to add files or samples to the brief.</p></div></div>' +
      '<div class="two-up" style="margin-top:24px"><div class="aside-card"><h3>While you wait</h3><ul><li><a href="#/shipping">Estimate freight</a> for your cartons</li><li>Read the <a href="#/insights/uk-import-duty-vat-china-2026">duty and VAT guide</a></li><li><a href="#/categories">Browse more products</a></li></ul></div><div class="aside-card"><h3>Need it sooner?</h3><p class="small" style="margin:0">Call the Manchester office on <strong>' + C.company.phone + "</strong> and quote " + q.ref + ".</p></div></div></div></section>";
  };

  pages.enquiry = function () {
    if (!enquiry.length) return pageHead("Enquiry list", "", [["Enquiry list"]]) + '<section class="section"><div class="container"><p>Your enquiry list is empty. Add products from the catalogue and request one quote for all of them.</p><a class="btn btn-primary" href="#/categories">Browse products</a></div></section>';
    var total = 0;
    var rows = enquiry.map(function (e) { var p = prodOf(e.slug); var v = e.qty * tierPrice(p, e.qty); total += v; return '<div class="enq-row"><img src="' + img(p.img) + '" alt=""><div><strong><a href="#/product/' + p.slug + '">' + esc(p.name) + '</a></strong><div class="small muted mono">' + p.id + " &middot; MOQ " + p.moq.toLocaleString("en-GB") + " " + p.unit + " &middot; " + gbp(tierPrice(p, e.qty)) + " FOB</div></div><input type=\"number\" min=\"" + p.moq + '" value="' + e.qty + '" data-slug="' + p.slug + '" aria-label="Quantity"><button type="button" class="rm" data-slug="' + p.slug + '">Remove</button></div>'; }).join("");
    return pageHead("Enquiry list", "One brief, several products. Adjust quantities then request a combined quote.", [["Enquiry list"]]) +
      '<section class="section"><div class="container"><div class="two-col"><div>' + rows + '</div><div><div class="aside-card"><h3>Summary</h3><dl class="kv" style="margin:0"><dt>Products</dt><dd>' + enquiry.length + "</dd><dt>Ex-factory value</dt><dd>" + gbp(total, 0) + '</dd><dt>Sourcing fee</dt><dd>' + gbp(Math.max(total * 0.05, 150), 0) + '</dd></dl><a class="btn btn-primary btn-block" style="margin-top:14px" href="#/quote?from=enquiry">Request a quote</a><p class="small muted" style="margin:10px 0 0">Freight, duty and VAT are added in the quote based on your delivery postcode.</p></div></div></div></div></section>';
  };
  function bindEnquiry() {
    $$(".enq-row input").forEach(function (i) { i.addEventListener("change", function () { var e = enquiry.filter(function (x) { return x.slug === i.dataset.slug; })[0]; if (e) { e.qty = Math.max(+i.value || 1, 1); saveEnquiry(); render(); } }); });
    $$(".enq-row .rm").forEach(function (b) { b.addEventListener("click", function () { enquiry = enquiry.filter(function (x) { return x.slug !== b.dataset.slug; }); saveEnquiry(); render(); }); });
  }

  pages.search = function (params) {
    var q = (params.q || "").trim().toLowerCase();
    var res = q ? C.products.filter(function (p) { return (p.name + " " + p.desc + " " + p.id + " " + catOf(p.cat).name).toLowerCase().indexOf(q) >= 0; }) : [];
    return pageHead("Search results", q ? res.length + " product" + (res.length === 1 ? "" : "s") + ' for "' + esc(params.q) + '"' : "Enter a product name, SKU or keyword.", [["Search"]]) +
      '<section class="section"><div class="container">' + (res.length ? '<div class="grid-products">' + res.map(pcard).join("") + "</div>" : '<p>No catalogue products match. Most of our sourcing is bespoke, so <a href="#/quote">send us a brief</a> and we will find it.</p>') + "</div></section>";
  };

  pages.login = function () {
    if (loggedIn) { location.hash = "#/dashboard"; return ""; }
    return '<section class="section"><div class="container"><div class="auth"><h1 style="font-size:1.8rem;text-align:center">Client login</h1><p class="muted" style="text-align:center">Track orders, approve inspection reports and download documents.</p><div class="form"><div class="demo-note">Demo account: <span class="mono">demo@bramleyandfinch.co.uk</span> with password <span class="mono">Demo2026</span></div><form id="login-form"><div class="field"><label for="l-email">Email</label><input id="l-email" type="email" value="demo@bramleyandfinch.co.uk" required></div><div class="field"><label for="l-pass">Password</label><input id="l-pass" type="password" value="Demo2026" required></div><div class="field"><label class="check"><input type="checkbox" checked> Keep me signed in on this device</label></div><button type="submit" class="btn btn-primary btn-block btn-lg">Sign in</button></form><p class="small muted" style="text-align:center;margin:14px 0 0"><a href="#/contact">Forgotten your password?</a> &middot; New client? <a href="#/quote">Send a brief</a> to get an account.</p></div></div></div></section>';
  };
  function bindLogin() {
    $("#login-form").addEventListener("submit", function (e) { e.preventDefault(); session("cl_user", { email: $("#l-email").value, name: "Hannah Bramley", co: "Bramley & Finch Ltd" }); loggedIn = true; renderHeaderState(); location.hash = "#/dashboard"; toast("Signed in as Hannah Bramley"); });
  }
  function logout() { try { sessionStorage.removeItem("cl_user"); } catch (e) {} loggedIn = false; renderHeaderState(); location.hash = "#/"; toast("Signed out"); }

  function dashShell(view, content) {
    var nav = [["dashboard", "Overview"], ["dashboard/orders", "Orders"], ["dashboard/quotes", "Quotes"], ["dashboard/documents", "Documents"], ["dashboard/account", "Account"]];
    return '<div class="page-head" style="padding-block:22px"><div class="container" style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap"><div><h1 style="font-size:1.6rem;margin:0">Bramley &amp; Finch Ltd</h1><span class="small muted">Client since March 2024 &middot; Growth plan &middot; Account manager Sophie Dunmore</span></div><div style="display:flex;gap:8px"><a class="btn btn-primary btn-sm" href="#/quote">New brief</a><button type="button" class="btn btn-light btn-sm" id="logout">Sign out</button></div></div></div>' +
      '<section class="section tight"><div class="container"><div class="dash"><nav class="dash-nav">' + nav.map(function (n) { return '<a href="#/' + n[0] + '" class="' + (view === n[0] ? "active" : "") + '">' + n[1] + "</a>"; }).join("") + "</nav><div>" + content + "</div></div></div></section>";
  }
  function statusPill(s) { var cls = { "Delivered": "ok", "In transit": "info", "QC inspection": "warn", "In production": "info", "Sampling": "neutral", "Quote": "neutral", "Customs cleared": "ok" }[s] || "neutral"; return '<span class="pill ' + cls + '">' + s + "</span>"; }
  function ordersTable(list) {
    return '<div class="table-wrap"><table class="dtable"><thead><tr><th>Reference</th><th>Product</th><th>Quantity</th><th>Value</th><th>Status</th><th>Next milestone</th></tr></thead><tbody>' + list.map(function (o) { return '<tr><td class="mono"><a href="#/dashboard/order/' + o.ref + '">' + o.ref + "</a></td><td>" + esc(o.product) + "</td><td>" + o.qty + '</td><td class="num">' + o.value + "</td><td>" + statusPill(o.status) + "</td><td>" + o.eta + "</td></tr>"; }).join("") + "</tbody></table></div>";
  }
  pages.dashboard = function (view, ref) {
    if (!loggedIn) { location.hash = "#/login"; return ""; }
    var content;
    if (view === "dashboard/orders") {
      content = '<div class="dash-card"><h3>All orders <span class="small muted">' + C.orders.length + " orders</span></h3>" + ordersTable(C.orders) + "</div>";
    } else if (view === "dashboard/order") {
      var o = C.orders.filter(function (x) { return x.ref === ref; })[0]; if (!o) return pages.notFound();
      var stages = ["Order confirmed, deposit paid", "Sampling approved", "In production", "Pre-shipment inspection", "Balance paid, ex-factory", "In transit", "Customs cleared", "Delivered"];
      var dates = ["12 Jul 2026", "24 Jul 2026", "27 Jul 2026", "22 Aug 2026", "25 Aug 2026", "29 Aug 2026", "Expected 1 Oct 2026", "Expected 3 Oct 2026"];
      content = '<div class="dash-card"><h3>Order ' + o.ref + " " + statusPill(o.status) + '</h3><dl class="kv"><dt>Product</dt><dd><a href="#/product/' + o.slug + '">' + esc(o.product) + "</a></dd><dt>Quantity</dt><dd>" + o.qty + "</dd><dt>Order value</dt><dd>" + o.value + " ex-factory</dd><dt>Freight</dt><dd>" + o.mode + "</dd>" + (o.container ? "<dt>Container</dt><dd class=\"mono\">" + o.container + "</dd><dt>Vessel</dt><dd>" + o.vessel + "</dd>" : "") + "<dt>Next milestone</dt><dd>" + o.eta + "</dd></dl></div>" +
        '<div class="two-up"><div class="dash-card"><h3>Progress</h3><ul class="timeline">' + stages.map(function (s, i) { var st = i < o.stage ? "done" : i === o.stage ? "now" : ""; return '<li class="' + st + '"><span class="dot">' + (st === "done" ? I.check : "") + "</span><div><strong>" + s + "</strong><span>" + (i <= o.stage ? dates[i] : "") + "</span></div></li>"; }).join("") + "</ul></div>" +
        '<div><div class="dash-card"><h3>Documents</h3><ul style="list-style:none;padding:0;margin:0;display:grid;gap:8px" class="small">' + ["Pro forma invoice " + o.ref + ".pdf", "Inspection report " + o.ref + "-PSI.pdf", "Packing list " + o.ref + ".pdf", "Commercial invoice " + o.ref + ".pdf", "Bill of lading " + (o.container ? o.container.replace(" ", "") : "pending") + ".pdf"].map(function (d, i) { return '<li style="display:flex;gap:8px;align-items:center"><span style="width:18px;color:var(--muted)">' + I.doc + "</span>" + (i < o.stage + 1 ? '<a href="#/dashboard/documents">' + d + "</a>" : '<span class="muted">' + d + "</span>") + "</li>"; }).join("") + "</ul></div>" +
        '<div class="dash-card"><h3>Messages</h3><div class="small"><p style="margin:0 0 10px"><strong>Sophie Dunmore</strong> <span class="muted">9 Sep, 14:12</span><br>' + (o.stage >= 5 ? "Vessel departed Yantian on schedule. Felixstowe ETA is unchanged. Haulage to Trafford Park is booked for the day after clearance." : o.stage === 3 ? "Inspection is booked for Tuesday. Report and photos will be in your dashboard the same day." : "Factory confirms materials are in and cutting starts Monday. Weekly photos to follow.") + '</p><form onsubmit="return false"><textarea style="width:100%;font:inherit;padding:8px;border:1px solid var(--stone-2);border-radius:4px;min-height:60px" placeholder="Reply to Sophie"></textarea><button type="button" class="btn btn-sm btn-ink" style="margin-top:6px" onclick="window.CL.toast(\'Message sent to Sophie Dunmore\')">Send</button></form></div></div></div></div>';
    } else if (view === "dashboard/quotes") {
      content = '<div class="dash-card"><h3>Open quotes</h3><div class="table-wrap"><table class="dtable"><thead><tr><th>Reference</th><th>Product</th><th>Quantity</th><th>Status</th><th>Total</th><th>Requested</th></tr></thead><tbody>' + C.quotes.map(function (q) { return '<tr><td class="mono">' + q.ref + "</td><td>" + esc(q.product) + "</td><td>" + q.qty + "</td><td>" + statusPill(q.status === "Quote ready" ? "QC inspection" : q.status === "Accepted" ? "Delivered" : "Sampling").replace(/>[^<]+</, ">" + q.status + "<") + "</td><td>" + (q.total || '<span class="muted">Pending</span>') + "</td><td>" + q.date + "</td></tr>"; }).join("") + "</tbody></table></div></div>";
    } else if (view === "dashboard/documents") {
      var docs = [["Duty and VAT statement, August 2026", "C79 equivalent, postponed VAT", "2 Sep 2026"], ["Inspection report CL-26-08290-PSI", "Vegan Leather Satchel, passed", "20 Aug 2026"], ["Bill of lading MSKU2201983", "Maersk Elba 233W", "26 Jul 2026"], ["Factory audit report, Chaozhou Ruiheng Ceramics", "On-site audit March 2026", "14 Mar 2026"], ["Terms of business, signed", "Growth plan agreement", "3 Mar 2024"], ["EORI and VAT authority letter", "Direct representation for customs", "3 Mar 2024"]];
      content = '<div class="dash-card"><h3>Documents</h3><div class="table-wrap"><table class="dtable"><thead><tr><th>Document</th><th>Detail</th><th>Date</th><th></th></tr></thead><tbody>' + docs.map(function (d) { return "<tr><td><strong>" + d[0] + "</strong></td><td>" + d[1] + "</td><td>" + d[2] + '</td><td><button type="button" class="btn btn-sm btn-light" onclick="window.CL.toast(\'Download started\')">PDF</button></td></tr>'; }).join("") + "</tbody></table></div></div>";
    } else if (view === "dashboard/account") {
      content = '<div class="dash-card"><h3>Company details</h3><dl class="kv"><dt>Company</dt><dd>Bramley &amp; Finch Ltd</dd><dt>Company number</dt><dd class="mono">14208871</dd><dt>VAT number</dt><dd class="mono">GB 412 8830 19</dd><dt>EORI</dt><dd class="mono">GB412883019000</dd><dt>Delivery address</dt><dd>Unit 3, Hunslet Trading Estate, Leeds LS10 1BL</dd><dt>Plan</dt><dd>Growth, £390 per month, renews 1 October 2026</dd><dt>Account manager</dt><dd>Sophie Dunmore, sophie.dunmore@cantonlink.co.uk</dd></dl></div><div class="dash-card"><h3>Users</h3><div class="table-wrap"><table class="dtable"><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody><tr><td>Hannah Bramley</td><td>hannah@bramleyandfinch.co.uk</td><td>Owner</td></tr><tr><td>Demo User</td><td>demo@bramleyandfinch.co.uk</td><td>Buyer</td></tr><tr><td>Rob Finch</td><td>rob@bramleyandfinch.co.uk</td><td>Finance</td></tr></tbody></table></div></div>';
    } else {
      content = '<div class="tiles"><div class="tile"><span>Active orders</span><strong>4</strong><em>1 in transit</em></div><div class="tile"><span>Open quotes</span><strong>2</strong><em>1 ready to accept</em></div><div class="tile"><span>Spend this year</span><strong>£24,635</strong><em>ex-factory</em></div><div class="tile"><span>Next delivery</span><strong>3 Oct</strong><em>CL-26-08412</em></div></div>' +
        '<div class="dash-card"><h3>Recent orders <a class="small" href="#/dashboard/orders">All orders</a></h3>' + ordersTable(C.orders.slice(0, 4)) + "</div>" +
        '<div class="two-up"><div class="dash-card"><h3>Shipment CL-26-08412</h3><ul class="timeline">' + [["Departed Yantian", "29 Aug", "done"], ["Transhipment Singapore", "6 Sep", "done"], ["At sea, Indian Ocean", "Position updated 11 Sep 06:40", "now"], ["Arrive Felixstowe", "Expected 1 Oct", ""], ["Cleared and delivered to Leeds", "Expected 3 Oct", ""]].map(function (s) { return '<li class="' + s[2] + '"><span class="dot">' + (s[2] === "done" ? I.check : "") + "</span><div><strong>" + s[0] + "</strong><span>" + s[1] + "</span></div></li>"; }).join("") + "</ul></div>" +
        '<div class="dash-card"><h3>Actions needed</h3><ul style="padding-left:18px;margin:0;display:grid;gap:8px" class="small"><li>Quote <span class="mono">Q-26-2214</span> for 40 sofas is ready. <a href="#/dashboard/quotes">Review and accept</a>.</li><li>Inspection for <span class="mono">CL-26-08377</span> is booked for 16 September. Approve the report to release the balance.</li><li>Samples for <span class="mono">CL-26-08501</span> ship 16 September by DHL.</li><li>Golden Week: factories close 1 to 7 October. <a href="#/insights/golden-week-2026-lead-times">Plan reorders now</a>.</li></ul></div></div>';
    }
    return dashShell(view === "dashboard/order" ? "dashboard/orders" : view, content);
  };

  pages.privacy = function () {
    return pageHead("Privacy policy", "Last updated 1 May 2026", [["Privacy"]]) + '<section class="section"><div class="container"><div class="article"><p>CantonLink Sourcing Ltd (company number ' + C.company.companyNo + ") is the data controller for personal data collected through this website and in the course of providing sourcing services. Our registered office is at " + C.company.ukOffice.join(", ") + ".</p><h2>What we collect</h2><p>Contact details you give us when you send a brief, request a quote, create an account or contact us. Order, shipment and payment records needed to provide the service. Website usage data collected through cookies with your consent.</p><h2>Why we use it</h2><p>To provide quotes and manage orders under our contract with you. To meet legal obligations including customs declarations made on your behalf, anti-money laundering checks and accounting records. With your consent, to send occasional updates on rates, fair dates and regulatory changes. You can withdraw consent at any time.</p><h2>Who we share it with</h2><p>Factories and inspection staff in China receive only the details needed to produce and ship your order. Our freight partner and HMRC receive the details required for customs entries. We do not sell personal data.</p><h2>Transfers outside the UK</h2><p>Order details are shared with our Guangzhou office and with suppliers in China. Transfers are covered by the International Data Transfer Agreement issued by the Information Commissioner's Office.</p><h2>Your rights</h2><p>You can ask for a copy of your data, ask us to correct or delete it, or object to processing. Email privacy@cantonlink.co.uk. You can also complain to the Information Commissioner's Office at ico.org.uk.</p></div></div></section>";
  };
  pages.terms = function () {
    return pageHead("Terms of business", "Version 4.2, effective 1 January 2026", [["Terms"]]) + '<section class="section"><div class="container"><div class="article"><h2>1. Our role</h2><p>CantonLink Sourcing Ltd acts as your sourcing agent. We identify suppliers, negotiate on your behalf, manage production and arrange inspection and freight. The contract of sale for goods is between you and the supplier unless we agree in writing to act as principal.</p><h2>2. Fees</h2><p>Our sourcing fee is a percentage of the ex-factory order value as set out on the plan you have chosen, subject to the minimum fee. Inspection, verification, freight, customs and other services are charged at the rates published on our website at the time of order or as quoted.</p><h2>3. Payment</h2><p>You pay CantonLink in pounds sterling. Supplier deposits and balances are held in a segregated client account and released to the supplier only when the agreed milestone has been met. Balances are normally released on your approval of the pre-shipment inspection report.</p><h2>4. Quality and claims</h2><p>Where an inspection is carried out and passed, goods are accepted as conforming unless a defect is discovered within 14 days of delivery that the inspection should reasonably have found. We will manage any claim with the supplier at no additional fee.</p><h2>5. Freight</h2><p>Freight is arranged through a BIFA member forwarder under BIFA Standard Trading Conditions 2021. Transit times are estimates.</p><h2>6. Customs</h2><p>Where we arrange customs clearance we act as your direct representative. You remain responsible for the accuracy of the information you provide and for duty and VAT due.</p><h2>7. Liability</h2><p>Our liability for any order is limited to the fees paid to us for that order, except where liability cannot be limited by law.</p><h2>8. Law</h2><p>These terms are governed by the law of England and Wales.</p></div></div></section>';
  };
  pages.notFound = function () {
    return '<section class="section"><div class="container" style="text-align:center;padding-block:60px"><span class="eyebrow">Error 404</span><h1>That page has moved or does not exist</h1><p class="muted">Try the catalogue or send us a brief.</p><div style="display:flex;gap:10px;justify-content:center"><a class="btn btn-primary" href="#/categories">Browse products</a><a class="btn btn-outline" href="#/">Home</a></div></div></section>';
  };

  /* ---------- router ---------- */
  var titles = { home: "CantonLink Sourcing | UK China sourcing agent", categories: "Product categories", howItWorks: "How it works", services: "Services and pricing", pricing: "Plans", shipping: "Shipping calculator", suppliers: "Verified suppliers", caseStudies: "Case studies", insights: "Insights", about: "About", contact: "Contact", faq: "FAQ", quote: "Request a quote", quoteSent: "Brief received", enquiry: "Enquiry list", search: "Search", login: "Client login", dashboard: "Client dashboard", privacy: "Privacy policy", terms: "Terms of business", notFound: "Page not found" };
  function parse() {
    var h = location.hash.replace(/^#/, "") || "/";
    var qi = h.indexOf("?"), params = {};
    if (qi >= 0) { h.slice(qi + 1).split("&").forEach(function (kv) { var p = kv.split("="); params[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || "").replace(/\+/g, " ")); }); h = h.slice(0, qi); }
    var parts = h.replace(/^\/|\/$/g, "").split("/");
    return { parts: parts, params: params };
  }
  function render() {
    var r = parse(), p = r.parts, html = "", page = "home", bind = null, navKey = "";
    var main = $("#app");
    switch (p[0]) {
      case "": page = "home"; html = pages.home(); break;
      case "how-it-works": page = "howItWorks"; html = pages.howItWorks(); navKey = "how"; break;
      case "categories": page = "categories"; html = pages.categories(); navKey = "products"; break;
      case "category": page = "category"; html = pages.category(p[1]); bind = function () { bindCategory(p[1]); }; navKey = "products"; break;
      case "product": page = "product"; html = pages.product(p[1]); bind = function () { bindProduct(p[1]); }; navKey = "products"; break;
      case "services": page = "services"; html = pages.services(); navKey = "services"; break;
      case "pricing": page = "pricing"; html = pages.pricing(); navKey = "pricing"; break;
      case "shipping": page = "shipping"; html = pages.shipping(); bind = bindShipping; navKey = "shipping"; break;
      case "suppliers": page = "suppliers"; html = pages.suppliers(); bind = bindSuppliers; navKey = "suppliers"; break;
      case "case-studies": page = "caseStudies"; html = pages.caseStudies(); navKey = "about"; break;
      case "insights": page = p[1] ? "article" : "insights"; html = p[1] ? pages.article(p[1]) : pages.insights(); navKey = "insights"; break;
      case "about": page = "about"; html = pages.about(); navKey = "about"; break;
      case "contact": page = "contact"; html = pages.contact(); bind = bindContact; navKey = "contact"; break;
      case "faq": page = "faq"; html = pages.faq(); break;
      case "quote": page = p[1] === "sent" ? "quoteSent" : "quote"; html = p[1] === "sent" ? pages.quoteSent() : pages.quote(r.params); bind = bindQuote; break;
      case "enquiry": page = "enquiry"; html = pages.enquiry(); bind = bindEnquiry; break;
      case "search": page = "search"; html = pages.search(r.params); break;
      case "login": page = "login"; html = pages.login(); bind = bindLogin; break;
      case "dashboard": page = "dashboard"; html = pages.dashboard(p[1] ? "dashboard/" + p[1] : "dashboard", p[2]); bind = function () { var b = $("#logout"); if (b) b.addEventListener("click", logout); }; break;
      case "privacy": page = "privacy"; html = pages.privacy(); break;
      case "terms": page = "terms"; html = pages.terms(); break;
      default: page = "notFound"; html = pages.notFound();
    }
    if (!html) return;
    main.innerHTML = '<div class="fade-in">' + html + "</div>";
    var t = titles[page];
    if (page === "product" && prodOf(p[1])) t = prodOf(p[1]).name;
    if (page === "category" && catOf(p[1])) t = catOf(p[1]).name;
    if (page === "article") { var a = C.articles.filter(function (x) { return x.slug === p[1]; })[0]; if (a) t = a.title; }
    document.title = page === "home" ? t : t + " | CantonLink Sourcing";
    $$(".nav a[data-nav]").forEach(function (el) { el.classList.toggle("active", el.dataset.nav === navKey); });
    if (bind) bind();
    window.scrollTo(0, 0);
    $("#mobile-nav").classList.remove("open");
  }

  /* ---------- header / footer ---------- */
  function renderHeaderState() {
    $$(".js-account").forEach(function (el) { el.innerHTML = I.user + (loggedIn ? '<span class="lbl">My account</span>' : '<span class="lbl">Client login</span>'); el.href = loggedIn ? "#/dashboard" : "#/login"; });
  }
  function initChrome() {
    $("#mega").innerHTML = C.categories.map(function (c) { return '<a href="#/category/' + c.slug + '"><img src="' + img(c.img) + '" alt=""><span>' + esc(c.name) + "<small>" + C.products.filter(function (p) { return p.cat === c.slug; }).length + " products</small></span></a>"; }).join("") + '<a class="all" href="#/categories">View all categories</a>';
    $("#mobile-links").innerHTML = [["#/categories", "Products"], ["#/how-it-works", "How it works"], ["#/services", "Services"], ["#/pricing", "Pricing"], ["#/shipping", "Shipping calculator"], ["#/suppliers", "Suppliers"], ["#/insights", "Insights"], ["#/about", "About"], ["#/contact", "Contact"], ["#/enquiry", "Enquiry list"], ["#/login", "Client login"]].map(function (l) { return '<a href="' + l[0] + '">' + l[1] + "</a>"; }).join("");
    $("#burger").addEventListener("click", function () { $("#mobile-nav").classList.toggle("open"); });
    $$("form.js-search").forEach(function (f) { f.addEventListener("submit", function (e) { e.preventDefault(); var q = $("input", f).value.trim(); if (q) location.hash = "#/search?q=" + encodeURIComponent(q); }); });
    renderHeaderState(); updateBadge();
    var cookie = $("#cookie");
    if (!store("cl_cookie")) { cookie.hidden = false; }
    $$("#cookie button").forEach(function (b) { b.addEventListener("click", function () { store("cl_cookie", b.dataset.choice); cookie.hidden = true; }); });
    $("#year").textContent = new Date().getFullYear();
    // enquiry buttons inside product cards are delegated
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-add]"); if (b) { addToEnquiry(b.dataset.add); }
    });
  }
  C.toast = toast;
  window.addEventListener("hashchange", render);
  document.addEventListener("DOMContentLoaded", function () { initChrome(); render(); });
})();
