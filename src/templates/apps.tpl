<h1><i class="fa fa-rocket"></i>Apps</h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-rocket"></i>Apps</li>
</ol>

<div class="content">
	<p><%= application.name %> has a continually growing collection of apps for communicating with your contacts and managing your data. </p>
	<% let apps = config.apps; %>
	<% let keys = Object.keys(apps); %>

	<div class="section">
		<div class="row">
			<div class="col-sm-4">
				<h2><i class="fa fa-desktop"></i>System Apps</h2>
				<p>The system apps allow you to use the core functionality of the system or to configure the system to your liking. </p>
				<br />
			</div>
			<div class="col-sm-8">
				<div class="app-icons large icon-grid" style="text-align:center">
				<% for (let i = 0; i < keys.length; i++) { %>
				<% let app = apps[keys[i]]; %>
				<% if (app.category == 'system') { %>
				<% if (!app.disabled) { %>
				<a class="item" href="#apps/<%= app.app %>" style="text-decoration:none">	
					<div class="row">
						<div class="icon colored <%= app.color %>">
							<img src="images/icons/apps/<%= app.image || app.app + '.svg' %>" />
							<i class="<%= app.icon %>"></i>
						</div>
					</div>
					<div class="row">
						<div class="name"><%= app.name %></div>
					</div>
				</a>
				<% } %>
				<% } %>
				<% } %>
				</div>
			</div>
		</div>
	</div>

	<div class="section">
		<div class="row">
			<div class="col-sm-4">
				<h2><i class="fa fa-user"></i>Social Apps</h2>
				<p>Social apps are provided to allow you to connect with friends or colleages and to share messages, files, folders, photos, and music. </p>
				<br />
			</div>
			<div class="col-sm-8">
				<div class="app-icons large icon-grid" style="text-align:center">
				<% for (let i = 0; i < keys.length; i++) { %>
				<% let app = apps[keys[i]]; %>
				<% if (app.category == 'social') { %>
				<% if (!app.disabled) { %>
				<a class="item" href="#apps/<%= app.app %>" style="text-decoration:none">	
					<div class="row">
						<div class="icon colored <%= app.color %>">
							<img src="images/icons/apps/<%= app.image || app.app + '.svg' %>" />
							<i class="<%= app.icon %>"></i>
						</div>
					</div>
					<div class="row">
						<div class="name"><%= app.name %></div>
					</div>
				</a>
				<% } %>
				<% } %>
				<% } %>
				</div>
			</div>
		</div>
	</div>

	<div class="section">
		<div class="row">
			<div class="col-sm-4">
				<h2><i class="fa fa-briefcase"></i>Productivity Apps</h2>
				<p>Productivity apps help you with your work, allowing you to create or edit files and to manage projects. </p>
				<br />
			</div>
			<div class="col-sm-8">
				<div class="app-icons large icon-grid" style="text-align:center">
				<% for (let i = 0; i < keys.length; i++) { %>
				<% let app = apps[keys[i]]; %>
				<% if (app.category == 'productivity') { %>
				<% if (!app.disabled) { %>
				<a class="item" href="#apps/<%= app.app %>" style="text-decoration:none">	
					<div class="row">
						<div class="icon colored <%= app.color %>">
							<img src="images/icons/apps/<%= app.image || app.app + '.svg' %>" />
							<i class="<%= app.icon %>"></i>
						</div>
					</div>
					<div class="row">
						<div class="name"><%= app.name %></div>
					</div>
				</a>
				<% } %>
				<% } %>
				<% } %>
				</div>
			</div>
		</div>
	</div>

	<div class="section">
		<div class="row">
			<div class="col-sm-4">
				<h2><i class="fa fa-music"></i>Multimedia Apps</h2>
				<p>Multimedia apps allow you to enjoy image, video, or audio media files. </p>
				<br />
			</div>
			<div class="col-sm-8">
				<div class="app-icons large icon-grid" style="text-align:center">
				<% for (let i = 0; i < keys.length; i++) { %>
				<% let app = apps[keys[i]]; %>
				<% if (app.category == 'multimedia') { %>
				<% if (!app.disabled) { %>
				<a class="item" href="#apps/<%= app.app %>" style="text-decoration:none">	
					<div class="row">
						<div class="icon colored <%= app.color %>">
							<img src="images/icons/apps/<%= app.image || app.app + '.svg' %>" />
							<i class="<%= app.icon %>"></i>
						</div>
					</div>
					<div class="row">
						<div class="name"><%= app.name %></div>
					</div>
				</a>
				<% } %>
				<% } %>
				<% } %>
				</div>
			</div>
		</div>
	</div>

	<div class="section">
		<div class="row">
			<div class="col-sm-4">
				<h2><i class="fa fa-tools"></i>Utility Apps</h2>
				<p>Utility apps add basic additional functionality to make life just a little bit easier. </p>
				<br />
			</div>
			<div class="col-sm-8">
				<div class="app-icons large icon-grid" style="text-align:center">
				<% for (let i = 0; i < keys.length; i++) { %>
				<% let app = apps[keys[i]]; %>
				<% if (app.category == 'utility') { %>
				<% if (!app.disabled) { %>
				<a class="item" href="#apps/<%= app.app %>" style="text-decoration:none">	
					<div class="row">
						<div class="icon colored <%= app.color %>">
							<img src="images/icons/apps/<%= app.image || app.app + '.svg' %>" />
							<i class="<%= app.icon %>"></i>
						</div>
					</div>
					<div class="row">
						<div class="name"><%= app.name %></div>
					</div>
				</a>
				<% } %>
				<% } %>
				<% } %>
				</div>
			</div>
		</div>
	</div>
</div>