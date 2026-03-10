# VidFind — GPU Price Finder

> Find the best graphics cards under ₹20,000 with live search and smart pricing filters.

![App Screenshot](image/Screenshot%202025-07-12%20200120.png)

---

## Overview

**VidFind** is a lightweight Flask web application that helps users discover and compare budget GPU listings sourced from multiple online retailers. It features a real-time keyword search, an interactive price-range slider, and a clean dark-mode UI — all served from a static JSON dataset.

---

## Features

- 🔍 **Live Search** — Filter GPU listings instantly by keyword (e.g. `RTX`, `RX 6600`, `12GB`)
- 💰 **Price Slider** — Set a maximum budget (₹5,000–₹20,000) and results update in real time
- 🔄 **Data Refresh** — One-click button to reload the product dataset via a POST endpoint
- 🌙 **Dark Mode UI** — Sleek purple/cyan gradient theme with glassmorphism card design
- 📦 **JSON API** — Expose product data programmatically via a REST endpoint
- 📱 **Responsive** — Mobile-friendly layout using Bootstrap 5 grid

---

## Project Structure

```
Simple-GPU-Finder/
│
├── app.py                  # Flask app — routes, data loading, price parsing
├── scraper.py              # Data pipeline — reads scraping.json → graphic_cards.json
├── run.py                  # Production entry point using Waitress WSGI server
│
├── data/
│   ├── scraping.json       # Raw scraped GPU data (source dataset)
│   └── graphic_cards.json  # Transformed dataset served by the app
│
├── templates/
│   ├── base.html           # Base layout — navbar, footer, Bootstrap, JS imports
│   └── index.html          # Main page — hero, filter panel, GPU card listings
│
├── static/
│   ├── css/style.css       # Custom dark-mode styles, animations, card design
│   └── js/app.js           # Client-side filtering, AJAX search, toast notifications
│
├── requirements.txt        # Python dependencies
├── Procfile                # Deployment config (e.g. Heroku)
└── README.md
```

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Backend    | Python 3, Flask, Jinja2                 |
| Frontend   | HTML5, Vanilla CSS, JavaScript (ES6+)   |
| UI Library | Bootstrap 5 (CDN)                       |
| Typography | Google Fonts — Inter                    |
| WSGI       | Waitress (production), Flask dev server |
| Data       | JSON (static file-based dataset)        |

---

## API Endpoints

| Method | Endpoint                          | Description                              |
|--------|-----------------------------------|------------------------------------------|
| `GET`  | `/`                               | Renders the main page with all products  |
| `GET`  | `/api/products`                   | Returns all products as JSON             |
| `GET`  | `/search?q=<term>&max_price=<n>`  | Returns filtered products as JSON        |
| `POST` | `/refresh`                        | Triggers a data refresh, returns count   |

**Example `/search` request:**
```
GET /search?q=rtx&max_price=15000
```

**Example `/api/products` response:**
```json
[
  {
    "title": "ZOTAC Gaming GeForce RTX 3050 6GB",
    "description": "NVIDIA powered GPU with 6GB GDDR6 memory...",
    "price": 14999.0,
    "source": "Amazon",
    "link": "https://www.amazon.in/..."
  }
]
```

---

## Setup & Running

### 1. Clone the repository

```bash
git clone https://github.com/Ankit-euphemism/Simple-GPU-Finder.git
cd Simple-GPU-Finder
```

### 2. Create and activate a virtual environment

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. (Optional) Regenerate the product dataset

The app ships with a pre-built `data/graphic_cards.json`. To regenerate it from the raw source:

```bash
python scraper.py
```

### 5. Run the application

**Development server (Flask):**
```bash
python app.py
```

**Production server (Waitress — cross-platform):**
```bash
python run.py
```

> ⚠️ `waitress` must be installed (`pip install waitress`). The classic `waitress-serve` CLI wrapper may fail on Windows due to a `fcntl` dependency, but `python run.py` works correctly on all platforms.

### 6. Open in browser

```
http://localhost:5000
```

---

## Data Pipeline

```
data/scraping.json
      │
      ▼
  scraper.py          ← Reads raw data, transforms fields, filters by price
      │
      ▼
data/graphic_cards.json
      │
      ▼
    app.py            ← Loads JSON, exposes via Flask routes & Jinja2 templates
```

The `scraper.py` script reads `data/scraping.json`, filters GPUs under ₹20,000, generates descriptions, and writes the cleaned output to `data/graphic_cards.json`. The Flask app then serves this file on every request.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
