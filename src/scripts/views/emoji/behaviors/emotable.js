/******************************************************************************\
|                                                                              |
|                                  emotable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for adding emojis to an item.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import EmojiSelectorView from '../../../views/emoji/emoji-selector-view.js';

export default {

	//
	// attributes
	//

	events: {
		'click .add-emoji': 'onClickAddEmoji'
	},

	//
	// rendering methods
	//

	showEmojiSelector: function(options) {
		let $container = this.parent.$el;

		// load emoji
		//
		if (!config.emoji) {
			fetch('config/emoji.json').then((response) => response.json()).then((json) => {
				config.emoji = json;
				this.showEmojiSelector(options);
			});
			return;
		}

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}
		if (!options.placement) {
			options.placement = 'bottom';
		}

		// show popover
		//
		this.emojiTrigger = this.$el.find('.add-emoji').addClass('popover-trigger');            
		this.emojiTrigger.popover({
			placement: 'right',
			trigger: 'manual',
			html: true,
			content: '',
			container: $container
		});
		this.emojiTrigger.popover('show');

		// show emoji selector in popover
		//
		this.addRegion('emoji', {
			el: $container.find('.popover-content'),
			replaceElement: false
		});
		this.showChildView('emoji', new EmojiSelectorView({

			// callbacks
			//
			onselect: (char) => {
				this.$el.find('.comment-inner').insertAtCaret(char);
				this.hideEmojiSelector();
				this.onInputMessage();
			}
		}));

		// position popover
		//
		if (options && options.placement) {
			$container.find('.popover').addClass(options.placement + '-placement');
		}

		// remove emoji selector on next click anywhere
		//
		this.eventListener = $('body')[0].addEventListener('click', () => {
			this.hideEmojiSelector();
		});
	},

	hideEmojiSelector: function() {
		this.emojiTrigger.popover('hide');
		$('body')[0].removeEventListener('click', this.eventListener);
		this.removeTooltips();
	},

	//
	// mouse event handling methods
	//

	onClickAddEmoji: function(event) {
		this.showEmojiSelector();

		// block event from parent
		//
		this.block(event);
	}
};