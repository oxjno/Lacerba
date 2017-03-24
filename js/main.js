$( document ).ready(function() {

	//plugin jquery.rss.js http://www.jqueryscript.net/social-media/Tiny-jQuery-Based-RSS-Reader-Custom-Template-RSS-js.html
	/*Caricamento iniziale degli ultimi video*/
	$("#rss-feeds")
	  .hide()
	  .rss("https://videoblog.lacerba.io/feed/"/*+Math.random(10000)*/, {
		limit: 5,
		effect: 'slideFastSynced',
		layoutTemplate: '{entries}',
		entryTemplate: '<div class="entry"><a href="{url}feed/?withoutcomments=1&fsk=58ce669950cc7" class="entry">{teaserImage}<h3>{title}</h3></a></div>'
	  }, function() {
		$("#loader").hide();
		$("#rss-feeds").show();
	  });
	
	/*Click sul menu*/
	$(".dropdown-menu a").click(function(e) {
		e.preventDefault();
		$(window).scrollTop(0);
		$('#pageTitle').text($(this).text());
		$('.navbar-toggle').click();
		$("#loader").fadeIn();
		$("#rss-feeds").empty();
		$("#rss-feeds")
	  .hide()
	  .rss($(this).attr('href'), {
		limit: 100,
		effect: 'slideFastSynced',
		layoutTemplate: '{entries}',
		entryTemplate: '<div class="entry"><a href="{url}feed/?withoutcomments=1&fsk=58ce669950cc7" class="entry">{teaserImage}<h3>{title}</h3></a></div>'
	  }, function() {
		$("#loader").hide();
		$("#rss-feeds").show();
	  });
	});
	
	/*Click sulla entry nella lista*/
	$("#rss-feeds").on("click","a.entry", function(e){
		e.preventDefault();
		$(window).scrollTop(0);
		$('#pageTitle').text($(this).text());
		$("#loader").fadeIn();
		$("#rss-feeds").empty();
		$("#rss-feeds")
	  .hide()
	  .rss($(this).attr('href'), {
		limit: 100,
		effect: 'slideFastSynced',
		layoutTemplate: '{entries}',
		entryTemplate: '<div class="entry">{body}</div>'
	  }, function() {
		$("#loader").hide();
		$("#rss-feeds").show();
	  });
	});
	
	
});