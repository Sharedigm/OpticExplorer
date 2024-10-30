/******************************************************************************\
|                                                                              |
|                                    rays2.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of an array of two dimensional rays.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

//
// constructor
//

function Rays2() {

	// extend array type
	//
	let array = [];
	array.push.apply(array, arguments);
	array.__proto__ = Rays2.prototype;
	
	return array;
}

//
// extend prototype from "superclass"
//

Rays2.prototype = _.extend(new Array(), {

	//
	// querying methods
	//

	clone: function() {
		let rays = new Rays2();
		for (let i = 0; i < this.length; i++) {
			rays.push(this.at(i).clone());
		}
		return rays;
	}
});

export default Rays2;