/******************************************************************************\
|                                                                              |
|                          refraction-editor-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing optics lens data info.           |
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
import RefractionGraphingFormView from '../../../../../views/apps/material-editor/forms/refraction/refraction-graphing-form-view.js';
import RefractionParamsFormView from '../../../../../views/apps/material-editor/forms/refraction/refraction-params-form-view.js';
import RefractionEquationFormView from '../../../../../views/apps/material-editor/forms/refraction/refraction-equation-form-view.js';
import RefractionCoeffsFormView from '../../../../../views/apps/material-editor/forms/refraction/refraction-coeffs-form-view.js';
import RefractionCalculationsFormView from '../../../../../views/apps/material-editor/forms/refraction/refraction-calculations-form-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'refraction-editor',

	template: template(`
		<ul class="nav nav-tabs flush" role="tablist">

			<li role="presentation" id="graphing-tab<%= index %>" class="active">
				<a href="#graphing-pane<%= index %>" aria-controls="formula" role="tab" data-toggle="tab">
					<i class="fa fa-chart-line"></i>Graph
				</a>
			</li>

			<li role="presentation" id="formula-tab<%= index %>">
				<a href="#params-pane<%= index %>" aria-controls="params" role="tab" data-toggle="tab">
					<i class="fa fa-list"></i>Params
				</a>
			</li>

			<li role="presentation" id="equation-tab<%= index %>" class="hidden-xs">
				<a href="#equation-pane<%= index %>" aria-controls="equation" role="tab" data-toggle="tab">
					<i class="fa fa-flask"></i>Equation
				</a>
			</li>

			<li role="presentation" id="coeffs-tab<%= index %>">
				<a href="#coeffs-pane<%= index %>" aria-controls="coeffs" role="tab" data-toggle="tab">
					<i class="fa fa-superscript"></i>Coeffs
				</a>
			</li>

			<li role="presentation" id="calculations-tab<%= index %>">
				<a href="#calculations-pane<%= index %>" aria-controls="calculations" role="tab" data-toggle="tab">
					<i class="fa fa-calculator"></i>Calculate
				</a>
			</li>
		</ul>

		<div class="tab-content">
			<div role="tabpanel" id="graphing-pane<%= index %>" class="graphing tab-pane active">
			</div>

			<div role="tabpanel" id="params-pane<%= index %>" class="params tab-pane">
			</div>

			<div role="tabpanel" id="equation-pane<%= index %>" class="equation tab-pane">
			</div>
			
			<div role="tabpanel" id="coeffs-pane<%= index %>" class="coeffs tab-pane">
			</div>

			<div role="tabpanel" id="calculations-pane<%= index %>" class="calculations tab-pane">
			</div>
		</div>
	`),

	regions: {
		graphing: '.graphing.tab-pane',
		params: '.params.tab-pane',
		equation: '.equation.tab-pane',
		coeffs: '.coeffs.tab-pane',
		calculations: '.calculations.tab-pane'
	},

	//
	// constructor
	//

	initialize: function() {
		this.index = this.constructor.count++;
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
		this.showParamsPane();
		this.showEquationPane();
		this.showCoeffsPane();
		this.showCalculationsPane();
	},

	showGraphingPane: function() {
		this.showChildView('graphing', new RefractionGraphingFormView({
			model: this.model,

			// callbacks
			//
			onchange: this.options.onchange
		}));
	},

	showParamsPane: function() {
		this.showChildView('params', new RefractionParamsFormView({
			model: this.model,

			// callbacks
			//
			onchange: this.options.onchange
		}));
	},

	showEquationPane: function() {
		this.showChildView('equation', new RefractionEquationFormView({
			model: this.model
		}));
	},

	showCoeffsPane: function() {
		this.showChildView('coeffs', new RefractionCoeffsFormView({
			model: this.model,

			// callbacks
			//
			onchange: this.options.onchange
		}));
	},

	showCalculationsPane: function() {
		this.showChildView('calculations', new RefractionCalculationsFormView({
			model: this.model,

			// options
			//
			wavelengths: this.options.wavelengths
		}));
	}
}, {

	//
	// static attributes
	//

	count: 0
});