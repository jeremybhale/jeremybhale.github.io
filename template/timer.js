;  (function ($) {
  'use strict';
  
  var cT = 3024000;
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
