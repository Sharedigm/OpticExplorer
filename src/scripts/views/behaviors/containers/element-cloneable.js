/******************************************************************************\
|                                                                              |
|                              element-cloneable.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of behavior for selectable container views.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	cloneAndPositionElements: function(elements, offset, options) {
		let clones = [];

		for (let i = 0; i < elements.length; i++) {
			let element = $(elements[i]);
			let left = parseInt(element.css('margin-left').replace('px', ''));
			let top = parseInt(element.css('margin-top').replace('px', ''));
			let position;

			// create element
			//
			let clone = element.clone();

			// position clone
			//
			if (options && options.position && element.css('position')) {
				if (elements.length > 1) {
					position = element.position();
					clone.css({
						position: 'absolute',
						left: left + position.left - offset.left,
						top: top + position.top - offset.top
					});
				} else {
					clone.css({
						position: 'absolute',
						left: left,
						top: top
					});
				}
			}

			// add element
			//
			clones.push(clone);
		}

		return clones;
	},

	cloneElements: function(elements) {
		let clones = [];
		for (let i = 0; i < elements.length; i++) {
			let element = $(elements[i]);
			let clone = element.clone();
			clone.css({
				position: 'absolute',
				left: 0,
				top: 0
			});
			clones.push(clone);
		}
		return clones;
	},

	cloneSelectedElements: function(options) {
		let elements = this.getVisibleElements('.selected');
		let offset;

		// find offset relative to top left element
		//
		if (elements.length > 1 && options && options.position) {
			offset = {
				left: undefined,
				top: undefined
			};
			for (let i = 0; i < elements.length; i++) {
				let item = $(elements[i]);
				let position = item.position();
				if (!offset.left || position.left < offset.left) {
					offset.left = position.left;
				}
				if (!offset.top || position.top < offset.top) {
					offset.top = position.top;
				}
			}
		}

		// clone selected elements
		//
		if ($(elements[0]).css('position') != 'absolute') {
			return this.cloneAndPositionElements(elements, offset, options);
		} else {
			return this.cloneElements(elements);
		}
	}
};