/******************************************************************************\
|                                                                              |
|                             person-mappable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines behavior for adding people to maps.                      |
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
	// person adding methods
	//

	addPerson: function(person, options) {

		// check if person has a geolocation
		//
		if (person.hasGeolocation && person.hasGeolocation()) {

			// add person to list of people
			//
			let people = this.getActivePaneView().people;
			if (!people.contains(person)) {

				// add person to collection
				//
				people.add(person);

				// place person on map
				//
				this.getLayerItemView('people', person).placeOn(this.getLayerView('map'));

				// zoom to new person
				//
				if (options && options.zoomTo) {
					this.zoomToPlace(person.getPlace(9));
				}

				// update
				//
				this.setDirty();
			}
		} else {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-compass"></i>',
				title: 'Geolocation Error',
				message: "The person '" + person.getName() + "' does not have a geographical location."
			});
		}
	},

	addPeople: function(people) {
		for (let i = 0; i < people.length; i++) {
			this.addPerson(people[i], {
				zoomTo: i == 0
			});
		}
	},

	removePeople: function(people, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				message: 'Are you sure that you want to remove ' + (people.length == 1? people[0].getName() : 'these ' + people.length + ' people') + ' from the map?',

				// callbacks
				//
				accept: () => {
					this.removePeople(people, {
						confirm: false
					});
				}
			});
		} else if (this.hasActivePaneView()) {

			// remove people from collection
			//
			this.getActivePaneView().people.remove(people);

			// play remove sound
			//
			application.play('remove');

			// update
			//
			this.setDirty();
		}
	},

	removeSelectedPeople: function() {
		this.removePeople(this.getSelectedLayerModels('people'));
	}
}