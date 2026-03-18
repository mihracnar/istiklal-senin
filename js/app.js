var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
/* GENERIC FUNCTIONS */
function setCookie(key, value, expiry) {
	var expires = new Date();
	expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
	document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
	var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	return keyValue ? keyValue[2] : null;
}

function eraseCookie(key) {
	var keyValue = getCookie(key);
	setCookie(key, keyValue, '-1');
}

function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

/* UPDATE LOCATIONS ACCORDING TO SEARCH & CATEGORY */
function updateLocations($filteredLocations = [], $filteredTags = []){
	//console.log($filteredLocations);
	$('#locations a').removeClass('diminished-by-location').removeClass('selected-by-location');
	if ($filteredLocations.length){
		$('#locations a').addClass('diminished-by-location');
		$('#locations a').each(function(index){
			$href = $(this).attr('href');
			$href = $href.replace("/mekanlar/", "");
			//console.log($href);
			$found = false;
			for ($i = 0; $i < $filteredLocations.length; $i ++){
				if ($filteredLocations[$i].slug == $href){
					$found = true;
					break;
				}
			}
			if ($found){
				$(this).addClass('selected-by-location');
			}
		})
	}
	
	$('#locations a').removeClass('diminished-by-tag').removeClass('selected-by-tag');
	if ($filteredTags.length){
		$('#locations a').addClass('diminished-by-tag');
		$('#locations a').each(function(index){
			$tags = $(this).attr('tags');
			$tagA = $tags.split(",");
			//console.log($href);
			$found = false;
			for ($i = 0; $i < $filteredTags.length; $i ++){
				for ($j = 0; $j < $tagA.length; $j ++){
					if ($filteredTags[$i].slug == $tagA[$j]){
						$found = true;
						break;
					}
				}
			}
			if ($found){
				$(this).addClass('selected-by-tag');
			}
		})
	}
	
	
	$('#locations a').removeClass('diminished-by-category').removeClass('selected-by-category');
	$('#mekanlar .list a').removeClass('diminished-by-category').removeClass('selected-by-category');
	if ($('#categories ul li a.selected').length > 0){
		$href = $('#categories ul li a.selected').attr('href');
		$href = $href.replace("#", "");
		$('#locations a').addClass('diminished-by-category');
		$('#mekanlar .list a').addClass('diminished-by-category');
		$('#locations a.' + $href).addClass('selected-by-category');
		$('#mekanlar .list a.' + $href).addClass('selected-by-category');
	}
	
}



