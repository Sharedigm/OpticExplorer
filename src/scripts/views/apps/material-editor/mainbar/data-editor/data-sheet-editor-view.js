/******************************************************************************\
|                                                                              |
|                          data-sheet-editor-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for editing data sheet info.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import MaterialWavelengthsFormView from '../../../../../views/apps/material-editor/forms/materials/material-wavelengths-form-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'data-sheet-editor',

	template: template(`
		<ul class="nav nav-tabs flush" role="tablist">
			<li role="presentation" id="wavelengths-tab<%= index %>" class="active">
				<a href="#wavelengths-pane<%= index %>" aria-controls="wavelengths" role="tab" data-toggle="tab">
					<i class="fa fa-lightbulb"></i>Wavelengths
				</a>
			</li>
		</ul>

		<div class="tab-content">
			<div role="tabpanel" id="wavelengths-pane<%= index %>" class="wavelengths tab-pane active">
			</div>
		</div>
	`),

	regions: {
		wavelengths: '.wavelengths.tab-pane'
	},

	//
	// constructor
	//

	initialize: function() {
		this.index = this.constructor.count++;
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		this.getChildView('wavelengths').setValue(key, value);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			index: this.index
		};
	},

	onRender: function() {

		// show panels
		//
		this.showWavelengthsPane();
	},

	showWavelengthsPane: function() {
		this.showChildView('wavelengths', new MaterialWavelengthsFormView({
			model: this.model,

			// options
			//
			wavelengths: this.options.wavelengths,
			selected: this.options.selected,

			// callbacks
			//
			onchange: this.options.onchange
		}));
	}
}, {

	//
	// static attributes
	//

	count: 0
});