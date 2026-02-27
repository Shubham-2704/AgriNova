import requests

api_key = '7c6f9435eddc2f9063fe9233bb6a273a'
city = 'Ahmedabad'
url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'

print(f"\n{'='*60}")
print(f"Testing Weather API for: {city}")
print(f"API URL: {url}")
print(f"{'='*60}")

response = requests.get(url, timeout=10)

print(f"\nResponse Status Code: {response.status_code}")
print(f"\n✅ Full API Response:")
print(response.json())
print(f"\n{'='*60}\n")
