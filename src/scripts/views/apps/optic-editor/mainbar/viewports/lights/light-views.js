/******************************************************************************\
|                                                                              |
|                                  light-views.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for creating views of lights.                       |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DistantLight from '../../../../../../models/optics/lights/distant-light.js';
import PointLight from '../../../../../../models/optics/lights/point-light.js';
import DistantLightView from '../../../../../../views/apps/optic-editor/mainbar/viewports/lights/distant-light-view.js';
import PointLightView from '../../../../../../views/apps/optic-editor/mainbar/viewports/lights/point-light-view.js';

export default {
	create: function(options) {
		switch (options.model.__proto__) {
			case DistantLight.prototype:
				return new DistantLightView(options);
			case PointLight.prototype:
				return new PointLightView(options);
		}
	}
};