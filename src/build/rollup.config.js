export default {
	input: '../scripts/main.js',

	external: [
		'https://apis.google.com/js/api.js',
		'https://www.dropbox.com/static/api/2/dropins.js',
		'https://apis.google.com/js/api.js'
	],

	output: {
		format: 'es',
		dir: '../../sharedigm-built/scripts',
		inlineDynamicImports: false,
		chunkFileNames: '[name].js'
	},

	manualChunks: {

		// library chunks
		//
		'jquery': ['../library/jquery/jquery-3.6.0.js'],
		'lodash': ['../library/lodash/lodash.js'],
		'backbone': ['../library/backbone/backbone.js'],
		'marionette': ['../library/backbone/marionette/backbone.marionette.js'],
		'underscore': ['../library/underscore/underscore.js'],

		// application chunks
		//
		'application': ['../scripts/application.js'],

		// app chunks
		//
		'app-launcher': ['../scripts/views/apps/app-launcher/app-launcher-view.js'],
		'audio-player': ['../scripts/views/apps/audio-player/audio-player-view.js'],
		'calculator': ['../scripts/views/apps/calculator/calculator-view.js'],
		'calendar': ['../scripts/views/apps/calendar/calendar-view.js'],
		'chat-browser': ['../scripts/views/apps/chat-browser/chat-browser-view.js'],
		'chat-viewer': ['../scripts/views/apps/chat-viewer/chat-viewer-view.js'],
		'clock': ['../scripts/views/apps/clock/clock-view.js'],
		'code-editor': ['../scripts/views/apps/code-editor/code-editor-view.js'],
		'connection-manager': ['../scripts/views/apps/connection-manager/connection-manager-view.js'],
		'contact-editor': ['../scripts/views/apps/contact-editor/contact-editor-view.js'],
		'desktop': ['../scripts/views/apps/desktop/desktop-view.js'],
		'file-browser': ['../scripts/views/apps/file-browser/file-browser-view.js'],
		'help-viewer': ['../scripts/views/apps/help-viewer/help-viewer-view.js'],
		'image-viewer': ['../scripts/views/apps/image-viewer/image-viewer-view.js'],
		'map-viewer': ['../scripts/views/apps/map-viewer/map-viewer-view.js'],
		'messenger': ['../scripts/views/apps/messenger/messenger-view.js'],
		'notification-center': ['../scripts/views/apps/notification-center/notification-center-view.js'],
		'pdf-viewer': ['../scripts/views/apps/pdf-viewer/pdf-viewer-view.js'],
		'post-viewer': ['../scripts/views/apps/post-viewer/post-viewer-view.js'],
		'profile-browser': ['../scripts/views/apps/profile-browser/profile-browser-view.js'],
		'profile-viewer': ['../scripts/views/apps/profile-viewer/profile-viewer-view.js'],
		'project-browser': ['../scripts/views/apps/project-browser/project-browser-view.js'],
		'project-viewer': ['../scripts/views/apps/project-viewer/project-viewer-view.js'],
		'settings-browser': ['../scripts/views/apps/settings-browser/settings-browser-view.js'],
		'settings-manager': ['../scripts/views/apps/settings-manager/settings-manager-view.js'],
		'terminal': ['../scripts/views/apps/terminal/terminal-view.js'],
		'text-editor': ['../scripts/views/apps/text-editor/text-editor-view.js'],
		'theme-manager': ['../scripts/views/apps/theme-manager/theme-manager-view.js'],
		'theme-picker': ['../scripts/views/apps/theme-picker/theme-picker-view.js'],
		'timer': ['../scripts/views/apps/timer/timer-view.js'],
		'topic-browser': ['../scripts/views/apps/topic-browser/topic-browser-view.js'],
		'topic-viewer': ['../scripts/views/apps/topic-viewer/topic-viewer-view.js'],
		'tune-editor': ['../scripts/views/apps/tune-editor/tune-editor-view.js'],
		'video-player': ['../scripts/views/apps/video-player/video-player-view.js'],
		'web-browser': ['../scripts/views/apps/web-browser/web-browser-view.js'],

		// vendor chunks
		//
		'ace': ['../vendor/ace/ace.js'],
		'flickity': ['../vendor/flickity/js/flickity.pkgd.js'],
		'jpictura': ['../vendor/jpictura/js/jpictura.js'],
		'jquery-fancybox': ['../vendor/jquery/fancybox/jquery.fancybox.js'],
		'jquery-mousewheel': ['../vendor/jquery/mousewheel/jquery.mousewheel.js'],
		'jquery-tablesorter': ['../vendor/jquery/tablesorter/js/jquery.tablesorter.min.js'],
		'jquery-ui': ['../vendor/jquery/jquery-ui/js/jquery-ui.js'],
		'pdfjs': ['../vendor/pdfjs/build/pdf.js'],
		'splitjs': ['../vendor/split-js/split.js']
	}
};