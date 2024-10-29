/******************************************************************************\
|                                                                              |
|                          contact-name-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for editing contact information.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="honorific form-group details">
			<label class="control-label"><i class="fa fa-chevron-left"></i>Honorific</label>
			<div class="controls">
				<select>
					<option value=""></option>
					<option value="Mr."<% if (honorific == 'Mr.') { %> selected<% } %>>Mr.</option>
					<option value="Ms."<% if (honorific == 'Ms.') { %> selected<% } %>>Ms.</option>
					<option value="Mrs."<% if (honorific == 'Mrs.') { %> selected<% } %>>Mrs.</option>
					<option value="Dr."<% if (honorific == 'Dr.') { %> selected<% } %>>Dr.</option>
					<option value="Hon."<% if (honorific == 'Hon.') { %> selected<% } %>>Hon.</option>
					<option value="Pvt."<% if (honorific == 'Pvt.') { %> selected<% } %>>Pvt.</option>
					<option value="Cpl."<% if (honorific == 'Cpl.') { %> selected<% } %>>Cpl.</option>
					<option value="Sgt."<% if (honorific == 'Sgt.') { %> selected<% } %>>Sgt.</option>
					<option value="Lt."<% if (honorific == 'Lt.') { %> selected<% } %>>Lt.</option>
					<option value="Cptn."<% if (honorific == 'Cpt.') { %> selected<% } %>>Cpt.</option>
					<option value="Maj."<% if (honorific == 'Maj.') { %> selected<% } %>>Maj.</option>
					<option value="Lcol."<% if (honorific == 'Lcol.') { %> selected<% } %>>Lcol.</option>
					<option value="Col."<% if (honorific == 'Col.') { %> selected<% } %>>Col.</option>
					<option value="Gen."<% if (honorific == 'Gen.') { %> selected<% } %>>Gen.</option>
				</select>
			</div>
		</div>
		
		<div class="first-name form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>First name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="first-name" value="<%= first_name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="First name" data-content="This is your first name or given name."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="preferred-name form-group details">
			<label class="control-label"><i class="fa fa-quote-left"></i>Nickname</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="preferred-name" value="<%= preferred_name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Preferred name" data-content="This is the informal name or nickname that you would like to be called by."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="middle-name form-group details">
			<label class="control-label"><i class="fa fa-quote-right"></i>Middle name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="middle-name" value="<%= middle_name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Middle name" data-content="This is your middle name or initial."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="last-name form-group">
			<label class="control-label"><i class="fa fa-quote-right"></i>Last name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="last-name" value="<%= last_name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Last name" data-content="This is your family name or surname."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="title form-group details">
			<label class="control-label"><i class="fa fa-chevron-right"></i>Title</label>
			<div class="controls">
				<select>
					<option value=""></option>
					<option value="Jr."<% if (titles == 'Jr.') { %> selected<% } %>>Jr.</option>
					<option value="Sr."<% if (titles == 'Sr.') { %> selected<% } %>>Sr.</option>
					<option value="II"<% if (titles == 'II') { %> selected<% } %>>II</option>
					<option value="III"<% if (titles == 'III') { %> selected<% } %>>III</option>
					<option value="PhD."<% if (titles == 'PhD.') { %> selected<% } %>>PhD.</option>
					<option value="Md."<% if (titles == 'Md.') { %> selected<% } %>>Md.</option>
					<option value="DDS."<% if (titles == 'DDS.') { %> selected<% } %>>DDS.</option>
					<option value="Esq."<% if (titles == 'Esq.') { %> selected<% } %>>Esq.</option>
					<option value="USA"<% if (titles == 'USA') { %> selected<% } %>>USA</option>
					<option value="USN"<% if (titles == 'USN') { %> selected<% } %>>USN</option>
					<option value="USAF"<% if (titles == 'USAF') { %> selected<% } %>>USAF</option>
					<option value="USMC"<% if (titles == 'USMC') { %> selected<% } %>>USMC</option>
				</select>
			</div>
		</div>
	`),

	//
	// form attributes
	//

	messages: {
		'first-name': {
			required: "Enter your given / first name."
		},
		'last-name': {
			required: "Enter your family / last name."
		},
		'preferred-name': {
			required: "Enter your preferred / nickname."
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'honorific':
				return this.$el.find('.honorific option:selected').val();
			case 'first_name':
				return this.$el.find('.first-name input').val();
			case 'preferred_name':
				return this.$el.find('.preferred-name input').val();
			case 'middle_name':
				return this.$el.find('.middle-name input').val();
			case 'last_name':
				return this.$el.find('.last-name input').val();
			case 'title':
				return this.$el.find('.title option:selected').val();
		}
	},

	getValues: function() {
		return {
			honorific: this.getValue('honorific'),
			first_name: this.getValue('first_name'),
			preferred_name: this.getValue('preferred_name'),
			middle_name: this.getValue('middle_name'),
			last_name: this.getValue('last_name'),
			titles: this.getValue('title')
		};
	}
});