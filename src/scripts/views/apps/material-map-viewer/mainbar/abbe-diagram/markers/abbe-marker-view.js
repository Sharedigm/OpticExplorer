/******************************************************************************\
|                                                                              |
|                             abbe-marker-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a marker on the Abbe glass diagram.            |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MarkerView from '../../../../../../views/svg/shapes/marker-view.js';

export default MarkerView.extend({

	//
	// attributes
	//

	className: 'abbe marker',
	width: 8,
	height: 8,

	//
	// rendering attributes
	//

	icon: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
			<circle cx="256" cy="256" r="206"/>
		</svg>
	`,

	//
	// querying methods
	//

	title: function() {
		return 'n = ' + this.model.get('index_of_refraction') + ', v = ' + this.model.get('abbe_number');
	}
});