/******************************************************************************\
|                                                                              |
|                             data-editor-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing light data info.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../../../models/base-model.js';
import BaseView from '../../../../../views/base-view.js';
import BaseCollection from '../../../../../collections/base-collection.js';
import WavelengthsGraphingFormView from '../../../../../views/apps/spectrum-editor/forms/wavelengths/wavelengths-graphing-form-view.js';
import WavelengthsListView from '../../../../../views/apps/spectrum-editor/mainbar/data-editor/wavelengths-list/wavelengths-list-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'data-editor',

	template: template(`
		<ul class="nav nav-tabs flush" role="tablist">
			<li role="presentation" id="graphing-tab<%= index %>" class="active">
				<a href="#graphing-pane<%= index %>" aria-controls="formula" role="tab" data-toggle="tab">
					<i class="fa fa-chart-line"></i>Graph
				</a>
			</li>

			<li role="presentation" id="wavelengths-tab<%= index %>">
				<a href="#wavelengths-pane<%= index %>" aria-controls="equation" role="tab" data-toggle="tab">
					<i class="fa fa-rainbow"></i>Wavelengths
				</a>
			</li>
		</ul>

		<div class="tab-content">
			<div role="tabpanel" id="graphing-pane<%= index %>" class="graphing tab-pane active">
			</div>

			<div role="tabpanel" id="wavelengths-pane<%= index %>" class="wavelengths tab-pane">
			</div>
		</div>
	`),

	regions: {
		graphing: '.graphing.tab-pane',
		wavelengths: '.wavelengths.tab-pane'
	},

	//
	// getting methods
	//

	getWavelengths: function() {
		let wavelengths = this.model.get('wavelengths');
		let weights = this.model.get('weights');
		let collection = new BaseCollection();

		if (wavelengths) {
			for (let i = 0; i < wavelengths.length; i++) {
				collection.add(new BaseModel({
					wavelength: wavelengths[i],
					weight: weights? weights[i] : undefined
				}))
			}
		}

		return collection;
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

	setSpectrum: function(spectrum) {

		// update attributes
		//
		this.model = spectrum;

		// update view
		//
		this.showWavelengthsPane();
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
		this.showGraphingPane();
		this.showWavelengthsPane();
	},

	showGraphingPane: function() {
		this.showChildView('graphing', new WavelengthsGraphingFormView({
			model: this.model,

			// callbacks
			//
			onchange: this.options.onchange
		}));
	},

	showWavelengthsPane: function() {
		this.showChildView('wavelengths', new WavelengthsListView({
			collection: this.getWavelengths(this.model),

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