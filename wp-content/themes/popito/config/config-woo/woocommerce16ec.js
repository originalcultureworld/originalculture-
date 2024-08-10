
(function ($){

	"use strict";
	
	
    var PopitoWoo 		= {
		
		cartWait: false,
		
		bar: $('.popito_fn_woobar'),
		
		init: function(){
			this.magnificPopup();
			this.openCartBox__Woo();
			this.removeItemFromCart__Woo();
			this.addToCart();
			this.someCustomFunctions();
			this.removeXFromCart();
			this.qty();
			$('body').bind('added_to_cart removed_from_cart updated_cart_totals updated_wc_div', this.updateCart);
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
		
		qty: function(){
			$('.qty').each(function(){
				var e = $(this);
				if(!e.hasClass('ready')){
					e.addClass('ready');
					e.wrap('<div class="fn__qty"></div>');
					e.closest('.fn__qty').append('<span class="up"><span></span></span><span class="down"><span></span></span>');
				}
				
			});
			this.qtyInit();
		},
		
		qtyInit: function(){
			$('.fn__qty .up').off().on('click', function() {
				var e = $(this);
				var time = 100;
				e.addClass('focused');
				clearTimeout(time);
				setTimeout(function(){
					e.removeClass('focused');
				},time);
				var input = e.closest('.fn__qty').find('input');
				var max = input.attr('max');
				var oldValue = parseInt(input.val());
				if(isNaN(oldValue)){oldValue = 0;}
				var newVal;
				if((typeof max !== 'undefined') && max !== '' && oldValue >= max){
					newVal = oldValue;
					return false; // остановиь действие функции, если достигнуто максимальное значение
				}else{
					newVal = oldValue + 1;
				}
				input.val(newVal).trigger("change");
				return false;
			});

			$('.fn__qty .down').off().on('click', function() {
				var e = $(this);
				var time = 100;
				e.addClass('focused');
				clearTimeout(time);
				setTimeout(function(){
					e.removeClass('focused');
				},time);
				var input = e.closest('.fn__qty').find('input');
				var oldValue = parseInt(input.val());
				var min = input.attr('min');
				var newVal;
				if(oldValue <= min){
					newVal = oldValue;
					return false; // остановиь действие функции, если достигнуто минимальное значение
				}else{
					newVal = oldValue - 1;
				}
				input.val(newVal).trigger("change");
				return false;
			});
		},
		
		removeXFromCart: function(){
			$('.woocommerce table.shop_table td.product-remove a.remove,.woocommerce.widget_shopping_cart .cart_list li a.remove').text('');
		},
		someCustomFunctions: function(){
			
			// smooth scroll to review section
			var shopReview	= $('a.woocommerce-review-link');
			if(shopReview.length){
				shopReview.on('click',function(e){
					e.preventDefault();
					$('body,html').animate({scrollTop: $('.woocommerce-tabs').offset().top - 150}, 1100);
					return false;
				});
			}

			// for create own design for empty cart
			var cartEmpty 		= $('p.cart-empty');
			var returnToShop 	= $('p.return-to-shop');
			var returnHTML		= returnToShop.html();
			var cartEmptyHTML	= cartEmpty.html();
			if(cartEmpty.length){
				returnToShop.empty();
				cartEmpty.remove();
				$('.woocommerce').append('<div class="fn_cart-empty"><span>'+cartEmptyHTML+'</span><span>'+returnHTML+'</span>');
			}
			// for create own design for my-account
			var myAccount 		= $('.woocommerce-account .woocommerce-MyAccount-content');
			if(myAccount.length){
				myAccount.parent().wrapInner('<div class="popito_fn_woo_myaccount"><div><div class="inner">');
			}
			// for create own design for my-account -> login
			var logIn			= $('.woocommerce form.login');
			var parentTitle		= logIn.parent().find('h2');
			if(logIn.length){
				parentTitle.hide();
				logIn.wrap('<div class="popito_fn_woo_login"><div>').wrapInner('<div class="popito_fn_woo_login_inner"><div>');
			}	
		},
		updateCart: function(){
			PopitoWoo.bar.addClass('updating');
			PopitoWoo.qty();
			var cartBox		= $('.popito_fn_cartbox');
			var counter		= $('.woo__opener .count');
			var pageFrom	= '';
			if($('body').hasClass('woocommerce-cart')){
				pageFrom	= 'cart';
			}
			if($('body').hasClass('woocommerce-checkout')){
				pageFrom	= 'checkout';
			}
			var requestData = {
				action: 'popito_fn_remove_item_from_cart',
				security: PopitoAjaxObject.nonce,
				product_id: '',
				cart_item_key: '',
				pageFrom: pageFrom
			};

			$.ajax({
				type: 'POST',
				url: PopitoAjaxObject.ajax_url,
				cache: true,
				data: requestData,
				success: function(data) {
					PopitoWoo.bar.removeClass('updating');
					var fnQueriedObj 	= $.parseJSON(data); //get the data object
					cartBox.html(fnQueriedObj.popito_fn_data);
					counter.html(fnQueriedObj.count);
					PopitoWoo.cartWait 		= false;
					PopitoWoo.removeItemFromCart__Woo();
					PopitoWoo.imgToSVG();
				},
				error: function() {
					PopitoWoo.cartWait 		= false;
					console.log('Error');
				}
			});
		},
		addToCart: function(){
			$('a.add_to_cart_button').on('click', function() {
				var link 	= this;

				$(link).closest('.product').find('a img').animate({opacity: 0.7});
				setTimeout(function(){

					$(link).closest('.product').addClass('added-to-cart-check');

					setTimeout(function(){
						$(link).closest('.product').find('a img').animate({opacity: 1});
					}, 1000);
				}, 1000);
				
			});	
		},
		magnificPopup: function(){
			if($().magnificPopup){
				// lightbox for gallery images
				$('.popito_fn_woo .images').each(function() {
					$(this).magnificPopup({
						delegate: 'a.zoom, .woocommerce-product-gallery__image a',
						type: 'image',
						overflowY: 'auto',
						fixedContentPos: false,
						closeOnContentClick: false,
						closeBtnInside: false,
						mainClass: 'mfp-with-zoom mfp-img-mobile',
						image: {
							verticalFit: true,
							titleSrc: function(item) {
								return item.el.attr('title');
							}
						},
						gallery: {
							enabled: true
						}
					});	
				});
			}
		},
		
		checkIfCartHasBeenChangedSomewhere: function(){
			var pageFrom	= '';
			var cartBox		= $('.popito_fn_cartbox');
			var counter		= $('.woo__opener .count');
			if($('body').hasClass('woocommerce-cart')){
				pageFrom	= 'cart';
			}
			if($('body').hasClass('woocommerce-checkout')){
				pageFrom	= 'checkout';
			}
			var requestData = {
				action: 'popito_fn_remove_item_from_cart',
				security: PopitoAjaxObject.nonce,
				product_id: '',
				cart_item_key: '',
				pageFrom: pageFrom
			};

			$.ajax({
				type: 'POST',
				url: PopitoAjaxObject.ajax_url,
				cache: true,
				data: requestData,
				success: function(data) {
					var fnQueriedObj 	= $.parseJSON(data); //get the data object
					$('.popito_fn_hidden_info').remove();
					$('body').append('<div class="popito_fn_hidden_info">'+fnQueriedObj.popito_fn_data+'</div>');
					if(PopitoWoo.bar.find('.woo__compare').html() !== $('.popito_fn_hidden_info .woo__compare').html()){
						PopitoWoo.bar.find('.bar_closer').after(fnQueriedObj.update);
						PopitoWoo.bar.find('.fn_cartbox_updater').on('click',function(){
							cartBox.html(fnQueriedObj.popito_fn_data);
							counter.html(fnQueriedObj.count);
							PopitoWoo.removeItemFromCart__Woo();
							$('.popito_fn_hidden_info').remove();
							PopitoWoo.bar.find('.woo_updater').slideUp(300).delay(300).remove();
							return false;
						});
						PopitoWoo.imgToSVG();
					}
					PopitoWoo.cartWait 		= false;
				},
				error: function() {
					PopitoWoo.cartWait 		= false;
					console.log('Error');
				}
			});
		},
		
		openCartBox__Woo: function(){
			var button			= $('.woo__opener a,.popito_fn_mobnav .item_woo');
			button.off().on('click',function(e){
				e.preventDefault();
				e.stopPropagation();
				if(PopitoWoo.bar.hasClass('active')){
					PopitoWoo.bar.removeClass('active');
				}else{
					PopitoWoo.bar.addClass('active');
					PopitoWoo.checkIfCartHasBeenChangedSomewhere();
				}
				return false;
			});
			
			$('.popito_fn_woobar .bar_closer a,.popito_fn_woobar .bar_extra_closer').off().on('click',function(){
				PopitoWoo.bar.removeClass('active');
				return false;
			});
		},
		removeItemFromCart__Woo: function(){
			$('.fn_cartbox_delete_item').off().on('click', function (e){
    			e.preventDefault();
				PopitoWoo.cartWait = true;
				PopitoWoo.bar.addClass('updating');
				var button	= $(this);
				var item	= button.closest('.fn_cartbox_item');
				var itemID	= item.data('id');
				var itemKey	= item.data('key');
				var cartBox	= $('.popito_fn_cartbox');
				var counter	= $('.woo__opener .count');
				
				
				var requestData = {
					action: 'popito_fn_remove_item_from_cart',
					product_id: itemID,
					security: PopitoAjaxObject.nonce,
					pageFrom: '',
					cart_item_key: itemKey
				};
				
				$.ajax({
					type: 'POST',
					url: PopitoAjaxObject.ajax_url,
					cache: true,
					data: requestData,
					success: function(data) {
						var fnQueriedObj 	= $.parseJSON(data); //get the data object
						cartBox.html(fnQueriedObj.popito_fn_data);
						counter.html(fnQueriedObj.count);
						PopitoWoo.cartWait 		= false;
						PopitoWoo.removeItemFromCart__Woo();
						PopitoWoo.imgToSVG();
						PopitoWoo.bar.removeClass('updating');
					},
					error: function() {
						PopitoWoo.cartWait 		= false;
						console.log('Error');
						PopitoWoo.bar.removeClass('updating');
					}
				});
				return false;
			});
		}
	};
	
	
	
	// ready functions
	$(document).ready(function(){
		PopitoWoo.init();
	});
	
	// resize functions
	$(window).on('resize',function(e){
		e.preventDefault();
	});
	
	// scroll functions
	$(window).on('scroll', function(e) {
		e.preventDefault();
    });
	
	
})(jQuery);