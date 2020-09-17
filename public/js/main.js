ajaxe.working = true;

$(document).ready(function(){
    var calc_params = {
        cpc: 0.02,
        cpm: 0.04
    }

	setTimeout(function() {
		window.scrollTo(0, 0);
      	$('.preloader').fadeOut("slow");
      	$('body').removeClass('overflow-hidden');
    }, 300);

	$('.languages_current').on( 'click', function() {
	  	$(this).toggleClass('active');
	  	$('.languages_dropdown__wrap').slideToggle();
	});

	$(document).mouseup(function (e){
		var div = $('.languages_current');
		if (!div.is(e.target) && div.has(e.target).length === 0 ) { 

			$('.languages_current').removeClass('active');
	  		$('.languages_dropdown__wrap').slideUp();
		}
	});

	$('.languages_dropdown').on( 'click', function(){ 
		var lang = $('html').attr('lang');
		if( lang === 'ru' )
			location.href = '/?language=en-US';
		else
			location.href = '/?language=ru-RU';
	});


	$('.calculator_selector').on( 'click', function() {
	  	if ($(this).hasClass('active')) 
	  	{
	  		$(this).removeClass('active');
	  		$(this).next().slideUp();
	  	}
	  	else
	  	{
	  		$('.calculator_selector').removeClass('active');
	  		$('.calculator_selector__dropdown').slideUp();

	  		$(this).addClass('active');
	  		$(this).next().slideDown();
	  	}
	  	
	});

	$('.calculator_selector__dropdown-list li').on( 'click', function() {
	  	$(this).parent().find('li').removeClass('active');
	  	$(this).addClass('active');

		$(this).parent().parent().parent().find('.calculator_selector').removeClass('active');
	  	$(this).parent().parent().slideUp();

	  	var itemContent = $(this).find('span').text();
		$(this).parent().parent().parent().find('.calculator_selector__info-current').html(itemContent);


        var data = $(this).data();

        if( 'mode' in data )
        {
	        $('.price_calculator .mode').hide();
	        $('.price_calculator .mode-'+data.mode).show();
	        data.value = $('.price_calculator .mode-'+data.mode).find('ul li.active').data('value');
        }

        if( 'value' in data )
        {
        	if( !data.mode )
        		data.mode = $('#calc-mode li.active').data('mode');

        	if( data.mode === 'bnr' )
        		$('#price_calculator__cost').text(calc_params[data.value]+'$ '+data.value.toUpperCase());

        	if( data.mode === 'popup' || data.mode === 'video' )
        		$('#price_calculator__cost').text(data.value+'$ CPM');
        }

        counting(cpm_value($('.qty'),0));
	});


    $('.qty').change(function(){
        var val = cpm_value(this,0);
        counting(val);
    });
    $('.cpm-minus,.cpm-plus').mousedown(function(){
        var val = parseFloat($(this).attr('data-val')),
        el = $(this).siblings('.qty');
        cpm_value(el,val);
        var loop = setTimeout(function(){
            var loop = setInterval(function(){
                var v = cpm_value(el,val);
                counting(v);
            },50);
            $(el).attr('data-loop',loop);
        },500);
        el.attr('data-loop',loop);
    });
    var mousestop = function(){
        var el = $(this).siblings('.qty');
        clearTimeout(parseInt(el.attr('data-loop')));
        clearInterval(parseInt(el.attr('data-loop')));
        el.attr('data-loop','0');

        var val = el.val();
        if(val[0] === '$')
            val = val.substr(1);
        counting(val);
    };
    $('.cpm-minus,.cpm-plus').mouseup(mousestop);
    $('.cpm-minus,.cpm-plus').mouseleave(mousestop);

    function counting(val){
        var type = $('#calc-mode li.active').data('mode');
        if(type === 'bnr')
        {
            var mode = $('#calc-bnr-params li.active').data('value');
            var price = calc_params[mode];
        }
        else
            var price = $('#calc-'+type+'-params li.active').data('value');

        var result = val/price;
        if(type === 'bnr' && mode === 'cpc')
            var rname = $('.price_calculator [name="clk"]').val();
        else
        {
            var rname = $('.price_calculator [name="imp"]').val();
            result *= 1000;
        }

        result = new Intl.NumberFormat('ru-RU').format( parseInt(result) );
        $('#calc-result').text( result+rname );
    }

	$(document).mouseup(function (e){
		var div = $('.calculator_selector');
		var btn = $('.calculator_selector__dropdown-list li');
		if (!div.is(e.target) && div.has(e.target).length === 0 ) { 

			$('.calculator_selector').removeClass('active');
	  		$('.calculator_selector__dropdown').slideUp();
		}
	});


	// Burger
	$('.burger').on( 'click', function() {
	  	$('.nav_wrap').addClass('active');
	  	$('.nav_backdrop').fadeIn();
	  	$('body').addClass('overflow-hidden');
	});
	$('.close-burger').on( 'click', function() {
	  	$('.nav_wrap').removeClass('active');
	  	$('.nav_backdrop').fadeOut();
	  	$('body').removeClass('overflow-hidden');
	});
	$('.nav_backdrop').on( 'click', function() {
	  	$('.nav_wrap').removeClass('active');
	  	$(this).fadeOut();
	  	$('body').removeClass('overflow-hidden');
	});

	// PopUp


	function popup_open(name,cb) {

		$('.popup-backdrop').fadeIn();
		$('.popup-active').fadeIn();

		if( name !== 'contact' && ajaxe.current === null )
		{
		  	var content = $('.popup-loading').html();
		  	$('.popup-active').html(content);

			ajaxe.query('/site/is-guest', function(d){
				if( d.isGuest )
				{
					$('form').each(function(){
						$(this).prepend('<input type="hidden" name="'+d.csrfParam+'" value="'+d.csrfToken+'"/>');
					});
					popup_open(name,cb);
				}
				else
					location.href = '/index';
			});
		}
		else
		{
		  	var content = $('.popup-'+name).html();
		  	$('.popup-active').html(content);

		  	if( typeof cb === 'function' )
		  		cb($('.popup-active'));
		}

	}

	function popup_login() {
		popup_open('login',function(){
		
			$('#login-form').yiiActiveForm([
			{
				"id":"login-form-login",
				"name":"login",
				"container":".field-login-form-login",
				"input":"#login-form-login",
				"error":".invalid-feedback",
				"enableAjaxValidation":true,
				"validateOnChange":false,
				"validateOnBlur":false
			},{
				"id":"login-form-password",
				"name":"password",
				"container":".field-login-form-password",
				"input":"#login-form-password",
				"error":".invalid-feedback",
				"enableAjaxValidation":true,
				"validateOnChange":false,
				"validateOnBlur":false
			},{
				"id":"login-form-rememberme",
				"name":"rememberMe",
				"container":".field-login-form-rememberme",
				"input":"#login-form-rememberme",
				"error":".invalid-feedback",
				"enableAjaxValidation":true,
				"validateOnChange":false,
				"validateOnBlur":false
			}], {
				"errorSummary":".alert.alert-danger",
				"errorCssClass":"is-invalid",
				"successCssClass":"is-valid",
				"validationStateOn":"input"
			});


		  	$('#login-form').prepend('<input type="hidden" name="timezone_offset" value="0"/>');
	    	$('[name="timezone_offset"]').val(-(new Date()).getTimezoneOffset());

    	});
	}

	$('body').on( 'click', '.popup-login_btn', function() {
		popup_login()
	});
	$('body').on( 'click', '.popup-forgot_password__back', function() {
		popup_login()
	});

	$('body').on( 'click', '.popup-singup_btn', function() {
		popup_open('singup', function(){

			$('#registration-form').yiiActiveForm([
			{
				"id":"register-form-email",
				"name":"email",
				"container":".field-register-form-email",
				"input":"#register-form-email",
				"error":".invalid-feedback",
				"enableAjaxValidation":true
			},{
				"id":"register-form-username",
				"name":"username",
				"container":".field-register-form-username",
				"input":"#register-form-username",
				"error":".invalid-feedback",
				"enableAjaxValidation":true
			},{
				"id":"register-form-password",
				"name":"password",
				"container":".field-register-form-password",
				"input":"#register-form-password",
				"error":".invalid-feedback",
				"enableAjaxValidation":true
			}], {
				"errorSummary":".alert.alert-danger",
				"errorCssClass":"is-invalid",
				"successCssClass":"is-valid",
				"validationStateOn":"input"
			});
			$('#registration-form').submit(function(){
			    // ym(32204314, 'reachGoal', 'reg');
			    return true;
			});

			$('#pass-visibility').on('click',function(){
			    $('#register-form-password').attr('type', $(this).hasClass('active') ? 'password' : 'text');
			    $(this).toggleClass('active')
			});
			$('#register-form-password').on('keyup',function(){
			    var t = $(this).val();
			    $('[data-min-chars=""]').attr('class', /(?=^.{8,}$).*$/.test(t) ? 'text-green' : 'text-red');
			    $('[data-number-requirement=""]').attr('class', /(?=.*\d).*$/.test(t) ? 'text-green' : 'text-red');
			    $('[data-letter-requirement=""]').attr('class', /(?=.*[A-z]).*$/.test(t) ? 'text-green' : 'text-red');
			});
			if( $('#register-form-password').val().length )
			    $('#register-form-password').removeClass('is-invalid').keyup();

		});
	});

	$('body').on( 'click', '.forgot_password', function() {
		popup_open('forgot_password');
		$('#password-recovery-form').yiiActiveForm([
		{
			"id":"recovery-form-email",
			"name":"email",
			"container":".field-recovery-form-email",
			"input":"#recovery-form-email",
			"error":".invalid-feedback",
			"enableAjaxValidation":true
		}], {
			"errorSummary":".alert.alert-danger",
			"errorCssClass":"is-invalid",
			"successCssClass":"is-valid",
			"validationStateOn":"input"
		});
	});

	$('body').on( 'click', '.popup-contact_btn', function() {
		popup_open('contact');
	});

	$('body').on( 'click', '.popup_close', function() {
	  	$('.popup').fadeOut();
	  	$('.popup-backdrop').fadeOut();
	});
	$('.popup-backdrop').on( 'click', function() {
	  	$('.popup').fadeOut();
  		$('.popup-backdrop').fadeOut();
	});
	$('body').on( 'click', '.popup-instructions_btn', function() {
	  	$('.popup').fadeOut();
  		$('.popup-backdrop').fadeOut();
	});


	$('body').on( 'click', '.popup-contact_send', function() {
		// validate email
		let data = {
			email: $('.popup-active [type="email"]').val(),
			msg: $('.popup-active textarea').val()
		};

		if( !validateEmail(data.email) ) {
			$('.popup-active [type="email"]').addClass('is-invalid');
			return;
		}
		else 
			$('.popup-active [type="email"]').removeClass('is-invalid');

		if( data.msg.length < 10 ) {
			$('.popup-active textarea').addClass('is-invalid');
			return;
		}
		else 
			$('.popup-active textarea').removeClass('is-invalid');

		$.post('/api/send-email', data, function(d){
			if( d !== true ) {
				alert('Error occurred');
				return;
			}
			$('.popup-email-sent .popup-instructions_info span').text(data.email);
			$('.popup-active').html($('.popup-email-sent').html());

		});

		// get data and send to api

		function validateEmail(email) {
		    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    return re.test(String(email).toLowerCase());
		}
	});

	




	// Slider

	 $( window ).resize(function() {
		var windowWidth = $( window ).width();
		var classCheck = $('.advantages_items' ).find('.slick-list');
	  	if (windowWidth < 768 &&  !classCheck.length == 1) {
	  		$('.advantages_items').slick({
				dots: true,
				infinite: true,
				slidesToShow: 1,
				arrows: false,
				mobileFirst: true,
			    responsive: [
			          {
			            breakpoint: 768,
			            settings: 'unslick'
			          }
			    ]
			});
	  	}
	});
 	$('.advantages_items').slick({
	  dots: true,
	  infinite: true,
	  slidesToShow: 1,
	  arrows: false,
	  mobileFirst: true,
	  responsive: [
	          {
	            breakpoint: 768,
	            arrows: false,
	            settings: 'unslick'
	          }
	    ]
	});

    $('body').on('keyup','.is-invalid',function(){
        $(this).removeClass('is-invalid');
    });



    $.ajax({
        url: 'https://surfe.be/api/landing-data',
        success: function(d)
        {
            // d = JSON.parse(d);

            $('#cpc_avg').html( d['cpc:avg'].split('.').join('<span>.</span>') );
            $('#clk_day').html( d['clk:day'] );
            $('#imp_day').html( d['imp:day'] );
            calc_params.cpc = d['cpc'];
            calc_params.cpm = d['cpm'];

            $('#stat_usr_ttl span:first').text(d['usr:total']);

            if( 'bnr:total' in d )
            {
            	$('#stat_bnr_ttl span:first').text(d['bnr:total']);
            	$('#stat_popup_ttl span:first').text(d['popup:total']);
            	$('#stat_video_ttl span:first').text(d['video:total']);
            }
        }
    });

});