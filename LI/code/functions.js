var origin;

function mainNavigation(main, toDo){

  if (document.body.className != main) {
    document.body.className = main;
    if (main != "locus") document.getElementById("locus").className = "hiddenNone";
    if (main != "media") document.getElementById("media").className = "hiddenNone";
    if (main != "exhibits") document.getElementById("exhibits").className = "hiddenNone";
    if (main != "social") document.getElementById("social").className = "hiddenNone";
    if (main != "account") document.getElementById("account").className = "hiddenNone";
	
	if ((document.getElementById("big_box").className == "hidden") && (toDo > 0)) {
		
		speed = 0;
	
		if (main == "locus") selectItem(0, 0);
		if (main == "media") selectItem(1, 0);
		if (main == "exhibits") selectItem(2, 0);
		if (main == "social") selectItem(3, 0);
		if (main == "account") selectItem(4, 0);
	
	}
	
    document.getElementById(main).className = "shown";
  }

}

function openBigBox(topic) {
	
  if (document.getElementById("tlHeadline").innerHTML == topic.slice(0, -1)) {
    document.getElementById("tl").className = "hidden";
  }
  if (document.getElementById("blHeadline").innerHTML == topic.slice(0, -1)) {
    document.getElementById("bl").className = "hidden";
  }
  if (document.getElementById("trHeadline").innerHTML == topic.slice(0, -1)) {
    document.getElementById("tr").className = "hidden";
  }
  if (document.getElementById("brHeadline").innerHTML == topic.slice(0, -1)) {
    document.getElementById("br").className = "hidden";
  }
  
  speed = 0;
  pauseOrbit(topic.charAt(topic.length-1));
  document.getElementById("orbitBox").style.zIndex = "1";
    
  document.getElementById("big_box").className = topic;
  document.getElementById("big_boxHeadline").innerHTML = topic.slice(0, -1);
  document.getElementById("big_boxContent").innerHTML = "Content";

  //fill with content from topic//

}

function closeBox(originA) {

  document.getElementById(originA).className = "hidden";
  
  if (originA == "big_box") {
	  document.getElementById("orbitBox").style.zIndex = "2";
	  stopOrbit();
  }
  
}

function restoreBox(topic, originA) {
	
  if (topic == "0") { 
    topic = document.getElementById("big_box").className; 
    origin = originA;

    if (document.getElementById("tl").className == "hidden") originA = "tl";
    else if (document.getElementById("bl").className == "hidden") originA = "bl";
    else if (document.getElementById("tr").className == "hidden") originA = "tr";
    else originA = "br";
  }
  
  if (originA == "big_box") {
	  speed = 0;
	  pauseOrbit(topic.charAt(topic.length-1));
  } 

  var Headline = originA + "Headline";
  var Content = originA + "Content";

  document.getElementById(originA).className = topic;

  document.getElementById(Headline).innerHTML = document.getElementById(origin+"Headline").innerHTML;
  document.getElementById(Content).innerHTML = document.getElementById(origin+"Content").innerHTML;

  closeBox(origin);

}

function moveBox(originA) {

  document.body.style.cursor = "move";
  
  document.getElementById("faketl").className = "fakeBoxShow";
  document.getElementById("fakebl").className = "fakeBoxShow";
  document.getElementById("faketr").className = "fakeBoxShow";
  document.getElementById("fakebr").className = "fakeBoxShow";

  origin = originA;

}

function colorChange(originA, inOut) {

  originA = "fake" + originA;

  if (inOut == 0) {
    document.getElementById(originA).style.backgroundColor = "#0099ff";
  }
  if (inOut == 1) {
    document.getElementById(originA).style.backgroundColor = "#66ccff";
  }

}

