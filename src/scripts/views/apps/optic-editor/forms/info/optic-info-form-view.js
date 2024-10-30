/******************************************************************************\
|                                                                              |
|                            optic-info-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing information about an optic.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import InfoFormView from '../../../../../views/apps/common/forms/info-form-view.js';
import FileIconView from '../../../../../views/apps/file-browser/mainbar/files/icons/file-icon-view.js';
import OpticGeneralPaneView from '../../../../../views/apps/optic-editor/forms/info/panes/optic-general-pane-view.js';
import OpticDimensionsPaneView from '../../../../../views/apps/optic-editor/forms/info/panes/optic-dimensions-pane-view.js';
import OpticInfoPaneView from '../../../../../views/apps/optic-editor/forms/info/panes/optic-info-pane-view.js';

export default InfoFormView.extend({

	//
	// attributes
	//

	className: 'form-vertical',

	template: template(`
		<div class="items">
			<div class="icon-grid"></div>
		</div>
		
		<ul class="nav nav-tabs" role="tablist">
		
			<li role="presentation" class="general tab<% if (tab == 'general') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".general.tab-pane">
					<i class="fa fa-info-circle"></i>
					<label>General</label>
				</a>
			</li>

			<li role="presentation" class="dimensions tab<% if (tab == 'analysis') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".dimensions.tab-pane">
					<i class="fa fa-arrows-left-right"></i>
					<label>Dimensions</label>
				</a>
			</li>

			<li role="presentation" class="info tab<% if (tab == 'info') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".info.tab-pane">
					<i class="fa fa-info-circle"></i>
					<label>Info</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
			<div role="tabpanel" class="general tab-pane<% if (tab == 'general') { %> active<% } %>">
			</div>

			<div role="tabpanel" class="dimensions tab-pane<% if (tab == 'dimensions') { %> active<% } %>">
			</div>

			<div role="tabpanel" class="info tab-pane<% if (tab == 'info') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		item: '.icon-grid',
		general: '.general.tab-pane',
		dimensions: '.dimensions.tab-pane',
		info: '.info.tab-pane'
	},

	//
	// querying methods
	//

	getTab: function() {
		let tab = this.$el.find('.nav-tabs li.active');
		let className = tab.attr('class');
		return className.replace('tab', '').replace('active', '').trim();
	},

	//
	// getting methods
	//

	getIconView: function() {
		return FileIconView;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			index: this.options.index,
			tab: this.options.tab || 'general',
			name: this.model.get('name')
		};
	},

	showRegion: function(name) {
		switch (name) {
			case 'item':
				this.showItem();
				break;
			case 'general':
				this.showGeneralPane();
				break;
			case 'dimensions':
				this.showDimensionsPane();
				break;
			case 'info':
				this.showInfoPane();
				break;	
		}
	},

	showItem: function() {
		this.showChildView('item', new (this.getIconView())({
			model: this.options.file,

			// capabilities
			//
			selectable: false
		}));
	},

	//
	// pane rendering methods
	//

	showGeneralPane: function() {
		this.showChildView('general', new OpticGeneralPaneView({
			model: this.model
		}));
	},

	showDimensionsPane: function() {
		this.showChildView('dimensions', new OpticDimensionsPaneView({
			model: this.model
		}));
	},

	showInfoPane: function() {
		this.showChildView('info', new OpticInfoPaneView({
			model: this.model
		}));
	}
});