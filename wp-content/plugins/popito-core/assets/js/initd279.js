(function($, fnFrontend){
	"use strict";
	
	
	
	var FrenifyPopito = {
		
		isAdmin: false,
		adminBarH: 0,
		
		ajaxClicksForAjaxGridPosts: 0,
		
		init: function() {
			
			if($('body').hasClass('admin-bar')){
				FrenifyPopito.isAdmin 		= true;
				FrenifyPopito.adminBarH 	= $('#wpadminbar').height();
			}

			var widgets = {
				'frel-categories.default' : FrenifyPopito.categoriesFunction,
				'frel-posts.default' : FrenifyPopito.postsFunction,
				'frel-latest-posts-by-category.default' : FrenifyPopito.postsTripleFunction,
				'frel-top-posts-by-category.default' : FrenifyPopito.postsTripleFunction,
				'frel-podcasts.default' : FrenifyPopito.podcastsFunction,
				'frel-hosts.default' : FrenifyPopito.hostsFunction,
				'frel-sponsors.default' : FrenifyPopito.sponsorsFunction,
			};

			$.each( widgets, function( widget, callback ) {
				fnFrontend.hooks.addAction( 'frontend/element_ready/' + widget, callback );
			});
		},
		
		postsTicker: function(){
			$(".TickerNews .marquee").each(function(){
				var e = $(this);
				if(!e.hasClass('ready')){
					e.addClass('ready').marquee({
						duplicated: true,
						duration: parseInt(e.data('speed'))*1000,
						delayBeforeStart: 0,
						direction: 'left',
						pauseOnHover: true,
						startVisible: true
					}).bind('finished', function () {
						FrenifyPopito.ImgToSVG();
					});
					FrenifyPopito.ImgToSVG();
				}
			});	
		},
		
		sponsorsFunction: function(){
			$('.fn_cs_sponsor.layout_carousel .swiper-container').each(function(){
				var element				= $(this);
				// Main Slider
				var mainSliderOptions 	= {
					loop: true,
					slidesPerView: 5,
					shortSwipes: false,
					speed: 1000,
					autoplay:{
						delay: 5000,
						disableOnInteraction: false,
					},
					navigation: {
						nextEl: element.closest('.fn_cs_sponsor').find('.next'),
						prevEl: element.closest('.fn_cs_sponsor').find('.prev'),
					},
					spaceBetween: 50,
					direction: 'horizontal',
					loopAdditionalSlides: 20,
					watchSlidesProgress: true,
					breakpoints:{
						768:{slidesPerView:1},
						1040:{slidesPerView:2},
						1200:{slidesPerView:3},
						1400:{slidesPerView:4},
						1600:{slidesPerView:5},
					}
				};
				new Swiper(element, mainSliderOptions);
			});
		},
		
		hostsFunction: function(){
			$('.fn_cs_hosts.layout_carousel .swiper-container').each(function(){
				var element				= $(this);
				// Main Slider
				var mainSliderOptions 	= {
					loop: true,
					slidesPerView: 3,
					speed: 1000,
					shortSwipes: false,
					autoplay:{
						delay: 5000,
						disableOnInteraction: false,
					},
					navigation: {
						nextEl: element.closest('.fn_cs_hosts').find('.next'),
						prevEl: element.closest('.fn_cs_hosts').find('.prev'),
					},
					spaceBetween: 50,
					direction: 'horizontal',
					loopAdditionalSlides: 20,
					watchSlidesProgress: true,
					breakpoints:{
						768:{slidesPerView:1},
						1040:{slidesPerView:2},
						1200:{slidesPerView:3},
					}
				};
				new Swiper(element, mainSliderOptions);
			});
			FrenifyPopito.BgImg();
			FrenifyPopito.ImgToSVG();
		},
		
		postsTripleFunction: function(){
			$('.fn__title_holder .cat_list_holder .active').off().on('click',function(){
				return false;
			});
			
			$('.fn__title_holder .cat_list li a').off().on('click',function(){
				var e = $(this),
					slug = e.data('id'),
					url = e.data('link'),
					layout = e.data('layout'),
					count = e.data('count'),
					parent = e.closest('.cat_list_holder'),
					wrapper = e.closest('.fn_cs_posts__ajax'),
					active = parent.find('.active');
				if(e.hasClass('selected')){
					return false;
				}
				if(!active.hasClass('loading')){
					active.addClass('loading');
					
					var requestData = {
						action: 'popito_fn_cs_ajax_get_last_posts_by_category',
						slug: slug,
						layout: layout,
						count: count,
						security: PopitoCoreAjaxObject.nonce,
					};


					$.ajax({
						type: 'POST',
						url: PopitoCoreAjaxObject.ajax_url,
						cache: false,
						data: requestData,
						success: function(data) {
							var fnQueriedObj 	= $.parseJSON(data);
							wrapper.find('.posts').html(fnQueriedObj.list);
							active.find('.text').text(e.find('.text').text());
							e.closest('.right_title').find('.see_all a').attr('href',url);
							e.parent().siblings().find('a').removeClass('selected');
							e.addClass('selected');
							active.removeClass('loading');
							FrenifyPopito.BgImg();
							FrenifyPopito.ImgToSVG();
						},
						error: function(xhr, textStatus, errorThrown){
							console.log(errorThrown);
							console.log(textStatus);
							console.log(xhr);
							active.removeClass('loading');
						}
					});
					
					
				}
				
				return false;
			});
		},
		
		postsFunction: function(){
			FrenifyPopito.postSlider();
			FrenifyPopito.postAjax();
			FrenifyPopito.fixedColAjax();
			FrenifyPopito.postCarousel();
			FrenifyPopito.parallaxClassicAjax();
			FrenifyPopito.parallaxEffect();
			FrenifyPopito.postsTicker();
		},
		
		
		postCarousel: function(){
			$('.fn_cs_post_carousel .owl-carousel').each(function(){
				var element				= $(this);
				element.owlCarousel({
					loop: true,
					margin: 50,
					nav: false,
					dots: false,
					autoWidth: false,
					items: 2,
					autoplay: true,
					autoplayHoverPause: true,
					autoplayTimeout: 7000,
					smartSpeed: 1500,
					slideTransition: 'linear',
					rtl: false,
					responsive : {
					// breakpoint from 0 up
					0 : {
						items : 1,
					},
					// breakpoint from 480 up
					1041 : {
						items : 2,
					},
				}
				});
				var nav = element.closest('.fn_cs_post_carousel').find('.slider__nav');
				nav.find('.next').off().click(function() {
					element.trigger('next.owl.carousel');
					return false;
				});
				// Go to the previous item
				nav.find('.prev').off().click(function() {
					// With optional speed parameter
					// Parameters has to be in square bracket '[]'
					element.trigger('prev.owl.carousel', [1500]);
					return false;
				});
			});
			$('.fn_cs_post_carousel .swiper-container').each(function(){
				var element				= $(this);
				// Main Slider
				var next = element.closest('.fn_cs_post_carousel').find('.next');
				var prev = element.closest('.fn_cs_post_carousel').find('.prev');
				var mainSliderOptions 	= {
					loop: true,
					slidesPerView: 2,
					shortSwipes: false,
					speed: 1000,
					autoplay:{
						delay: 5000,
						disableOnInteraction: false,
					},
					navigation: {
						nextEl: next,
						prevEl: prev,
					},
					spaceBetween: 50,
					direction: 'horizontal',
					loopAdditionalSlides: 20,
					watchSlidesProgress: true,
					breakpoints:{
						1040:{slidesPerView:1},
						1041:{slidesPerView:2},
					}
				};
				new Swiper(element, mainSliderOptions);
			});
		},
		
		
		podcastsFunction: function(){
			$('.fn_cs_podcast_listed.layout_carousel .swiper-container').each(function(){
				var element				= $(this);
				// Main Slider
				var mainSliderOptions 	= {
					loop: false,
					slidesPerView: 2,
					shortSwipes: false,
					speed: 1000,
					autoplay:{
						delay: 5000,
						disableOnInteraction: false,
					},
					navigation: {
						nextEl: element.closest('.fn_cs_podcast_listed').find('.next'),
						prevEl: element.closest('.fn_cs_podcast_listed').find('.prev'),
					},
					spaceBetween: 50,
					direction: 'horizontal',
					watchSlidesProgress: true,
					breakpoints:{
						1040:{slidesPerView:1},
						1041:{slidesPerView:2},
					}
				};
				new Swiper(element, mainSliderOptions);
				FrenifyPopito.ImgToSVG();
			});
		},
		
		fixedColAjax: function(){
			var ajax_more = $('.fn_cs_posts_fixed_col .popito_fn_pagination a');
			if(ajax_more.length){
				ajax_more.off().on('click',function(){
					var element = $(this);
					if(!element.hasClass('current')){
						var parent = element.closest('.fn_cs_posts_fixed_col');
						FrenifyPopito.fixedColPosts__function(parent,element.data('page'));
					}
					
					return false;
				});
			}	
		},
		
		fixedColPosts__function: function(parent,page){
			if(parent.hasClass('loading')){
				return false;
			}
			$('.fn_ajax__preloader').addClass('loading');
			parent.addClass('loading');
			
			$([document.documentElement, document.body]).animate({
				scrollTop: parent.offset().top - FrenifyPopito.adminBarH
			}, 1500);

			var requestData = {
				action: 'popito_fn_cs_ajax_fixed_col_posts',
				myarguments: PopitoArgumentsFixedCol,
				paged: page,
				security: PopitoCoreAjaxObject.nonce,
			};


			$.ajax({
				type: 'POST',
				url: PopitoCoreAjaxObject.ajax_url,
				cache: false,
				data: requestData,
				success: function(data) {
					var fnQueriedObj 	= $.parseJSON(data);
					parent.removeClass('loading');
					$('.fn_ajax__preloader').removeClass('loading');
					parent.html(fnQueriedObj.list);
					
					if(fnQueriedObj.disabled === 'disabled'){
						parent.find('.fn_ajax_more').slideUp(500);
					}else{
						parent.find('.fn_ajax_more').slideDown(500);
					}
					var url = window.location.href.split("?")[0];
					window.history.pushState("", '', url + '?page_number='+page);
					FrenifyPopito.BgImg();
					FrenifyPopito.ImgToSVG();
					FrenifyPopito.fixedColAjax();
				},
				error: function(xhr, textStatus, errorThrown){
					parent.removeClass('loading');
					console.log(errorThrown);
					console.log(textStatus);
					console.log(xhr);
				}
			});
		},
		
		parallaxClassicAjax: function(){
			var ajax_more = $('.fn_cs_posts_parallax_classic .popito_fn_pagination a');
			if(ajax_more.length){
				ajax_more.off().on('click',function(){
					var element = $(this);
					if(!element.hasClass('current')){
						var parent = element.closest('.fn_cs_posts_parallax_classic');
						FrenifyPopito.parallaxClassicPosts__function(parent,element.data('page'));
					}
					
					return false;
				});
			}	
		},
		
		parallaxClassicPosts__function: function(parent,page){
			if(parent.hasClass('loading')){
				return false;
			}
			$('.fn_ajax__preloader').addClass('loading');
			parent.addClass('loading');
			
			$([document.documentElement, document.body]).animate({
				scrollTop: parent.offset().top - FrenifyPopito.adminBarH
			}, 1500);

			var requestData = {
				action: 'popito_fn_cs_ajax_parallax_classic_posts',
				myarguments: PopitoArgumentsParallaxClassic,
				paged: page,
				security: PopitoCoreAjaxObject.nonce,
			};


			$.ajax({
				type: 'POST',
				url: PopitoCoreAjaxObject.ajax_url,
				cache: false,
				data: requestData,
				success: function(data) {
					var fnQueriedObj 	= $.parseJSON(data);
					parent.removeClass('loading');
					$('.fn_ajax__preloader').removeClass('loading');
					parent.html(fnQueriedObj.list);
					
					if(fnQueriedObj.disabled === 'disabled'){
						parent.find('.fn_ajax_more').slideUp(500);
					}else{
						parent.find('.fn_ajax_more').slideDown(500);
					}
					var url = window.location.href.split("?")[0];
					window.history.pushState("", '', url + '?page_number='+page);
					FrenifyPopito.BgImg();
					FrenifyPopito.ImgToSVG();
					FrenifyPopito.parallaxClassicAjax();
					FrenifyPopito.parallaxEffect();
				},
				error: function(xhr, textStatus, errorThrown){
					parent.removeClass('loading');
					console.log(errorThrown);
					console.log(textStatus);
					console.log(xhr);
				}
			});
		},
		
		parallaxEffect: function(){
			var detail       = $('.moving_effect');
			var offset    = 0;
			detail.each(function(){
				var element  = $(this);
				var direction = element.attr('data-direction');
				$(window).on('scroll',function(){
					offset  = $(window).scrollTop();
					var h  = $(window).height();
					var i  = element.offset().top - offset - h;
					if(element.attr('data-reverse') === 'yes'){
						i*= -1;
					}
					var x  = direction === 'x' ?  (i*150)/h : 0;
					var y   = direction === 'x' ?  0 : (i*150)/h;
					if(element.attr('data-reverse') === 'yes'){
						i*= -1;
					}
					if((i*(-1))<h+300 && i<300){
						element.css({transform: 'translate3d('+x+'px, '+y+'px, 0px)'});
					}
				});
			});	
		},
		
		postAjax: function(){
			var ajax_more = $('.fn_cs_posts_ajax_grid .fn_ajax_more a');
			if(ajax_more.length){
				ajax_more.on('click',function(){
					var element = $(this);
					var parent 	= element.closest('.fn_cs_posts_ajax_grid');
					FrenifyPopito.ajaxGridPosts__function(parent);
					return false;
				});
			}	
		},
		
		ajaxGridPosts__function: function(parent){
			var self = this;
			if(parent.hasClass('loading')){
				return false;
			}
			parent.addClass('loading');
			self.ajaxClicksForAjaxGridPosts++;
			

			var requestData = {
				action: 'popito_fn_cs_ajax_grid_filter_posts',
				arguments: PopitoArguments,
				clicked: self.ajaxClicksForAjaxGridPosts,
				security: PopitoCoreAjaxObject.nonce,
			};


			$.ajax({
				type: 'POST',
				url: PopitoCoreAjaxObject.ajax_url,
				cache: false,
				data: requestData,
				success: function(data) {
					var fnQueriedObj 	= $.parseJSON(data);
					parent.removeClass('loading');
					parent.find('.fn_posts ul').append(fnQueriedObj.list);
					
					if(fnQueriedObj.disabled === 'disabled'){
						parent.find('.fn_ajax_more').slideUp(500);
					}else{
						parent.find('.fn_ajax_more').slideDown(500);
					}
					FrenifyPopito.BgImg();
					FrenifyPopito.ImgToSVG();
				},
				error: function(xhr, textStatus, errorThrown){
					parent.removeClass('loading');
					console.log(errorThrown);
					console.log(textStatus);
					console.log(xhr);
				}
			});
		},
		
		postSlider: function(){
			$('.fn_cs_post_slider .owl-carousel').each(function(){
				var owl = $(this);
				var parent = owl.closest('.fn_cs_post_slider');
				owl.owlCarousel({
					items: 1,
					loop: true,
					nav: false,
					dots: false,
					margin: 0,
					autoplay: true,
					smartSpeed: 1500,
					autoplayTimeout: 5000,
					autoplayHoverPause: false
				});
				FrenifyPopito.ImgToSVG();
				parent.find('.slider_nav.prev').off().on('click',function(){
					owl.trigger('prev.owl.carousel', [1500]);
					return false;
				});
				parent.find('.slider_nav.next').off().on('click',function(){
					owl.trigger('next.owl.carousel');
					return false;
				});
			});
		},
		
		
		categoriesFunction: function(){
			$('.fn_cs_category_alpha').each(function(){
				var element				= $(this);
				var gap = 50, speed = 4000, rtl = false;
				element.find('.owl-carousel').owlCarousel({
					loop: true,
					margin: gap,
					nav: false,
					autoplayHoverPause: true,
					dots: false,
					autoWidth: true,
					items:4,
					autoplay: true,
					autoplayTimeout: speed,
					smartSpeed: speed,
					slideTransition: 'linear',
					rtl: rtl,
				});	
			});
		},
		
		
		/* COMMMON FUNCTIONS */
		BgImg: function(){
			var div = $('*[data-fn-bg-img]');
			div.each(function(){
				var element = $(this);
				var attrBg	= element.attr('data-fn-bg-img');
				var dataBg	= element.data('fn-bg-img');
				if(typeof(attrBg) !== 'undefined'){
					element.addClass('frenify-ready');
					element.css({backgroundImage:'url('+dataBg+')'});
				}
			});
			var div2 = $('*[data-bg-img]');
			div2.each(function(){
				var element = $(this);
				var attrBg	= element.attr('data-bg-img');
				var dataBg	= element.data('bg-img');
				if(typeof(attrBg) !== 'undefined'){
					element.addClass('frenify-ready');
					element.css({backgroundImage:'url('+dataBg+')'});
				}
			});
		},
		
		ImgToSVG: function(){
			
			$('img.fn__svg').each(function(){
				var $img 		= $(this);
				var imgClass	= $img.attr('class');
				var imgURL		= $img.attr('src');

				$.get(imgURL, function(data) {
					var $svg = $(data).find('svg');
					if(typeof imgClass !== 'undefined') {
						$svg = $svg.attr('class', imgClass+' replaced-svg');
					}
					$img.replaceWith($svg);

				}, 'xml');
			});
		},
		
		jarallaxEffect: function(){
			$('.jarallax').each(function(){
				var element			= $(this);
				var	customSpeed		= element.data('speed');

				if(customSpeed !== "undefined" && customSpeed !== ""){
					customSpeed = customSpeed;
				}else{
					customSpeed 	= 0.5;
				}
				element.jarallax({
					speed: customSpeed,
					automaticResize: true
				});
			});
		},
		
		isotopeFunction: function(){
			var masonry = $('.fn_cs_masonry');
			if($().isotope){
				masonry.each(function(){
					$(this).isotope({
					  itemSelector: '.fn_cs_masonry_in',
					  masonry: {}
					});
					$(this).isotope( 'reloadItems' ).isotope();
				});
			}
		},
		
		lightGallery: function(){
			if($().lightGallery){
				// FIRST WE SHOULD DESTROY LIGHTBOX FOR NEW SET OF IMAGES
				var gallery = $('.fn_cs_lightgallery');

				gallery.each(function(){
					var element = $(this);
					element.lightGallery(); // binding
					if(element.length){element.data('lightGallery').destroy(true); }// destroying
					$(this).lightGallery({
						selector: ".lightbox",
						thumbnail: 1,
						loadYoutubeThumbnail: !1,
						loadVimeoThumbnail: !1,
						showThumbByDefault: !1,
						mode: "lg-fade",
						download:!1,
						getCaptionFromTitleOrAlt:!1,
					});
				});
			}	
		},
	};
	
	$( window ).on( 'elementor/frontend/init', FrenifyPopito.init );
	
	
	$( window ).on('resize',function(){
		FrenifyPopito.isotopeFunction();
		setTimeout(function(){
			FrenifyPopito.isotopeFunction();
		},700);
	});
	$( window ).on('load',function(){
		FrenifyPopito.isotopeFunction();
	});
	
	$(window).on('scroll',function(){
		
	});
	
})(jQuery, window.elementorFrontend);