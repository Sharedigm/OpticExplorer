/******************************************************************************\
|                                                                              |
|                                 wallpaperable.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a behavior for displaying wallpaper / background color.       |
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
	// setting methods
	//

	setBackgroundUrl: function(url) {
		if (url) {

			// set background size attributes
			//
			this.$el.css({
				'background-image': 'url(' + url + ')',
			});

			// tag svg backgrounds
			//
			if (url.endsWith('.svg')) {
				this.$el.addClass('svg');
			} else {
				this.$el.removeClass('svg');
			}

			this.$el.addClass('wallpapered');
		} else {
			this.clearBackgroundImage();		
		}
	},

	setBackgroundSize: function(backgroundSize, backgroundRepeats) {
		switch (backgroundSize || 'cover') {
			case 'cover':
				this.$el.css({
					'background-size': 'cover',
					'background-position': 'center',
					'background-repeat': 'no-repeat',
					'image-rendering': 'auto'
				});
				break;
			case 'contain':
				this.$el.css({
					'background-size': 'contain',
					'background-position': 'center',
					'background-repeat': 'no-repeat',
					'image-rendering': 'auto'
				});
				break;
			case 'center':
				this.$el.css({
					'background-size': 'auto',
					'background-position': 'center',
					'background-repeat': 'no-repeat',
					'image-rendering': 'pixelated'
				});
				break;
			case 'tile':
				this.$el.css({
					'background-size': 'auto',
					'background-position': 'center',
					'background-repeat': 'repeat',
					'image-rendering': 'pixelated'
				});
				break;
			case 'repeat':
				this.$el.css({
					'background-size': (100 / backgroundRepeats) + '%',
					'background-position': 'center',
					'background-repeat': 'repeat',
					'image-rendering': 'auto'
				});
				break;
			case 'none':
				this.$el.css({
					'background-size': '',
					'background-position': '',
					'background-repeat': '',
					'image-rendering': ''
				});
				break;
		}
	},

	setBackgroundColor: function(color, element) {
		if (!element) {
			element = this.$el;
		}
		this.clearBackgroundColor(element);

		// set to custom color
		//
		if (color && (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl'))) {
			element.css({
				'background-color': color
			});

		// set to auto color
		//
		} else if (color == 'auto') {
			element.addClass('auto-colored');

		// set to standard color
		//
		} else if (color && color != 'none') {
			element.addClass('colored ' + color);		
		}
	},

	//
	// clearing methods
	//

	clearBackground: function() {
		this.clearBackgroundColor();
		this.clearBackgroundImage();
	},

	clearBackgroundColor: function(element) {
		let colors = config.defaults.colors;

		if (!element) {
			element = this.$el;
		}

		// clear background classes
		//
		element.removeClass('colored');
		element.removeClass('auto-colored');
		element.css({
			'background-color': ''
		});

		// clear background colors
		//
		element.removeClass('white');
		element.removeClass('black');
		if (!colors) {
			return;
		}
		for (let i = 0; i < colors.length; i++) {
			element.removeClass(colors[i]);
		}
	},

	clearBackgroundImage: function() {
		this.$el.css({
			'background-image': ''
		});

		this.$el.removeClass('wallpapered');	
	}
};