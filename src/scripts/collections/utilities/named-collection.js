/******************************************************************************\
|                                                                              |
|                             named-collection.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of named items.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// getting methods
	//

	getNames: function() {
		let names = [];
		for (let i = 0; i < this.length; i++) {
			names.push(this.at(i).get('name'));
		}
		return names;
	},

	getByName: function(name) {
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model.get('name') === name) {
				return model;
			}
		}
	},

	//
	// filtering methods
	//

	removeDuplicateNames: function() {
		let namesFound = {};
		let removeList = [];

		// find list of items to remove
		//
		this.each((item) => {
			if (namesFound[item.get('name')]) {
				removeList.push(item);
			} else {
				namesFound[item.get('name')] = true;
			}
		});

		this.remove(removeList);
	},

	distinguishRepeatedNames: function(namesCount) {
		if (!namesCount) {
			namesCount = {};
		}

		// append suffixes to repeated item names
		//
		this.each((item) => {
			if (namesCount[item.get('name')]) {
				namesCount[item.get('name')]++;
				item.set('name', item.get('name') + ' (' + namesCount[item.get('name')] + ')');
			} else {
				namesCount[item.get('name')] = 1;
			}
		});
	},

	//
	// sorting methods
	//

	sort: function() {

		// sort by name, case insensitive
		//
		this.sortByAttribute('name', {
			comparator: function(name) {
				return name.toLowerCase();
			}
		});
	},

	sorted: function() {

		// sort by name, case insensitive
		//
		return this.sortedByAttribute('name', {
			comparator: function(name) {
				return name.toLowerCase();
			}		
		});
	}
});