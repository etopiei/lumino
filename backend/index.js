require('dotenv').config();
const express = require('express');
const expressOasGenerator = require('express-oas-generator');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
expressOasGenerator.init(app, {});
const port = 3000;

// the details to access the database will come from environment variables
const { Client } = require('pg');
const client = new Client({host: process.env.DB});
client.connect();

app.use(bodyParser.json());

function get_station_metadata(station_id) {
	// here fetch metadata from station file
	filePath = path.join(__dirname, `/../data/output/stop-data-${station_id}.json`);
	try {
		fileData = fs.readFileSync(filePath, { encoding: 'utf-8'});
		const file_data = JSON.parse(fileData);
		return {
			"cctv": file_data["amenities"]["cctv"],
			"toilet": file_data["amenities"]["toilet"],
			"pay_phone": file_data["amenities"]["pay_phone"],
			"indoor_waiting_area": file_data["amenities"]["indoor_waiting_area"],
			"sheltered_waiting_area": file_data["amenities"]["sheltered_waiting_area"],
			"taxi_rank": file_data["amenities"]["taxi_rank"],
			"lighting": file_data["accessibility"]["lighting"],
			"phone": file_data["contact"]["phone"]
		};
	} catch (e) {
		console.log("Error reading file");
		console.log(e);
		return {};
	}
}

function get_safety_index(stop_id) {
	const meta_data = get_station_metadata(stop_id);
	return client.query('SELECT safety_index($1::integer)', [stop_id]).then(safety_index => {
		return {
			"s_index": safety_index["rows"][0]["safety_index"],
			"meta": meta_data
		};
	}).catch(db_err => {
		console.log(db_err);
		return {
			"s_index": null,
			"meta": meta_data
		};
	});
}

function get_walking_index(fromLat, fromLon, toLat, toLon) {
	return {
		"s_index": Math.floor(Math.random() * 10) + 1,
		"meta": null
	};
}

app.get('/safety', (req, res) => {
	const stop = req.query.stopid;
	console.log(stop);
	get_safety_index(stop).then(safety_data => {
		res.json({"safety": safety_data});
	}).catch(err => {
		console.log(err);
	});
});

app.get('/route', async (req, res) => {
	const fromLat = req.body.start.lat;
	const fromLon = req.body.start.lon;
	const toLat = req.body.destination.lat;
	const toLon = req.body.destination.lon;
	// hit Nick's API to get a route
	const params = {"method": "GET", "headers": {
		"Accept": "application/json"
	}};
	fetch(`http://${process.env.ROUTE_API}/otp/routers/default/plan?fromPlace=${fromLat},${fromLon}&toPlace=${toLat},${toLon}&mode=TRANSIT,WALK&maxWalkDistance=500&arriveBy=false`, params).then(data => data.json()).then(response => {
		const routes = response["plan"]["itineraries"];
		const promises_waiting = [];
		routes.forEach(route => {
			const legs = route["legs"];
			legs.forEach(leg => {
				if (leg["MODE"] != "WALK") {
					promises_waiting.push(get_safety_index(leg["from"]["stopId"].split(":")[1]));
				} else {
					promises_waiting.push(get_walking_index(leg["from"]["lat"], leg["from"]["lon"], leg["to"]["lat"], leg["to"]["lon"]));
				}
			});
		});
		Promises.all(promises_waiting).then(resolved => {
			res.json({"routes": routes, "safety": resolved});
		}).catch(err => {
			// If this happens, make sure the route is still sent
			console.log(err);
			res.json({"routes": routes, "safety": null});
		});
	}).catch(err => {
		res.status(500).send(`Failed to get route data: ${JSON.stringify(err)}`);
	});
});

app.get('/', (_, res) => {
	res.send('Lumino API');
});

app.listen(port, () => console.log(`Listening on port: ${port}`));

