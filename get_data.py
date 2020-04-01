import json

lines = open('airports.csv', encoding='utf-8', newline='').readlines()

coordinatesAirports = []

for line in lines:
    data_line = line.replace('"', '').replace("'", "").split(',')
    if data_line[2] == "large_airport":
        array_airport = [data_line[3], data_line[4], data_line[5], data_line[1]]
        coordinatesAirports.append(array_airport)


coordinatesAirports = sorted(coordinatesAirports, key=lambda x: x[0])


# put data in JS file
dataJson = json.dumps(coordinatesAirports)
content = "window.data = JSON.parse('" + dataJson + "')"
open('data.js', 'w').write(content)
