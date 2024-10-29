/******************************************************************************\
|                                                                              |
|                              app-loadable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for loading applications.                     |
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

	loadAppView: function(appName, done) {
		switch (appName) {

			case 'app_launcher':
				import(
					'../../../app-launcher/app-launcher-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'audio_player':
				import(
					'../../../audio-player/audio-player-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'calculator':
				import(
					'../../../calculator/calculator-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'calendar':
				import(
					'../../../calendar/calendar-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'chat_browser':
				import(
					'../../../chat-browser/chat-browser-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'chat_viewer':
				import(
					'../../../chat-viewer/chat-viewer-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'clock':
				import(
					'../../../clock/clock-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'code_editor':
				import(
					'../../../code-editor/code-editor-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'communicator':
				import(
					'../../../communicator/communicator-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'connection_manager':
				import(
					'../../../connection-manager/connection-manager-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'contact_editor':
				import(
					'../../../contact-editor/contact-editor-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'decibel_meter':
				import(
					'../../../decibel-meter/decibel-meter-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'desktop':
				import(
					'../../../desktop/desktop-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'file_browser':
				import(
					'../../../file-browser/file-browser-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'help_viewer':
				import(
					'../../../help-viewer/help-viewer-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'image_viewer':
				import(
					'../../../image-viewer/image-viewer-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'map_viewer':
				import(
					'../../../map-viewer/map-viewer-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'notification_center':
				import(
					'../../../notification-center/notification-center-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'pdf_viewer':
				import(
					'../../../pdf-viewer/pdf-viewer-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'post_viewer':
				import(
					'../../../post-viewer/post-viewer-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'profile_browser':
				import(
					'../../../profile-browser/profile-browser-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'profile_viewer':
				import(
					'../../../profile-viewer/profile-viewer-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'project_browser':
				import(
					'../../../project-browser/project-browser-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'project_viewer':
				import(
					'../../../project-viewer/project-viewer-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'search_viewer':
				import(
					'../../../search-viewer/search-viewer-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'settings_browser':
				import(
					'../../../settings-browser/settings-browser-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'settings_manager':
				import(
					'../../../settings-manager/settings-manager-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'terminal':
				import(
					'../../../terminal/terminal-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'text_editor':
				import(
					'../../../text-editor/text-editor-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'theme_manager':
				import(
					'../../../theme-manager/theme-manager-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'theme_picker':
				import(
					'../../../theme-picker/theme-picker-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'timer':
				import(
					'../../../timer/timer-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'topic_browser':
				import(
					'../../../topic-browser/topic-browser-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'topic_viewer':
				import(
					'../../../topic-viewer/topic-viewer-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'tune_editor':
				import(
					'../../../tune-editor/tune-editor-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'video_player':
				import(
					'../../../video-player/video-player-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;

			case 'web_browser':
				import(
					'../../../web-browser/web-browser-view.js'
				).then((AppView) => {
					done(AppView.default);
				});
				break;
			default:
				done();
		}
	}

	/*
	loadApp: function(appName, done) {
		let dirname = appName.replace('_', '-');
		let filename = dirname + '-view.js';

		import(
			'../../../' + dirname + '/' + filename
		).then((AppView) => {
			done(AppView.default);
		});
	}
	*/
};