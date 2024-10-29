/******************************************************************************\
|                                                                              |
|                          selectable-containable.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of behavior for selectable containers.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ContainableSelectable from '../../../views/behaviors/containers/containable-selectable.js';
import ElementCloneable from '../../../views/behaviors/containers/element-cloneable.js';
import Browser from '../../../utilities/web/browser.js';

export default _.extend({}, ContainableSelectable, ElementCloneable, {
	
	//
	// attributes
	//

	events: {

		// mouse events
		//
		'mousedown ': 'onMouseDown',

		// touch events
		//
		'tap': 'onTap'
	},

	//
	// mouse event handling methods
	//

	handleClick: function(event) {

		// skip clicks on selectable item buttons
		//
		if (event.target.type == 'button' || event.target.type == 'submit') {
			return;
		}

		// perform selection
		//
		if (this.selectable != false) {

			// check for shift clicking or multi-select
			//
			if (!event.shiftKey && !this.multi_selectable) {

				// if mouse down on selectable view
				//
				if (!event.isDefaultPrevented()) {

					// deselect previously selected items
					//
					if (this.options.deselectable != false) {

						// deselect all children
						//
						this.deselectAll(null, {
							silent: true
						});

						// perform callback
						//
						if (this.options.ondeselect) {
							this.options.ondeselect();
						}
					}
				}
			}
		}
	},

	onMouseDown: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}

		this.handleClick(event);
	},

	//
	// touch event handling methods
	//

	onTap: function(event) {

		// skip mouse events if not touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}

		this.handleClick(event);
	}
});