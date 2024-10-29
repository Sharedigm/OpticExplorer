/******************************************************************************\
|                                                                              |
|                              list-item-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view that shows a single list item.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';
import Selectable from '../../../views/behaviors/selection/selectable.js';

export default BaseView.extend(_.extend({}, Selectable, {
	
	//
	// rendering methods
	//

	onAttach: function() {

		// add tooltips to parent
		//
		this.addTooltips({
			container: this.parent.parent.$el
		});
	}
}));