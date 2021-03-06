
//https://gist.github.com/anhang/1096149
// Changed slightly for testing speed (https://gist.github.com/porkeypop/1096149)
var ls2 = {
	save: function (key, jsonData, expirationMS) {
		if (typeof (Storage) == "undefined") {
			return false;
		}
		//var expirationMS = expirationMin * 60 * 1000;
		var record = {
			value: JSON.stringify(jsonData),
			timestamp: new Date().getTime() + expirationMS
		}
		localStorage.setItem(key, JSON.stringify(record));
		return jsonData;
	},
	load: function (key) {
		if (typeof (Storage) == "undefined") {
			return false;
		}
		var record = JSON.parse(localStorage.getItem(key));
		if (!record) {
			return false;
		}
		return (new Date().getTime() < record.timestamp && JSON.parse(record.value));
	}
}
	
/*Caricamento iniziale degli ultimi video*/
function homePage() {
	$(window).scrollTop(0);
	$('#pageTitle').text('Latest videos');
	$("#loader").fadeIn();
	$("#rss-feeds").empty();
	currentURL = "https://videoblog.lacerba.io/feed/json?callback=callback";
	var cached = ls2.load(currentURL);
	if (cached === false) {
		$.ajax({
			url: "https://videoblog.lacerba.io/feed/json?callback=callback",
			method: "GET",
			dataType: "jsonp",
			data: '',
			success: function (data, status, jqxhr) {
				ls2.save('https://videoblog.lacerba.io/feed/json?callback=callback', data, 3600000);
				$.each(data, function (index, element) {
					$('#rss-feeds').append($('<div class="entry"><a href="' + element.permalink + 'feed/json" class="entry"><img src="' + element.thumbnail.split(",")[2].split(' 768w')[0] + '"><h3>' + element.title + '</h3></a></div>'));
				});
				$("#loader").hide();
				$("#rss-feeds").show();
			},
			error: function (jqxhr, status, error) {
				console.log("Something went wrong!");
			}
		});
	} else {
		console.log('reading from cache');
		console.log(cached);
		data = cached;
		$.each(data, function (index, element) {
			$('#rss-feeds').append($('<div class="entry"><a href="' + element.permalink + 'feed/json" class="entry"><img src="' + element.thumbnail.split(",")[2].split(' 768w')[0] + '"><h3>' + element.title + '</h3></a></div>'));
		});
		$("#loader").hide();
		$("#rss-feeds").show();
	}
}

function searchBlog() {
	console.log('https://videoblog.lacerba.io/wp-json/wp/v2/posts?search=' + $("#search").val());
	$('#search').blur();
	$(window).scrollTop(0);
	$('#pageTitle').text('Search results');
	$("#loader").fadeIn();
	$("#rss-feeds").empty();

	$.ajax({
		url: 'https://videoblog.lacerba.io/wp-json/wp/v2/posts?search=' + $("#search").val(),
		method: "GET",
		dataType: "json",
		data: '',
		success: function (data, status, jqxhr) {
			console.log(data);
			if (data.length > 0) {
				$.each(data, function (index, element) {
					$('#rss-feeds').append($('<div class="entry"><a href="' + data[index].link + 'feed/json" class="entry"><h3>' + data[index].title.rendered + '</h3></a></div>'));
				});
			} else {
				$('#rss-feeds').append($('<div class="entry">Nothing found :(</div>'));
			}
			$("#loader").hide();
			$("#rss-feeds").show();
		},
		error: function (jqxhr, status, error) {
			console.log("Something went wrong!");
			$('#rss-feeds').append($('<div class="entry">Nothing found :(</div>'));
			$("#loader").hide();
			$("#rss-feeds").show();
		}
	});
	$("#search").val('');
}

function onOffline() {
	console.log('Internet connection lost!');
	navigator.notification.alert('Internet connection not available!', alertDismissed, 'Warning', 'OK');
}

function onBackKeyDown(e) {
	e.preventDefault();
	navigator.notification.confirm("Sei sicuro di voler uscire?", onConfirm, "Attenzione", "Si,No");
}

