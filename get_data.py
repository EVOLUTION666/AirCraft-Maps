import requests
import webbrowser

# get current data from Central Bank
url = 'http://api.aviationstack.com/v1/flights?access_key=e7fb4a4cefd2b81f3d8152e3397a4d2a'

request = requests.get(url, allow_redirects=True)
data = "window.flights = JSON.parse('" + request.text + "')"
open('flights.js', 'w').write(data)

# open HTML file in browser
'''new = 2
urlExe = "index.html"
webbrowser.open(urlExe, new=new)'''