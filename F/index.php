<!DOCTYPE HTML>
<html>
	<head>
		<meta name="copyright" content="chipatlas, llc.">
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta property="og:title" content="fill in the trip!" />
		<meta property="og:url" content="http://www.fillinthetrip.com" />
		<meta property="og:description" content="What do you want to do? Who do you want to go with? Click the blanks, choose an option, and find out where you should go!" />
		<meta property="og:image" content="http://www.fillinthetrip.com/share-photo.jpg" />
		<meta property="og:image:height" content="630" />
		<meta property="og:image:width" content="1200" />		
		<meta property="og:type" content="website" />
		<meta property="fb:app_id" content="501732299939026" />
		<title>fill in the trip!</title>
		<!--[if lt IE 9]>
			<script>
			  document.createElement('section');
			  document.createElement('article');
			  document.createElement('footer');
		   </script>
		<![endif]-->
		<link rel="stylesheet" media="(max-width:767px)" href="mobile-styles.css" />
		<link rel="stylesheet" media="(min-width:768px)"href="styles.css" />
		<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
		<script>
			function formFilled(){
				var count = new Array();
				$(".adlib").each(function(){
					if(!$(this).hasClass("empty")){
						count.push($(this).text());
					} else {
						return false;
					}
				});
				if(count.length == 4){
					$("#submit").show();
				}
			}
			
			function formSubmit(){
				var count = new Array();
				$(".adlib").unbind("click").addClass("done");
				$("#submit").hide();
				$(".adlib").each(function(){
					count.push($(this).text());
				});
				$.ajax({
					url: 'results.php',
					data: {data: count},
					type: 'POST',
					success: function(data) {
						data = $.parseJSON(data);
						if(data.image[0].owner_name != "fill_in_the_trip"){
							$("#attribution").html("<span class='attribution-text'><a href='"+data.image[0].photo_url+"' target='_blank'><img src='http://www.panoramio.com/img/acrylic/header-panoramio.png' alt='Panoramio Logo' title='Panoramio'></a><br/>Image Author: <a href='"+data.image[0].owner_url+"' target='_blank'>"+data.image[0].owner_name+"</a><br/>Photos provided by Panoramio are under the copyright of their owners</span>");
						}
						$("#result-name").text(data.name);
						if($.type( data.image ) != "string"){
							$("#container").css({"background": "url("+data.image[0].photo_file_url+")", "background-size": "cover", "background-position": "center center"});
						}
						var message = "I want to go somewhere "+$("#somewhere").text()+" for "+$("#for").text()+" to experience "+$("#experience").text()+" with "+$("#with").text()+". Where do you want to go?";
						var twitterMessage = "I'm going somewhere #"+$("#somewhere").text().replace(/ /g,'')+" for #"+$("#for").text().replace(/ /g,'')+" to experience #"+$("#experience").text().replace(/ /g,'')+" with #"+$("#with").text().replace(/ /g,'')+". @fillinthetrip";
						$("#tweet").attr("href", "https://twitter.com/intent/tweet?text="+encodeURIComponent(twitterMessage));
						$("#fb").on("click", function(){
							FB.ui({
								method: 'feed',
								name: (message),
								caption: 'fillinthetrip.com',
								description: 'One sentence, endless _____.',
								link: 'http://www.fillinthetrip.com'
							});
							return false;
						});
						if(data.hotel != "nowhere"){
							$("#result-affiliate").html("<a href='"+data.hotel+"' target='_blank' class='secondary-link'>Why not start planning your trip?</a>");
						}
						$("#result-learn").html("<a href='"+data.learn+"' target='_blank' class='secondary-link'>Learn more about "+data.name+"</a>");
						$("#message, #sentence, #adlib").addClass("is-hidden");
						$("#result").removeClass("is-hidden");
						$("#result").fadeIn();
					}
				});
				return false;
			}
			$(document).ready(function(){
				$(".refresh").click(function(){
					location.reload();
				});
				$("#submit").click(formSubmit);
				$(".adlib").click(function(){
					$(".adlib").removeClass("selected");
					$(this).addClass("selected");
					$(".choices").removeClass("choices-selected");
					$("#choices-"+$(this).attr("id")).addClass("choices-selected");
				});
				$(".choice").mouseout(function(){
					$(".selected").text("").addClass("empty");
				});
				$(".choice").mouseover(function(){
					$(".selected").text($(this).text()).removeClass("empty");
				});
				$(".choice").click(function(){
					$(".selected").text($(this).text()).removeClass("selected");
					$(".choices").removeClass("choices-selected");
					formFilled();
				});
				$("body").on("click touchend", function(e){
					if(e.target == $('#container')[0]){
						if(!$("#result").hasClass("is-hidden")){
							$("#destination").fadeToggle();
							$("#like").toggleClass("is-hidden");
							return false;
						}
					}else if(e.target == $('#right .content')[0] || e.target == $('#adlib')[0]){
						if (!$("#result").hasClass("is-hidden")){
							$("#destination").fadeToggle();
							$("#like").toggleClass("is-hidden");
							return false;
						}
					}
				});
			});
		</script>
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		  ga('create', 'UA-44377149-2', 'fillinthetrip.com');
		  ga('send', 'pageview');
		</script>
	</head>
	<body>
		<div id="fb-root"></div>
		<script>
		  window.fbAsyncInit = function() {
			FB.init({
			  appId      : '501732299939026',
			  status     : true,
			  xfbml      : true
			});
		  };
		  (function(d, s, id){
			 var js, fjs = d.getElementsByTagName(s)[0];
			 if (d.getElementById(id)) {return;}
			 js = d.createElement(s); js.id = id;
			 js.src = "//connect.facebook.net/en_US/all.js";
			 fjs.parentNode.insertBefore(js, fjs);
		   }(document, 'script', 'facebook-jssdk'));
		</script>
		<div id="container">
			<section id="left">
				<div class="content">
					<article id="blurb">
						<h1 id="title"><img src="fitt_logo_web.png" alt="Fill in the Trip"></h1>
						<span id="message">What do you want to do? Who do you want to go with? Click the blanks, choose an option, and find out where you should go!</span>
						<div id="like" class="is-inline-block">
							<div class="fb-like" data-href="http://www.facebook.com/fillinthetrip" data-width="100" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>
						</div>
					</article>
					<div id="adlib">
						<div id="left-adlib">
							<div id="sentence">
								I want to go somewhere <span id="somewhere" class="adlib empty"></span> for <span id="for" class="adlib empty"></span> where I can experience <span id="experience" class="adlib empty"></span> with <span id="with" class="adlib empty"></span>.<br/>
							</div>
							<div id="buttons">
								<a href="/" class="refresh secondary-link">start over</a>
								<a href="#" id="submit" class="button">go!</a>
							</div>
							<div id="large-adspace" class="is-hidden">
							</div>
						</div>
						<?php
						$somewhere = array();
						$for = array();
						$experience = array();
						$with = array();
						$choiceXML=simplexml_load_file("dataChoices.xml");
						foreach($choiceXML->choice as $choice){
							switch($choice->type){
								case "somewhere":
									$somewhere[] = "<li class='choice'>".$choice->ID."</li>";
									break;
								case "for":
									$for[] = "<li class='choice'>".$choice->ID."</li>";
									break;
								case "experience":
									$experience[] = "<li class='choice'>".$choice->ID."</li>";
									break;
								case "with":
									$with[] = "<li class='choice'>".$choice->ID."</li>";
									break;
							}
						}?>
						<span id="choices-somewhere" class="choices">
							<h2>somewhere...</h2>
							<ul>
								<?php array_walk($somewhere, create_function('$a', 'echo $a;')); ?>
							</ul>
						</span>
						<span id="choices-for" class="choices">
							<h2>for...</h2>
							<ul>
								<?php array_walk($for, create_function('$a', 'echo $a;')); ?>
							</ul>
						</span>
						<span id="choices-experience" class="choices">
							<h2>to experience...</h2>
							<ul>
								<?php array_walk($experience, create_function('$a', 'echo $a;')); ?>
							</ul>
						</span>
						<span id="choices-with" class="choices">
							<h2>with...</h2>
							<ul>
								<?php array_walk($with, create_function('$a', 'echo $a;')); ?>
							</ul>
						</span>
					</div>
				</div>
			</section>
			<section id="right">
				<div class="content">
					<article id="result" class="is-hidden">
						<div id="destination">
							<h2>You should go to: <span id="result-name"></span></h2>
							<span id="share">
								<a href="https://www.facebook.com/sharer/sharer.php?u=http://www.fillinthetrip.com" target="_blank" id="fb"><img src="facebook.png" alt="share on facebook"></a>
								<a href="https://twitter.com/intent/tweet" target="_blank" id="tweet"><img src="twitter.png" alt="share on twitter"></a>
							</span>
							<span id="result-learn"></span>
							<span id="result-affiliate"></span>
							<span id="mobile-refresh" class="is-mobile-only">
								<a href="/" class="refresh secondary-link">start over</a>
							</span>
						</div>
						<div id="attribution"></div>
					</article>
				</div>
			</section>
		</div>
		<div id="mobile-adspace" class="is-mobile-only"></div>
	</body>
</html>