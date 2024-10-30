/******************************************************************************\
|                                                                              |
|                           spectrum-info-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing information about a spectrum.         |
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
import SpectrumGeneralPaneView from '../../../../../views/apps/spectrum-editor/forms/info/panes/spectrum-general-pane-view.js';

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
		</ul>
		
		<div class="tab-content">
			<div role="tabpanel" class="general tab-pane<% if (tab == 'general') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		item: '.icon-grid',
		general: '.general.tab-pane'
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
			name: this.options.file.getName()
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
		this.showChildView('general', new SpectrumGeneralPaneView({
			model: this.model
		}));
	}
});