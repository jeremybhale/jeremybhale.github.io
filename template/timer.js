;  (function ($) {
  'use strict';
  
  var t1 = new Date();
  var t2 = new Date("August 25, 2016 16:00:00");
  var dif = t1.getTime() - t2.getTime();

  var Seconds_from_T1_to_T2 = dif / 1000;
  var cT = Math.abs(Seconds_from_T1_to_T2);

  setInterval(function(){ 
		cT--;
		var d = ("0" + ~~(cT / 86400)).slice(-2);
		var s = cT - (86400 * d);
		var h = ("0" + ~~(s / 3600)).slice(-2);
		s = s - (3600 * h);
		var m = ("0" + ~~(s / 60)).slice(-2);
		s = ("0" + ~~(s - (60 * m))).slice(-2);
		
		$('#timer').html('<span class="s s' + d.charAt(0) + '"></span>' +
		'<span class="s s' + d.charAt(1) + '"></span>'+
		'<span class="s sC"></span>'+
		'<span class="s s' + h.charAt(0) + '"></span>'+
		'<span class="s s' + h.charAt(1) + '"></span>'+
		'<span class="s sC"></span>'+
		'<span class="s s' + m.charAt(0) + '"></span>'+
		'<span class="s s' + m.charAt(1) + '"></span>'+
		'<span class="s sC"></span>'+
		'<span class="s s' + s.charAt(0) + '"></span>'+
		'<span class="s s' + s.charAt(1) + '"></span>');
  }, 1000);
  
})(jQuery);
