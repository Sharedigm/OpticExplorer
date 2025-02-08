/******************************************************************************\
|                                                                              |
|                             params-panel-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import ParamsFormView from '../../../../../views/apps/search-viewer/forms/params/params-form-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'params panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-sliders"></i>Parameters</label>
		</div>

		<div class="form"></div>
	`),

	regions: {
		form: '.form'
	},

	events: {
		'click .search input': 'onClickSearch',
		'click .target input': 'onClickTarget',
		'change .min-score input': 'onChangeMinScore',
		'change .max-results input': 'onChangeMaxResults'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		return this.getChildView('form').getValue(key);
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showParamsForm();
	},

	showParamsForm: function() {
		this.showChildView('form', new ParamsFormView({
			search_kind: this.parent.app.preferences.get('search')
		}));
	},

	//
	// mouse event handling methods
	//

	onClickSearch: function() {
		this.parent.app.setOption('search', this.getValue('search'));
	},

	onClickTarget: function() {
		this.parent.app.setOption('target', this.getValue('target'));
	},

	onClickMinScore: function() {
		this.parent.app.setOption('min_score', this.getValue('min_score'));
	},

	onClickMaxResults: function() {
		this.parent.app.setOption('max_results', this.getValue('max_results'));
	}
});