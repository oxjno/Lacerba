$( document ).ready(function() {
	
	/*Caricamento iniziale degli ultimi video*/
	$.ajax({
	  url: "https://videoblog.lacerba.io/feed/json?callback=callback",
	  method: "GET",
	  dataType: "jsonp",
	  data: '',
	  success: function( data, status, jqxhr ){
		  console.log( data );
		$.each(data, function(index, element) {
           $('#rss-feeds').append($('<div class="entry"><a href="'+element.permalink+'feed/json" class="entry"><img src="'+element.thumbnail.split(",")[2].split(' 768w')[0]+'"><h3>'+element.title+'</h3></a></div>'
            ));
        });
		$("#loader").hide();
		$("#rss-feeds").show();
	  },
	  error: function( jqxhr, status, error ){
		console.log( "Something went wrong!" );
	  }
	});
	
	/*Click sul menu*/
	$(".dropdown-menu a").click(function(e) {
		e.preventDefault();
		$(window).scrollTop(0);
		categoryUrl = $(this).attr('href');
		maxEntry = 100;	
		if(categoryUrl=="https://videoblog.lacerba.io/feed/"){maxEntry = 5;}
		$('#pageTitle').text($(this).text());
		$('.navbar-toggle').click();
		$("#loader").fadeIn();
		$("#rss-feeds").empty();
		
		currentURL = $(this).attr('href');
		$.ajax({
		  url: currentURL+"json?callback=callback",
		  method: "GET",
		  dataType: "jsonp",
		  data: '',
		  success: function( data, status, jqxhr ){
			  console.log( data );
			$.each(data, function(index, element) {
			   $('#rss-feeds').append($('<div class="entry"><a href="'+element.permalink+'feed/json" class="entry"><img src="'+element.thumbnail.split(",")[2].split(' 768w')[0]+'"><h3>'+element.title+'</h3></a></div>'
				));
			});
			$("#loader").hide();
			$("#rss-feeds").show();
		  },
		  error: function( jqxhr, status, error ){
			console.log( "Something went wrong!" );
		  }
		});
	});
	
	/*Click sulla entry nella lista*/
	$("#rss-feeds").on("click","a.entry", function(e){
		e.preventDefault();
		$(window).scrollTop(0);
		$('#pageTitle').text($(this).text());
		$("#loader").fadeIn();
		$("#rss-feeds").empty();
		
		
		currentURL = $(this).attr('href');
		$.ajax({
		  url: currentURL,
		  method: "GET",
		  dataType: "jsonp",
		  data: '',
		  success: function( data, status, jqxhr ){
			  console.log( data );
			$.each(data, function(index, element) {
			   $('#rss-feeds').append($('<div class="entry">'+element.content.replace(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="100%" height="150" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>')+'</div>'
				));
			});
			$("#loader").hide();
			$("#rss-feeds").show();
		  },
		  error: function( jqxhr, status, error ){
			console.log( "Something went wrong!" );
		  }
		});
	});
	
	
});