# GPU Finder - Top Graphic Cards under ₹20,000

Information tool for graphic cards under ₹20,000 with search and refresh capabilities.

## Data Source
The data is sourced from the static json website, specifically from the URL: \data\scraping

## Features
- Display 15 graphic cards with prices
- Real-time search/filter by keyword and price
- One-click data refresh
- Responsive design
- JSON API endpoint

## Setup Instructions
1. Clone repository:
   git clone https://github.com/yourusername/graphic-card-finder.git
   cd graphic-card-finder

2. Install dependencies:
    pip install -r requirements.txt

3. Run the application:
    python app.py

4. Access the application:
    Access the web interface at: http://localhost:5000

5. Use search box and price slider to filter

6. Click "Refresh Data" to update information

## API Endpoint

GET /api/products: Get all products as JSON

POST /refresh: Trigger data refresh

GET /search?q=search_term&max_price=15000: Search products

## Technologies Used

flask, requests json , re, HTML, bootstrap CDN, CSS, JavaScript, jinja2

## Sample Output

![alt text](<image/Screenshot 2025-07-12 200120.png>)
