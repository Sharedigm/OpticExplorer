<h1><i class="<%= config.apps['help_viewer'].icon %>"></i><%= config.apps['help_viewer'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-question-circle"></i><%= config.apps['help_viewer'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['help_viewer'].color %>">
		<img src="images/icons/apps/<%= config.apps['help_viewer'].image || config.apps['help_viewer'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['help_viewer'].name %> app lets you browse the online help pages. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Use the table of contents to easily navigate the help pages.</li>
					<li>Use navigation controls to move through your help browsing history.</li>
					<li>Share links to help pages.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>View online help pages. </li>
					<li>Easily navigate help pages. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/help-viewer/help-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['help_viewer'].name %>"><img class="dialog" src="images/info/apps/help-viewer/help-viewer.png" /></a>
		<div class="caption"><%= config.apps['help_viewer'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/help-viewer/mobile/mobile-help-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['help_viewer'].name %>"><img src="images/info/apps/help-viewer/mobile/mobile-help-viewer.png" /></a>
		<div class="caption"><%= config.apps['help_viewer'].name %></div>
	</div>
</div>