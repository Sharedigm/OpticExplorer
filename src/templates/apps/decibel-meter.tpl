<h1><i class="<%= config.apps['decibel_meter'].icon %>"></i><%= config.apps['decibel_meter'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-volume-up"></i><%= config.apps['decibel_meter'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['decibel_meter'].color %>">
		<img src="images/icons/apps/<%= config.apps['decibel_meter'].image || config.apps['decibel_meter'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['decibel_meter'].name %> app shows you the current audio level. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Shows current audio level</li>
					<li>Displays results on digital display</li>
					<li>Keeps track of max audio level since previous reset.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Monitor the loudness of your environment. </li>
					<li>Keep noise at a safe level. </li>
					<li>Can be used to gauge level of audience applause. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>

	<div class="figure row desktop-only">
		<div class="figure light-theme-only">
			<a href="images/info/apps/decibel-meter/decibel-meter.png" target="_blank" class="lightbox" title="<%= config.apps['decibel_meter'].name %>"><img class="dialog" src="images/info/apps/decibel-meter/decibel-meter.png" style="width:300px" /></a>
			<div class="caption"><%= config.apps['decibel_meter'].name %></div>
		</div>
		<div class="figure dark-theme-only">
			<a href="images/info/apps/decibel-meter/decibel-meter-dark.png" target="_blank" class="lightbox" title="<%= config.apps['decibel_meter'].name %>"><img class="dialog" src="images/info/apps/decibel-meter/decibel-meter-dark.png" style="width:300px" /></a>
			<div class="caption"><%= config.apps['decibel_meter'].name %></div>
		</div>
	</div>
	<div class="figure row mobile-only">	
		<div class="figure col-sm-6 light-theme-only" style="float:none">
			<a href="images/info/apps/decibel-meter/mobile/mobile-decibel-meter.png" target="_blank" class="lightbox" title="<%= config.apps['decibel_meter'].name %>"><img class="dialog" src="images/info/apps/decibel-meter/mobile/mobile-decibel-meter.png" /></a>
			<div class="caption"><%= config.apps['decibel_meter'].name %></div>
		</div>
		<div class="figure col-sm-6 dark-theme-only" style="float:none">
			<a href="images/info/apps/decibel-meter/mobile/mobile-decibel-meter-dark.png" target="_blank" class="lightbox" title="<%= config.apps['decibel_meter'].name %>"><img class="dialog" src="images/info/apps/decibel-meter/mobile/mobile-decibel-meter-dark.png" /></a>
			<div class="caption"><%= config.apps['decibel_meter'].name %></div>
		</div>
	</div>
</div>