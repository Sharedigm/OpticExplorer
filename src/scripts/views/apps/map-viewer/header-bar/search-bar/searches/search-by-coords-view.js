/******************************************************************************\
|                                                                              |
|                            search-by-coords-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-view.js';

export default SearchByView.extend({

	//
	// attributes
	//

	icon: 'fa fa-crosshairs',

	template: template(`
		<div class="search-by-coords input-group">
			<div class="input-group-addon">
				<i class="<%= icon %>"></i>
			</div>
		
			<input type="text" class="latitude form-control" placeholder="Latitude" spellcheck="false">
		
			<div class="dimension input-group-addon">
				&deg N
			</div>
		
			<input type="text" class="longitude form-control" placeholder="Longitude" spellcheck="false">
		
			<div class="dimension input-group-addon">
				&degW
			</div>
		
			<div class="close-btn input-group-addon btn">
				<i class="fa fa-xmark"></i>
			</div>
			<div class="search-btn input-group-addon btn">
				<i class="fa fa-search"></i>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'latitude':
				return this.$el.find('.latitude').val();
			case 'longitude':
				return this.$el.find('.longitude').val();
		}
	},

	//
	// form methods
	//

	submit: function() {
		this.parent.app.searchFor({
			latitude: this.getValue('latitude'),
			longitude: this.getValue('longitude')
		});
	}
});