/******************************************************************************\
|                                                                              |
|                                  section.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a recursive directory structure.              |
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
import Page from '../../models/indices/page.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {
		icon: '<i class="fa fa-sitemap"></i>',
		name: 'Untitled',
		contents: null
	},

	//
	// querying methods
	//

	isTop: function() {
		return this.get('top');
	},

	//
	// getting methods
	//

	getItemByAttribute: function(key, value) {
		let items = this.get('items');
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item.get(key) == value) {
				return item;
			} if (item.has('items')) {
				item = item.getItemByAttribute(key, value);
				if (item) {
					return item;
				}
			}
		}
	}
}, {

	//
	// static methods
	//

	parseSection: function(object, url, index) {
		let section = new this.prototype.constructor({
			icon: object.icon? '<i class="' + object.icon + '"></i>' : undefined,
			name: object.name,
			index: index? index.length + 1 : undefined,
			url: url
		});

		// add item to index
		//
		if (index) {
			index.push(section);
		}

		// get section items
		//
		section.set({
			items: this.parse(object.items, url, index)
		});

		return section;
	},

	parsePage: function(object, url, index) {
		let page = new Page({
			icon: object.icon? '<i class="' + object.icon + '"></i>' : undefined,
			name: object.name,
			index: index? index.length + 1 : undefined,
			url: url
		});

		// add item to index
		//
		index.push(page);

		return page;
	},

	parse: function(objects, url, index) {
		let items = [];
		let keys = Object.keys(objects);

		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let object = objects[key];

			// add help section to items
			//
			if (object.items) {
				items.push(this.parseSection(object, url? url + '/' + key : '#' + key, index));
			} else {
				items.push(this.parsePage(object, url? url + '/' + key : '#' + key, index));
			}
		}

		return items;
	}
});