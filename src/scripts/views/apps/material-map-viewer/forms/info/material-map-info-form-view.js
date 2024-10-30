/******************************************************************************\
|                                                                              |
|                          connection-info-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing information about a connection.       |
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
import MaterialMapGeneralPaneView from '../../../../../views/apps/material-map-viewer/forms/info/panes/material-map-general-pane-view.js';
import MaterialMapInfoPaneView from '../../../../../views/apps/material-map-viewer/forms/info/panes/material-map-info-pane-view.js';
import MaterialMapAnalysisPaneView from '../../../../../views/apps/material-map-viewer/forms/info/panes/material-map-analysis-pane-view.js';

export default InfoFormView.extend({

	//
	// attributes
	//

	className: 'form-vertical',

	template: template(`
		<div class="center aligned items">
			<div class="icon-grid">
				<div class="file item">
					<div class="row">
						<div class="icon">
							<img src="images/icons/apps/material-map-viewer.svg" />
						</div>
					</div>
					<div class="row">
						<div class="name"><%= name %></div>
					</div>
				</div>
			</div>
		</div>
		
		<ul class="nav nav-tabs" role="tablist">
		
			<li role="presentation" class="general tab<% if (tab == 'general') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".general.tab-pane">
					<i class="fa fa-info-circle"></i>
					<label>General</label>
				</a>
			</li>

			<li role="presentation" class="analysis tab<% if (tab == 'analysis') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".analysis.tab-pane">
					<i class="fa fa-chart-line"></i>
					<label>Analysis</label>
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

			<div role="tabpanel" class="analysis tab-pane<% if (tab == 'analysis') { %> active<% } %>">
			</div>

			<div role="tabpanel" class="info tab-pane<% if (tab == 'info') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		general: '.general.tab-pane',
		analysis: '.analysis.tab-pane',
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
			case 'general':
				this.showGeneralPane();
				break;
			case 'analysis':
				this.showAnalysisPane();
				break;
			case 'info':
				this.showInfoPane();
				break;	
		}
	},

	//
	// pane rendering methods
	//

	showGeneralPane: function() {
		this.showChildView('general', new MaterialMapGeneralPaneView({
			model: this.model
		}));
	},

	showAnalysisPane: function() {
		this.showChildView('analysis', new MaterialMapAnalysisPaneView({
			model: this.model
		}));
	},

	showInfoPane: function() {
		this.showChildView('info', new MaterialMapInfoPaneView({
			model: this.model
		}));
	}
});