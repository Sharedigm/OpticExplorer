/******************************************************************************\
|                                                                              |
|                               light-tools-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a group of related toolbar buttons.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonGroupView from '../../../../../../views/apps/common/toolbars/button-groups/button-group-view.js';
import InfoButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/general/buttons/info-button-view.js';
import ColorsButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/general/buttons/colors-button-view.js';
import BrightnessButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/general/buttons/brightness-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	tools: _.template(`
		<div id="show-info" data-toggle="tooltip" title="Show Info"></div>
		<div id="colors" data-toggle="tooltip" title="Colors"></div>
		<div id="brightness" data-toggle="tooltip" title="Brightness"></div>
	`),

	regions: {
		show_info: '#show-info',
		colors: '#colors',
		brightness: '#brightness'
	},

	tooltips: {
		placement: 'top'
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.app = this.getParentView('app');

		// call superclass method
		//
		ButtonGroupView.prototype.onRender.call(this);
		
		// show child views
		//
		this.showChildView('show_info', new InfoButtonView({
			parent: this
		}));
		this.showChildView('colors', new ColorsButtonView({
			parent: this
		}));
		this.showChildView('brightness', new BrightnessButtonView({
			parent: this
		}));
	}
});
