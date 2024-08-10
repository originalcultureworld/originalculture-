(function ($) {
	'use strict';

	var ScorePublicInit = {
		
		init: function () {
			this.imgToSVG();
		},
		
		imgToSVG: function(){
			$('img.fn__svg').each(function(){
				var img 		= $(this);
				var imgClass	= img.attr('class');
				var imgURL		= img.attr('src');

				$.get(imgURL, function(data) {
					var svg 	= $(data).find('svg');
					if(typeof imgClass !== 'undefined') {
						svg 	= svg.attr('class', imgClass+' replaced-svg');
					}
					img.replaceWith(svg);

				}, 'xml');

			});	
		},
	};
	
	// ready functions
	$(document).ready(function(){
		ScorePublicInit.init();
	});

})(jQuery);