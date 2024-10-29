/******************************************************************************\
|                                                                              |
|                               user-profile.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an application user account.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../../models/utilities/timestamped.js';
import ImageFile from '../../../models/storage/media/image-file.js';
import UserHomes from '../../../collections/users/profile/user-homes.js';
import UserJobs from '../../../collections/users/profile/user-jobs.js';
import UserPublications from '../../../collections/users/profile/user-publications.js';
import UserBooks from '../../../collections/users/profile/publications/user-books.js';
import UserArticles from '../../../collections/users/profile/publications/user-articles.js';
import UserPatents from '../../../collections/users/profile/publications/user-patents.js';
import UserFamilyMembers from '../../../collections/users/profile/user-family-members.js';
import UserSchools from '../../../collections/users/profile/user-schools.js';
import UserContacts from '../../../collections/users/profile/user-contacts.js';
import UserPhones from '../../../collections/users/profile/contacts/user-phones.js';
import UserAddresses from '../../../collections/users/profile/contacts/user-addresses.js';
import UserEmailAddrs from '../../../collections/users/profile/contacts/user-email-addrs.js';
import UserWebsites from '../../../collections/users/profile/contacts/user-websites.js';
import UserAffiliations from '../../../collections/users/profile/user-affiliations.js';
import DateUtils from '../../../utilities/time/date-utils.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		cover_photo_path: undefined,
		profile_photo_path: undefined,
		bio: undefined,
		birth_date: undefined,
		gender: undefined,
		interests: undefined,
		likes: undefined,
		dislikes: undefined,
		skills: undefined,
		experiences: undefined,
		goals: undefined,
		num_connections: undefined,
		num_posts: undefined,
		num_comments: undefined
	},

	//
	// ajax attributes
	//

	idAttribute: 'user_id',
	urlRoot: config.servers.api + '/users',

	//
	// querying methods
	//

	url: function() {
		return this.urlRoot + '/' + this.get('user_id') + '/profile';
	},
	
	isOwnedBy: function(user) {
		return user && this.get('user_id') == user.get('id');
	},

	hasProfilePhoto: function() {
		return this.has('profile_photo_path') && this.get('profile_photo_path').length != 0;
	},

	hasCoverPhoto: function() {
		return this.has('cover_photo_path') && this.get('cover_photo_path').length != 0;
	},

	//
	// relationship querying methods
	//

	hasFamily: function(family) {
		return this.get('family')[family];
	},

	isMarried: function() {
		return this.getSpouse() != undefined;
	},

	getSpouse: function() {
		return this.hasFamily('wife') || this.hasFamily('husband');
	},

	hasPartner: function() {
		return this.getPartner() != undefined;
	},

	getPartner: function() {
		return this.hasFamily('girlfriend') || this.hasFamily('boyfriend');
	},

	isSingle: function() {
		return !this.isMarried() && !this.hasPartner();
	},

	//
	// parental querying methods
	//

	hasChildren: function() {
		return this.hasFamily('son') || this.hasFamily('daughter');
	},

	//
	// sibling querying methods
	//

	hasSiblings: function() {
		return this.hasFamily('brother') || this.hasFamily('sister');
	},

	//
	// getting methods
	//

	getProfilePhoto: function() {
		return new ImageFile({
			path: this.get('profile_photo_path'),
			share_id: this.get('profile_photo_share_id')
		});
	},

	getCoverPhoto: function() {
		return new ImageFile({
			path: this.get('cover_photo_path'),
			share_id: this.get('cover_photo_share_id')
		});
	},

	getAge: function() {
		if (this.has('birth_date')) {
			return (new Date().getTime() - this.get('birth_date').getTime()) / (1000 * 3600 * 24 * 365);
		}
	},

	getPublications: function() {
		let collection = new UserPublications();

		// create aggregate collection
		//
		collection.add(this.get('books').models);
		collection.add(this.get('articles').models);
		collection.add(this.get('patents').models);

		return collection;
	},

	getContacts: function() {
		let collection = new UserContacts();

		// create aggregate collection
		//
		collection.add(this.get('phones').models);
		collection.add(this.get('addresses').models);
		collection.add(this.get('email_addrs').models);
		collection.add(this.get('websites').models);

		return collection;
	},

	//
	// converting methods
	//

	toJSON: function() {

		// call superclass method
		//
		let json = Timestamped.prototype.toJSON.call(this);

		// serialize attributes
		//
		if (this.has('name')) {
			json.name = this.get('name').toJSON();
		}
		if (this.has('birth_date')) {
			json.birth_date = this.get('birth_date').format('yyyy-mm-dd');
		}
		if (this.has('check_in')) {
			json.check_in = this.get('check_in').toJSON();
		}

		return json;
	},
	
	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: user.url() + '/profile'			
		}, options));
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = Timestamped.prototype.parse.call(this, response);

		// parse profile info
		//
		if (data.birth_date) {
			data.birth_date = DateUtils.parse(data.birth_date, 'yyyy-mm-dd');
		}

		// parse personal info
		//
		data.homes = new UserHomes(data.homes, {
			parse: true
		});
		data.jobs = new UserJobs(data.jobs, {
			parse: true
		});
		data.family_members = new UserFamilyMembers(data.family_members, {
			parse: true
		});
		data.schools = new UserSchools(data.schools, {
			parse: true
		});
		data.affiliations = new UserAffiliations(data.affiliations, {
			parse: true
		});

		// parse publications info
		//
		data.books = new UserBooks(data.books, {
			parse: true
		});
		data.articles = new UserArticles(data.articles, {
			parse: true
		});
		data.patents = new UserPatents(data.patents, {
			parse: true
		});

		// parse contact info
		//
		data.phones = new UserPhones(data.phones, {
			parse: true
		});
		data.addresses = new UserAddresses(data.addresses, {
			parse: true
		});
		data.email_addrs = new UserEmailAddrs(data.email_addrs, {
			parse: true
		});
		data.websites = new UserWebsites(data.websites, {
			parse: true
		});

		return data;
	}
});
