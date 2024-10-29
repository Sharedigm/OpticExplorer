/******************************************************************************\
|                                                                              |
|                             sidebar-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract application sidebar panel view.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'panel',

	tooltips: {
		placement: 'right',
		container: 'body'
	},

	//
	// setting methods
	//

	setViewKind: function(viewKind) {

		// set options
		//
		this.options.view_kind = viewKind;

		// update
		//
		if (this.hasChildView('items') && this.getChildView('items').setViewKind) {
			this.getChildView('items').setViewKind(viewKind);
		}
	},

	setTileSize: function(tileSize) {

		// set options
		//
		this.options.tile_size = tileSize;

		// update
		//
		if (this.hasChildView('items') && this.getChildView('items').setTileSize) {
			this.getChildView('items').setTileSize(tileSize);
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// set attributes
		//
		this.app = this.getParentView('app');
		
		// add tooltip triggers
		//
		this.addTooltips();
	}
});