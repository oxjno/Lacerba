$( document ).ready(function() {
	
	window.isphone = false;
    if(document.URL.indexOf("http://") === -1 
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;
    }

    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }

	
});


function onDeviceReady(){
	//https://gist.github.com/anhang/1096149
	// Changed slightly for testing speed (https://gist.github.com/porkeypop/1096149)
	var ls2 = {
		save : function(key, jsonData, expirationMS){
			if (typeof (Storage) == "undefined") { return false; }
			//var expirationMS = expirationMin * 60 * 1000;
			var record = {value: JSON.stringify(jsonData), timestamp: new Date().getTime() + expirationMS}
			localStorage.setItem(key, JSON.stringify(record));
			return jsonData;
		},
		load : function(key){
			if (typeof (Storage) == "undefined") { return false; }
			var record = JSON.parse(localStorage.getItem(key));
			if (!record){return false;}
			return (new Date().getTime() < record.timestamp && JSON.parse(record.value));
		}
	}

	
	
	/*Caricamento iniziale degli ultimi video*/
	currentURL = "https://videoblog.lacerba.io/feed/json?callback=callback";
	var cached = ls2.load(currentURL);	
		if(cached === false) {
			$.ajax({
			  url: "https://videoblog.lacerba.io/feed/json?callback=callback",
			  method: "GET",
			  dataType: "jsonp",
			  data: '',
			  success: function( data, status, jqxhr ){
				ls2.save('https://videoblog.lacerba.io/feed/json?callback=callback', data, 3600000);
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
		}else{
			console.log('reading from cache');
			console.log( cached );
			data = cached;
			$.each(data, function(index, element) {
			   $('#rss-feeds').append($('<div class="entry"><a href="'+element.permalink+'feed/json" class="entry"><img src="'+element.thumbnail.split(",")[2].split(' 768w')[0]+'"><h3>'+element.title+'</h3></a></div>'
				));
			});
			$("#loader").hide();
			$("#rss-feeds").show();
		}
	
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
		
		var cached = ls2.load(currentURL);	
		if(cached === false) {
			$.ajax({
			  url: currentURL+"json?callback=callback",
			  method: "GET",
			  dataType: "jsonp",
			  data: '',
			  success: function( data, status, jqxhr ){
				console.log( data );
				console.log('saving on cache');  
				ls2.save(currentURL, data, 3600000);
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
		}else{
			console.log('reading from cache');
			console.log( cached );
			data = cached;
			$.each(data, function(index, element) {
			   $('#rss-feeds').append($('<div class="entry"><a href="'+element.permalink+'feed/json" class="entry"><img src="'+element.thumbnail.split(",")[2].split(' 768w')[0]+'"><h3>'+element.title+'</h3></a></div>'
				));
			});
			$("#loader").hide();
			$("#rss-feeds").show();
		}
		
		
	});
	
	/*Click sulla entry nella lista*/
	$("#rss-feeds").on("click","a.entry", function(e){
		e.preventDefault();
		$(window).scrollTop(0);
		$('#pageTitle').text($(this).text());
		$("#loader").fadeIn();
		$("#rss-feeds").empty();
		
		
		currentURL = $(this).attr('href');
		var cached = ls2.load(currentURL);	
		if(cached === false) {
			$.ajax({
			  url: currentURL,
			  method: "GET",
			  dataType: "jsonp",
			  data: '',
			  success: function( data, status, jqxhr ){
				  //console.log( data );
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
		}else{
			console.log('reading from cache');
			console.log( cached );
			data = cached;
			$.each(data, function(index, element) {
			   $('#rss-feeds').append($('<div class="entry">'+element.content.replace(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="100%" height="150" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>')+'</div>'
				));
			});
			$("#loader").hide();
			$("#rss-feeds").show();
		}	
	});
}