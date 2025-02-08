/******************************************************************************\
|                                                                              |
|                              search-bar-view.js                              |
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

import SearchBarView from '../../../../../views/apps/common/header-bar/search-bar/search-bar-view.js';
import SearchByCoordsView from '../../../../../views/apps/map-viewer/header-bar/search-bar/searches/search-by-coords-view.js';
import SearchByAddressView from '../../../../../views/apps/map-viewer/header-bar/search-bar/searches/search-by-address-view.js';
import SearchByNameView from '../../../../../views/apps/map-viewer/header-bar/search-bar/searches/search-by-name-view.js';

export default SearchBarView.extend({

	//
	// file attribute searching methods
	//

	showSearchByCoords: function() {

		// show search
		//
		this.showChildView('searches', new SearchByCoordsView({
			value: this.options.value
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByAddress: function() {

		// show search
		//
		this.showChildView('searches', new SearchByAddressView({
			value: this.options.value
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByName: function() {

		// show search
		//
		this.showChildView('searches', new SearchByNameView({
			value: this.options.value
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SearchBarView.prototype.onRender.call(this);

		// set search kind
		//
		switch (this.options.kind) {
			
			case 'coords':
				this.showSearchByCoords();
				break;
			case 'address':
				this.showSearchByAddress();
				break;
			case 'name':
				this.showSearchByName();
				break;
				
			default:
				this.clear();
				break;
		}
	}
});