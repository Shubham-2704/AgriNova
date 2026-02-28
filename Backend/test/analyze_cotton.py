import pandas as pd

df = pd.read_csv('Final_dataset.csv')
cotton = df[df['Crop'].str.contains('Cotton', case=False, na=False)]

print('='*70)
print('COTTON CULTIVATION - OPTIMAL CONDITIONS ANALYSIS')
print('='*70)

print(f'\n📊 Total Cotton records in dataset: {len(cotton)}')

print(f'\n🌾 SEASONS for Cotton:')
print(cotton['Season'].value_counts())

print(f'\n🌱 SOIL TYPES for Cotton:')
print(cotton['Soil Type'].value_counts())

print(f'\n💧 WATER AVAILABILITY for Cotton:')
print(cotton['Water_Availability'].value_counts())

print(f'\n🌡️ AVERAGE CLIMATE CONDITIONS for Cotton:')
print(f'  Average Temperature: {cotton["avgTemp"].mean():.2f}°C')
print(f'  Rainfall: {cotton["Rainfall"].mean():.2f} mm')
print(f'  Precipitation: {cotton["Precipitation"].mean():.2f} mm')
print(f'  pH Level: {cotton["pH"].mean():.2f}')
print(f'  Cloud Cover: {cotton["Cloud Cover"].mean():.2f}%')
print(f'  Vapor Pressure: {cotton["vapPressure"].mean():.2f} hPa')
print(f'  Wet Day Frequency: {cotton["Wet Day Freq"].mean():.2f}')

print(f'\n🏙️ TOP CITIES for Cotton Production:')
print(cotton['City'].value_counts().head(10))

print(f'\n📈 PRODUCTION STATISTICS:')
print(f'  Average Production: {cotton["Production"].mean():.2f} kg')
print(f'  Average Area: {cotton["Area"].mean():.2f} acres')
print(f'  Average Price: ₹{cotton["AVG_Price"].mean():.2f}/kg')

print(f'\n✅ RECOMMENDED INPUT CONDITIONS FOR COTTON:')
print('='*70)
print(f'  Season: {cotton["Season"].mode()[0]}')
print(f'  Soil Type: {cotton["Soil Type"].mode()[0]}')
print(f'  Water Availability: {cotton["Water_Availability"].mode()[0]}')
print(f'  Average Temperature: {cotton["avgTemp"].mean():.1f}°C')
print(f'  Rainfall: {cotton["Rainfall"].mean():.1f} mm')
print(f'  pH Level: {cotton["pH"].mean():.1f}')
print(f'  Cloud Cover: {cotton["Cloud Cover"].mean():.1f}%')
print('='*70)

print(f'\n💡 TO GET COTTON AS OUTPUT IN THE APP:')
print('='*70)
print('  1. Select Season: Kharif (most common)')
print('  2. Select Soil Type: Red, Loamy, or Black')
print('  3. Select Water Availability: High')
print('  4. Select City: Any Gujarat city (Ahmedabad, Rajkot, Surendranagar, etc.)')
print('  5. Weather conditions will auto-fetch (should be around 28°C)')
print('='*70)

