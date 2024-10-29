<h1><i class="<%= config.apps['terminal'].icon %>"></i><%= config.apps['terminal'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-file-alt"></i><%= config.apps['terminal'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['terminal'].color %>">
		<img src="images/icons/apps/<%= config.apps['terminal'].image || config.apps['terminal'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['terminal'].name %> app lets you interact via a simple command line. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Perform file system manipulations.</li>
					<li>Execute simple shell commands.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Lets you interact with your files using the command line. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/terminal/terminal.png" target="_blank" class="lightbox" title="<%= config.apps['terminal'].name %>"><img class="dialog" src="images/info/apps/terminal/terminal.png" /></a>
		<div class="caption"><%= config.apps['terminal'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/terminal/mobile/mobile-terminal.png" target="_blank" class="lightbox" title="<%= config.apps['terminal'].name %>"><img src="images/info/apps/terminal/mobile/mobile-terminal.png" /></a>
		<div class="caption"><%= config.apps['terminal'].name %></div>
	</div>
</div>