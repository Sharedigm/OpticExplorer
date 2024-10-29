/******************************************************************************\
|                                                                              |
|                                animatable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a collection of animation methods.                       |
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

	// animation attributes
	//
	duration: 300,

	//
	// animating methods
	//

	getEffectElement: function() {
		return this.$el.find('.icon');
	},

	showEffect: function(effect, done) {
		switch (effect) {
			case 'blink':
				this.blink(done);
				break;
			case 'bounce':
				this.bounce(done);
				break;
			case 'contract':
				this.contract(done);
				break;
			case 'expand':
				this.expand(done);
				break;
			case 'flip':
				this.flip(done);
				break;
			case 'grow':
				this.grow(done);
				break;
			case 'shimmy':
				this.shimmy(done);
				break;
			case 'shrink':
				this.shrink(done);
				break;
			case 'squeeze':
				this.squeeze(done);
				break;
			case 'tilt':
				this.tilt(done);
				break;
			case 'wobble':
				this.wobble(done);
				break;
		}
	},

	blink: function(done) {
		this.startAnimation('blinking', done);
	},

	bounce: function(done) {
		this.startAnimation('bouncing', done);
	},

	contract: function(done) {
		this.$el.removeClass('uncontracted');
		this.startAnimation('contracting', done);
	},

	expand: function() {
		let element = this.$el;
		element.addClass('expanding');

		// remove style after animation
		//
		window.setTimeout(() => {
			element.removeClass('expanding');
			element.addClass('uncontracted');
		}, this.duration);
	},

	flip: function(done) {
		this.startAnimation('flipping', done);
	},

	grow: function(done) {
		this.startAnimation('growing-bounce', done);
	},

	shimmy: function(done) {
		this.startAnimation('shimmying', done);
	},

	shrink: function(done) {
		this.startAnimation('shrinking-bounce', () => {
			this.$el.css('visibility', 'hidden');

			// perform callback
			//
			if (done) {
				done();
			}
		});
	},

	squeeze: function(done) {
		this.startAnimation('squeezing', done);
	},

	tilt: function(done) {
		this.startAnimation('tilting', done);
	},

	wobble: function(done) {
		this.startAnimation('wobbling', done);
	},

	//
	// effect animation methods
	//

	animateElement: function(element, effect, done) {
		if (!this.animation) {

			// add style
			//
			element.addClass(effect);

			// remove style after animation
			//
			this.animation = window.setTimeout(() => {

				// remove style
				//
				element.removeClass(effect);
				this.animation = null;

				// perform callback
				//
				if (done) {
					done();
				}
			}, this.duration);
		}
	},

	startAnimation(animation, done) {
		this.animateElement(this.getEffectElement(), animation, done);
	},
};