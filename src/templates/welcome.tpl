<div class="primary colored section">
	<div class="row">
		<div class="col-sm-6">
			<a class="unstyled" href="#features/easy-to-use">
				<h2><img class="icon" src="images/logos/logo-blue.svg" />Optics for Everyone</h2>
				<p>You no longer need to spend tens of thousands of dollars and countless hours learning optical design software.  For basic optical design applications, <%= application.name %> allows to to explore, simulate, design and share optical systems like never before. </p>
			</a>
		</div>
		<div class="col-sm-6">
			<div class="figure">
				<a href="images/info/desktop/desktop.png" target="_blank" class="lightbox" title="<%= application.name %>"><img src="images/info/desktop/desktop.png" /></a>
				<div class="caption"><%= application.name %></div>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<a class="unstyled" href="#uses/exploration">
				<h2><i class="fa fa-microscope"></i>Exploration</h2>
				<p>Are you curious about optics?  Do you like to know how things work?  <%= application.name %> is an easy and fun way for you to explore the art and science of optics. </p>
			</a>
		</div>
		<div class="col-sm-6">
			<div class="figure">
				<a href="images/info/uses/exploration.png" target="_blank" class="lightbox" title="Exploration"><img src="images/info/uses/exploration.png" /></a>
				<div class="caption">Exploration</div>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<a class="unstyled" href="#uses/simulation">
				<h2><i class="fa fa-lightbulb"></i>Simulation</h2>
				<p>Whether you're an optics enthusiast or professional, <%= application.name %> can help you to simulate and understand complex optical systems. </p>
			</a>
		</div>
		<div class="col-sm-6">
			<div class="figure">
				<a href="images/info/uses/simulation.png" target="_blank" class="lightbox" title="Simulation"><img src="images/info/uses/simulation.png" /></a>
				<div class="caption">Simulation</div>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<a class="unstyled" href="#uses/design">
				<h2><i class="fa fa-ruler-combined"></i>Design</h2>
				<p><%= application.name %> can help you to understand existing lens designs or to design and build your own! </p>
			</a>
		</div>
		<div class="col-sm-6">
			<div class="figure">
				<a href="images/info/uses/design.png" target="_blank" class="lightbox" title="Design"><img src="images/info/uses/design.png" /></a>
				<div class="caption">Design</div>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<a class="unstyled" href="#uses/education">
				<h2><i class="fa fa-chalkboard"></i>Education</h2>
				<p>Whether you're a teacher or a student, use <%= application.name %> to teach and learn about the art and science of optics. </p>
			</a>
		</div>
		<div class="col-sm-6">
			<div class="figure">
				<a href="images/info/uses/education.png" target="_blank" class="lightbox" title="Education"><img src="images/info/uses/education.png" /></a>
				<div class="caption">Education</div>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<a class="unstyled" href="#features/platform-independent">
				<h2><i class="fa fa-cloud"></i>Access It From Anywhere</h2>
				<p>Access your digital world from anywhere on any internet connected device. </p>
			</a>
		</div>
		<div class="col-sm-6">
			<a class="unstyled" href="#features/platform-independent">
				<div class="figure">
					<a href="images/info/desktop/iphone-desktop.png" target="_blank" class="lightbox" title="<%= application.name %> Mobile"><img src="images/info/desktop/iphone-desktop.png" /></a>
					<div class="caption"><%= application.name %> Mobile</div>
				</div>
			</a>
		</div>
	</div>
</div>

<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<a class="unstyled" href="#features/web-postable">
				<h2><i class="fa fa-code"></i>Post Your Optical Designs Anywhere</h2>
				<p>You can post and view optics files uploaded to <%= application.name %> on other websites easily with just a bit of HTML code. </p>
			</a>
		</div>
		<div class="col-sm-6">
			<a class="unstyled" href="#features/web-postable">
				<div class="code well">
	&lt;iframe src="YOUR FILE LINK HERE"&gt;&lt;/iframe&gt
				</div>
			</a>
		</div>
	</div>
</div>

<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<h2><i class="fa fa-dollar-sign"></i>It's Free To Use</h2>
			<p>This application is free for non-commercial use.  <a href="#contact">Contact us</a> for commercial applications or if you want to set up an instance on your own server. </p>
		</div>
		<div class="col-sm-6">
		</div>
	</div>
</div>

<% let identityProviders = application.session.has('config')? application.session.get('config').identity_providers : undefined; %>
<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<h2><i class="fa fa-pencil-alt"></i>It's Quick To Sign Up</h2>
			<% if (identityProviders && identityProviders.length > 0) { %>
			<p>Signing up is quick and easy.  There's a simple registration form or if you're already signed in to an identity provider (<%= identityProviders.join(', ') %>), just hit the "Sign Up With" button and you can get started in seconds! </p>
			<% } else { %>
			<p>Signing up is quick and easy.  Fill out a simple registration to get started in seconds! </p>
			<% } %>
		</div>
		<div class="col-sm-6">
			<div class="well">
				<br />
				<div class="buttons">
					<button class="sign-up btn btn-lg">
						<i class="fa fa-pencil-alt"></i>Sign Up!
					</button>
				</div>
				<br />
			</div>
		</div>
	</div>
</div>

<div class="section"></div>