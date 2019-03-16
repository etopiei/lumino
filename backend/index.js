require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
//const fs = require('fs');
const fetch = require('node-fetch');
//const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');

const app = express();
const port = 3000;

// the details to access the database will come from environment variables
const sequelize = new Sequelize('postgres', 'postgres', process.env.PGPASSWORD, {
	host: process.env.DB,
	dialect: "postgres"
})

app.use(cors());
app.use(bodyParser.json());

var options = {
	customCss: '.swagger-ui .topbar { display: none }'
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

/*
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
	} catch (_) {
		console.log("Error reading file");
		return {};
	}
}
*/

function get_station_metadata(station_id) {
	const p = [];
	p.push(sequelize.query('SELECT * FROM stop_facilities WHERE stopid = ? LIMIT 1', {replacements: [station_id]}));
	return Promise.all(p).then(result => {
		const row_data = result[0][0][0];
		try {
			return {
				"cctv": row_data["cctv"],
				"toilet": row_data["toilet"],
				"pay_phone": row_data["pay_phone"],
				"indoor_waiting_area": row_data["indoor_waiting_area"],
				"sheltered_waiting_area": row_data["sheltered_waiting_area"],
				"taxi_rank": row_data["taxi_rank"],
				"lighting": row_data["lighting"],
				"phone": row_data["phone"],
				"waiting_room": row_data["waiting_room"],
				"psos": row_data["psos"],
				"premium_stop": row_data["premium_stop"],
				"travellers_aid": row_data["travellers_aid"],
				"kiosk": row_data["kiosk"]
			};
		} catch (e) {
			console.log("Failed to add data");
			return null;
		}
	}).catch(err => {
		// stopid probably doesn't exist
		console.log(err);
		return null;
	});
}

function get_safety_index(stop_id) {
	const p = [];
	p.push(get_station_metadata(stop_id));
	p.push(sequelize.query('SELECT safety_index(?)', {replacements: [stop_id]}));
	return Promise.all(p).then(resolved => {
		return {
			"s_index": resolved[1][0][0],
			"meta": resolved[0]
		};
	}).catch(err => {
		console.log(err);
		return null;
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
	get_safety_index(stop).then(safety_data => {
		res.json({"safety": safety_data});
	}).catch(err => {
		console.log(err);
	});
});

app.post('/route', async (req, res) => {
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
				if (leg["MODE"] != 'WALK') {
					try {
						promises_waiting.push(get_safety_index(leg["from"]["stopId"].split(":")[1]));
					} catch (_) {
						promises_waiting.push(get_walking_index(leg["from"]["lat"], leg["from"]["lon"], leg["to"]["lat"], leg["to"]["lon"]));
					}
				} else {
					promises_waiting.push(get_walking_index(leg["from"]["lat"], leg["from"]["lon"], leg["to"]["lat"], leg["to"]["lon"]));
				}
			});
		});
		Promise.all(promises_waiting).then(resolved => {
			res.json({"routes": routes, "safety": resolved});
		}).catch(err => {
			// If this happens, make sure the route is still sent
			console.log(err);
			res.json({"routes": routes, "safety": null});
		});
	}).catch(err => {
		console.log(err);
		res.status(500).send(`Failed to get route data, or no route options: ${JSON.stringify(err)}`);
	});
});

app.get('/', (_, res) => {
	res.send('Lumino API');
});

app.listen(port, () => console.log(`Listening on port: ${port}`));

