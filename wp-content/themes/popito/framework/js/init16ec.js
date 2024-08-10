/*
 * Copyright (c) 2023 Frenify
 * Author: Frenify
 * This file is made for CURRENT THEME
*/


/*

	@Author: Frenify
	@URL: http://themeforest.net/user/frenify


	This file contains the jquery functions for the actual theme, this
	is the file you need to edit to change the structure of the
	theme.

	This files contents are outlined below.

*/

jQuery.fn.isInViewportPopito = function() {
	"use strict";
	var element 		= jQuery(this);
    var elementTop 		= element.offset().top;
    var elementBottom 	= elementTop + element.outerHeight();

    var viewportTop = jQuery(window).scrollTop();
    var viewportBottom = viewportTop + jQuery(window).height();

	var percentage		= (viewportBottom - elementTop)/element.outerHeight() * 100;
	return percentage;
    return elementBottom > viewportTop && elementTop < viewportBottom;
};

jQuery.fn.isInViewportByFrenify = function() {
	"use strict";
	var element 		= jQuery(this),
		windoww 		= jQuery(window);
    var elementTop 		= element.offset().top;
    var elementBottom 	= elementTop + element.outerHeight();

    var viewportTop 	= windoww.scrollTop();
    var viewportBottom 	= viewportTop;// + windoww.height();
	var percentage		= (viewportTop - elementTop)/element.outerHeight() * 100;
    return [(elementBottom > viewportTop) && (elementTop < viewportBottom),percentage];
};


var PopitoAjax				= PopitoAjaxObject;
var PopitoBody				= jQuery('body');
var PopitoWrapper			= jQuery('.popito-fn-wrapper');
var PopitoVoteWait			= false;
var PopitoReactionWait		= false;
var PopitoNextPostWait		= false;
var PopitoSearch			= {
	search: '',
	text: '',
	onlyTitle: false,
	onlyPost: false
};
var PoptioEntityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
};

