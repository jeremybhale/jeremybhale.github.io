//https://www.w3.org/WAI/tutorials/carousels/full-code/

var alumniCarousel = (function() {
	"use strict";

	var carousel, slides, index, slidenav, settings, timer, setFocus;

	function init(set) {
		settings = set;
		
		carousel = document.getElementById(settings.id);
		slides = carousel.querySelectorAll('li');
		
		var ctrls = document.createElement('ul');

		ctrls.className = 'controls';
		ctrls.innerHTML = '<li>' +
			'<button type="button" class="btn-prev" title="Previous Item"></button>' +
		  '</li>' +
		  '<li>' +
			'<button type="button" class="btn-next" title="Next Item"></button>' +
		  '</li>';

		ctrls.querySelector('.btn-prev')
			.addEventListener('click', function () {
				clearInterval(timer);
				prevSlide(true, index-1);
			});
		ctrls.querySelector('.btn-next')
			.addEventListener('click', function () {
				clearInterval(timer);
				nextSlide(true, index+1);
			});

		carousel.appendChild(ctrls);
		
		if (settings.slidenav || settings.animate) {
			slidenav = document.createElement('ul');

			slidenav.className = 'slidenav';
			
			if (settings.slidenav) {
				for(var i = 0; i < slides.length; i++) {
					var li = document.createElement('li');
					var klass = (i===0) ? 'class="active" ' : '';
					var kurrent = (i===0) ? ' <span class="visuallyhidden">(Current Item)</span>' : '';
					var name = slides[i].getElementsByClassName('featured-name')[0].textContent;

					li.innerHTML = '<button '+ klass +'data-slide="' + i + '"><span class="visuallyhidden">' + name + '</span> ' + kurrent + '</button>';
					slidenav.appendChild(li);
				}
			}

			slidenav.addEventListener('click', function(event) {
				var button = event.target;
				if (button.localName == 'button') {
					var slide = button.getAttribute('data-slide');
					if (slide) {
						clearInterval(timer);
						if(slide > index)
							nextSlide(true, slide);
						else if(slide < index)
							prevSlide(true, slide);
					}
				}
			}, true);

			carousel.className = 'js';
			carousel.appendChild(slidenav);
		}
		
		var liveregion = document.createElement('div');
		liveregion.setAttribute('aria-live', 'polite');
		liveregion.setAttribute('aria-atomic', 'true');
		liveregion.setAttribute('class', 'liveregion visuallyhidden');
		carousel.appendChild(liveregion);
		
		slides[0].parentNode.addEventListener('transitionend', function (event) {
			var slide = event.target;
			for (var i = slides.length - 1; i >= 0; i--) {
				slides[i].classList.remove('in-transition');
			}
			if (slide.classList.contains('active'))  {
				if(setFocus) {
					slide.focus();
					setFocus = false;
				}
			}
		});
		
		index = 0;
		setSlides(index);
		
		timer = setInterval(function(){ nextSlide(false, index+1); }, 5000);
	}
	
	function setSlides(new_current, setFocusHere, transition, announceItemHere) {
		setFocus = typeof setFocusHere !== 'undefined' ? setFocusHere : false;
		transition = typeof transition !== 'undefined' ? transition : 'none';
		
		var announceItem = typeof announceItemHere !== 'undefined' ? announceItemHere : false;
		
		new_current = parseFloat(new_current);

		var length = slides.length;
		var new_next = new_current+1;
		var new_prev = new_current-1;
		
		if(new_next === length) {
			new_next = 0;
		} else if(new_prev < 0) {
			new_prev = length-1;
		}
		
		for (var i = slides.length - 1; i >= 0; i--) {
			slides[i].className = "";
		}
		
		slides[index].className = 'in-transition';
		
		slides[new_next].classList.add('next');
		slides[new_next].setAttribute('aria-hidden', 'true');

		slides[new_prev].classList.add('prev');
		slides[new_prev].setAttribute('aria-hidden', 'true');

		slides[new_current].classList.add('active');
		slides[new_current].removeAttribute('aria-hidden');
		
		if (announceItem) {
			carousel.querySelector('.liveregion').textContent = 'Item ' + (new_current + 1) + ' of ' + slides.length;
		}
		
		if(settings.slidenav) {
			var buttons = carousel.querySelectorAll('.slidenav button[data-slide]');
			for (var j = buttons.length - 1; j >= 0; j--) {
				var name = slides[j].getElementsByClassName('featured-name')[0].textContent;
				buttons[j].className = '';
				buttons[j].innerHTML = '<span class="visuallyhidden">' + name + '</span>';
			}
			buttons[new_current].className = "active";
			buttons[new_current].innerHTML = '<span class="visuallyhidden">' + slides[new_current].getElementsByClassName('featured-name')[0].textContent + '</span> ' + ' <span class="visuallyhidden">(Current Item)</span>';
		}		

		index = new_current;
	}
	
	function nextSlide(announceItem, slide) {
		announceItem = typeof announceItem !== 'undefined' ? announceItem : false;
		
		var length = slides.length,
		new_current = slide;

		if(new_current === length) {
			new_current = 0;
		}

		setSlides(new_current, false, 'prev', announceItem);
	}

	function prevSlide(announceItem, slide) {
		announceItem = typeof announceItem !== 'undefined' ? announceItem : false;

		var length = slides.length,
		new_current = slide;

		if(new_current < 0) {
			new_current = length-1;
		}
		
		setSlides(new_current, false, 'next', announceItem);
	}
	
	return {
		init:init,
		next:nextSlide,
		prev:prevSlide
	};
});

var carousel = new alumniCarousel();
carousel.init({
  id: 'featuredAlumni',
  slidenav: true
});