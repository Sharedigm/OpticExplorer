/******************************************************************************\
|                                                                              |
|                               metar-stations.js                              |
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

import MetarStation from '../../models/weather/metar-station.js';
import BaseCollection from '../../collections/base-collection.js';
import QueryString from '../../utilities/web/query-string.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: MetarStation,
	url: 'https://aviationweather.gov/adds/dataserver_current/httpparam',

	//
	// ajax methods
	//

	fetch: function(options) {
		let params = {
			dataSource: 'metars',
			requestType: 'retrieve',

			// constrain to viewport
			//
			minLat: options.minLat,
			minLon: options.minLon,
			maxLat: options.maxLat,
			maxLon: options.maxLon,

			// stations to load
			//
			hoursBeforeNow: 3,
			format: 'xml',
			mostRecentForEachStation: true,

			// number of stations to load
			//
			minDegreeDistance: Math.abs(options.maxLon - options.minLon) / 20,
		};

		return $.ajax({
			type: 'GET',
			url: config.servers.api + '/proxy?url=' + encodeURIComponent(this.url + '?' + QueryString.encode(params)),

			// callbacks
			//
			success: (data) => {
				let models = this.parse(data);
				this.set(models);

				// perform callback
				//
				if (options.success) {
					options.success(this);
				}
			}
		});
	},

	//
	// xml parsing methods
	//

	parseStation: function(element) {
		return new MetarStation().parse(element);
	},

	parseStations: function(elements) {
		let stations = [];
		for (let i = 0; i < elements.length; i++) {
			stations.push(this.parseStation(elements[i]));
		}
		return stations;
	},

	parse: function(xml) {
		let parser = new DOMParser();
		let xmlDoc = parser.parseFromString(xml, "text/xml");
		let data = this.parseStations(xmlDoc.getElementsByTagName("METAR"));
		return data;
	}
});