$(document).ready(function(){
	
	/* İstiklal Haber */
	$('#subscribe-to-email').on("submit", function(e){
		e.preventDefault();
		$(this).find('.response').html("E-posta adresiniz kaydediliyor...");
		$email = $(this).find("input[name='email']").val();
		if (!$email){
			$(this).find('.response').html("Lütfen e-posta adresinizi yazınız.");
		}
		else{
			if (!validateEmail($email)){
				$(this).find('.response').html("Lütfen e-posta adresinizi kontrol ediniz.");
			}
			else{
				var data = {email: $email};
				$.ajax({
					type: "POST",
					url: "/subscribe",
					data: data,
					success: function (response) {
						if (response == 'success'){
							$('#subscribe-to-email .response').html('Kaydınız alındı, teşekkür ederiz.');
						}
						else{
							$('#subscribe-to-email .response').html(response);
						}
					}
				});
			}
		}
	})
	
	/* GDPR */
	if (localStorage.getItem('gdpr_status') === null) {
		if (getCookie('gdpr_status') === null){
			$('#gdpr').addClass('show');
		}
	}
	
	$('#gdpr-dismiss').click(function(e){
		e.preventDefault();
		localStorage.setItem('gdpr_status', 'dismissed');
		$('#gdpr').removeClass('show');
	})
	
	$('#gdpr-allow').click(function(e){
		e.preventDefault();
		localStorage.setItem('gdpr_status', 'allowed');
		setCookie('gdpr_status', 'allowed', 60);
		$('#gdpr').removeClass('show');
	})
	
	/* HAMBURGER MENU */
	$('a.menu-toggle').click(function(e){
		e.preventDefault();
		if ($('body').hasClass('expanded')){
			$('body').removeClass('expanded');
		}
		else{
			$('body').addClass('expanded');
		}
	});
	
	/* CATEGORY INTERACTIONS */
	$('#categories ul li a').click(function(e){
		e.preventDefault();
		if ($(this).hasClass('selected')){
			$(this).removeClass('selected');
		}
		else{
			$(this).parent().parent().find('.selected').removeClass('selected');
			$(this).addClass('selected');
		}
		updateLocations();
	})
	
	$('#categories ul li a').hover(function(e){
		if (!$(this).hasClass('selected')){
			$(this).parent().parent().find('.selected').addClass('hover-on-other');
		}
	},
	function(e){
		$(this).parent().parent().find('.selected').removeClass('hover-on-other');
	})
	
	/* ROUTE PLANNER */
	function updateRoutePlanner(){
		if (window.sessionStorage) {
			if (sessionStorage.getItem("benimrotam")){
				$data = JSON.parse(sessionStorage.getItem("benimrotam"));
				$('#route-planner .dynamic').html("");
				$html = '';
				for ($i = 0; $i < $data.length; $i ++){
					$location = "<div class='location' data-id='" + $data[$i][4] + "' href='" + $data[$i][0] + "'><div class='icon'><img src='/images/layout/" + $data[$i][3] + "'></div><a href='" + $data[$i][0] + "' style='color:#" + $data[$i][2] + ";'>" + $data[$i][1] + "</a><a href='#' class='remove'><img src='/images/layout/delete.svg'></a></div>";
					$html += $location;
				}
				$('#route-planner .dynamic').html($html);
				if ($data.length >= 3){
					$('#benim-rotam #route-planner .call-to-action').removeClass('inactive');
				}
				else{
					$('#benim-rotam #route-planner .call-to-action').addClass('inactive');
				}
				if ($data.length > 1){
					$('#route-planner .dynamic').sortable({
						containment: "parent",
						/*change: function( event, ui ) {
							console.log(event);
						}*/
						stop: function(event, ui) {
							var arr = [];
							if (window.sessionStorage) {
								$data = JSON.parse(sessionStorage.getItem("benimrotam"));
								$orderedData = [];
								$('.location', $(this)).each(function() {
									for ($i = 0; $i < $data.length; $i ++){
										if ($data[$i][0] == $(this).attr('href')){
											$orderedData.push($data[$i]);
											break;
										}
									}
								});
								sessionStorage.setItem("benimrotam", JSON.stringify($orderedData));
							}
						}
					});
				}
				else{
					//$('#route-planner .dynamic').sortable("destroy");
				}
				
				if ($data.length == 0){
					$('#route-planner .dynamic').html("<p>Harita üzerindeki noktalara tıklayarak rotanıza ekleyebilirsiniz.</p>");
					$('#benim-rotam #route-planner .call-to-action').addClass('inactive');
				}
				
				if ($data.length){
					$('#benim-rotam-menu-item').html("Benim Rotam (" + $data.length + ")");
				}
				else {
					$('#benim-rotam-menu-item').html("Benim Rotam");
				}
			}
			else{
				$('#route-planner .dynamic').html("<p>Harita üzerindeki noktalara tıklayarak rotanıza ekleyebilirsiniz.</p>");
				$('#benim-rotam #route-planner .call-to-action').addClass('inactive');
				$('#benim-rotam-menu-item').html("Benim Rotam");
				//$('#route-planner .dynamic').sortable("destroy");
			}
			//console.log($data);
			//sessionStorage.setItem("benimrotam", JSON.stringify($data));
		}
		else{
			$('#benim-rotam-menu-item').html("Benim Rotam");
		}
	}
	//sessionStorage.setItem("benimrotam", "");
	
	$('#benim-rotam #locations a').click(function(e){
		e.preventDefault();
		//console.log('test');
		if (window.sessionStorage) {
			$data = [];
			if (sessionStorage.getItem("benimrotam")){
				$data = JSON.parse(sessionStorage.getItem("benimrotam"));
				if ($(this).hasClass('picked')){
					$(this).removeClass('picked');
					$index = -1;
					for ($i = 0; $i < $data.length; $i ++){
						if ($data[$i][0] == $(this).attr('href')){
							$index = $i;
							break;
						}
					}
					$data.splice($index, 1);
				}
				else{
					$(this).addClass('picked');
					$data.push([$(this).attr('href'),$(this).attr('title'),$(this).attr('color'),$(this).attr('icon'),$(this).attr('data-id')]);
				}
			}
			else{
				$(this).addClass('picked');
				$data = [[$(this).attr('href'),$(this).attr('title'),$(this).attr('color'),$(this).attr('icon'),$(this).attr('data-id')]];
			}
			sessionStorage.setItem("benimrotam", JSON.stringify($data));
		}
		updateRoutePlanner();
	})
	
	if (window.sessionStorage) {
		if (sessionStorage.getItem("benimrotam")){
			$data = JSON.parse(sessionStorage.getItem("benimrotam"));
			for ($i = 0; $i < $data.length; $i ++){
				$('#benim-rotam #locations a[href="' + $data[$i][0] + '"]').addClass('picked');
			}
		}
	}
	updateRoutePlanner();
	
	$('body').on('click', '#route-planner .location a.remove', function(e) {
		e.preventDefault();
		$('#benim-rotam #locations a[href="' + $(this).parent().attr('href') + '"]').removeClass('picked');
		if (window.sessionStorage) {
			$data = JSON.parse(sessionStorage.getItem("benimrotam"));
			$index = -1;
			for ($i = 0; $i < $data.length; $i ++){
				if ($data[$i][0] == $(this).parent().attr('href')){
					$index = $i;
					break;
				}
			}
			$data.splice($index, 1);
			sessionStorage.setItem("benimrotam", JSON.stringify($data));
		}
		$(this).parent().remove();
		updateRoutePlanner();
	});
	
	$("#route-planner form.call-to-action input[name='title']").on('input', function(e){
		$name = $("#route-planner form.call-to-action input[name='name']").val();
		$title = $(this).val();
		if ($name.length && $title.length){
			$(this).parent().find('input[type="submit"]').addClass('active');
		}
		else{
			$(this).parent().find('input[type="submit"]').removeClass('active');
		}
	})
	
	$("#route-planner form.call-to-action input[name='name']").on('input', function(e){
		$name = $(this).val();
		$title = $("#route-planner form.call-to-action input[name='title']").val();
		if ($name.length && $title.length){
			$(this).parent().find('input[type="submit"]').addClass('active');
		}
		else{
			$(this).parent().find('input[type="submit"]').removeClass('active');
		}
	})
	
	$('#route-planner form.call-to-action').on("submit", function(e){
		e.preventDefault();
		$name = $(this).find("input[name='name']").val();
		$title = $(this).find("input[name='title']").val();
		if (!$name){
			$(this).find('.response').addClass('display').html("Lütfen adınızı yazın.");
		}
		else{
			if (!$title){
				$(this).find('.response').addClass('display').html("Lütfen rotanıza bir isim verin.");
			}
			else{
				$(this).find('.response').addClass('display').html("Rotanız kaydediliyor...");
			
				$locations = [];
				if (window.sessionStorage) {
					$data = JSON.parse(sessionStorage.getItem("benimrotam"));
					for ($i = 0; $i < $data.length; $i ++){
						$locations.push($data[$i][4]);
					}
				}
				var data = {name: $name, title: $title, locations: $locations};
				$.ajax({
					type: "POST",
					url: "/benim-rotam/yayinla",
					data: data,
					success: function (response) {
						response = JSON.parse(response);
						//console.log(response);
						if (response['message'] == 'success'){
							$('#route-planner form.call-to-action .response').html('Rotanıza yönlendiriliyorsunuz...');
							if (window.sessionStorage) {
								sessionStorage.setItem("benimrotam", JSON.stringify([]));
							}
							window.location.replace("/benim-rotam/" + response['slug']);
						}
						else{
							$('#route-planner form.call-to-action .response').html(response['message']);
						}
					}
				});
			}
		}
	})
	
	/* LOCATION PHOTO SWIPER */
	var locationPhotos = new Swiper('.location-photos.swiper-container', {
		speed: 400,
		spaceBetween: 0,
		keyboard:true,
		loop:true,
		navigation: {
			nextEl: '.swiper-button-next'
		},
		pagination: false,
		autoplay: {
			delay: 5000,
		}
	});
	
	
	/* MAP PAN ZOOM */
	
	function scaleMapPanZoom(){
		if ($('#map.panzoom').length){	
			$transform = instance.getTransform();
			$scale = $transform.scale;
			$('#map svg polygon.bordered').attr('stroke-width', 10 / $scale);
			$('#map svg path.bordered').attr('stroke-width', 10 / $scale);
			$('#locations a').css('transform', "scale(" + (1 / ($('#map-scaler').attr('scale') * $scale)) + ")");
			//console.log(1 / $scale);
		}
	}
	
	if ($('#map.panzoom').length){
		
		
		
		var instance = panzoom($('#map.panzoom')[0], {
			maxZoom: 16,
			minZoom: 1,
			bounds: false,
			boundsPadding: 0.1,
			zoomDoubleClickSpeed: 2,
			filterKey: function(/* e, dx, dy, dz */) {
				// don't let panzoom handle this event:
				return true;
			}
		});

		instance.on('zoom', function(e) {
			scaleMapPanZoom();
		});
		
		
		
		$('#map-interactions a.zoom-in').click(function(e){
			e.preventDefault();
			$transform = instance.getTransform();
			$scale = $transform.scale;
			instance.smoothZoom(500, 200, 2);
		})
		
		$('#map-interactions a.zoom-out').click(function(e){
			e.preventDefault();
			$transform = instance.getTransform();
			$scale = $transform.scale;
			instance.smoothZoom(500, 200, 0.5);
		})
	}
	
	if ($('.routes').length){
		var macy = Macy({
			container: '.routes',
			trueOrder: false,
			waitForImages: false,
			margin: 32,
			columns: 4,
			breakAt: {
				1360: 3,
				1180: {
					margin: 16,
					columns: 3
				},
				960: 2,
				520: 1
			}
		});
	}
	
	
	/* MAP SCALER */
	function scaleMap(){
		$nw = 1312;
		$nh = 541;
		
		$nw = 1372;
		$nh = 536;
		
		$w = $(window).width() - 64;
		$h = $(window).height() - 300;
		
		$scaler = 1;
		
		if ($(window).width() < 660){
			$nw = 650;
			$nh = 1200;
			$scaler = $w / $nw;
			$('#home #map').css('margin-left', 0);
			$('#benim-rotam #map').css('margin-left', 0);
			$('#rota #map').css('margin-left', 0);
			
			$('#home #map').css('margin-top', 0);
			$('#benim-rotam #map').css('margin-top', 0);
			$('#rota #map').css('margin-top', 0);
		}
		else{
			if (($nw / $nh) > ($w / $h)){
				$scaler = $w / $nw;
				$('#home #map').css('margin-left', 40);
				$('#benim-rotam #map').css('margin-left', 40);
				$('#rota #map').css('margin-left', 40);
			
				$('#home #map').css('margin-top', $(window).height() * 0.7 + 50);
				$('#benim-rotam #map').css('margin-top', $(window).height() * 0.7 + 50);
				$('#rota #map').css('margin-top', $(window).height() * 0.7 + 50);
			}
			else{
				$scaler = $h / $nh;
				$('#home #map').css('margin-left', ($(window).width() - $nw * $scaler) / 2);
				$('#benim-rotam #map').css('margin-left', ($(window).width() - $nw * $scaler) / 2);
				$('#rota #map').css('margin-left', ($(window).width() - $nw * $scaler) / 2);
			
				$('#home #map').css('margin-top', $(window).height() * 0.7 + 50);
				$('#benim-rotam #map').css('margin-top', $(window).height() * 0.7 + 50);
				$('#rota #map').css('margin-top', $(window).height() * 0.7 + 50);
			}
		}
			
		$('#home #locations a').css('transform', "scale(" + (1 / $scaler) + ")");
		$('#benim-rotam #locations a').css('transform', "scale(" + (1 / $scaler) + ")");
		$('#rota #locations a').css('transform', "scale(" + (1 / $scaler) + ")");
		
		$('#home #map-scaler').attr('scale', $scaler);
		$('#benim-rotam #map-scaler').attr('scale', $scaler);
		$('#rota #map-scaler').attr('scale', $scaler);
		
		$('#home #map-scaler').css('transform', "scale(" + $scaler + ")");
		$('#benim-rotam #map-scaler').css('transform', "scale(" + $scaler + ")");
		$('#rota #map-scaler').css('transform', "scale(" + $scaler + ")");
	
		if ($(window).width() < 1130){
			if ($(window).width() < 660){
				$scaler = $w / 1372;
			}
			$('#mekan #locations a').css('transform', "scale(" + (1 / $scaler) + ")");
			$('#mekan #map-scaler').css('transform', "scale(" + $scaler + ")");
			$('#kisi-ve-olay #locations a').css('transform', "scale(" + (1 / $scaler) + ")");
			$('#kisi-ve-olay #map-scaler').css('transform', "scale(" + $scaler + ")");
		}
		
		$('#map-inner').addClass('show'); 
		
		scaleMapPanZoom();
	}
	
	/* WINDOW RESIZE EVENT LISTENER */
	function windowResized(){
		scaleMap();
	}
	
	windowResized();
	setTimeout(windowResized, 500);
	setTimeout(windowResized, 1000);
	$(window).resize(function(){
		windowResized();
	});
	window.dispatchEvent(new Event("resize"));
	setTimeout(function(){window.dispatchEvent(new Event("resize"));}, 500);
	
});
}

/*
     FILE ARCHIVED ON 17:23:30 Jun 01, 2023 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:09:29 Mar 18, 2026.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.643
  exclusion.robots: 0.049
  exclusion.robots.policy: 0.038
  esindex: 0.009
  cdx.remote: 30.434
  LoadShardBlock: 140.326 (3)
  PetaboxLoader3.datanode: 114.493 (4)
  PetaboxLoader3.resolve: 384.685 (2)
  load_resource: 395.056
*/