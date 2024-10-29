/******************************************************************************\
|                                                                              |
|                      identity-provider-selector-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting identity providers.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import IdentityProviders from '../../../../../collections/users/auth/identity-providers.js';
import GroupedNameSelectorView from '../../../../../views/widgets/selectors/grouped-name-selector-view.js';

export default GroupedNameSelectorView.extend({

	//
	// contructor
	//

	initialize: function() {

		// call superclass method
		//
		GroupedNameSelectorView.prototype.initialize.call(this);

		// set attributes
		//
		this.collection = new IdentityProviders();

		// fetch and display
		//
		this.update();
	},

	//
	// rendering methods
	//

	update: function(options) {

		// fetch tools
		//
		this.collection.fetch({
			
			// callbacks
			//
			success: (collection) => {

				// filter out exceptions
				//
				if (this.options.except) {
					collection = new Backbone.Collection(collection.filter((model) => {
						return !this.options.except.hasItemNamed(model.get('entityid'));
					}));
					this.collection = collection;
				}

				// save original list of providers
				//
				this.providers = this.collection.clone();

				// divide providers into groups
				//
				let academicProviders = new Backbone.Collection(this.collection.filter((model) => {
					let name = model.get('name');

					// filter on name
					//
					return name.contains('University') || name.contains('College') || 
						name.contains('School') || name.contains('Institute') || 
						name.contains('State') || name == 'Johns Hopkins';
				}));

				// remove from providers list
				//
				academicProviders.each((model) => {
					this.collection.remove(model);
				});

				this.collection = new Backbone.Collection([{
					'name': 'Academic Providers',
					'group': academicProviders
				}, {
					'name': 'Other Providers',
					'group': this.collection
				}]);

				// set initial selected
				//
				if (application.options.authProvider) {
					this.selected = this.providers.findWhere({
						name: application.options.authProvider
					});
				}
				
				// render
				//
				this.render();
				
				// perform callback
				//
				if (options && options.done) {
					options.done();
				}
			}, 

			error: () => {

				// show error message
				//
				application.error({
					message: "Could not fetch identity providers."
				});
			}
		});
	}
});
