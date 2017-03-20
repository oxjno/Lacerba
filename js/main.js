$( document ).ready(function() {
	//plugin jquery.rss.js http://www.jqueryscript.net/social-media/Tiny-jQuery-Based-RSS-Reader-Custom-Template-RSS-js.html
	$("#rss-feeds")
	  .hide()
	  .rss("https://videoblog.lacerba.io/feed/?rnd="+Math.random(10000), {
		limit: 15,
		effect: 'slideFastSynced',
		layoutTemplate: '{entries}',
		entryTemplate: '<div class="entry">{teaserImage}<h3>{title}</h3></div>'
	  }, function() {
		$("#rss-feeds").show();
	  });
	$(".dropdown-menu a").click(function(e) {
		e.preventDefault();
		$('.navbar-toggle').click();
		$("#rss-feeds").empty();
		$("#rss-feeds")
	  .hide()
	  .rss($(this).attr('href'), {
		limit: 15,
		effect: 'slideFastSynced',
		layoutTemplate: '{entries}',
		entryTemplate: '<div class="entry">{teaserImage}<h3>{title}</h3></div>'
	  }, function() {
		$("#rss-feeds").show();
	  });
	});
  });