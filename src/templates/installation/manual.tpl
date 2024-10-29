<h1><i class="fa fa-list"></i>Manual Installation</h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-installation"></i>Installation</li>
	<li><i class="fa fa-list"></i>Manual Installation</li>
</ol>

<div class="content">
	<p>The manual installation process allows you to install <%= application.name %> with full control over the details and without the extra overhead of Docker. This is the right approach if you want to set up a site for many users or want to optimize the deployment for your web server or application.</p>

	<div class="attention"><div class="emphasis">Have Complete Control!</div></div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-thumbs-up"></i>Advantages</h2>
				<ul>
					<li><b>Control</b> - have full control over the configuration.</li>
					<li><b>Low overhead</b> - no extra Docker overhead.</li>
					<li><b>Understand</b> - have a more complete understanding of your system configuration.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-thumbs-down"></i>Disadvantages</h2>
				<ul>
					<li><b>Requires more time</b> to complete the installation. </li>
					<li><b>Requires</b> more system administration expertise.</li>
					<li><b>More difficult</b> to keep the configuration consistent across deployments.</li>
				</ul>
			</div>
		</div>
	</div>

	<ol>
		<li>
			<h2><i class="fa fa-check"></i>Check System Requirements</h2>
			<p>Check that your system can fulfill these <a href="#installation/requirements">system requirements.</a></p>
		</li>

		<li>
			<h2><i class="fa fa-server"></i>Install a LAMP Stack</h2>
			<p>Install a LAMP stack on your server.  This includes: </p>
			<ul>
				<li>A web server</li>
				<li>A database</li>
				<li>PHP</li>
			</ul>
			<p>It may be easier to install a pre-configured LAMP stack. </p>
			<ul>
				<li>
					If you are running on MacOS, then we recommend <a href="https://www.mamp.info" target="_blank">MAMP</a>.
				</li> 
				<li>
					If you are running on Windows, then we recommend <a href="https://www.apachefriends.org/" target="_blank">XAMPP</a> or <a href="https://www.wampserver.com/" target="_blank">WAMP</a>.
				</li>
			</ul>
		</li>

		<li>
			<h2><i class="fa fa-database"></i>Set Up the Database</h2>
			<p>Once you have installed the web server software, you will need to <a href="#installation/database">set up the database</a>.</p>
		</li>

		<li>
			<h2><i class="fa fa-code"></i>Install the Code</h2>
			<p>Next, you will need to <a href="#installation/code">install the code</a> in the proper location on your web server. </p>
		</li>

		<li>
			<h2><i class="fa fa-image"></i>Install Multimedia Support</h2>
			<p>Next, you will need to <a href="#installation/multimedia-support">install multimedia support</a> in order to handle images and sound properly. </p>
		</li>
	</ol>
</div>