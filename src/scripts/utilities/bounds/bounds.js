/******************************************************************************\
|                                                                              |
|                                   bounds.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a one dimensional set of bounds.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default class Bounds {

	constructor(min, max) {

		// set attributes
		//
		this.min = min;
		this.max = max;
	}

	//
	// querying methods
	//

	contains(value) {
		return (value >= this.min && value <= this.max);
	}

	overlaps(bounds) {
		return this.contains(bounds.min) || this.contains(bounds.max) || 
			bounds.contains(this.max) || bounds.contains(this.min);
	}

	//
	// computing methods
	//

	mean() {
		return (this.min + this.max) / 2;
	}

	size() {
		return this.max - this.min;
	}

	//
	// setting methods
	//

	extend(value) {
		if (!this.min || value < this.min) {
			this.min = value;
		}
		if (!this.max || value > this.max) {
			this.max = value;
		}
	}
}