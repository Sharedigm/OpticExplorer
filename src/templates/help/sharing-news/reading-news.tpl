<h1><i class="fa fa-eye"></i>Reading News</h1>

<ol class="breadcrumb">
	<li><a href="#help"><i class="fa fa-question-circle"></i>Help</a></li>
	<li><a href="#help/sharing-news"><i class="fa fa-newspaper"></i>Sharing News</a></li>
	<li><i class="fa fa-eye"></i>Reading News</li>
</ol>

<div class="content">
	<p>You can use <%= application.name %> to keep up with news and events from your friends or colleagues.  News is shared in the form of a time ordered sequence of posts, similar to other social media applications that you are probably familiar with. </p>

	<ol>
		<li>
			<h2><i class="fa fa-newspaper"></i>The News Browser App</h2>
			<p>To view news, click on the "Read News" icon in the session toolbar at the top of the screen. </p> 

			<div class="figure">
				<img src="images/help/sharing-news/reading-news/read-news-icon.png" />
				<div class="caption">Read News Icon</div>
			</div>

			<p>This will launch the <a href="#apps/topic-viewer">News Browser</a> app, which you can use to view and post news. </p>

			<div class="figure">
				<a href="images/help/sharing-news/reading-news/news-browser.png" target="_blank" class="lightbox" title="The News Browser"><img class="dialog" src="images/help/sharing-news/reading-news/news-browser.png" /></a>
				<div class="caption">The News Browser</div>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-newspaper"></i>Your News Feed</h2>
			<p>The area underneath the new post form in the main view is known as your "News Feed".  This contains a list of news posts ordered chronologically from newest to oldest.  If you have not yet connected with friends, then you will see an empty list of posts.  Once you have connected with friends, your news feed will be populated by news posts that you or your friends have made.  If you have set your privacy to "Public", then this list will contain public posts from all users posting to this topic. </p>

			<div class="figure">
				<a href="images/help/sharing-news/reading-news/news-browser-sample.png" target="_blank" class="lightbox" title="A Sample News Feed"><img class="dialog" src="images/help/sharing-news/reading-news/news-browser-sample.png" /></a>
				<div class="caption">A Sample News Feed</div>
			</div>

			<div class="tip well">
				<h3><span class="icon"><i class="fa fa-lightbulb"></i></span>Tip</h3><p>No algorithmic sorting is used to re-arrange posts according to popularity or other criteria. </p>
			</div>

			<h2><i class="fa fa-newspaper"></i>Anatomy of a Post</h2>
			<p>A news post consists of a number of component parts including the following. </p> 

			<ul>
				<li><label>Author</label> - a thumbnail image and name of the author of this post is shown at the upper left. </li>
				<li><label>Badges</label> - badges are shown for the number of comments and number of likes. </li>
				<li><label>Privacy</label> - if a post is public, the globe icon (<i class="fa fa-globe"></i>) is shown. </li>
				<li><label>Date</label> - when the post was created. </li>
				<li><label>Message</label> - this is the main text of the post, displayed in a comment bubble. </li>
				<li><label>Attachments</label> - a post can also contain one or more file and photo attachments. </li>
				<li><label>Comments</label> - underneath the body of the post is a panel containing comments on the post and replies to those comments. </li>
			</ul>

			<div class="figure">
				<a href="images/help/sharing-news/reading-news/sample-post.png" target="_blank" class="lightbox" title="A Sample Post"><img src="images/help/sharing-news/reading-news/sample-post.png" /></a>
				<div class="caption">A Sample Post</div>
			</div>

			<h2><i class="fa fa-hashtag"></i>News Topics</h2>
			<p>On the left sidebar, you'll see a list of topics. To view posts from that topic, just click on the topic that you're interested in. </p> 

			<div class="figure">
				<a href="images/help/sharing-news/reading-news/topics-sidebar.png" target="_blank" class="lightbox" title="Topics"><img src="images/help/sharing-news/reading-news/topics-sidebar.png" /></a>
				<div class="caption">Topics</div>
			</div>

			<p>By default you are subscribed to the two topics:. </p>

			<ul>
				<li><label>What's New</label> - this is the default topic. </li>
				<li><label><%= application.name %></label> - this is for posts about the <%= application.name %> platform, including questions an answers on how it works, feature requests, etc.</li>
			</ul>
		</li>
	</ol>
</div>