/******************************************************************************\
|                                                                              |
|                             prefs-loadable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for loading application preferencess.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// dynamic loading methods
	//

	loadPrefsFormView: function(appName, done) {
		switch (appName) {

			case 'app_launcher':
				import(
					'../../../app-launcher/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'audio_player':
				import(
					'../../../audio-player/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'calculator':
				import(
					'../../../calculator/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'calendar':
				import(
					'../../../calendar/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'chat_browser':
				import(
					'../../../chat-browser/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'chat_viewer':
				import(
					'../../../chat-viewer/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'clock':
				import(
					'../../../clock/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'code_editor':
				import(
					'../../../code-editor/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'communicator':
				import(
					'../../../communicator/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'connection_manager':
				import(
					'../../../connection-manager/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'contact_editor':
				import(
					'../../../contact-editor/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'decibel_meter':
				import(
					'../../../decibel-meter/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			/*
			case 'desktop':
				import(
					'../../../desktop/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;
			*/

			case 'file_browser':
				import(
					'../../../file-browser/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'help_viewer':
				import(
					'../../../help-viewer/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'image_viewer':
				import(
					'../../../image-viewer/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'map_viewer':
				import(
					'../../../map-viewer/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			/*
			case 'notification_center':
				import(
					'../../../notification-center/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;
			*/

			case 'pdf_viewer':
				import(
					'../../../pdf-viewer/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'post_viewer':
				import(
					'../../../post-viewer/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'profile_browser':
				import(
					'../../../profile-browser/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'profile_viewer':
				import(
					'../../../profile-viewer/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'project_browser':
				import(
					'../../../project-browser/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'project_viewer':
				import(
					'../../../project-viewer/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'search_viewer':
				import(
					'../../../search-viewer/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'settings_browser':
				import(
					'../../../settings-browser/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'settings_manager':
				import(
					'../../../settings-manager/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'terminal':
				import(
					'../../../terminal/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'text_editor':
				import(
					'../../../text-editor/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'theme_manager':
				import(
					'../../../theme-manager/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			/*
			case 'theme_picker':
				import(
					'../../../theme-picker/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;
			*/

			case 'timer':
				import(
					'../../../timer/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'topic_browser':
				import(
					'../../../topic-browser/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'topic_viewer':
				import(
					'../../../topic-viewer/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'tune_editor':
				import(
					'../../../tune-editor/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'video_player':
				import(
					'../../../video-player/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;

			case 'web_browser':
				import(
					'../../../web-browser/forms/preferences/preferences-form-view.js'
				).then((PrefsFormView) => {
					done(PrefsFormView.default);
				});
				break;
		}
	}

	/*
	loadApp: function(appName, done) {
		let dirname = appName.replace('_', '-');
		let filename = dirname + '-view.js';

		import(
			'../../../' + dirname + '/' + filename
		).then((AppView) => {
			done(AppView);
		});
	}
	*/
};