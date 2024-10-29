/******************************************************************************\
|                                                                              |
|                         sound-settings-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for viewing and editing sound settings.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SettingsFormView from '../../../../../views/apps/common/forms/settings-form-view.js';
import SoundSettingsListView from '../../../../../views/apps/settings-manager/mainbar/sound-settings-list/sound-settings-list-view.js';
import RangeInputView from '../../../../../views/forms/inputs/range-input-view.js';

export default SettingsFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="settings icon-grid">
			<div class="item">
				<div class="row">
					<div class="icon colored grey">
						<img src="images/icons/settings/sound.svg" />
						<i class="fa fa-volume-up"></i>
					</div>
				</div>
				<div class="row">
					<div class="name">Sound</div>
				</div>
			</div>
		</div>

		<ul class="nav nav-tabs" role="tablist">

			<li role="presentation" class="general-tab<% if (tab == 'general' || !tab) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".general-settings">
					<i class="fa fa-check"></i>
					<label>General</label>
				</a>
			</li>

			<li role="presentation" class="events-tab<% if (tab == 'events') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".events-settings">
					<i class="fa fa-exclamation-triangle"></i>
					<label>Events</label>
				</a>
			</li>
		</ul>

		<div class="tab-content">

			<div role="tabpanel" class="general-settings tab-pane<% if (tab == 'general' || !tab) { %> active<% } %>">
				<div class="mute-sounds form-group">
					<label class="control-label"><i class="fa fa-volume-mute"></i>Mute</label>
					<div class="controls">
						<div class="checkbox-inline">
							<input type="checkbox"<% if (mute_sounds) { %> checked<% } %> />
						</div>
					</div>
				</div>

				<div class="volume form-group">
					<label class="control-label"><i class="fa fa-volume-up"></i>Volume</label>
					<div class="controls">
						<div class="range-input"></div>

						<div class="control-inline">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Volume" data-content="This is the volume to use for system sounds."></i>
						</div>
					</div>
				</div>
			</div>

			<div role="tabpanel" class="events-settings tab-pane<% if (tab == 'events') { %> active<% } %>">
				<div class="list"></div>
			</div>
		</div>
	`),

	regions: {
		volume: '.volume .range-input',
		list: '.list'
	},

	events: {
		'click .mute-sounds': 'onClickMuteSounds'
	},

	//
	// constructor
	//

	initialize: function() {
		this.model = application.settings.sound;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab: this.options.tab,
			mute_sounds: application.isMuted()
		};
	},

	showRegion: function(name) {
		switch (name) {
			case 'volume':
				this.showVolume();
				break;
			case 'list':
				this.showList();
		}
	},

	showVolume: function() {
		this.showChildView('volume', new RangeInputView({

			// options
			//
			value: application.getVolume(),
			min: 0,
			max: 10,
			step: 1,

			// callbacks
			//
			onchange: (value) => this.onChangeVolume(value)
		}));
	},

	showList: function() {
		this.showChildView('list', new SoundSettingsListView({
			model: this.model,
			collection: this.model.toCollection('event', 'sound')
		}));	
	},

	validate: function() {

		// do nothing
		//
	},

	//
	// mouse event handling methods
	//

	onClickMuteSounds: function() {
		application.setMuted(!application.isMuted());
	},

	onChangeVolume: function(volume) {
		application.setVolume(volume);
	}
});