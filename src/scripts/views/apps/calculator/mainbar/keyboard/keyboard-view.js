/******************************************************************************\
|                                                                              |
|                               keyboard-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for performing calculations.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import Keyboard from '../../../../../views/keyboard/keyboard.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'keyboard',

	template: template(`
		<div class="scientific keys">
			<div class="row">
				<button class="mem-clear btn">MC</button>
				<button class="mem-add mem-operator btn">M+</button>
				<button class="mem-minus mem-operator btn">M-</button>
				<button class="mem-recall btn">MR</button>
			</div>
		
			<div class="row">
				<button class="percent operator btn">%</button>
				<button class="invert operator btn">1/x</button>
				<button class="sqrt operator btn">sqrt</button>
				<button class="sqr operator btn">x^2</button>
			</div>
		
			<div class="row">
				<button class="trig-mode btn">deg</button>
				<button class="trig-mode btn">rad</button>
				<button class="pi constant btn">&pi;</button>
				<button class="e constant btn">e</button>
			</div>
		
			<div class="row">
				<button class="hyp-mode btn">hyp</button>
				<button class="sin operator btn">sin</button>
				<button class="cos operator btn">cos</button>
				<button class="tan operator btn">tan</button>
			</div>
		
			<div class="row">
				<button class="power operator2 btn">x^y</button>
				<button class="root operator2 btn">y &radic;<span style="text-decoration:overline;">x</span></button>
				<button class="log btn operator">log</button>
				<button class="ln btn operator">ln</button>
			</div>
		</div>
		
		<div class="programmer keys">
			<div class="row">
				<button class="base-mode binary btn">bin</button>
				<button class="base-mode octal btn">oct</button>
				<button class="base-mode decimal btn">dec</button>
				<button class="base-mode hexidecimal btn">hex</button>
			</div>
		
			<div class="row">
				<button class="and operator2 btn">and</button>
				<button class="or operator2 btn">or</button>
				<button class="xor operator2 btn">xor</button>
				<button class="not operator btn">not</button>
			</div>
		
			<div class="row">
				<button class="shift-left operator btn">shftl</button>
				<button class="shift-right operator btn">shftr</button>
				<button class="rotate-left operator btn">rol</button>
				<button class="rotate-right operator btn">ror</button>
			</div>
		
			<div class="row">
				<button class="d digit btn">D</button>
				<button class="e digit btn">E</button>
				<button class="f digit btn">F</button>
				<button class="000 digits btn">000</button>
			</div>
		
			<div class="row">
				<button class="a digit btn">A</button>
				<button class="b digit btn">B</button>
				<button class="c digit btn">C</button>
				<button class="111 digits btn">111</button>
			</div>
		</div>
		
		<div class="numeric keys">
			<div class="row">
				<button class="all-clear warning btn">AC</button>
				<button class="clear-entry caution btn">CE</button>
				<button class="mode success btn">mode</button>
				<button class="divide operator2 btn btn-primary nosubmit">÷</button>
			</div>
		
			<div class="row">
				<button class="seven digit btn">7</button>
				<button class="eight digit btn">8</button>
				<button class="nine digit btn">9</button>
				<button class="times operator2 btn btn-primary nosubmit">×</button>
			</div>
		
			<div class="row">
				<button class="four digit btn">4</button>
				<button class="five digit btn">5</button>
				<button class="six digit btn">6</button>
				<button class="minus operator2 btn btn-primary nosubmit">-</button>
			</div>
		
			<div class="row">
				<button class="one digit btn">1</button>
				<button class="two digit btn">2</button>
				<button class="three digit btn">3</button>
				<button class="plus operator2 btn btn-primary nosubmit">+</button>
			</div>
		
			<div class="row">
				<button class="zero digit btn">0</button>
				<button class="dot btn">.</button>
				<button class="sign operator btn ">+/-</button>
				<button class="equals btn btn-primary nosubmit">=</button>
			</div>
		</div>
	`),

	events: {

		// basic events
		//
		'click .all-clear': 'onClickAllClear',
		'click .clear-entry': 'onClickClearEntry',
		'click .mode': 'onClickMode',
		'click .digit': 'onClickDigit',
		'click .digits': 'onClickDigits',
		'click .dot': 'onClickDot',
		'click .operator': 'onClickOperator',
		'click .operator2': 'onClickOperator2',
		'click .equals': 'onClickEquals',			

		// scientific events
		//
		'click .mem-clear': 'onClickMemClear',
		'click .mem-operator': 'onClickMemOperator',
		'click .mem-recall': 'onClickMemRecall',
		'click .trig-mode': 'onClickTrigMode',
		'click .hyp-mode': 'onClickHypMode',
		'click .constant': 'onClickConstant',

		// programmer events
		//
		'click .base-mode': 'onClickBaseMode'
	},

	strip: function(string, substrings) {
		for (let i = 0; i < substrings.length; i++) {
			string = string.replace(substrings[i], '');
		}
		return string.trim();
	},

	//
	// mouse event handling methods
	//

	onClickAllClear: function() {
		this.parent.clearAll();
	},

	onClickClearEntry: function() {
		this.parent.clearEntry();
	},

	onClickMode: function() {

		// find next mode
		//
		let mode = this.parent.getNextMode(this.parent.getMode());

		// set current mode
		//
		this.parent.setMode(mode);

		// save user preferences
		//
		if (application.isSignedIn()) {
			this.parent.preferences.save({
				'mode': mode
			});
		}
	},

	//
	// digit entering methods
	//

	onClickDigit: function(event) {
		this.parent.addDigit($(event.target).text());
	},

	onClickDigits: function(event) {
		this.parent.addDigits($(event.target).text());
	},

	onClickDot: function() {
		this.parent.addDecimalPoint();
	},

	onClickOperator: function(event) {
		let className = $(event.target).attr('class');
		let operator = this.strip(className, ['btn', 'operator']);
		this.parent.processOperator(operator);	
	},

	onClickOperator2: function(event) {
		let className = $(event.target).attr('class');
		let operator = this.strip(className, ['btn', 'operator2', 'btn-primary', 'nosubmit']);
		this.parent.setOperator(operator);
	},

	onClickEquals: function() {
		if (this.parent.status) {
			this.parent.processOperator2(this.parent.status);
		}
	},

	//
	// memory mouse event handling methods
	//

	onClickMemClear: function() {
		this.parent.memClear();
	},

	onClickMemOperator: function(event) {
		this.parent.memOperate($(event.target).text());
	},

	onClickMemRecall: function() {
		this.parent.memRecall();
	},

	//
	// scientific event handling methods
	//

	onClickTrigMode: function(event) {
		this.parent.setTrigMode($(event.target).text());
	},

	onClickHypMode: function() {
		this.parent.toggleHypMode();
	},

	onClickConstant: function(event) {
		this.parent.setConstant($(event.target).text());
	},

	//
	// programmer event handling methods
	//

	onClickBaseMode: function(event) {
		this.parent.setBaseMode($(event.target).text());
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		switch (event.keyCode) {

			// digit keys
			//
			case Keyboard.keyCodes['0']:
				this.parent.addDigit('0');
				break;
			case Keyboard.keyCodes['1']:
				this.parent.addDigit('1');
				break;
			case Keyboard.keyCodes['2']:
				this.parent.addDigit('2');
				break;
			case Keyboard.keyCodes['3']:
				this.parent.addDigit('3');
				break;
			case Keyboard.keyCodes['4']:
				this.parent.addDigit('4');
				break;
			case Keyboard.keyCodes['5']:
				this.parent.addDigit('5');
				break;
			case Keyboard.keyCodes['6']:
				this.parent.addDigit('6');
				break;
			case Keyboard.keyCodes['7']:
				this.parent.addDigit('7');
				break;
			case Keyboard.keyCodes['8']:
				this.parent.addDigit('8');
				break;
			case Keyboard.keyCodes['9']:
				this.parent.addDigit('9');
				break;

			// decimal point keys
			//
			case Keyboard.keyCodes['.']:
				this.parent.addDecimalPoint();
				break;

			// operator keys
			//
			case Keyboard.keyCodes['+']:
			case Keyboard.keyCodes['=']:
				this.parent.setOperator('plus');
				break;
			case Keyboard.keyCodes['-']:
				this.parent.setOperator('minus');
				break;
			case Keyboard.keyCodes['×']:
			case Keyboard.keyCodes.X:
				this.parent.setOperator('times');
				break;
			case Keyboard.keyCodes['÷']:
			case Keyboard.keyCodes['/']:
				this.parent.setOperator('divide');
				break;

			// delete key
			//
			case Keyboard.keyCodes.delete:
				this.parent.clearAll();
				break;

			// equal key
			//
			case Keyboard.keyCodes.enter:
				this.parent.processOperator2(this.parent.status);
				break;

			default:
				return;
		}

		// block event from parent
		//
		this.block(event);
	}
});