function onConfirm(button) {
	if (button == 2) { //If User selected No, then we just do nothing
		return;
	} else {
		navigator.app.exitApp(); // Otherwise we quit the app.
	}
}


function myDeviceReady() {
	console.log('function onDeviceReady');


	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {

		document.addEventListener("offline", onOffline, false);
		document.addEventListener("backbutton", onBackKeyDown, false);



		if (!navigator.onLine) {
			navigator.notification.alert('Internet connection not available!', alertDismissed, 'Warning', 'OK');
		}
	}


	homePage();
	
	$("#logoTop").click(function (e) {
		homePage();
	});

	$("#searchForm").on("submit", function (e) {
		e.preventDefault();
		searchBlog();
	});
	
	$("#search").on('keyup', function (e) {
		if (e.keyCode == 13) {
			searchBlog();
		}
	});

	/*Click sul menu*/
	$(".dropdown-menu a").click(function (e) {
		e.preventDefault();
		$(window).scrollTop(0);
		categoryUrl = $(this).attr('href');
		maxEntry = 100;
		if (categoryUrl == "https://videoblog.lacerba.io/feed/") {
			maxEntry = 5;
		}
		$('#pageTitle').text($(this).text());
		$('.navbar-toggle').click();
		$("#loader").fadeIn();
		$("#rss-feeds").empty();

		currentURL = $(this).attr('href');

		var cached = ls2.load(currentURL);
		if (cached === false) {
			$.ajax({
				url: currentURL + "json?callback=callback",
				method: "GET",
				dataType: "jsonp",
				data: '',
				success: function (data, status, jqxhr) {
					console.log(data);
					console.log('saving on cache');
					ls2.save(currentURL, data, 3600000);
					$.each(data, function (index, element) {
						$('#rss-feeds').append($('<div class="entry"><a href="' + element.permalink + 'feed/json" class="entry"><img src="' + element.thumbnail.split(",")[2].split(' 768w')[0] + '"><h3>' + element.title + '</h3></a></div>'));
					});
					$("#loader").hide();
					$("#rss-feeds").show();
				},
				error: function (jqxhr, status, error) {
					console.log("Something went wrong!");
				}
			});
		} else {
			console.log('reading from cache');
			console.log(cached);
			data = cached;
			$.each(data, function (index, element) {
				$('#rss-feeds').append($('<div class="entry"><a href="' + element.permalink + 'feed/json" class="entry"><img src="' + element.thumbnail.split(",")[2].split(' 768w')[0] + '"><h3>' + element.title + '</h3></a></div>'));
			});
			$("#loader").hide();
			$("#rss-feeds").show();
		}


	});

	/*Click sulla entry nella lista*/
	$("#rss-feeds").on("click", "a.entry", function (e) {
		e.preventDefault();
		$(window).scrollTop(0);
		$('#pageTitle').text($(this).text());
		$("#loader").fadeIn();
		$("#rss-feeds").empty();


		currentURL = $(this).attr('href');
		var cached = ls2.load(currentURL);
		if (cached === false) {
			$.ajax({
				url: currentURL,
				method: "GET",
				dataType: "jsonp",
				data: '',
				success: function (data, status, jqxhr) {
					//console.log( data );
					$.each(data, function (index, element) {
						$('#rss-feeds').append($('<div class="entry">' + element.content.replace(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="100%" height="150" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>') + '</div>'));
					});
					$("#loader").hide();
					$("#rss-feeds").show();
				},
				error: function (jqxhr, status, error) {
					console.log("Something went wrong!");
				}
			});
		} else {
			console.log('reading from cache');
			console.log(cached);
			data = cached;
			$.each(data, function (index, element) {
				$('#rss-feeds').append($('<div class="entry">' + element.content.replace(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="100%" height="150" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>') + '</div>'));
			});
			$("#loader").hide();
			$("#rss-feeds").show();
		}
	});
} //end myDeviceReady

$(document).ready(function () {
	console.log('document ready');
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
		console.log('we are in phonegap');
		//document.addEventListener("deviceready", myDeviceReady, false);
	} else {
		console.log('we are on desktop');
	}
	myDeviceReady();
}); //end document ready