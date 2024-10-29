<h1><i class="<%= config.apps['clock'].icon %>"></i><%= config.apps['clock'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-clock"></i><%= config.apps['clock'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['clock'].color %>">
		<img src="images/icons/apps/<%= config.apps['clock'].image || config.apps['clock'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['clock'].name %> app shows you the current time and day / date. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Analog or digital display</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>View hours, minutes, and seconds. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>

	<div class="figure desktop-only">
		<div class="figure">
			<a href="images/info/apps/clock/analog-clock.png" target="_blank" class="lightbox" title="Analog <%= config.apps['clock'].name %>"><img class="dialog" src="images/info/apps/clock/analog-clock.png" style="width:300px" /></a>
			<div class="caption">Analog <%= config.apps['clock'].name %></div>
		</div>
	</div>
	<div class="figure desktop-only">
		<div class="figure">
			<a href="images/info/apps/clock/digital-clock.png" target="_blank" class="lightbox" title="Digital <%= config.apps['clock'].name %>"><img class="dialog" src="images/info/apps/clock/digital-clock.png" style="width:300px" /></a>
			<div class="caption">Digital <%= config.apps['clock'].name %></div>
		</div>
	</div>
	<div class="figure row mobile-only">	
		<div class="figure col-sm-6" style="float:none">
			<a href="images/info/apps/clock/mobile/mobile-analog-clock.png" target="_blank" class="lightbox" title="Analog <%= config.apps['clock'].name %>"><img class="dialog" src="images/info/apps/clock/mobile/mobile-analog-clock.png" /></a>
			<div class="caption">Analog <%= config.apps['clock'].name %></div>
		</div>
		<div class="figure col-sm-6" style="float:none">
			<a href="images/info/apps/clock/mobile/mobile-digital-clock.png" target="_blank" class="lightbox" title="Digital <%= config.apps['clock'].name %>"><img class="dialog" src="images/info/apps/clock/mobile/mobile-digital-clock.png" /></a>
			<div class="caption">Digital <%= config.apps['clock'].name %></div>
		</div>
	</div>
</div>