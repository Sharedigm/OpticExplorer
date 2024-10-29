<h1><i class="fa fa-info-circle"></i>About <%= application.name %></h1>

<ol class="breadcrumb">
	<li><i class="fa fa-info-circle"></i>About <%= application.name %></li>
</ol>

<div class="content">
	<div style="display:none; margin:20px; text-align:center">
		<img width="150" src="images/logos/logo.svg" />
	</div>

	<p><%= application.name %> is a cloud based operating system and sharing platform.  It combines the power of the cloud with the familiar look and feel of your favorite desktop or mobile operating system! </p>

	<div class="attention"><div class="emphasis"><%= application.name %> = <br />Cloud OS + <br />Familiar Look and Feel!</div></div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Easy and intuitive user interface.</li>
					<li>View photos and videos.</li>
					<li>Listen to audio and podcasts.</li>
					<li>Run a variety of apps.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Manage and your data, documents, and code.</li>
					<li>Share data with friends and colleagues.</li>
					<li>Control access to your data.</li>
					<li>Manage geospatial data.</li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>

	<div class="figure">
		<a href="images/info/desktop/desktop.png" target="_blank" class="smooth lightbox" title="<%= application.name %> Desktop"><img src="images/info/desktop/desktop.png" /></a>
		<div class="caption"><%= application.name %> Desktop</div>
	</div>

	<div class="figure row">
		<div class="figure col-sm-6">
			<a href="images/info/desktop/iphone-desktop.png" target="_blank" class="smooth lightbox" title="<%= application.name %> Mobile"><img src="images/info/desktop/iphone-desktop.png" style="width:300px" /></a>
			<div class="caption"><%= application.name %> Mobile</div>
		</div>
	</div>
</div>