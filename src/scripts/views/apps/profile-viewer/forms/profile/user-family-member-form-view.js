/******************************************************************************\
|                                                                              |
|                        user-family-member-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a user's family member.               |
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
		<% let ex = relationship && relationship.startsWith('ex'); %>
		<% let inLaw = relationship && relationship.endsWith('in-law'); %>
		<% relationship = relationship? relationship.replace('ex-', '').replace('-in-law', '') : undefined; %>
		
		<div class="name form-group">
			<label class="required control-label"><i class="fa fa-quote-left"></i>Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="This is the name of your family member."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="relationship form-group details">
			<label class="control-label"><i class="fa fa-sitemap"></i>Relationship</label>
			<div class="controls">
				<select>
					<option value=""></option>
					
					<optgroup label="Relationship">
						<option value="partner"<% if (relationship == 'partner') { %> selected<% } %>>Partner</option>
						<option value="wife"<% if (relationship == 'wife') { %> selected<% } %>>Wife</option>
						<option value="husband"<% if (relationship == 'husband') { %> selected<% } %>>Husband</option>
		
						<option value="girlfriend"<% if (relationship == 'girlfriend') { %> selected<% } %>>Girlfriend</option>
						<option value="boyfriend"<% if (relationship == 'boyfriend') { %> selected<% } %>>Boyfriend</option>
					</optgroup>
		
					<optgroup label="Birth family">
						<option value="mother"<% if (relationship == 'mother') { %> selected<% } %>>Mother</option>
						<option value="father"<% if (relationship == 'father') { %> selected<% } %>>Father</option>
		
						<option value="sister"<% if (relationship == 'sister') { %> selected<% } %>>Sister</option>
						<option value="brother"<% if (relationship == 'brother') { %> selected<% } %>>Brother</option>
		
						<option value="daughter"<% if (relationship == 'daughter') { %> selected<% } %>>Daughter</option>
						<option value="son"<% if (relationship == 'son') { %> selected<% } %>>Son</option>
		
						<option value="grandmother"<% if (relationship == 'grandmother') { %> selected<% } %>>Grandmother</option>
						<option value="grandfather"<% if (relationship == 'grandfather') { %> selected<% } %>>Grandfather</option>
		
						<option value="aunt"<% if (relationship == 'aunt') { %> selected<% } %>>Aunt</option>
						<option value="uncle"<% if (relationship == 'uncle') { %> selected<% } %>>Uncle</option>
		
						<option value="cousin"<% if (relationship == 'cousin') { %> selected<% } %>>Cousin</option>
						<option value="niece"<% if (relationship == 'niece') { %> selected<% } %>>Niece</option>
						<option value="nephew"<% if (relationship == 'nephew') { %> selected<% } %>>Nephew</option>
					</optgroup>
		
					<optgroup label="Chosen family">
						<option value="pet"<% if (relationship == 'pet') { %> selected<% } %>>Pet</option>
					</optgroup>
				</select>
				
				<i class="active fa fa-question-circle" data-toggle="popover" title="Relationship" data-content="This is the relationship that you have with this family member."></i>
			</div>
		</div>
		
		<div class="ex form-group">
			<label class="control-label">Ex-</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<input type="checkbox"<% if (ex) { %> checked<% } %>>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Ex-" data-content="This is whether this is a former relationship."></i>
			</div>
		</div>
		
		<div class="in-law form-group">
			<label class="control-label">-in Law</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<input type="checkbox"<% if (inLaw) { %> checked<% } %>>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="-in Law" data-content="This is whether this is a relationship by marriage."></i>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'name':
				return this.$el.find('.name input').val();
			case 'relationship': 
				return this.$el.find('.relationship option:selected').val();
			case 'ex':
				return this.$el.find('.ex input').is(':checked');
			case 'in_law':
				return this.$el.find('.in-law input').is(':checked');
		}
	},

	getRelationship: function() {
		let relationship = this.getValue('relationship');
		if (this.getValue('ex')) {
			relationship = 'ex-' + relationship;
		}
		if (this.getValue('in_law')) {
			relationship = relationship + '-in-law';
		}
		return relationship;		
	},

	getValues: function() {
		return {
			name: this.getValue('name'),
			relationship: this.getRelationship()
		};
	}
});