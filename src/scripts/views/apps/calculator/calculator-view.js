/******************************************************************************\
|                                                                              |
|                              calculator-view.js                              |
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

import AppView from '../../../views/apps/common/app-view.js';
import DisplayView from '../../../views/apps/calculator/mainbar/display/display-view.js';
import KeyboardView from '../../../views/apps/calculator/mainbar/keyboard/keyboard-view.js';
import PreferencesFormView from '../../../views/apps/calculator/forms/preferences/preferences-form-view.js'
import Browser from '../../../utilities/web/browser.js';

export default AppView.extend({

	//
	// attributes
	//

	name: 'calculator',

	template: template(`
		<div class="body last">
			<div class="display"></div>
			<div class="keyboard"></div>
		</div>
	`),

	regions: {
		'display': {
			el: '.display',
			replaceElement: true
		},
		'keyboard': {
			el: '.keyboard',
			replaceElement: true
		}
	},

	//
	// dialog attributes
	//
	
	size: [300, 300],
	size2: [300, 500],
	resizable: false,
	maximizable: false,
	resizeDelay: 100,
	
	//
	// memory registers
	//

	x: undefined, 
	y: undefined,
	status: undefined,
	memory: 0,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppView.prototype.initialize.call(this);

		// set static attributes
		//
		this.constructor.current = this;
	},

	//
	// querying methods
	//

	isValidDigit: function(digit, baseMode) {
		switch (baseMode) {
			case 'bin':
				return ['0', '1'].contains(digit);
			case 'oct':
				return ['0', '1', '2', '3', '4', '5', '6', '7', '8'].contains(digit);
			case 'dec':
				return !(['A', 'B', 'C', 'D', 'E', 'F'].contains(digit));
			case 'hex':
				return true;
		}
	},

	isHypMode: function() {
		return this.getChildView('display').isHypMode();
	},

	//
	// getting methods
	//

	getMode: function() {
		if (this.$el.hasClass('basic')) {
			return 'basic';
		} else if (this.$el.hasClass('scientific')) {
			return 'scientific';
		} else if (this.$el.hasClass('programmer')) {
			return 'programmer';
		}
	},

	getNextMode: function() {
		switch (this.getMode()) {
			case 'basic':
				return 'scientific';
			case 'scientific':
				return 'programmer';
			case 'programmer':
				return 'basic';
		}
	},

	getValue: function() {

		// return previously computed value
		//
		if (this.x != undefined) {
			return this.x;
		} else {

			// parse digits
			//
			if (this.getMode() != 'programmer') {
				return parseFloat(this.getChildView('display').getDigits());
			} else {
				return this.parseDigits(this.getChildView('display').getDigits(), this.getBaseMode());
			}
		}
	},

	getTrigMode: function() {
		return this.getChildView('display').getTrigMode();
	},

	getBaseMode: function() {
		return this.getChildView('display').getBaseMode();
	},

	//
	// setting methods
	//

	setMode: function(mode) {

		// save current mode
		//
		this.constructor.mode = mode;

		// adjust window size
		//
		if (this.dialog) {
			switch (mode) {
				case 'basic':
					if (!Browser.is_mobile) {
						this.dialog.setSize(this.size);
					} else {
						this.dialog.setSize(this.size2);
					}
					break;
				case 'scientific':
					this.dialog.setSize(this.size2);
					break;
				case 'programmer':
					this.dialog.setSize(this.size2);
					break;
			}
		}

		// set base mode to decimal
		//
		if (this.getMode() == 'programmer' && this.getBaseMode() != 'dec') {
			this.setBaseMode('dec');
		}
		
		// update classes
		//
		switch (mode) {
			case 'basic':
				this.$el.addClass('basic');
				this.$el.removeClass('scientific');
				this.$el.removeClass('programmer');
				break;
			case 'scientific':
				this.$el.removeClass('basic');
				this.$el.addClass('scientific');
				this.$el.removeClass('programmer');
				break;
			case 'programmer':
				this.$el.removeClass('basic');
				this.$el.removeClass('scientific');
				this.$el.addClass('programmer');
				break;
		}

		// update display
		//
		this.update();
	},

	setValue: function(value) {
		this.x = value;
		this.showValue(value);
	},

	setOperator: function(operator) {

		// push x register to y
		//
		this.y = this.getValue();
		this.x = 0;

		// process previous operator
		//
		if (this.status) {
			this.processOperator2(this.status);
		}

		// set status register
		//
		this.status = operator;
	},

	setTrigMode: function(trigMode) {
		this.getChildView('display').setTrigMode(trigMode);
	},

	setConstant: function(constant) {
		switch (constant) {
			case 'π':
				this.setValue(Math.PI);
				break;
			case 'e':
				this.setValue(Math.E);
				break;
		}
	},

	setBaseMode: function(baseMode) {
		this.getChildView('display').setBaseMode(baseMode);
	},

	toggleHypMode: function() {
		this.getChildView('display').toggleHypMode();
	},

	//
	// computing methods
	//

	sin: function(operand) {
		if (this.isHypMode()) {
			return Math.sinh(operand);
		} else {
			return Math.sin(this.toRadians(operand));
		}
	},

	cos: function(operand) {
		if (this.isHypMode()) {
			return Math.cosh(operand);
		} else {
			return Math.cos(this.toRadians(operand));
		}
	},

	tan: function(operand) {
		if (this.isHypMode()) {
			return Math.tanh(operand);
		} else {
			return Math.tan(this.toRadians(operand));
		}
	},
	
	//
	// converting methods
	//

	toRadians: function(value) {
		switch (this.getTrigMode()) {
			case 'deg':
				return value * Math.PI / 180;
			case 'rad':
				return value;
		}
	},

	toDigits: function(value) {
		let digits;
		let numDigits = this.getChildView('display').numDigits();

		if (this.getMode() != 'programmer') {

			// convert float to string
			//
			digits = value.toString();

			// limit string to length of display
			//
			if (digits.contains('e')) {
				let index = digits.indexOf('e');
				let mantissa = digits.substring(0, index);
				let exponent = digits.substring(index + 1);
				digits = mantissa.substring(0, numDigits - exponent.length - 1) + 'e' + exponent;
			} else {
				digits = digits.substring(0, numDigits);
			}

			// trim trailing zeros
			//
			digits = digits.replace(/\.0+$/,'');
		} else {

			// convert value to digits
			//
			digits = this.valueToDigits(value, this.getBaseMode());
		}

		return digits;
	},

	valueToDigits: function(value, baseMode) {
		switch (baseMode) {
			case 'bin':
				return value.toString(2);
			case 'oct':
				return value.toString(8);
			case 'dec':
				return value.toString(10);
			case 'hex':
				return value.toString(16);
		}
	},

	convertDigits: function(digits, fromMode, toMode) {
		
		// convert "from" mode to decimal
		//
		let value = this.parseDigits(digits, fromMode);

		// convert decimal to "to" mode
		//
		return this.valueToDigits(value, toMode);
	},

	parseDigits: function(digits, baseMode) {

		// convert "from" mode to decimal
		//
		switch (baseMode) {
			case 'bin':
				return parseInt(digits, 2);
			case 'oct':
				return parseInt(digits, 8);
			case 'dec':
				return parseInt(digits, 10);
			case 'hex':
				return parseInt(digits, 16);
		}
	},

	//
	// rendering methods
	//

	showValue: function(value) {
		this.getChildView('display').setDigits(this.toDigits(value));
	},

	addDigit: function(digit) {

		// check for invalid digits
		//
		if (this.getMode() == 'programmer') {
			if (!this.isValidDigit(digit, this.getBaseMode())) {
				return;
			}
		}

		// check for repeat zeros
		//
		if (digit == '0') {
			if (this.getChildView('display').getDigits() == '0') {
				return;
			}
		}

		// start
		//
		if (this.x != undefined) {
			this.getChildView('display').clear();
			this.x = undefined;
		}

		// update display
		//
		this.getChildView('display').setDigits(this.getChildView('display').getDigits() + digit);
	},

	addDigits: function(digits) {
		switch (digits) {
			case '000':
				this.addDigit('0');
				this.addDigit('0');
				this.addDigit('0');
				break;
			case '111':
				this.addDigit('1');
				this.addDigit('1');
				this.addDigit('1');
				break;
		}
	},

	//
	// computating methods
	//

	clearAll: function() {
		this.setValue(0);
		this.status = undefined;
	},

	clearEntry: function() {
		this.x = 0;
		this.showValue(0);
	},

	processOperator: function(operator) {
		let operand = this.getValue();
		let result;
		
		switch (operator) {
			case 'percent':
				result = operand * 0.01;
				break;
			case 'sqrt':
				result = Math.sqrt(operand);
				break;
			case 'sqr':
				result = operand * operand;
				break;
			case 'invert':
				result = 1 / operand;
				break;
			case 'sign':
				result = -operand;
				break;
			case 'sin':
				result = this.sin(operand);
				break;
			case 'cos':
				result = this.cos(operand);
				break;
			case 'tan':
				result = this.tan(operand);
				break;
			case 'cube':
				result = operand * operand * operand;
				break;
			case 'cbrt':
				result = operand ** (1 / 3);
				break;
			case 'epower':
				result = Math.E ** operand;
				break;
			case 'power10':
				result = 10 ** operand;
				break;
			case 'ln':
				result = Math.log(operand);
				break;
			case 'log':
				result = Math.log10(operand);
				break;
			case 'not':
				result = ~ operand;
				break;
			case 'shift-left':
				result = operand << 1;
				break;
			case 'shift-right':
				result = operand >> 1;
				break;
			case 'rotate-left':
				result = (operand << 1) | (operand >> (32 - 1));
				break;
			case 'rotate-right':
				result = (operand >> 1) | (operand << (32 - 1));
				break;
		}

		this.setValue(result);
	},

	processOperator2: function() {
		let operand1 = this.y;
		let operand2 = this.getValue();
		let result;

		if (!operand1 || !operand2) {
			return;
		}

		switch (this.status) {
			case 'divide':
				result = operand1 / operand2;
				break;
			case 'times':
				result = operand1 * operand2;
				break;
			case 'plus':
				result = operand1 + operand2;
				break;
			case 'minus':
				result = operand1 - operand2;
				break;
			case 'power':
				result = operand1 ** operand2;
				break;
			case 'root':
				result = operand1 ** (1 / operand2);
				break;
			case 'and':
				result = operand1 & operand2;
				break;
			case 'or':
				result = operand1 | operand2;
				break;
			case 'xor':
				result = operand1 ^ operand2;
				break;
		}

		this.setValue(result);

		// done processing operator
		//
		this.status = undefined;
	},

	addDecimalPoint: function() {
		let digits = this.getChildView('display').getDigits();

		// only add decimal point if it does not already exist
		//
		if (!digits.contains('.')) {
			this.getChildView('display').setDigits(digits + '.');
			this.x = undefined;
		}
	},

	//
	// memory methods
	//

	memClear: function() {
		this.memory = 0;
		this.$el.find('.mem-mode').hide();
	},

	memOperate: function(operator) {
		switch (operator) {
			case 'M+':
				this.memory += this.getValue();
				this.$el.find('.mem-mode').show();
				break;
			case 'M-':
				this.memory -= this.getValue();
				this.$el.find('.mem-mode').show();
				break;
		}
	},

	memRecall: function() {
		this.setValue(this.memory);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showDisplay();
		this.showKeyboard();

		// set initial mode
		//
		this.setMode(this.preferences.get('mode'));
	},

	onAttach: function() {

		// call superclass method
		//
		AppView.prototype.onAttach.call(this);

		// set initial mode
		//
		this.setMode(this.getMode());

		// reset
		//
		this.clearAll();
	},

	showDisplay: function() {
		this.showChildView('display', new DisplayView());
	},

	showKeyboard: function() {
		this.showChildView('keyboard', new KeyboardView());
	},

	update: function() {
		if (this.x != undefined) {
			this.showValue(this.x);
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getChildView('keyboard').onKeyDown(event);
	},

	//
	// window event handling methods
	//

	onResize: function() {
		this.update();
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// clear static attributes
		//
		this.constructor.current = null;
	}
}, {

	//
	// static attributes
	//

	mode: 'basic',

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});