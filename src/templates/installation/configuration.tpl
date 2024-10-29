<h1><i class="fa fa-gear"></i>Configuration</h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-installation"></i>Installation</li>
	<li><i class="fa fa-gear"></i>Configuration</li>
</ol>

<div class="content">
	<p>Once you have installed the software, you'll want to perform a few simple action to configure it for use.</p>

	<h2><i class="fa fa-lock"></i>Change the Admin Password</h2>
	<p>When you first install the software, an "administrator" account is created for you.  The administrator account lets you view the users on the system and everyone's files.  For this reason, you should set a secure password.  To do, so login as the administrator by clicking on the "Sign In" button at the upper right and enter the administrator's credentials: </p>

	<br />
	<div class="well" style="width:300px; margin:auto">
		<p><div style="float:right">admin</div><b>Username:</b></p>
		<p><div style="float:right">admin</div><b>Password:</b></p>
	</div>
	<br />

	<p>Once you have logged in, click on the gear icon in the top navbar to bring up the Settings application.  Then, click on "Account" in the left sidebar and click the "Change Password" button to enter a new, secure password. </p>

	<h2><i class="fa fa-envelope"></i>Configure Mail</h2>
	<p>If you'd like the application to be able to send mail, then you'll need to configure the application's mail settings. Mail is useful for the following reasons: </p>

	<ul>
		<li>To verify users' identities when they create new accounts. </p>
		<li>To share items via email. </p>
		<li>To recover forgotten usernames. </p>
		<li>To reset forgotten passwords. </p>
	</ul>

	<p>To configure mail, open the file <span class="code">services/.env</span> and enter the following information: </p>

	<div class="code well">
MAIL_ENABLED=true
MAIL_MAILER=smtp
MAIL_HOST=&lt;YOUR MAIL HOST HERE&gt;
MAIL_PORT=1025
MAIL_USERNAME=&lt;YOUR MAIL USERNAME HERE&gt;
MAIL_PASSWORD=&lt;YOUR MAIL PASSWORD HERE&gt;
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME="${APP_NAME}"
MAIL_CONTACT_ADDRESS=
MAIL_CONTACT_NAME="${APP_NAME}"
	</div>
</div>