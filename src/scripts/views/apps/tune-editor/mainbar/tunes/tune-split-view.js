/******************************************************************************\
|                                                                              |
|                              tune-split-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying and editing tunes.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SplitView from '../../../../../views/layout/split-view.js';
import Chars from '../../../../../utilities/scripting/chars.js';
import '../../../../../../vendor/abcjs/abcjs_basic_5.6.8-min.js';

export default SplitView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="split mainbar">
			<div class="notation"></div>
			<div class="midi" style="display:none"></div>
		</div>
		
		<div class="split sidebar">
			<textarea class="markup" spellcheck="false"></textarea>
		</div>
	`),

	events: _.extend({}, SplitView.prototype.events, {
		'click': 'onClick'
	}),

	orientation: 'vertical',
	flipped: true,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		SplitView.prototype.initialize.call(this);

		// set attributes
		//
		this.index = this.constructor.numTunes++;
	},

	//
	// getting methods
	//

	getValue: function() {
		return this.$el.find('textarea').val();
	},

	getDuration: function() {
		return 60;
	},

	getTrackTime: function() {
		return MIDI.player.currentTime / 1000;
	},

	getCursor: function() {
		let textarea = this.$el.find('textarea');
		let position = textarea.selectionStart || 0;
		let line = 1;
		let lineStart = 0;
		for (let i = 0; i < position; i++) {
			if (textarea[0].value[i] == Chars.carriageReturn) {
				line++;
				lineStart = i;
			}
		}

		return {
			row: line,
			column: position - lineStart
		};
	},

	//
	// setting methods
	//

	setValue: function(text) {

		// render tune
		//
		this.showTune(text);

		// render tune to midi
		//
		/*
		this.midi = $('<div id="midi"></div>');
		this.notation.append(this.midi);
		this.midiData = ABCJS.renderMidi(this.midi[0], text, {
			generateInline: true
		});
		*/
		// this.midi = midiCreate(text);
		// MIDI.player.loadTune(SampleMIDI);
	},

	setOption: function(key, value) {
		switch (key) {

			case 'notation_size':
				this.options.preferences.set('notation_size', value);
				this.update();
				break;

			case 'show_markup':
				if (value) {
					this.showSideBar();
				} else {
					this.hideSideBar();
				}
				break;

			case 'fit_width':
				this.options.preferences.set('fit_width', value);
				this.update();
				break;
		}
	},

	setTrackTime: function(time) {
		MIDI.player.currentTime = time;
	},

	//
	// loading methods
	//

	loadTune: function(text) {

		// set initial text 
		//
		this.setValue(text);

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},
	
	//
	// playing methods
	//

	play: function() {
		if (!this.activated) {
			this.$el.find('.abcjs-midi-start').trigger('click');
			this.activated = true;
		} else {
			MIDI.player.start(MIDI.player.currentTime);
		}

		/*
		let notation = this.$el.find('notation' + this.index);
		ABCJS.startAnimation(notation[0], this.editor.tunes[0], {
			'show_cursor': true
		});
		*/

		// MIDI.player.start(MIDI.player.currentTime);
		// this.midiData.startPlaying();
		// ABCJS.midi.startPlaying(this.el);
		// ABCJS.midi.startPlaying('midi');
		// ABCJS.midi.startPlaying(this.editor.inlineMidi);
	},

	pause: function() {
		MIDI.player.pause();
		// ABCJS.midi.stopPlaying();
	},

	//
	// rendering methods
	//

	getTemplate: function() {
		return this.template;
	},

	onRender: function() {

		// add unique ids
		//
		this.$el.find('.notation').attr('id', 'notation' + this.index);
		this.$el.find('.midi').attr('id', 'midi' + this.index);
		this.$el.find('.markup').attr('id', 'markup' + this.index);

		// show splitter
		//
		if (!this.splitter) {
			this.showSplitter();
		}

		// set initial state
		//
		/*
		if (!this.options.preferences.get('show_markup')) {
			this.hideSideBar();
		}
		*/
	},

	showTune: function(text) {
		let fitWidth = this.options.preferences.get('fit_width');
		let width = this.$el.closest('.tab-content').find('.tab-pane.active').width();
		let notationSize = this.options.preferences.get('notation_size');

		// add text to dom
		//
		this.$el.find('textarea').val(text);

		// show notation and markup
		//
		this.editor = new ABCJS.Editor('markup' + this.index, {

			// options
			//
			paper_id: 'notation' + this.index,
			generate_midi: true,
			midi_id: 'midi' + this.index,
			onchange: this.options.onchange,

			abcjsParams: {

				// engraver params
				//
				staffwidth: width - 40,
				scale: notationSize / 100,
				add_classes: true,
				responsive: fitWidth? 'resize' : true,
				paddingtop: 10,
				paddingbottom: 10,
				paddingleft: 10,
				paddingright: 10,
				showCursor: true
			}
		});

		// add callback
		//
		this.$el.find('textarea').on('change', () => {
			this.onChange();
		});

		// remove added styling
		//
		this.$el.find('.notation').css('overflow', '');

		// remove SVG inline markup
		//
		this.unfill();
	},

	unfill: function() {

		// remove SVG inline markup used for setting fill colors
		//
		this.$el.find('path').removeAttr('fill');
		this.$el.find('rect').removeAttr('fill');
		this.$el.find('text').removeAttr('fill');
	},

	update: function() {
		this.showTune(this.getValue());
	},

	//
	// mouse event handling methods
	//

	onClick: function(event) {

		// deselect selected items if clicking on background
		//
		if (event.target.nodeName == 'svg') {
			this.$el.find('.abcjs-note_selected').removeClass('abcjs-note_selected');
			this.unfill();
		}

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick();
		}
	},

	//
	// window event handling methods
	//

	onResize: function() {

		// update view
		//
		if (!this.options.preferences.get('fit_width')) {
			this.update();
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		if (window.MIDI) {
			window.MIDI.player.stop();
		}
	}
}, {
	numTunes: 0
});