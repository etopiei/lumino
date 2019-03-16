import re
import json
import aiohttp
from bs4 import BeautifulSoup
import asyncio

endpoint = "https://beta.ptv.vic.gov.au/stop/"

async def fetch_data(session, url, x):
    print("Started fetching from: " + url + str(x))
    async with session.get(url + str(x)) as response:
        res = await response.text()
        return [res, x]

async def write_to_json(stop_data, x):
    soup = BeautifulSoup(stop_data, 'html.parser')
    json_access_info = soup.findAll("div", {"class": "js-react", "data-init-props": re.compile(r".*")})
    try:
        all_stop_data = json_access_info[1]["data-init-props"]
        stop_data_json = json.loads(all_stop_data)
        stop_data_json["type_of_transport"] = re.search("([^\/]+$)", stop_data_json["stop"]["link"][:-1]).group(1)
        with open("output/stop-data-" + str(x) + ".json", "w") as out_file:
            out_file.write(json.dumps(stop_data_json))
        print("Wrote out")
    except:
        print("Something broke.")

async def main(stop_ids):

    futures = []
    async with aiohttp.ClientSession() as session:
        for x in stop_ids:
            futures.append(fetch_data(session, endpoint, str(x)))

        html_contents = await asyncio.gather(*futures)
        for html_data in html_contents:
            await write_to_json(html_data[0], html_data[1])

stop_ids = []
with open("stop_info.json") as stop_data:
    train_info = json.loads(stop_data.read())
    for stop_info in train_info["stops"]:
        stop_ids.append(stop_info["id"])

batch_number = 0
while batch_number * 100 <  len(stop_ids):
    batch_stop_ids = stop_ids[batch_number * 100 : (batch_number + 1) * 100]
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main(batch_stop_ids))
    print("Batch " + str(batch_number + 1) + " done!")
    batch_number += 1

print("All of them are done!")
