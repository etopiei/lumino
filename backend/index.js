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
	const p = [];
	p.push(sequelize.query('SELECT * FROM stop_facilities WHERE stopid = ? LIMIT 1', {replacements: [station_id]}));
	return Promise.all(p).then(result => {
		const row_data = result[0][0][0];
		return row_data;
	}).catch(err => {
		// stopid probably doesn't exist
		console.log(err);
		return null;
	});
}

function get_crime_level(stop_id) {
	return sequelize.query('SELECT crime_level(?)', {replacements: [stop_id]}).then(results => {
		return results[0][0];
	}).catch(err => {
		console.log(err);
		return null;
	});
}

function get_safety_index(stop_id) {
	const p = [];
	p.push(get_station_metadata(stop_id));
	p.push(sequelize.query('SELECT safety_index(?)', {replacements: [stop_id]}));
	p.push(get_crime_level(stop_id));
	return Promise.all(p).then(resolved => {
		return {
			"s_index": resolved[1][0][0],
			"meta": resolved[0],
			"crime": resolved[2]
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