// All other theme functions
(function ($){

	"use strict";
	
	
    var PopitoInit 		= {
		
		
		pageNumber: 1,
		
        init: function () {
			this.cursor();
			this.blog_info();
			this.url_fixer();
			this.hamburgerOpener__Mobile();
			this.submenu__Mobile();
			this.imgToSVG();
			this.isotopeMasonry();
			this.dataFnBgImg();
			this.dataFnStyle();
			this.prev_next_posts();
			this.widget__pages();
			this.widget__archives();
			this.portfolioContentHeight();
			this.inputCheckBoxInComment();
			
			
			this.menuFixer();
			this.widgetTitle();
			this.fixAdminBar();
			this.minHeightPages();
			this.countdown();
			
			// since popito
			this.ready();
			this.totopScroll();
			this.seachSomething();
			this.reversedMenu();
			this.moreMenu();
			this.sidebarOpener();
			this.commentOpener();
			this.readMore2();
			this.voteOpener();
			this.footerPosts();
			this.reaction();
			this.featuredPostsWidget();
			this.ajaxNextPost();
			this.nowReading();
			this.transformReading();
			this.stickyHeader();
			this.stickyTopBar();
			this.newPlayer();
			this.mobile__Menu();
			this.single_post__gallery();
			this.getSidePopupPost();
			this.totopWinScroll();
        },
		
		totopWinScroll: function (){
			var WinOffset	= $(window).scrollTop();
			var totop		= $('a.popito_fn_fixedtotop');
			
			var footerTotop = $('.popito_fn_totop');
			var f 	= footerTotop.isInViewportPopito();
			if(f > -1200){
				totop.addClass('footer_totop_active');
			}else{
				totop.removeClass('footer_totop_active');
			}
			if(totop.length){
				if(WinOffset > 300){
					totop.addClass('active');
				}else{
					totop.removeClass('active');
				}
			}
		},
		
		single_post__gallery: function(){
			$('.fn__gallery_format .swiper-container').each(function(){
				var element				= $(this);
				if(!element.hasClass('ready')){
					element.addClass('ready');
					var parent			= element.closest('.fn__gallery_format');
					var height			= parent.data('l-height');
					if (window.matchMedia('(max-width: 768px)').matches){
						height			= parent.data('m-height');
					}
					parent.find('.item img').css({height: height + 'px'});
					parent.find('.slider__nav .wave span').css({width: parseInt(height*0.277) + 'px'});
					parent.find('.slider__nav .wave1').css({top: parseInt(height*0.107) + 'px'});
					parent.find('.slider__nav .wave2').css({bottom: parseInt(height*0.107) + 'px'});
					// Main Slider
					var mainSliderOptions 	= {
						loop: true,
						speed: 1500,
						autoplay:{
							delay: 5000,
							disableOnInteraction: false,
						},
						slidesPerView: 'auto',
						spaceBetween: 0,
						direction: 'horizontal',
						loopAdditionalSlides: 10,
						navigation: {
							nextEl: parent.find('.next'),
							prevEl: parent.find('.prev')
						},
						watchSlidesProgress: true,
					};
					new Swiper(element, mainSliderOptions);
				}
					
			});
		},
		
		mobile__Menu: function(){
			var mobNav		= $('.popito_fn_mobnav');
			var trigger		= mobNav.find('.right__trigger a');
			var featured	= mobNav.find('.item_featured a');
			var mobBottom	= mobNav.find('.mob_bot');
			var featuredBar	= mobNav.find('.mob_featured_bar');
			trigger.off().on('click',function(){
				if(mobNav.hasClass('menu_opened')){
					mobNav.removeClass('menu_opened');
					mobBottom.slideUp();
				}else{
					mobNav.addClass('menu_opened').removeClass('featured_bar_opened');
					featuredBar.slideUp();
					mobBottom.slideDown();
				}
				return false;
			});
			featured.off().on('click',function(){
				if(mobNav.hasClass('featured_bar_opened')){
					mobNav.removeClass('featured_bar_opened');
					featuredBar.slideUp();
				}else{
					mobNav.addClass('featured_bar_opened').removeClass('menu_opened');
					mobBottom.slideUp();
					featuredBar.slideDown();
				}
				return false;
			});	
		},
		
		runPlayer: function(){
			var parent		= $('.popito_fn_main_audio');
			var audioVideo 	= parent.find('audio,video');
			audioVideo.each(function(){
				var element = $(this);
				if(parent.find('.mejs-audio').length){
					parent.find('.mejs-audio').remove();
				}
				element.mediaelementplayer({
					// Do not forget to put a final slash (/)
					pluginPath: 'https://cdnjs.com/libraries/mediaelement/',
					// this will allow the CDN to use Flash without restrictions
					// (by default, this is set as `sameDomain`)
					shimScriptAccess: 'always',
//					features: ['playpause','skipback','jumpforward','progress','current','duration','tracks','volume'],
					features: ['skipback','jumpforward','progress','current','duration','tracks','volume'],
					skipBackInterval: 10,
					jumpForwardText: '10s',
					skipBackText: '10s',
					jumpForwardInterval: 10,
					classPrefix: 'mejs__',
					timeAndDurationSeparator: ' / ',
					audioVolume: 'vertical',
					success: function(mediaElement) {
						mediaElement.addEventListener('play', function() {
							parent.removeClass('fn_pause').addClass('fn_play');
						}, false);
						mediaElement.addEventListener('pause', function() {
							parent.removeClass('fn_play').addClass('fn_pause');
						}, false);
					},
				});
			});
		},
		
		newPlayer: function(){
			var audiobox			= $('.popito_fn_main_audio');
			var playButton			= $('.popito_fn_audio_button');
			var boxCloser 			= audiobox.find('.closer');
			var audioOpener 		= $('.popito_fn_audio_opener');
			var playOfAudiobox		= audiobox.find('.podcast_icon');
			var playPauseOfOpener 	= audioOpener.find('.icon_bar');
			var openBtn 			= audioOpener.find('.text');
			var closeBtn 			= audioOpener.find('.closer');
			var self				= this;
			
			self.runPlayer();
			
			// close button of audiobox on click action
			boxCloser.off().on('click', function(){
				
				if(audiobox.hasClass('fn_play')){
					// открыть кнопку "открыть"
					audiobox.addClass('closed');
					audioOpener.addClass('opened');
				}else{
					// action #shutup
					audiobox.removeClass('fn_play').addClass('fn_pause closed').find('audio,video')[0].pause();
					PopitoBody.removeClass('music-play music-pause');
					$('.fn__mp3_item.active').removeClass('fn_pause active fn_play');
				}
				return false;
			});
			
			// open button (fixed to right with equalizer) on click action
			openBtn.off().on('click', function(){
				// open audiobox
				audiobox.removeClass('closed');
				// close open button
				audioOpener.removeClass('opened');
				
				return false;
			});
			
			// Отключить все звуки и проигрыватель + закрыть кнопку "открыть"
			closeBtn.off().on('click', function(){
				audioOpener.removeClass('opened');
				
				// action #shutup
				audiobox.removeClass('fn_play').addClass('fn_pause closed').find('audio,video')[0].pause();
				PopitoBody.removeClass('music-play music-pause');
				$('.fn__mp3_item.active').removeClass('fn_pause active fn_play');
				
				return false;
			});
			
			// play/pause button of audiobox on click action
			playOfAudiobox.off().on('click', function(){
				if(audiobox.find('audio,video').length){
					if(audiobox.hasClass('fn_pause')){
						// action #play_mp3
						audiobox.removeClass('fn_pause').addClass('fn_play').find('audio,video')[0].play();
						PopitoBody.addClass('music-play').removeClass('music-pause');
						$('.fn__mp3_item.active').addClass('fn_play').removeClass('fn_pause');
					}else{
						// action #pause_mp3
						audiobox.removeClass('fn_play').addClass('fn_pause').find('audio,video')[0].pause();
						PopitoBody.removeClass('music-play').addClass('music-pause');
						$('.fn__mp3_item.active').addClass('fn_pause').removeClass('fn_play');
					}
				}
			});
			
			// play/pause button of "open" button on click action
			playPauseOfOpener.off().on('click', function(){
				if(audiobox.find('audio,video').length){
					if(audiobox.hasClass('fn_pause')){
						// action #play_mp3
						audiobox.removeClass('fn_pause').addClass('fn_play').find('audio,video')[0].play();
						PopitoBody.addClass('music-play').removeClass('music-pause');
						$('.fn__mp3_item.active').addClass('fn_play').removeClass('fn_pause');
					}else{
						// action #pause_mp3
						audiobox.removeClass('fn_play').addClass('fn_pause').find('audio,video')[0].pause();
						PopitoBody.removeClass('music-play').addClass('music-pause');
						$('.fn__mp3_item.active').addClass('fn_pause').removeClass('fn_play');
					}
				}
			});
			
			// play/pause button of mp3 in any place on click action
			playButton.off().on('click',function(){
				var button			= $(this);
				
				
				// if it is mp3 item
				if(button.closest('.fn__mp3_item').length){
					var mp3Item = button.closest('.fn__mp3_item');
					
					if(!mp3Item.hasClass('active')){
						$('.fn__mp3_item').removeClass('active fn_play fn_pause');
						mp3Item.addClass('active');
					}
					
					if(mp3Item.hasClass('fn_pause')){
						// action #play_mp3
						audiobox.removeClass('fn_pause').addClass('fn_play').find('audio,video')[0].play();
						PopitoBody.addClass('music-play').removeClass('music-pause');
						mp3Item.removeClass('fn_pause').addClass('fn_play');
					}else if(mp3Item.hasClass('fn_play')){
						// action #pause_mp3
						audiobox.removeClass('fn_play').addClass('fn_pause').find('audio,video')[0].pause();
						PopitoBody.removeClass('music-play').addClass('music-pause');
						mp3Item.removeClass('fn_play').addClass('fn_pause');
					}else{
						// action #new_play_mp3
						mp3Item.addClass('fn_play');
						audioOpener.removeClass('opened');
						PopitoBody.addClass('music-play').removeClass('music-pause');
						$('.popito_fn_main_audio .audio_player').html('<audio controls><source src="'+button.attr('data-mp3')+'" type="audio/mpeg"></audio>');
						self.runPlayer();
						setTimeout(function(){
							audiobox.removeClass('fn_pause closed').addClass('fn_play').find('audio,video')[0].play();
						},50);
					}
				}else{
					button.addClass('fn_play');
					audioOpener.removeClass('opened');
					PopitoBody.addClass('music-play').removeClass('music-pause');
					$('.popito_fn_main_audio .audio_player').html('<audio controls><source src="'+button.attr('data-mp3')+'" type="audio/mpeg"></audio>');
					self.runPlayer();
					setTimeout(function(){
						audiobox.removeClass('fn_pause closed').addClass('fn_play').find('audio,video')[0].play();
					},50);
				}
				
				return false;
			});
		},
		
		stickyTopBar: function(){
			var stickyHeader = $('.popito_fn_stickynav');
			if(stickyHeader.length){
				stickyHeader.on('mouseenter',function(){
					stickyHeader.addClass('hover');
				}).on('mouseleave',function(){
					stickyHeader.removeClass('hover');
				});
			}
		},
		
		stickyHeader: function(){
			var stickyHeader = $('.popito_fn_stickynav');
			if(stickyHeader.length){
				var scrollTop 	= $(window).scrollTop();
				if(scrollTop > $('.popito_fn_header').outerHeight() + 50){
					PopitoBody.addClass('sticky-active');
				}else{
					PopitoBody.removeClass('sticky-active');
				}
			}
		},
		
		transformReading: function(){
			var stickyHeader = $('.popito_fn_stickynav.ajax_enable');
			if(stickyHeader.length && PopitoBody.hasClass('single-post')){
				var lastScrollTop = 0;
				$(window).scroll(function(){
					var st = $(this).scrollTop();
					if (st > lastScrollTop){
						// downscroll
						stickyHeader.addClass('active');
					}
					lastScrollTop = st;
				});
			}
				
		},
		
		nowReading: function(){
			var title 		= $('.header_post_reading .reading_post .title');
			var progress 	= $('.header_post_reading .progress');
			$(window).on('resize scroll', function() {
				var bs 		= $('.popito_fn_blog_single');
				bs.each(function(){
					var e 	= $(this);
					var f 	= e.isInViewportByFrenify();
					var p	= f[1];
					if(f[0]){
						var newPostTitle = e.data('post-title');
						if(title.html() !== newPostTitle){
							title.html(e.data('post-title'));
						}
						var currentURL	= window.location.href;
						var newURL		= e.data('post-url');
						if(currentURL !== newURL){
							window.history.pushState("", newPostTitle, newURL);
						}
					}
					if(p >= 0 && p <= 100){
						progress.css({width: p + '%'});
					}
				});
			});	
		},
		
		getSidePopupPost: function(){
			var sidepp = $('.fn__fixed_bottom_post');
			if(sidepp.length){
				$(document).scroll(function() {
					var footerHeight =  $('#popito_fn_footer').length > 1 ?  $('#popito_fn_footer').outerHeight() : 0;
					if (((window.innerHeight + window.scrollY+400) >= document.body.offsetHeight - footerHeight) && !sidepp.hasClass('remove')) {
						sidepp.addClass('active');
					}
				});
				sidepp.find('.fbp_closer a').off().on('click',function(){
					sidepp.removeClass('active').delay(500).addClass('remove');
					return false;
				});
			}
		},
		
		ajaxNextPost: function(){
			var singlePost = $('.popito_fn_singleajax');
			if($('.popito_fn_singleajax').length && !PopitoNextPostWait){
				$(document).scroll(function() {
					if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - $('#popito_fn_footer').outerHeight()) {
						if(!PopitoNextPostWait){
							var single			= $('.popito_fn_blog_single');
							var ID 				= single.last().data('get-post-id');
							if(ID === ''){
								PopitoNextPostWait = true;
								PopitoBody.addClass('no-prev-post');
								return false;
							}
							PopitoBody.addClass('prev-post-loading');
							PopitoNextPostWait 	= true;
							
							var requestData 	= {
								action: 'popito_fn_get_prev_post', 
								ID: ID,
								security: PopitoAjax.nonce
							};

							$.ajax({
								type: 'POST',
								url: PopitoAjax.ajax_url,
								cache: false,
								data: requestData,
								success: function(data) {
									var fnQueriedObj 	= $.parseJSON(data); //get the data object
									singlePost.append(fnQueriedObj.output);
									PopitoInit.init();
									PopitoNextPostWait = false;
									PopitoBody.removeClass('prev-post-loading');
								},
								error: function(MLHttpRequest, textStatus, errorThrown) {
									console.log(MLHttpRequest);
									console.log(textStatus);
									console.log(errorThrown);
								}
							});
						}
					}
				});
			}
				
		},
		
		featuredPostsWidget: function(){
			$('.popito_fn_widget_featured .swiper-container').each(function(){
				var element				= $(this);
				// Main Slider
				var mainSliderOptions 	= {
					loop: true,
					speed: 1500,
					autoplay:{
						delay: 5000,
						disableOnInteraction: false,
					},
					slidesPerView: 1,
					spaceBetween: 10,
					direction: 'horizontal',
					loopAdditionalSlides: 10,
					navigation: {
						nextEl: element.find('.nav .next'),
						prevEl: element.find('.nav .prev'),
				  	},
					watchSlidesProgress: true,
				};
				new Swiper(element, mainSliderOptions);
			});
		},
		
		footerPosts: function(){
			$('.popito_fn_vertical_slider').each(function(){
				var e = $(this);
				if(e.hasClass('ready')){
					return false;
				}
				e.addClass('ready');
				var vs = e.find('.vertical_slider');
				var vsHTML = vs.html();
				vs.html(vsHTML.repeat(3));
				PopitoInit.vs_changeslide(1,e);
				PopitoInit.vs_start(vs,e);
			});
		},
		
		vs_start: function(vs,element){
			var timeout 		= 6000;
			var time 			= null;
			clearInterval(time);
			time = setInterval(function(){
				var index 		= vs.find('.current').index() + 2;
				PopitoInit.vs_changeslide(index,element);
			}, timeout);
		},
		
		vs_changeslide: function(index,element){
			var vs 				= element.find('.vertical_slider'),
				children 		= vs.children('.item'),
				length			= children.length;
				index			= (index + length) % length;
			var el 				= children.eq(index-1);

			if(!el.hasClass('current')){
				children.removeClass('current next1 next2 prev1 prev2 next3 prev3');
				el.addClass('current');
				var next1_index = (index + 1) % length;
				var next2_index = (index + 2) % length;
				var next3_index = (index + 3) % length;
				var prev1_index = (index - 1 + length) % length;
				var prev2_index = (index - 2 + length) % length;
				var prev3_index = (index - 3 + length) % length;
				children.eq(next1_index-1).addClass('next1');
				children.eq(next2_index-1).addClass('next2');
				children.eq(prev1_index-1).addClass('prev1');
				children.eq(prev2_index-1).addClass('prev2');
				if(length > 6){
					children.eq(next3_index-1).addClass('next3');
					children.eq(prev3_index-1).addClass('prev3');
				}
			}
		},
		
		voteOpener: function(){
			$('.popito_fn_votes').off().on('click',function(){
				var e = $(this);
				var b = e.find('.vote_info');
				if(e.hasClass('opened')){
					e.removeClass('opened');
					b.slideUp(300);
				}else{
					e.addClass('opened');
					b.slideDown(300);
				}
			});
			
			$('.popito_fn_vote_up').off().on('click',function(e){
				e.preventDefault();
				var element = $(this);
				if(element.closest('.popito_fn_votes').hasClass('up_action')){
					return false;
				}
				PopitoInit.vote(element,'up');
				return false;
			});
			
			
			$('.popito_fn_vote_down').off().on('click',function(e){
				e.preventDefault();
				var element = $(this);
				if(element.closest('.popito_fn_votes').hasClass('down_action')){
					return false;
				}
				PopitoInit.vote(element,'down');
				
				return false;
			});
		},
		
		vote: function(element,action){
			if(PopitoVoteWait === true) {return false;}
			var parent			= element.closest('.popito_fn_votes');
			parent.addClass('loading');
			PopitoVoteWait 		= true;
			var ID 				= parent.data('id');
			var requestData 	= {
				action: 'popito_fn_vote', 
				ID: ID,
				voteAction: action,
				security: PopitoAjax.nonce
			};
				
			$.ajax({
				type: 'POST',
				url: PopitoAjax.ajax_url,
				cache: false,
				data: requestData,
				success: function(data) {
					var fnQueriedObj 	= $.parseJSON(data); //get the data object
					parent.find('.result_vote .count').text(fnQueriedObj.count__result);
					parent.find('.vote_info').html(fnQueriedObj.result__text);
					parent.removeClass('loading');
					parent.find('.result_vote .action').text(fnQueriedObj.difference);
					parent.removeClass('up_action down_action').addClass(action+'_action');
					PopitoVoteWait = false;
				},
				error: function(MLHttpRequest, textStatus, errorThrown) {
					console.log(MLHttpRequest);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		},
		
		escapeHTML: function(string){
			return String(string).replace(/[&<>"'`=\/]/g, function (s) {
				return PoptioEntityMap[s];
			});
		},
		
		reaction: function(){
			$('.popito_fn_reaction_btn').off().on('click',function(){
				var element = $(this);
				if(PopitoReactionWait === true) {return false;}
				var parent			= element.closest('.popito_fn_reactions');
				parent.addClass('loading');
				PopitoReactionWait	= true;
				var ID 				= element.data('id');
				var requestData 	= {
					action: 'popito_fn_reactions', 
					ID: parseInt(ID),
					ajax_action: PopitoInit.escapeHTML(element.data('action')),
					security: PopitoAjax.nonce
				};
				

				$.ajax({
					type: 'POST',
					url: PopitoAjax.ajax_url,
					cache: false,
					data: requestData,
					success: function(data) {
						var fnQueriedObj 	= $.parseJSON(data); //get the data object
						var newReaction		= fnQueriedObj.reaction;
						var ajaxAction		= fnQueriedObj.ajax_action;
						element = $('.popito_fn_reaction_btn[data-id="'+ID+'"][data-action="'+newReaction+'"]');
						element.find('.count').html(fnQueriedObj.count);
						if(ajaxAction === 'add'){
							element.addClass('active');
						}else{
							element.removeClass('active');
						}
						PopitoReactionWait = false;
					},
					error: function(MLHttpRequest, textStatus, errorThrown) {
						console.log(MLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
					}
				});
				
				return false;
			});
				
		},
		
		readMore2: function(){
			$('.read_more.second a').each(function(){
				var e = $(this);
				var t = e.find('.text');
				var w = t.width();
				e.css('--www',(110+w)+'px');
			});
		},
		
		commentOpener: function(){
			var comment = $('.fn__comments');
			$('.popito_fn_comments .comment_opener a').off().on('click',function(){
				if(PopitoBody.hasClass('comment-active')){
					PopitoBody.removeClass('comment-active');
					comment.slideUp();
				}else{
					PopitoBody.addClass('comment-active');
					comment.slideDown();
				}
				return false;
			});
		},
		
		sidebarOpener: function(){
			var rightbar 	= $('.popito_fn_rightbar');
			var trigger		= $('.popito_fn_stickynav .right__trigger a,#popito_fn_header .right__trigger a');
			trigger.off().on('click',function(){
				if(trigger.hasClass('active')){
					trigger.removeClass('active');
					rightbar.removeClass('active');
				}else{
					trigger.addClass('active');
					rightbar.addClass('active');
				}
				return false;
			});
			$('.popito_fn_rightbar .bar_closer a,.popito_fn_rightbar .bar_extra_closer').off().on('click',function(){
				trigger.removeClass('active');
				rightbar.removeClass('active');
				return false;
			});
		},
		
		moreMenu: function(){
			PopitoInit.menuCenter();
			$('.popito_fn_nav').each(function(){
				var nav = $(this);
				var menu = nav.find('.menu');
				var more = menu.find('.more');
				var moreBtn = more.find('a');
				var moreBtnWidth = moreBtn.width();
				var w = 0, a = 0,html = '';
				nav.find('.popito_fn_main_nav > li').each(function(){
					var e = $(this);
					a+= parseInt(e.outerWidth(true));
					a+= moreBtnWidth;
					if(w+a>menu.width()){
						e.addClass('disabled');
						html+='<li class="'+e.attr('class')+'">'+e.html()+'</li>';
					}else{
						e.removeClass('disabled');
					}
					a-= moreBtnWidth;
					w+= a;a=0;
				});
				if(html !== ''){
					more.addClass('active');
					more.find('.sub-menu').html(html);
				}else{
					more.removeClass('active');
				}
			});
				
			
		},
		
		reversedMenu: function(){
			$('.popito_fn_main_nav ul').each(function(){
				var e = $(this),
					w = e.offset().left + 240,
					W = $('body').width();
				if(w>W){
					e.addClass('reverse');
				}
			});
		},
		
		
		
		
		seachSomething: function(){
			var searchOpener 	= $('.popito_fn_nav .search a,.popito_fn_mobnav .item_search a');
			var searchbox 		= $('.popito_fn_searchbox');
			var input 			= searchbox.find('form input[type="text"]');
			
			searchOpener.off().on('click',function(){
				if(PopitoBody.hasClass('search-active')){
					PopitoBody.removeClass('search-active');
				}else{
					PopitoBody.addClass('search-active');
					input.val('');
					setTimeout(function(){
						input[0].focus();
					},100);
				}
				return false;
			});
			
			searchbox.find('.search_closer').off().on('click',function(){
				PopitoBody.removeClass('search-active');
				return false;
			});
			input.on("keypress", function(event) {
				if (event.key === "Enter") {
					event.preventDefault();
					$('.popito_fn_searchbox form input[type="submit"]').trigger('click');
				}
			});
			
			// filter search
			var timeout = null;
			input.on('keyup', function(){
				var field 	= $(this);
				var text 	= field.val();
				
				clearTimeout(timeout);

				timeout = setTimeout(function () {
					PopitoSearch.search = text;
					if(text === PopitoSearch.text){
							return false;
					}
					PopitoSearch.text	= text;
					PopitoInit.filterAjaxSearch();
				}, 700);
			});
			
			searchbox.find('input[type="checkbox"]').change(function(){
				PopitoInit.filterAjaxSearch();
			});
		},
		
		filterAjaxSearch: function(){
			var searchBox 	= $('.popito_fn_searchbox');
			var resultBox	= searchBox.find('.resultbox');
			var infoBox		= resultBox.find('.result_info');
			var resultList	= resultBox.find('.result_list ul');
			if(PopitoSearch.text === ''){
				resultList.html('');
				searchBox.removeClass('ajax_result');
				infoBox.html('<p>'+infoBox.data('info')+'</p>');
				return false;
			}
			searchBox.addClass('loading ajax_result');
			
			var titleFilter = searchBox.find('.title_filter input').prop('checked') ? 1: 0;
			var postFilter = searchBox.find('.post_filter input').prop('checked') ? 1 : 0;
			
			
			var requestData = {
				action: 'popito_fn_ajax_search',
				security: PopitoAjax.nonce,
				text: PopitoSearch.text,
				titleFilter: titleFilter,
				postFilter: postFilter,
			};
			


			$.ajax({
				type: 'POST',
				url: PopitoAjax.ajax_url,
				cache: false,
				data: requestData,
				success: function(data) {
					var fnQueriedObj 	= $.parseJSON(data);
					
					// append new items into grid 
					resultList.html(fnQueriedObj.list);
					infoBox.html(fnQueriedObj.info);
					
					
					// recall some functions
					PopitoInit.dataFnBgImg();
					
					searchBox.removeClass('loading');
				},
				error: function(xhr, textStatus, errorThrown){
					console.log(errorThrown);
					console.log(textStatus);
					console.log(xhr);
				}
			});
		},
		
		
		totopScroll: function(){
			var minSpeed 		= 500;
			var maxSpeed		= 1500;
			$(".popito_fn_totop,.popito_fn_fixedtotop").off().on('click', function(e) {
				e.preventDefault();
				var speed		= ($(window).scrollTop()-$(window).height())/2;
				if(speed < minSpeed){speed = minSpeed;}
				if(speed > maxSpeed){speed = maxSpeed;}
				$("html, body").animate({ scrollTop: 0 }, speed);
				return false;
			});
		},
		
		
		menuCenter: function(){
			var nav 		= $('.popito_fn_nav');
			nav.each(function(){
				var element 		= $(this);
				var leftWidth 		= 0;
				var rightWidth 		= 0;
				var header,left,right;
				if(element.hasClass('main_nav')){
					header			= $('.popito_fn_header');
					left 			= header.find('.logo');
					right 			= header.find('.right__trigger');
					if(left.length){
						leftWidth 	= parseInt(left.outerWidth(true));
					}
					if(right.length){
						rightWidth	= parseInt(right.outerWidth(true));
					}
					element.css({width: (header.width() - rightWidth - leftWidth) + 'px',opacity: 1});
				}else if(element.hasClass('sticky_nav')){
					header			= $('.popito_fn_stickynav');
					right 			= header.find('.right__trigger');
					if(right.length){
						rightWidth	= parseInt(right.outerWidth(true));
					}
					element.css({width: (header.width() - rightWidth) + 'px',opacity: 1});
				}
			});
			$("body").removeClass("frenify-overflow");
		},
		
		ready: function(){
			$('.popito_fn_walletbox, .popito_fn_wallet_closer, .popito_fn_leftnav, .popito_fn_leftnav_closer').removeClass('ready');
		},
		
		countdown: function(){
			$('.popito_fn_countdown').each(function(){
				var e = $(this),
					t = e.data('type');
				if(t === 'due_date'){
					var countDownDate = new Date(e.data('date')).getTime();
				}else if(t === 'ever'){
					var days 	= parseInt(e.data('days')) * 24 * 3600,
						hours	= parseInt(e.data('hours')) * 3600,
						minutes	= parseInt(e.data('minutes')) * 60,
						seconds	= parseInt(e.data('seconds'));
					var ever	= days + hours + minutes + seconds;
				}
				if(e.hasClass('boxed')){
					e.after('<div class="popito_fn_boxed_countdown"><span class="left_wing"></span><span class="right_wing"></span><ul><li class="days"><div class="item"><div class="count"><h3 class="fn__title">0</h3></div><span>'+e.data('text-days')+'</span></div></li><li class="hours"><div class="item"><div class="count"><h3 class="fn__title">0</h3></div><span>'+e.data('text-hours')+'</span></div></li><li class="minutes"><div class="item"><div class="count"><h3 class="fn__title">0</h3></div><span>'+e.data('text-minutes')+'</span></div></li><li class="seconds"><div class="item"><div class="count"><h3 class="fn__title">0</h3></div><span>'+e.data('text-seconds')+'</span></div></li></ul></div>');
					var p = e.parent().find('.popito_fn_boxed_countdown');
					e.remove();
				}
				if(t === 'due_date'){
					// Update the count down every 1 second
					var x = setInterval(function() {
						// Get today's date and time
						var now = new Date().getTime();

						// Find the distance between now and the count down date
						var distance = countDownDate - now;

						// Time calculations for days, hours, minutes and seconds
						var days = Math.floor(distance / (1000 * 60 * 60 * 24));
						var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
						var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
						var seconds = Math.floor((distance % (1000 * 60)) / 1000);

						if(e.hasClass('boxed')){
							days = (days < 10 ? '0' + days : days);
							hours = (hours < 10 ? '0' + hours : hours);
							minutes = (minutes < 10 ? '0' + minutes : minutes);
							seconds = (seconds < 10 ? '0' + seconds : seconds);
							p.find('.days h3').text(days);
							p.find('.hours h3').text(hours);
							p.find('.minutes h3').text(minutes);
							p.find('.seconds h3').text(seconds);
						}else{
							var text = '';
							if(days > 0){text += days + 'd: ';}
							text += hours + 'h: ' + minutes + 'm: ' + seconds + 's';
							e.text(text);
						}
						if (distance < 0) {
							if(e.hasClass('boxed')){
								p.find('.days h3').text(0);
								p.find('.hours h3').text(0);
								p.find('.minutes h3').text(0);
								p.find('.seconds h3').text(0);
							}else{
								e.text('0d: 0h: 0m: 0s');
							}
							clearInterval(x);
					  	}
					}, 1000);
				}else if(t === 'ever'){
					setInterval(function(){
						days 	= Math.floor(ever / 86400);
						hours	= Math.floor((ever % 86400) / 3600);
						minutes	= Math.floor((ever % 3600) / 60);
						seconds	= Math.floor((ever % 60));
							
						if(e.hasClass('boxed')){
							days = (days < 10 ? '0' + days : days);
							hours = (hours < 10 ? '0' + hours : hours);
							minutes = (minutes < 10 ? '0' + minutes : minutes);
							seconds = (seconds < 10 ? '0' + seconds : seconds);
							p.find('.days h3').text(days);
							p.find('.hours h3').text(hours);
							p.find('.minutes h3').text(minutes);
							p.find('.seconds h3').text(seconds);
						}else{
							var text = '';
							if(days > 0){text += days + 'd: ';}
							text += hours + 'h: ' + minutes + 'm: ' + seconds + 's';
							e.text(text);
						}
						ever--;
					}, 1000);
				}
			});
		},
		
		minHeightPages: function(){
			var adminBar 		= $('#wpadminbar');
			var adminBarHeight 	= 0;
			var footer 			= $('#popito_fn_footer');
			var footerHeight	= 0;
			if(adminBar.length){
				adminBarHeight = adminBar.height();
			}
			if (window.matchMedia('(max-width: 600px)').matches) {
				adminBarHeight = 0;
			}
			if(footer.length){
				footerHeight = footer.outerHeight();
			}
			$('.popito_fn_page_ajax,.popito_fn_index .popito_fn_hassidebar, .popito_fn_archive_category .popito_fn_hassidebar').css({minHeight: ($(window).height() - adminBarHeight - footerHeight) + 'px'});
		},
		
		fixAdminBar: function(){
			if(PopitoBody.hasClass('admin-bar')){
				$('html').addClass('frenify-html');
			}
			if($('.popito_fn_author_info .info_img img').length){
				$('.popito_fn_author_info .info_in').css({marginTop: 0});
			}
		},
		
		
		preloader: function(){
			$('.popito_fn_preloader').addClass('ready');
		},
		
		
		widgetTitle: function(){
			$('.wp-block-group__inner-container > h1,.wp-block-group__inner-container > h2,.wp-block-group__inner-container > h3,.wp-block-group__inner-container > h4,.wp-block-group__inner-container > h5,.wp-block-group__inner-container > h6').each(function(){
				var e = $(this);
				e.after('<div class="wid-title"><span class="text">'+e.text()+'</span><span class="icon"></span></div>');
				e.remove();
			});
		},
		
		
		menuFixer: function (){
			var menu	 		= $('.popito_fn_header');
			var WinOffset		= $(window).scrollTop();

			if(WinOffset > 10){
				menu.addClass('active');
			}else{
				menu.removeClass('active');
			}
			if(WinOffset > 300){
				PopitoBody.addClass('totop-active');
			}else{
				PopitoBody.removeClass('totop-active');
			}
		},
		
		
		
		// ************************************************************************
		// ************************************************************************
		// ************************************************************************
		blog_info: function(){
			if($('.blog_info').height() === 0){
				$('.popito_fn_comment').addClass('margin-no-top');
			}
			if($('.wp-calendar-nav').length){
				$('.wp-calendar-nav').each(function(){
					var e = $(this);
					if(!e.find('a').length){
						e.remove();
					}
				});
			}
		},
		
		projectPopup: function(){
			$('.popito_popup_gallery').each(function() { // the containers for all your galleries
				$(this).magnificPopup({
					delegate: 'a.zoom', // the selector for gallery item
					type: 'image',
					gallery: {
					  enabled:true
					},
					removalDelay: 300,
					mainClass: 'mfp-fade'
				});

			});
			$('.popito_popup_youtube, .popito_popup_vimeo').each(function() { // the containers for all your galleries
				$(this).magnificPopup({
					disableOn: 700,
					type: 'iframe',
					mainClass: 'mfp-fade',
					removalDelay: 160,
					preloader: false,
					fixedContentPos: false
				});
			});

			$('.popito_popup_soundcloude').each(function(){
				$(this).magnificPopup({
					type : 'image',
					gallery: {
						enabled: true, 
					},
				});	
			});
		},
		
		
		
		inputCheckBoxInComment: function(){
			if($('p.comment-form-cookies-consent input[type=checkbox]').length){
				$('p.comment-form-cookies-consent input[type=checkbox]').wrap('<label class="fn_checkbox"></label>').after('<span></span>');
			}
		},
		
		portfolioContentHeight: function(){
			var portfolio = $('.popito_fn_portfolio_page .portfolio_content');
			if(portfolio.height() === 0){
				portfolio.css({display: 'none'});
			}
		},
		
		url_fixer: function(){
			$('a[href*="fn_ex_link"]').each(function(){
				var oldUrl 	= $(this).attr('href'),
					array   = oldUrl.split('fn_ex_link/'),
					newUrl  = PopitoAjax.siteurl + "/" + array[1];
				$(this).attr('href', newUrl);
			});
			if($('.popito-fn-protected').length){
				$('.popito_fn_pagein').css({paddingTop: 0});
			}
		},
		
		cursor: function () {
			var myCursor = $('.frenify-cursor');
			if (myCursor.length) {
				if ($("body").length) {
					const e = document.querySelector(".cursor-inner"),
						t 	= document.querySelector(".cursor-outer");
					var n, i = 0,W = 0,intro = 0,
						o = !1;
					if($('.popito_fn_intro').length){intro=1;}
					
					var buttons = ".modal_ux_closer, .popito_fn_nav .trigger,.popito_fn_header .trigger,.fn_cs_intro_testimonials .prev, .fn_cs_intro_testimonials .next, .fn_cs_swiper_nav_next, .fn_cs_swiper_nav_prev, .fn_dots, .swiper-button-prev, .swiper-button-next, .fn_cs_accordion .acc_head, .popito_fn_popupshare .share_closer, .popito_fn_header .fn_finder, .popito_fn_header .fn_trigger, a, input[type='submit'], .cursor-link, button";
					var sliders = ".owl-carousel, .swiper-container, .cursor-link";
					// link mouse enter + move
					window.onmousemove = function(s) {
						o || (t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)"), e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)", n = s.clientY, i = s.clientX
					}, $("body").on("mouseenter", buttons, function() {
						e.classList.add("cursor-hover"), t.classList.add("cursor-hover")
					}), $("body").on("mouseleave", buttons, function() {
						$(this).is("a") && $(this).closest(".cursor-link").length || (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"))
					}), e.style.visibility = "visible", t.style.visibility = "visible";
					
					
					// slider mouse enter
					PopitoBody.on('mouseenter', sliders, function(){
						e.classList.add('cursor-slider');
						t.classList.add('cursor-slider');
					}).on('mouseleave', sliders,function(){
						e.classList.remove('cursor-slider');
						t.classList.remove('cursor-slider');
					});
					
					// slider mouse hold
					PopitoBody.on('mousedown', sliders, function(){
						e.classList.add('mouse-down');
						t.classList.add('mouse-down');
					}).on('mouseup', sliders, function(){
						e.classList.remove('mouse-down');
						t.classList.remove('mouse-down');
					});
				}
			}
		},
		
		widget__archives: function(){
			$('.widget_archive li').each(function(){
				var e = $(this);
				var a = e.find('a').clone();
				PopitoBody.append('<div class="frenify_hidden_item"></div>');
				$('.frenify_hidden_item').html(e.html());
				$('.frenify_hidden_item').find('a').remove();
				var suffix = $('.frenify_hidden_item').html().match(/\d+/); // 123456
				$('.frenify_hidden_item').remove();
				suffix = parseInt(suffix);
				if(isNaN(suffix)){
					return false;
				}
				suffix = '<span class="count">'+suffix+'</span>';
				e.html(a);
				e.append(suffix);
			});
		},
		
		prev_next_posts: function(){
			if($('.popito_fn_siblings')){
				$(document).keyup(function(e) {
					if(e.key.toLowerCase() === 'p') {
						var a = $('.popito_fn_siblings').find('a.previous_project_link');
						if(a.length){
							window.location.href = a.attr('href');
							return false;
						}
					}
					if(e.key.toLowerCase() === 'n') {
						var b = $('.popito_fn_siblings').find('a.next_project_link');
						if(b.length){
							window.location.href = b.attr('href');
							return false;
						}
					}
				});
			}
		},
		
		
		
		
		widget__pages: function(){
			var nav 						= $('.widget_pages ul');
			nav.each(function(){
				$(this).find('a').off().on('click', function(e){
					var element 			= $(this);
					var parentItem			= element.parent('li');
					var parentItems			= element.parents('li');
					var parentUls			= parentItem.parents('ul.children');
					var subMenu				= element.next();
					var allSubMenusParents 	= nav.find('li');

					allSubMenusParents.removeClass('opened');

					if(subMenu.length){
						e.preventDefault();

						if(!(subMenu.parent('li').hasClass('active'))){
							if(!(parentItems.hasClass('opened'))){parentItems.addClass('opened');}

							allSubMenusParents.each(function(){
								var el = $(this);
								if(!el.hasClass('opened')){el.find('ul.children').slideUp();}
							});

							allSubMenusParents.removeClass('active');
							parentUls.parent('li').addClass('active');
							subMenu.parent('li').addClass('active');
							subMenu.slideDown();


						}else{
							subMenu.parent('li').removeClass('active');
							subMenu.slideUp();
						}
						return false;
					}
				});
			});
		},
		
		submenu__Mobile: function(){
			var nav 						= $('ul.vert_menu_list, .widget_nav_menu ul.menu, .popito_fn_mobnav .mob_bot .mobile_menu');
			var mobileAutoCollapse			= PopitoWrapper.data('mobile-autocollapse');
			nav.each(function(){
				$(this).find('a').off().on('click', function(e){
					var element 			= $(this);
					var parentItem			= element.parent('li');
					var parentItems			= element.parents('li');
					var parentUls			= parentItem.parents('ul.sub-menu');
					var subMenu				= element.next();
					var allSubMenusParents 	= nav.find('li');

					allSubMenusParents.removeClass('opened');

					if(subMenu.length){
						e.preventDefault();

						if(!(subMenu.parent('li').hasClass('active'))){
							if(!(parentItems.hasClass('opened'))){parentItems.addClass('opened');}

							allSubMenusParents.each(function(){
								var el = $(this);
								if(!el.hasClass('opened')){el.find('ul.sub-menu').slideUp();}
							});

							allSubMenusParents.removeClass('active');
							parentUls.parent('li').addClass('active');
							subMenu.parent('li').addClass('active');
							subMenu.slideDown();


						}else{
							subMenu.parent('li').removeClass('active');
							subMenu.slideUp();
						}
						return false;
					}
					if(mobileAutoCollapse === 'enable'){
						if(nav.parent().parent().hasClass('opened')){
							nav.parent().parent().removeClass('opened').slideUp();
							$('.popito_fn_mobilemenu_wrap .hamburger').removeClass('is-active');
						}
					}
				});
			});
		},
		
		hamburgerOpener__Mobile: function(){
			var hamburger		= $('.popito_fn_mobilemenu_wrap .hamburger');
			hamburger.off().on('click',function(){
				var element 	= $(this);
				var menupart	= $('.popito_fn_mobilemenu_wrap .mobilemenu');
				if(element.hasClass('is-active')){
					element.removeClass('is-active');
					menupart.removeClass('opened');
					menupart.slideUp(500);
				}else{
					element.addClass('is-active');
					menupart.addClass('opened');
					menupart.slideDown(500);
				}return false;
			});
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
		
		
		dataFnStyle: function(){
			$('[data-fn-style]').each(function(){
				var el		= $(this);
				var s 		= el.attr('data-fn-style');
				$.each(s.split(';'),function(i,e){
					el.css(e.split(':')[0],e.split(':')[1]);
				});
			});
		},
		
		dataFnBgImg: function(){
			var bgImage 	= $('*[data-fn-bg-img]');
			bgImage.each(function(){
				var element = $(this);
				var attrBg	= element.attr('data-fn-bg-img');
				var bgImg	= element.data('fn-bg-img');
				if(typeof(attrBg) !== 'undefined'){
					element.addClass('frenify-ready');
					if(bgImg === ''){
						return;
					}
					element.css({backgroundImage:'url('+bgImg+')'});
				}
			});
			var bgImage2 	= $('*[data-bg-img]');
			bgImage2.each(function(){
				var element = $(this);
				var attrBg	= element.attr('data-bg-img');
				var bgImg	= element.data('bg-img');
				if(typeof(attrBg) !== 'undefined'){
					element.addClass('frenify-ready');
					if(bgImg === ''){
						return;
					}
					element.css({backgroundImage:'url('+bgImg+')'});
				}
			});
		},
		
		isotopeMasonry: function(){
			var masonry = $('.fn__masonry');
			if($().isotope){
				masonry.each(function(){
					$(this).isotope({
						itemSelector: '.mas__in',
						masonry: {}
					});
				});
			}
			var masonry2 = $('.blog_layout_masonry ul');
			if($().isotope){
				masonry2.each(function(){
					$(this).isotope({
						itemSelector: 'li',
						masonry: {}
					});
				});
			}
		},
    };
	
	
	
	// ready functions
	$(document).ready(function(){
		PopitoInit.init();
	});
	
	// resize functions
	$(window).on('resize',function(e){
		e.preventDefault();
		PopitoInit.isotopeMasonry();
		PopitoInit.minHeightPages();
		PopitoInit.moreMenu();
	});
	
	// scroll functions
	$(window).on('scroll', function(e) {
		e.preventDefault();
		PopitoInit.menuFixer();
		PopitoInit.stickyHeader();
		PopitoInit.totopWinScroll();
    });
	
	// load functions
	$(window).on('load', function(e) {
		e.preventDefault();
		PopitoInit.preloader();
		PopitoInit.isotopeMasonry();
		setTimeout(function(){
			PopitoInit.isotopeMasonry();
		},200);
	});
	
	
	window.addEventListener("load", function(){
		PopitoInit.preloader();
		PopitoInit.moreMenu();
	});
	
	
	$( window ).on( 'elementor/frontend/init', PopitoInit.rippleEffect );
	
})(jQuery);