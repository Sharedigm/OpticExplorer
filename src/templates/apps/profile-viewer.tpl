<h1><i class="<%= config.apps['profile_viewer'].icon %>"></i><%= config.apps['profile_viewer'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-user"></i><%= config.apps['profile_viewer'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['profile_viewer'].color %>">
		<img src="images/icons/apps/<%= config.apps['profile_viewer'].image || config.apps['profile_viewer'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['profile_viewer'].name %> app is used to view personal profile information about you or your connections. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Create and edit your personal profile, including your name and profile photo.</li>
					<li>View and edit your geographical location and past homes.</li>
					<li>View and edit your work and occupational history.</li>
					<li>View and edit your educational background.</li>
					<li>View and edit your family info.</li>
					<li>View and edit your contact info.</li>
					<li>View other users' connections to find new connections.</li>
					<li>Invite users to become connections.</li>
					<li>View other users' posts.</li>
					<li>View the mutual connections that you share with friends and colleagues.</li>
					<li>Manage your account and password.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Easily view a wide variety of types of information about a person, all in one place. </p>
					<li>View your own and your connections' personal information, including personal, family, work, and contact info.</li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-info-circle"></i>For More Information</h2>
	<ul>
		<li><a href="#help/creating-profile">Creating Your Profile</a></li>
	</ul>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/profile-viewer/profile-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['profile_viewer'].name %>"><img class="dialog" src="images/info/apps/profile-viewer/profile-viewer.png" /></a>
		<div class="caption"><%= config.apps['profile_viewer'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/profile-viewer/mobile/mobile-profile-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['profile_viewer'].name %>"><img src="images/info/apps/profile-viewer/mobile/mobile-profile-viewer.png" /></a>
		<div class="caption"><%= config.apps['profile_viewer'].name %></div>
	</div>
</div>