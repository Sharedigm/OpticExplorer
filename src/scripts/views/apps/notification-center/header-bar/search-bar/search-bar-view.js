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
import SearchByNameView from '../../../../../views/apps/notification-center/header-bar/search-bar/searches/search-by-name-view.js';
import SearchByKindView from '../../../../../views/apps/notification-center/header-bar/search-bar/searches/search-by-kind-view.js';
import SearchByDateView from '../../../../../views/apps/notification-center/header-bar/search-bar/searches/search-by-date-view.js';

export default SearchBarView.extend({

	//
	// file attribute searching methods
	//

	showSearchByName: function() {

		// show search
		//
		this.showChildView('searches', new SearchByNameView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByKind: function() {

		// show search
		//
		this.showChildView('searches', new SearchByKindView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	//
	// date attribute searching methods
	//

	showSearchByDate: function(kind) {

		// show search
		//
		this.showChildView('searches', new SearchByDateView({
			model: this.model,

			// options
			//
			kind: kind
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
			
			// file attributes
			//
			case 'name':
				this.showSearchByName();
				break;
			case 'kind':
				this.showSearchByKind();
				break;
			case 'date':
				this.showSearchByDate();
				break;

			default:
				this.clear();
				break;
		}
	}
});