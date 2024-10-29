<h1><i class="<%= config.apps['project_browser'].icon %>"></i><%= config.apps['project_browser'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-clipboard"></i><%= config.apps['project_browser'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['project_browser'].color %>">
		<img src="images/icons/apps/<%= config.apps['project_browser'].image || config.apps['project_browser'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['project_browser'].name %> app is used to manage your projects which are used for planning and prioritizing tasks. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>View project names, dates, and number of tasks.</p>
					<li>Sort projects by name, date, or number of tasks.</li>
					<li>Double-click to open projects and view tasks.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>View and edit your projects. </p>
				</ul>
			</div>
		</div>
	</div>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/project-browser/project-browser.png" target="_blank" class="lightbox" title="<%= config.apps['project_browser'].name %>"><img class="dialog" src="images/info/apps/project-browser/project-browser.png" /></a>
		<div class="caption"><%= config.apps['project_browser'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/project-browser/mobile/mobile-project-browser.png" target="_blank" class="lightbox" title="<%= config.apps['project_browser'].name %>"><img class="dialog" src="images/info/apps/project-browser/mobile/mobile-project-browser.png" /></a>
		<div class="caption"><%= config.apps['project_browser'].name %></div>
	</div>
</div>