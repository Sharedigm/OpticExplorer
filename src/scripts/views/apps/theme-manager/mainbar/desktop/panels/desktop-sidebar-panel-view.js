/******************************************************************************\
|                                                                              |
|                          desktop-sidebar-panel-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for viewing and editing theme settings.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormPanelView from '../../../../../../views/forms/form-panel-view.js';

export default FormPanelView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="desktop-sidebar-transparency form-group">
			<label class="control-label"><i class="fa fa-glass-martini"></i>Transparency</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="desktop-sidebar-transparency" value="opaque"<% if (desktop_sidebar_transparency == 'opaque') {%> checked<% } %>>Opaque</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="desktop-sidebar-transparency" value="transparent"<% if (desktop_sidebar_transparency == 'transparent') {%> checked<% } %>>Clear</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="desktop-sidebar-transparency" value="translucent"<% if (desktop_sidebar_transparency == 'translucent') {%> checked<% } %>>Translucent</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="desktop-sidebar-transparency" value="auto"<% if (desktop_sidebar_transparency == 'auto') {%> checked<% } %>>Auto</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Transparency" data-content="This determines whether or not transparency effects are used in the visual styling."></i>
			</div>
		</div>
		
		<div class="desktop-sidebar-panels form-group">
			<label class="control-label"><i class="fa fa-pause"></i>Sidebar Panels</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="desktop-sidebar-panels" value="show"<% if (desktop_sidebar_panels == 'show' || desktop_sidebar_panels == true) {%> checked<% } %>>Show</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="desktop-sidebar-panels" value="hide"<% if (desktop_sidebar_panels == 'hide' || desktop_sidebar_panels == false) {%> checked<% } %>>Hide</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="desktop-sidebar-panels" value="auto"<% if (desktop_sidebar_panels == 'auto') {%> checked<% } %>>Auto</label>
				</div>
			</div>
		</div>
	`),

	events: {
		'change .desktop-sidebar-transparency input': 'onChangeDesktopSideBarTransparency',
		'change .desktop-sidebar-panels input': 'onChangeDesktopSideBarPanels'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'desktop_sidebar_transparency':
				return this.$el.find('.desktop-sidebar-transparency input:checked').val();
			case 'desktop_sidebar_panels':
				return this.$el.find('.desktop-sidebar-panels input:checked').val();
		}
	},

	getValues: function() {
		return {
			desktop_sidebar_transparency: this.getValue('desktop_sidebar_transparency'),
			desktop_sidebar_panels: this.getValue('desktop_sidebar_panels')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			desktop_sidebar_transparency: application.settings.desktop.get('desktop_sidebar_transparency'),
			desktop_sidebar_panels: application.settings.desktop.get('desktop_sidebar_panels')
		};
	},

	//
	// event handling methods
	//

	onChangeDesktopSideBarTransparency: function() {
		application.settings.desktop.set('desktop_sidebar_transparency', this.getValue('desktop_sidebar_transparency'));
	},

	onChangeDesktopSideBarPanels: function() {
		application.settings.desktop.set('desktop_sidebar_panels', this.getValue('desktop_sidebar_panels'));
	}
});