function takeSlot(destination, originA) {

	if (originA != "0") { origin = originA; }
	
	if (destination != origin) {

 	  restoreBox(document.getElementById(origin).className, destination);

	  if (destination == "big_box") { 
		document.getElementById("orbitBox").style.zIndex = "1"; 
	  }
	
	}
	
	document.getElementById("faketl").className = "hiddenNone";
	document.getElementById("fakebl").className = "hiddenNone";
	document.getElementById("faketr").className = "hiddenNone";
	document.getElementById("fakebr").className = "hiddenNone";
	
	document.body.style.cursor = "default";

}

	var orbArr=new Array();

	var angle = 0;
	var radX = 60; 
	var radY = 230; 
	var centerX = 220; 
	var centerY = -80; 
	var orbitSpeed = .025;
	var x = 0;
	var y = 0;
	
	var speed = -.3;
	var direction = -1;
	var expo = 0;
	var focusing = 0;
	var selecting = 0;

	var t;

	globalDiv = document.getElementById("orbiter").getElementsByTagName("img");

	for (i=0; i<5; i++){
		orbArr[i] = globalDiv[i].style;
	}

function init()
{
	document.getElementById("loadingScreen").style.display = "none";
	document.getElementById("everything").style.display = "block";
	document.getElementById("orbitBox").style.display = "block";

	rotate();

	for (i=0; i<5; i++){
		orbArr[i].visibility = "visible";
	}

	t=setInterval(function(){goFast()}, 30);
}

function rotate()
{
	angle += orbitSpeed;

	for (i=0; i<5; i++){
		rotationMath(angle-i*1.25,i);
	}

}

function rotationMath(angleP, orb)
{
	x = centerX+Math.cos(angleP)*radX; 
	y = centerY+Math.sin(angleP)*radY;

	x1 = Math.round(x * Math.cos(-45) + y*Math.sin(-44.7));
	y1 = Math.round(-x * Math.sin(-44.7) + y*Math.cos(-45));

	orbArr[orb].right = x1+"px";
	orbArr[orb].top = y1+"px";

	if (Math.round(x) < 220 && Math.round(y) < 130) { orbArr[orb].zIndex="-1"; }
	else { orbArr[orb].zIndex="3";}
}

function pauseOrbit(toDo)
{
	clearInterval(t);
	if (toDo > -1) selectItem(toDo, 1);
}

function stopOrbit()
{
	clearInterval(t);
	t=setTimeout(function(){ infoKiller() }, 2000);
}

function infoMaker()
{
		if (speed>=-.025 && speed<=.025) 
		{
			clearInterval(t);
			speed=0;
			t=setTimeout(function(){ infoKiller() }, 1000);
		}
}

function infoKiller()
{
	expo=0;
	speed=0;
	if (focusing == 1) focusing = 0;
	t=setInterval(function(){goSlow()}, 30);
}

function resumeOrbit()
{
	clearInterval(t);
	speed=.025*direction;

	t=setInterval(function(){ rotate() }, 30);
}

function goSlow()
{
	if (direction < 0) {
		angle -= speed;

		for (i=0; i<5; i++){
			rotationMath(angle-i*1.25,i);
		}

		speed -= expo;
		if (speed<-.025) speed = -.025;
	}
	else if (direction > 0) {
		angle -= speed;

		for (i=0; i<5; i++){
			rotationMath(angle-i*1.25,i);
		}

		speed += expo;
		if (speed>.025) speed = .025;
	}

	if (speed == .025 || speed == -.025) { 
		if (direction > 0){ speed=Math.round(speed*1000)/1000; orbitSpeed=-.025; resumeOrbit(); }
		else { speed=Math.round(speed*1000)/1000; orbitSpeed=.025; resumeOrbit(); }
	}
	else { expo = expo + .00005; }
}

function goFast()
{
	if (speed > .3) speed = .3;
	if (speed <-.3) speed = -.3;

	if (speed<-.025) {
		for (i=0; i<5; i++){
			rotationMath(angle-i*1.25,i);
		}

		speed += .005;
		angle -= speed;
	}
	else if (speed>.025) {
		for (i=0; i<5; i++){
			rotationMath(angle-i*1.25,i);
		}

		speed -= .005;
		angle -= speed;
	}
	else { 
		if (direction > 0){ orbitSpeed=-.025;resumeOrbit();}
		else { orbitSpeed=.025;resumeOrbit();}
	}

}

