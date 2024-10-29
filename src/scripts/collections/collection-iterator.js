/******************************************************************************\
|                                                                              |
|                            collection-iterator.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model to iterate through a collection.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../models/base-model.js';
import BaseCollection from '../collections/base-collection.js';

export default BaseModel.extend({

	//
	// constructor
	//

	initialize: function(collection, options) {
		this.set({
			collection: collection || new BaseCollection(),
			index: options && options.index? options.index : 0,
			wraparound: options && options.wraparound? options.wraparound : false
		});
	},

	//
	// querying methods
	//

	item: function(position) {
		return this.at(this.getIndex(position));
	},

	at: function(index) {
		return this.get('collection').at(index);
	},

	isFirst: function() {
		return this.get('index') == 0;
	},

	isLast: function() {
		return this.get('index') == this.get('collection').length - 1;
	},

	hasItem: function(position) {
		switch (position) {
			case 'first':
				return this.numItems() > 0;
			case 'prev':
				return this.numItems() > 0 && (!this.isFirst()? true : this.get('wraparound') == true);
			case 'current':
				return this.numItems() > 0 && this.get('index') != undefined;
			case 'next':
				return this.numItems() > 0 && (!this.isLast()? true : this.get('wraparound') == true);
			case 'last':
				return this.numItems() > 0;
		}
	},

	//
	// counting methods
	//

	numItems: function() {
		return this.get('collection').length;
	},

	//
	// getting methods
	//

	getIndex: function(position) {
		switch (position || 'current') {
			case 'first':
				return 0;
			case 'prev':
				return !this.isFirst()? this.get('index') - 1 : (this.get('wraparound')? this.getIndex('last') : undefined);
			case 'current':
				return this.get('index');	
			case 'next':
				return !this.isLast()? this.get('index') + 1 : (this.get('wraparound')? this.getIndex('first') : undefined);
			case 'last':
				return this.get('collection').length - 1;
		}
	},
	
	//
	// setting methods
	//

	setPosition: function(position) {
		this.setIndex(this.getIndex(position));
	},

	setIndex: function(index) {
		this.set('index', index);
	}
});
