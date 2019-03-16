const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

function get_station_metadata(station_id) {
	// here fetch metadata from station file
	filePath = path.join(__dirname, `/../data/output/stop-data-${station_id}.json`);
	fs.readFile(filePath, { encoding: 'utf-8'}, function (err, data) {
		if (!err) {
			const file_data = JSON.parse(data);
			return {
				"cctv": file_data["amenities"]["cctv"],
				"toilet": file_data["amenities"]["toilet"],
				"pay_phone": file_data["amenities"]["pay_phone"],
				"indoor_waiting_area": file_data["amenities"]["indoor_waiting_area"],
				"sheltered_waiting_area": file_data["amenities"]["sheltered_waiting_area"],
				"taxi_rank": file_data["amenities"]["taxi_rank"],
				"lighting": file_data["accessibility"]["lighting"],
				"phone": file_data["contact"]["phone"]
			}
		} else {
			return {};
		}
	});
}

function get_safety_index(stop_id) {
	return {
		"s_index": Math.floor(Math.random() * 10) + 1,
		"meta": get_station_metadata(stop_id)
	};
}

function get_walking_index(fromLat, fromLon, toLat, toLon) {
	return {
		"s_index": Math.floor(Math.random() * 10) + 1,
		"meta": null
	};
}

app.get('/safety', (req, res) => {
	const stops = req.body.stop_ids;
	const meta_data = [];
	stops.forEach(stop => {
		meta_data.push(get_station_metadata(stop));
	});
	res.json({"safety_index": get_safety_index, "meta_data": meta_data});
});

app.get('/route', (req, res) => {
	const fromLat = req.body.start.lat;
	const fromLon = req.body.start.lon;
	const toLat = req.body.destination.lat;
	const toLon = req.body.destination.lon;
	// hit Nick's API to get a route
	const params = {"method": "GET", "headers": {
		"Accept": "application/json"
	}};
	fetch(`http://10.77.1.52:8080/otp/routers/default/plan?fromPlace=${fromLat},${fromLon}&toPlace=${toLat},${toLon}&mode=TRANSIT,WALK&maxWalkDistance=500&arriveBy=false`, params).then(data => data.json()).then(response => {
		const routes = response["plan"]["itineraries"];
		const safety = [];
		routes.forEach(route => {
			const list_of_safeties = [];
			const meta_data = [];
			const legs = route["legs"];
			legs.forEach(leg => {
				let safety_details = null;
				if (leg["MODE"] != "WALK") {
					safety_details = get_safety_index(leg["from"]["stopId"].split(":")[1]);
				} else {
					safety_details = get_walking_index(leg["from"]["lat"], leg["from"]["lon"], leg["to"]["lat"], leg["to"]["lon"]);
				}
				list_of_safeties.push(safety_details.s_index);
				meta_data.push(safety_details.meta);
			});
			safety.push({"s_index": list_of_safeties});
			safety.push({"details": meta_data});
		});
		res.json({"routes": routes, "safety": safety})
	}).catch(err => {
		res.status(500).send(`Failed to get route data: ${JSON.stringify(err)}`);
	});
});

app.get('/', (_, res) => {
	res.send('Lumino API');
});

app.listen(port, () => console.log(`Listening on port: ${port}`));

