<h1><i class="<%= config.apps['project_viewer'].icon %>"></i><%= config.apps['project_viewer'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-task"></i><%= config.apps['project_viewer'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['project_viewer'].color %>">
		<img src="images/icons/apps/<%= config.apps['project_viewer'].image || config.apps['project_viewer'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['project_viewer'].name %> app is used to manage a project's tasks. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>View tasks by icons, lists, cards, or tiles.</p>
					<li>View task priorities, create dates, modify dates, or due dates.</li>
					<li>Sort tasks by title, type, priority, or number of tasks.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>View and edit a project's tasks. </p>
				</ul>
			</div>
		</div>
	</div>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/project-viewer/project-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['project_viewer'].name %>"><img class="dialog" src="images/info/apps/project-viewer/project-viewer.png" /></a>
		<div class="caption"><%= config.apps['project_viewer'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/project-viewer/mobile/mobile-project-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['project_viewer'].name %>"><img class="dialog" src="images/info/apps/project-viewer/mobile/mobile-project-viewer.png" /></a>
		<div class="caption"><%= config.apps['project_viewer'].name %></div>
	</div>
</div>