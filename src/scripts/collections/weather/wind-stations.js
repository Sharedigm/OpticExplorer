/******************************************************************************\
|                                                                              |
|                               wind-stations.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of metar weather stations.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import WindStation from '../../models/weather/wind-station.js';
import BaseCollection from '../../collections/base-collection.js';
import QueryString from '../../utilities/web/query-string.js';
let windStations;

export default BaseCollection.extend({

	//
	// attributes
	//

	model: WindStation,
	url: 'https://api.weather.gov/products/types/FD1',

	//
	// fetching methods
	//

	fetch: function(options) {
		if (!windStations) {
			return this.fetchWindStations({

				// callbacks
				//
				success: () => {
					this.fetchStationData(options);
				}
			});
		} else {
			return this.fetchStationData(options);
		}
	},

	fetchWindStations: function(options) {
		return $.ajax({
			type: 'GET',
			url: config.servers.api + '/stations/wind',

			// callbacks
			//
			success: (stations) => {

				// parse wind stations
				//
				windStations = {};
				for (let i = 0; i < stations.length; i++) {
					let station = stations[i];
					windStations[station.station_id] = {
						latitude: station.latitude,
						longitude: station.longitude
					};
				}

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			}
		});
	},

	fetchStationData: function(options) {
		return $.ajax({
			type: 'GET',
			url: config.servers.api + '/proxy?url=' + encodeURIComponent(this.url + '?' + QueryString.encode(options.params)),

			// callbacks
			//
			success: (response) => {
				let data = JSON.parse(response);

				// fetch most recent report for the continental US
				//
				let reports = data['@graph'];
				let index;
				for (let i = 0; i < reports.length; i++) {
					if (reports[i].wmoCollectiveId == 'FBUS31') {
						index = i;
						break;
					}
				}
				this.fetchReport(reports[index]['@id'], options);

				// perform callback
				//
				/*
				if (options.success) {
					options.success(this);
				}
				*/
			}
		});
	},

	fetchReport: function(url, options) {
		return $.ajax({
			type: 'GET',
			url: config.servers.api + '/proxy?url=' + encodeURIComponent(url + '?' + QueryString.encode(options.params)),

			// callbacks
			//
			success: (response) => {
				let data = JSON.parse(response);
				this.parse(data, options);

				// perform callback
				//
				if (options.success) {
					options.success(this);
				}
			}
		});
	},

	parseStation: function(line, options) {
		let stationId = line.substr(0, 3);
		let stationData = windStations[stationId];

		if (stationData && stationData.latitude && stationData.longitude) {
			let latitude = stationData? stationData.latitude : undefined;
			let longitude = stationData? stationData.longitude : undefined;

			if (latitude > options.minLat && latitude < options.maxLat &&
				longitude > options.minLon && longitude < options.maxLon) {
				return new WindStation({
					issue_time: options.issuanceTime,
					station_id: 'K' + stationId,
					latitude: latitude,
					longitude: longitude,
					winds: {
						'3000': line.substr(4, 4).trim(),
						'6000': line.substr(9, 7).trim(),
						'9000': line.substr(17, 7).trim(),
						'12000': line.substr(25, 7).trim(),
						'18000': line.substr(33, 7).trim(),
						'24000': line.substr(41, 7).trim(),
						'30000': line.substr(49, 7).trim(),
						'34000': line.substr(56, 7).trim(),
						'39000': line.substr(63, 7).trim()
					}
				});
			}
		}
	},

	parse: function(data, options) {
		let issuingOffice = data.issuingOffice;
		let issuanceTime = data.issuanceTime;
		let lines = data.productText.split('\n');
		let models = [];

		for (let i = 8; i < lines.length; i++) {
			let station = this.parseStation(lines[i], {
				issuingOffice: issuingOffice,
				issuanceTime: issuanceTime,
				minLat: options.minLat,
				maxLat: options.maxLat,
				minLon: options.minLon,
				maxLon: options.maxLon
			});
			if (station) {
				models.push(station);
			}
		}

		this.set(models);
	}
});