import json
import random

def ScrapeData():
    
    products = []

    # Load the scraping data from the JSON file
    try:
        with open('data/scraping.json') as f:
            # Load the JSON data
            data = json.load(f)
            if not data:
                return []
            return data
        
        # Iterate through the data and extract relevant information
        for item in data:
            title_elem = data["title_elem"]
            price_elem = float(data["price_elem"])
            link_elem = data["link_elem"]
            
            # Check if the required elements are present
            if not (title_elem and price_elem and link_elem):
                continue
            
            # Check if the title contains "graphics card"
                if "graphics card" or "graphic card" not in title_elem.lower():
                    continue
            
            # validate the title format
            title = title_elem.text.strip()
            
            # Extract the price from the string and convert to float
            price = float(price_elem.replace('₹', '').replace(',', '').strip())

            # Validate the link format
            if not link_elem.startswith("https://www.amazon.in/"):
                continue
            # Validate the link format
            link= link_elem.strip()
            
            # Skip products above ₹20,000
            if price > 20000:
                continue
            
            # Generate realistic descriptions
            brands = ['NVIDIA', 'AMD', 'ZOTAC', 'Gigabyte', 'ASUS', 'MSI']
            vram = ['4GB', '6GB', '8GB', '12GB']
            interfaces = ['Pcie 3.0', 'Pcie 4.0']
            
            description = (
                f"{random.choice(brands)} powered GPU with {random.choice(vram)} GDDR6 memory. "
                f"Features {random.choice(interfaces)} interface, dual-fan cooling, and "
                "HDMI/DisplayPort outputs. Ideal for gaming and graphic-intensive tasks."
            )
            
            products.append({
                "title": title,
                "description": description,
                "price": price,
                "source": "Amazon",
                "link": link
            })
            
            if len(products) >= 15:
                break
                
        return products
            
    except (FileNotFoundError, json.JSONDecodeError):
        print("Error reading scraping data. Returning empty list.")
        return get_random_item([])
    
    
    
def get_random_item(data):
    if not data:
        return None
    return random.choice(data)

if __name__ == '__main__':
    cards = ScrapeData()
    with open('data/graphic_cards.json', 'w') as f:
        json.dump(cards, f, indent=2)
    print(f"Scraped {len(cards)} products")
