/******************************************************************************\
|                                                                              |
|                              apps-list-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a list of applications.                        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../../../models/base-model.js';
import App from '../../../../../models/apps/app.js';
import ListView from '../../../../../views/items/lists/list-view.js';
import AppsListItemView from '../../../../../views/apps/common/items/lists/apps-list-item-view.js';
import ListDividerView from '../../../../../views/items/lists/list-divider-view.js';

export default ListView.extend({

	//
	// attributes
	//

	tagName: 'ul',
	className: 'apps-list item-list',

	//
	// constructor
	//

	initialize: function() {

		// add dividers
		//
		if (this.options.show_dividers != false) {
			this.addDividers(this.getAppLetters());
		}
	},

	//
	// getting methods
	//

	getLetters: function() {
		let letters = [];

		// add entire alphabet to list
		//
		for (let i = 1; i <= 26; i++) {
			this.collection.add(new BaseModel({
				name: (i + 9).toString(36).toUpperCase()
			}));
		}

		return letters;
	},

	getAppLetters: function() {
		let letters = [];

		for (let i = 0; i < this.collection.length; i++) {
			let letter = this.collection.at(i).get('name').charAt(0);
			if (!letters.contains(letter)) {
				letters.push(letter);
			}
		}

		return letters;
	},

	//
	// divider methods
	//

	addDividers: function(letters) {
		this.collection = this.collection.clone();
		
		// add dividers to list
		//
		for (let i = 0; i < letters.length; i++) {
			this.collection.add(new BaseModel({
				name: letters[i]
			}));
		}

		// sort alphabetically
		//
		this.collection.comparator = (model) => {
			return model.get('name');
		};
		this.collection.sort();
	},

	//
	// rendering methods
	//

	childView: function(item) {
		if (item instanceof App) {
			return AppsListItemView;
		} else {
			return ListDividerView;
		}
	},

	childViewOptions: function(model) {
		return _.extend({}, this.options, {
			model: model,

			// state
			//
			selected: this.options.selected && this.options.selected.contains(model)
		});
	}
});
