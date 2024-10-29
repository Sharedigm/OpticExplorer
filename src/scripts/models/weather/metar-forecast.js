/******************************************************************************\
|                                                                              |
|                              metar-forecast.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a metar weather data report.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../models/base-model.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {

		// timestamps
		//
		fcst_time_from: undefined,
		fcst_time_to: undefined,

		// wind
		//
		wind_dir_degrees: undefined,
		wind_speed_kt: undefined,

		// cloud and precipitation
		//
		visibility_statute_mi: undefined,
		wx_string: undefined,
		sky_conditions: []
	}
});
