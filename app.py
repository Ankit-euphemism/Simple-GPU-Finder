from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)

import re

# load the sample data
def load_data():
    try:
        with open('data/graphic_cards.json') as f:
            data = f.read().strip()
            if not data:
                return []
            return json.loads(data)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def parse_price(price_str):
    # Remove non-numeric characters except dot and comma, then convert to float
    if not price_str:
        return 0.0
    # Remove currency symbols and whitespace
    cleaned = re.sub(r'[^\d.,]', '', price_str)
    # Replace comma with empty string for thousands separator
    cleaned = cleaned.replace(',', '')
    try:
        return float(cleaned)
    except ValueError:
        return 0.0

def transform_card(card):
    return {
        'title': card.get('title_elem', 'N/A'),
        'description': card.get('description', ''),  # default empty if missing
        'price': parse_price(card.get('price_elem', '0')),
        'source': card.get('source', 'N/A'),
        'link': card.get('link_elem', '#')
    }

# render the main page
@app.route('/')
def index():
    cards = load_data()
    transformed_cards = [transform_card(card) for card in cards]
    return render_template('index.html', products=transformed_cards, last_updated=datetime.now().strftime("%d %b %Y %H:%M"))

# endpoint for the products data in json format
@app.route('/api/products')
def api_products():
    cards = load_data()
    transformed_cards = [transform_card(card) for card in cards]
    return jsonify(transformed_cards)

# refresh the page if needed
@app.route('/refresh', methods=['POST'])
def refresh_data():
    # In production, this would call the scraper
    return jsonify({
        "status": "success",
        "message": "Data refresh triggered",
        "new_count": len(load_data()),
        "timestamp": datetime.now().isoformat()
    })

# filter or search the data according to the input
@app.route('/search')
def search():
    query = request.args.get('q', '').lower()
    max_price = float(request.args.get('max_price', 20000))

    cards = load_data()
    transformed_cards = [transform_card(card) for card in cards]
    results = [
        card for card in transformed_cards
        if (query in card['title'].lower() or query in card['description'].lower())
           and card['price'] <= max_price
    ]

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
