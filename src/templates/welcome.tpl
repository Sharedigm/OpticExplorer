<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<h2><img class="icon" src="images/logos/logo.svg" />Sharing Made Simple</h2>
			<p><%= application.name %> is a self-hostable cloud based operating system that brings together file management, file sharing, and collaboration / social networking all in one easy to use platform. </p>
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
			<h2><i class="fa fa-dollar-sign"></i>It's Free To Use!</h2>
			<p><%= application.name %> is <a href="#policies/terms-of-use">free to use</a> for non-commmercial applications. </p>
		</div>
	</div>
</div>

<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<h2><i class="fa fa-smile"></i>It's Easy to Use!</h2>
			<p><%= application.name %> has the <a href="#features/easy-to-use">familiar look and feel</a> of your desktop or mobile OS.  It's so familiar that you'll be comfortable with it right from the start.  It's like your computer but in the cloud. </p>
		</div>
		<div class="col-sm-6">
			<div class="figure">
				<a href="images/info/desktop/desktop-photos.png" target="_blank" class="lightbox" title="<%= application.name %>"><img src="images/info/desktop/desktop-photos.png" /></a>
				<div class="caption"><%= application.name %></div>
			</div>
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

<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<h2><i class="fa fa-mobile"></i>It's Accessible Anywhere</h2>
			<p>Access your digital world from anywhere on <a href="#features/platform-independent">any internet connected device.</a> </p>
		</div>
		<div class="col-sm-6">
			<a href="#features/platform-independent">
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
			<h2><i class="fa fa-rocket"></i>It's Got Apps!</h2>
			<p><%= application.name %> has a collection of <a href="#apps">apps</a> for viewing, managing and sharing your data.</p>
		</div>
		<div class="col-sm-6">
			<div class="icons carousel">
				<% let apps = config.apps; %>
				<% let keys = Object.keys(apps); %>
				<% for (let i = 0; i < keys.length; i++) { %>
				<% let app = apps[keys[i]]; %>

				<% if (!app.disabled) { %>
				<div class="carousel-cell">
					<div class="app-icons large icon-grid items">
						<a href="#apps/<%= app.app %>">
						<div class="item" href="#apps/profile-browser" style="text-decoration:none">	
							<div class="row">
								<div class="icon colored <%= app.color %>">
									<img src="images/icons/apps/<%= app.image || app.app + '.svg' %>" />
									<i class="<%= app.icon %>"></i>
								</div>
							</div>
							<div class="row">
								<div class="name"><%= app.name %></div>
							</div>
						</div>
						</a>
					</div>
				</div>
				<% } %>

				<% } %>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<h2><i class="fa fa-tools"></i>It's Self-Hostable!</h2>
			<p>Are you a DIY type person?  You can <a href="#features/self-hostable">run <%= application.name %> on your own server</a>! Join the host it yourself (HIY) movement to retake control over your data! </p>
		</div>
		<div class="col-sm-6">
			<div class="figure">
				<a href="#welcome/we-can-do-it">
					<img class="vertical" src="images/welcome/we-can-do-it.jpg" />
				</a>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="row">
		<div class="col-sm-6">
			<h2><i class="fa fa-heart"></i>You Might Also Like</h2>
			<p>You might also like these other websites built upon the Sharedigm <a href="#platform">platform</a>. </p>
		</div>
		<div class="col-sm-6">
			<div class="icons large icon-grid items">

				<div class="item">	
					<div class="row">
						<a href="http://www.dreamachines.ai" target="_blank">
							<div class="icon">
								<img src="images/logos/dreamachines.png" />
							</div>
						</a>
					</div>
					<div class="row">
						<div class="name">Dreamachines</div>
					</div>
				</div>

				<div class="item">	
					<div class="row">
						<a href="http://www.opticexplorer.com" target="_blank">
							<div class="icon">
								<img src="images/logos/opticexplorer.png" />
							</div>
						</a>
					</div>
					<div class="row">
						<div class="name">OpticExplorer</div>
					</div>
				</div>

				<div class="item">	
					<div class="row">
						<a href="http://easybucket.sharedigm.com" target="_blank">
							<div class="icon">
								<img src="images/logos/easybucket.png" />
							</div>
						</a>
					</div>
					<div class="row">
						<div class="name">EasyBucket</div>
					</div>
				</div>

				<div class="item">	
					<div class="row">
						<a href="http://cloudkitty.org" target="_blank">
							<div class="icon">
								<img src="images/logos/cloudkitty.png" />
							</div>
						</a>
					</div>
					<div class="row">
						<div class="name">CloudKitty</div>
					</div>
				</div>

				<div class="item">
					<div class="row">
						<a href="http://www.cloudintosh.com" target="_blank">
							<div class="icon">
								<img src="images/logos/cloudintosh.png" />
							</div>
						</a>
					</div>
					<div class="row">
						<div class="name">Cloudintosh</div>
					</div>
				</div>

				<div class="item">	
					<div class="row">
						<a href="http://windows3000.com" target="_blank">
							<div class="icon">
								<img src="images/logos/windows3000.png" />
							</div>
						</a>
					</div>
					<div class="row">
						<div class="name">Windows3000</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>