<h1><i class="<%= config.apps['contact_editor'].icon %>"></i><%= config.apps['contact_editor'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-address-book"></i><%= config.apps['contact_editor'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['contact_editor'].color %>">
		<img src="images/icons/apps/<%= config.apps['contact_editor'].image || config.apps['contact_editor'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['contact_editor'].name %> app lets you store, view, and share your contact information. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Store contact names, affilations, phone numbers, addresses, email addresses, and websites. </li>
					<li>Import your contacts list from Google. </li>
					<li>Open contact info from any source using the standard .vcf (Variant Card Format) file format. </li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Create, edit, and manage your contact information. </li>
					<li>Manage your contact information across all of your devices. </li>
					<li>A safer way of storing your contact information because you don't have to worry about losing your mobile device. </p>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/contact-editor/contact-editor.png" target="_blank" class="lightbox" title="<%= config.apps['contact_editor'].name %>"><img class="dialog" src="images/info/apps/contact-editor/contact-editor.png" /></a>
		<div class="caption"><%= config.apps['contact_editor'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/contact-editor/mobile/mobile-contact-editor.png" target="_blank" class="lightbox" title="<%= config.apps['contact_editor'].name %>"><img src="images/info/apps/contact-editor/mobile/mobile-contact-editor.png" /></a>
		<div class="caption"><%= config.apps['contact_editor'].name %></div>
	</div>
</div>