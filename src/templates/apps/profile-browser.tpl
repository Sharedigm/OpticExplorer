<h1><i class="<%= config.apps['profile_browser'].icon %>"></i><%= config.apps['profile_browser'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-user"></i><%= config.apps['profile_browser'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['profile_browser'].color %>">
		<img src="images/icons/apps/<%= config.apps['profile_browser'].image || config.apps['profile_browser'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['profile_browser'].name %> app is used to find and connect with people you know. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Search for people by name.</li>
					<li>View public profiles.</li>
					<li>View profiles by name, location, occupation, or gender.</p>
					<li>Sort by name, location, occupation, or gender.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Find and connection with people you know. </p>
					<li>View the public profiles of other users.</li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-info-circle"></i>For More Information</h2>
	<ul>
		<li><a href="#help/building-social-network/finding-connections">Finding Connections</a></li>
	</ul>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/profile-browser/profile-browser.png" target="_blank" class="lightbox" title="<%= config.apps['profile_browser'].name %>"><img class="dialog" src="images/info/apps/profile-browser/profile-browser.png" /></a>
		<div class="caption"><%= config.apps['profile_browser'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/profile-browser/mobile/mobile-profile-browser.png" target="_blank" class="lightbox" title="<%= config.apps['profile_browser'].name %>"><img class="dialog" src="images/info/apps/profile-browser/mobile/mobile-profile-browser.png" /></a>
		<div class="caption"><%= config.apps['profile_browser'].name %></div>
	</div>
</div>