function selectItem(catNumber, doStop)
{
	position = parseInt(orbArr[catNumber].right);
	
	if (catNumber == 0) mainNavigation('locus', 0);
	if (catNumber == 1) mainNavigation('media', 0);
	if (catNumber == 2) mainNavigation('exhibits', 0);
	if (catNumber == 3) mainNavigation('social', 0);
	if (catNumber == 4) mainNavigation('account', 0);

	if (speed == 0 && position<162) {
		clearInterval(t);
		focusing = 1;
		speed = .1;
		direction = 1;
		t=setInterval(function(){ setOrbFocus(catNumber, doStop) }, 30);
	}
	else if (speed == 0 && position>164) { 
		clearInterval(t);
		focusing = 1;
		speed = .1;
		direction = -1;
		t=setInterval(function(){ setOrbFocus(catNumber, doStop) }, 30);
	}
	else if (speed==0 && position==163) { 
		clearInterval(t);
		selecting = 1;
		if (doStop > 0) pauseOrbit(-1);
		else stopOrbit();
	}
}

function setOrbFocus(catNumber, doStop)
{
	angleP=angle-catNumber*1.25;
	position = Math.round((centerX+Math.cos(angleP)*radX) * Math.cos(-45) + (centerY+Math.sin(angleP)*radY)*Math.sin(-44.7));

	if (position==163) {
		speed=0;	  
		if (doStop > 0) pauseOrbit(-1);
		else stopOrbit();
	}

	if ((direction==1 && position>163) || (direction==-1 && position<163)) {
		while(position != 163){
			if ((direction==1 && position<163) || (direction==-1 && position>163)) angleP -= .004*direction;
			else angleP += .004*direction;
			position = Math.round((centerX+Math.cos(angleP)*radX) * Math.cos(-45) + (centerY+Math.sin(angleP)*radY)*Math.sin(-44.7));
		}

		angle = angleP+catNumber*1.25;

		for (i=0; i<5; i++) {
			rotationMath(angle-i*1.25,i);
		}
	}
	else {
		for (i=0; i<5; i++) {
			rotationMath(angle-i*1.25,i);
		}

		angle -= speed*direction;
	}
}

if  (document.getElementById)
{ 
	(function(){

	//Stop Opera selecting anything whilst dragging.
	if (window.opera){
		document.write("<input type='hidden' id='Q' value=' '>");
	}

	var dragok = false;
	var xmouse,moveNum;

	function move(e){
		if (!e) e = window.event;
		clearInterval(t);
		if (dragok){
			speed = (xmouse-e.clientX)/50;
			if (speed!=0 && speed>0) direction=1;
			else if (speed!=0 && speed<0) direction=-1;

			angle-=speed;

			for (i=0; i<5; i++){
				rotationMath(angle-i*1.25,i);
			}

			xmouse=e.clientX;

	  		return false;
 		}
	}

	function down(e){
		if (!e) e = window.event;
		var temp = (typeof e.target != "undefined")?e.target:e.srcElement;
		if (temp.tagName != "HTML"|"BODY" && temp.className != "dragclass"){
 			temp = (typeof temp.parentNode !="undefined")?temp.parentNode:temp.parentElement;
		}
		if (temp.className == "dragclass"){

			if (window.opera){
  				document.getElementById("Q").focus();
 			}
 			dragok = true;
 			xmouse = e.clientX;
 			document.onmousemove = move;

 			return false;
 		}
	}
	
	function up(){
		if (dragok == true){
			dragok = false;
			document.onmousemove = null;
			clearInterval(t);
			if (speed>=-.025 && speed<=.025) {
				speed=0;
				t=setTimeout(function(){ resumeOrbit() }, 2000);
			}
			else { 
				focusing = 0;
				t=setInterval(function(){goFast()}, 30); 
			}
		}
	}

	document.onmousedown = down;
	document.onmouseup = up;

	})();
}