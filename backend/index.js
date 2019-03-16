require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const fetch = require('node-fetch');
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
				"phone": row_data["telephone"],
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
		"s_index": Math.random(),
		"meta": null
	};
}

app.get('/crime', (req, res) => {
	const stop = req.query.stopid;
	get_crime_level(stop).then(crime_text => {
		if (crime_text !== null) {
			res.send(crime_text);
		} else {
			res.status(404).send("Could not find crime data from this stop id");
		}
	});
});

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

	fetch(`http://${process.env.ROUTE_API}/otp/routers/default/plan?fromPlace=${fromLat},${fromLon}&toPlace=${toLat},${toLon}&mode=TRANSIT,WALK&maxWalkDistance=1500&arriveBy=false`, params).then(data => data.json()).then(response => {
		let routes = response["plan"]["itineraries"];
		const promises_waiting = [];
		routes.forEach(route => {
			const legs = route["legs"];
			legs.forEach(leg => {
				if (leg["MODE"] != 'WALK') {
					try {
						promises_waiting.push(get_safety_index(leg["to"]["stopId"].split(":")[1]));
					} catch (_) {
						promises_waiting.push(get_walking_index(leg["from"]["lat"], leg["from"]["lon"], leg["to"]["lat"], leg["to"]["lon"]));
					}
				} else {
					promises_waiting.push(get_walking_index(leg["from"]["lat"], leg["from"]["lon"], leg["to"]["lat"], leg["to"]["lon"]));
				}
			});
		});
		Promise.all(promises_waiting).then(resolved => {
			let counter = 0;
			for(let i = 0; i < routes.length; i++) {
				for(let j = 0; j < routes[i]["legs"].length; j++) {
					routes[i]["legs"][j]["safety"] = resolved[counter++];
				}
			}
			res.json({"routes": routes});
		}).catch(_ => {
			console.log("Failed to add safety data to route");
			res.json({"routes": routes});
		});
		res.json({"routes": routes});
	}).catch(err => {
		console.log(err);
		res.status(500).send(`Failed to get route data, or no route options: ${JSON.stringify(err)}`);
	});
});

app.get('/', (_, res) => {
	res.send('Lumino API');
});

app.listen(port, () => console.log(`Listening on port: ${port}`));

