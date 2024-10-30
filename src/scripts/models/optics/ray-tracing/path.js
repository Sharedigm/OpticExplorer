/******************************************************************************\
|                                                                              |
|                                    path.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a linear path of 2D points.                 |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

//
// constructor
//

function Path() {

	// extend array type
	//
	let array = [];
	array.push.apply(array, arguments);
	array.__proto__ = Path.prototype;
	
	return array;
}

//
// extend prototype from "superclass"
//

Path.prototype = _.extend(new Array(), {

	//
	// methods
	//

	start: function() {
		return this[0];
	},

	finish: function() {
		return this[this.length - 1];
	}
});

export default Path;