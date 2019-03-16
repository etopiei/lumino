import re
import json
import requests
from bs4 import BeautifulSoup

stop_ids = []

with open("stop_info.json") as stop_data:
    train_info = json.loads(stop_data.read())
    for stop_info in train_info["stops"]:
        stop_ids.append(stop_info["id"])

accessibility_data = {}
endpoint = "https://beta.ptv.vic.gov.au/stop/"
printed = False

for x in stop_ids:
    # scape info about accessibility
    stop_data = requests.get(endpoint + str(x)).text
    soup = BeautifulSoup(stop_data, 'html.parser')
    json_access_info = soup.findAll("div", {"class": "js-react", "data-init-props": re.compile(r".*")})
    all_stop_data = json_access_info[1]["data-init-props"]
    stop_data_json = json.loads(all_stop_data)
    stop_data_json["type_of_transport"] = re.search("/(.*)/", stop_data_json["stop"]["link"]).group(1)
    with open("stop-data-" + str(x)) as out_file:
        out_file.write(json.dumps(stop_data_json))
     
