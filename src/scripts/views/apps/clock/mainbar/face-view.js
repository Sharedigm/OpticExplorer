/******************************************************************************\
|                                                                              |
|                                face-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used to display the time.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'face',

	template: template(`
		<div class="empty pie"></div>
		<div class="half-full pie slice1"></div>
		<div class="half-empty pie slice2"></div>
		
		<div class="digital lcd display">
			<div class="digits">
				<div class="am-pm">AM</div>
				<div class="middle">
					<div class="hours">00</div>
					<div class="colons">:</div>
					<div class="minutes">00</div>
				</div>
				<div class="seconds">00</div>
			</div>
		</div>
		
		<div class="analog lcd display">
			<svg width="200" height="200">
				<filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
					<feOffset in="blur" dx="2.5" dy="2.5"/>
				</filter>
				
				<g id="hands">
					<line x1="100" y1="100" x2="100" y2="40" id="minutehand">
						<animatetransform attributeName="transform"
							attributeType="XML"
							type="rotate"
							dur="3600s"
							repeatCount="indefinite"/>
					</line>
					<line x1="100" y1="100" x2="100" y2="55" transform="rotate(80 100 100)" id="hourhand">
						<animatetransform attributeName="transform"
							attributeType="XML"
							type="rotate"
							dur="43200s"
							repeatCount="indefinite"/>
					</line>
					<line x1="100" y1="100" x2="100" y2="30" id="secondhand">
							<animatetransform attributeName="transform"
							attributeType="XML"
							type="rotate"
							dur="60s"
							repeatCount="indefinite"/>
					</line>
				</g>
		
				<circle id="center" cx="100" cy="100" r="3"></circle>
			</svg>
		</div>
	`),

	//
	// setting methods
	//

	setMode: function(mode) {
		this.mode = mode;

		// update display
		//
		switch (mode) {
			case 'analog':
				this.$el.find('.analog').show();
				this.$el.find('.digital').hide();
				break;
			case 'digital':
				this.$el.find('.analog').hide();
				this.$el.find('.digital').show();
				break;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			mode: this.options.mode,
		};
	},

	onRender: function() {

		// show analog clock
		//
		this.showAnalog();

		// set initial mode
		//
		this.setMode(this.options.mode);
	},

	setDigitalTime: function(dow, time) {
		let hours = time.hours;
		let minutes = time.minutes;
		let seconds = Math.floor(time.seconds);
		let am = hours < 12;

		function pad(string) {
			return string.length == 1? '0' + string : string;
		}

		if (hours > 12) {
			hours -= 12;
		}
		if (hours == 0) {
			hours = 12;
		}

		// this.$el.find('.dow').html(pad(dow.toUpperCase().substring(0, 2)));
		this.$el.find('.am-pm').html(am? 'AM' : 'PM');
		this.$el.find('.hours').html(hours.toString());
		this.$el.find('.minutes').html(pad(minutes.toString()));
		this.$el.find('.seconds').html(pad(seconds.toString()));	
	},

	showAnalog: function() {
		let hands = [];
		hands.push(this.el.querySelector('#secondhand > *'));
		hands.push(this.el.querySelector('#minutehand > *'));
		hands.push(this.el.querySelector('#hourhand > *'));

		let cx = 100;
		let cy = 100;

		function shifter(val) {
			return [val, cx, cy].join(' ');
		}

		let date = new Date();
		let hoursAngle = 360 * date.getHours() / 12 + date.getMinutes() / 2;
		let minuteAngle = 360 * date.getMinutes() / 60;
		let secAngle = 360 * date.getSeconds() / 60;

		hands[0].setAttribute('from', shifter(secAngle));
		hands[0].setAttribute('to', shifter(secAngle + 360));
		hands[1].setAttribute('from', shifter(minuteAngle));
		hands[1].setAttribute('to', shifter(minuteAngle + 360));
		hands[2].setAttribute('from', shifter(hoursAngle));
		hands[2].setAttribute('to', shifter(hoursAngle + 360));

		// add tick marks
		//
		for (let i = 1; i <= 12; i++) {
			let el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			el.setAttribute('x1', '100');
			el.setAttribute('y1', '15');
			el.setAttribute('x2', '100');
			el.setAttribute('y2', '35');
			el.setAttribute('transform', 'rotate(' + (i * 360 / 12) + ' 100 100)');
			this.$el.find('svg')[0].appendChild(el);
		}
	}
});