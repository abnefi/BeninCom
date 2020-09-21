$(function(){
    if(/\/ext\/iframe/.test(location.href)) 
        return;
    if(/\/login/.test(location.href)) 
        return;
    if(/\/register/.test(location.href)) 
        return;
    if(/^\/user\//.test(location.pathname)) 
        return;

    ajaxe.init({eval_scripts:true});
    ajaxe.csrf = {
      	param : $('meta[name=csrf-param]').attr("content"),
      	token : $('meta[name=csrf-token]').attr("content")
    };

    ajaxe.assets = [];
    $('#assets script').each(function(){
    	if($(this).attr('src'))
    		ajaxe.assets.push($(this).attr('src'));
    });

    ajaxe.events.ontpl.run(false);
});


// RULES -------------------------------------------------------

ajaxe.rules.add(/\/ext\/click.*/, function (str){
    window.open(str);
    return false;
});

ajaxe.rules.add(/\?language/, function (str){
    setTimeout(function(){location.href=location.href;},500);
    return str;
});

ajaxe.rules.add('/', function (str){
  location.href = '/';
  return false;
});

ajaxe.rules.add(/./, function (str){

  // защита от двойных запросов форм
  if(ajaxe.CURRENT_SENDDATA.same_protect)
  {
    if(ajaxe.same_protect === ajaxe.CURRENT_SENDDATA.same_protect)
      return false;

    ajaxe.same_protect = ajaxe.CURRENT_SENDDATA.same_protect;
  }

  // csrf
	ajaxe.CUSTOM_SENDDATA = {};
  ajaxe.CUSTOM_SENDDATA[ajaxe.csrf.param] = ajaxe.csrf.token;

  if(ajaxe.recaptcha)
    ajaxe.CUSTOM_SENDDATA['recaptcha'] = ajaxe.recaptcha;

	return str;
});


// EVENTS -------------------------------------------------------

ajaxe.events.onrequest.bind(function(d){
  wloader.fadeIn(d);
  $('.chartjs-tooltip').remove();
});

ajaxe.events.onresponse.bind(function(d){
	if(d && d.header && d.header.redirect)
		history.replaceState(null, null, d.header.redirect)

  wloader.hide(d && d.header ? d.header.tpl : false);
});

ajaxe.events.onerror.bind(function(e){
  if(e.type === 'server_response')
    wloader.hide();
});

ajaxe.events.ontpl.bind(function(d){

  if( d.content )
  {
    $('.nicescroll-rails').remove();
    $('.popover:not(.popover-deadline)').remove();
    
    detectAdBlock();
  }


  // деактивируем валидацию форм Yii 
  setTimeout(function(){
    $('form').off('submit.yiiActiveForm');
  },200);

  // включаем подсказки и поповеры
  $("[data-toggle='tooltip']").tooltip(); 
  $("[data-toggle='popover']").popover(); 

  rating_block();
  sortSelectInit();
  chartSwitchInit();

  if(!d) return;



	if(d.header.csrf)
		ajaxe.csrf = {
			param : d.header.csrf.param,
			token : d.header.csrf.token
		};

  if( 'tpl' in d.header && d.header.tpl !== 'site/queue' && typeof d.header.tpl === 'string')
    grecaptcha.ready(function() {
      var act = '/'+d.header.tpl.replace(/-/g,'_');
      grecaptcha.execute('6LfnWWMUAAAAAM5qI-omxxZOYyJg63Cv0XNy6pRZ', {
        action: act
      }).then(function(token) {
        ajaxe.recaptcha = token;
      });
    });


  // stop polling if header does not have 'allow_poll' field
  if(!('allow_poll' in d.header) && wpoll.status)
  {
    wpoll._xhr.abort();
    wpoll.status = false;
  }


  // if(!ajaxe.current.header.tpl && typeof _ws !== 'undefined')
  //   _ws.send('indexStats',_ws.message_id);

  // if('_popover_deadline' in window && _popover_deadline)
  //   clearTimeout(_popover_deadline);

  // $('.banner_cpm').on('change input', function() {
  //     var inputWidth = $(this).textWidth();
  //     $(this).css({
  //         width: inputWidth
  //     })
  // }).trigger('input');

  wshow_more.init();

  // if( d.content && !('scrollTo' in d.widgets) )
  //   ajaxe.widgets.scrollTo.tpl(1);

});


















// WIDGETS -------------------------------------------------------


ajaxe.widgets.add({
  name: 'banner_stats',

  tpl: function(d) {
    $(d.id).replaceWith( ajaxe.links(d.content) );
  },
});





ajaxe.widgets.add({
  name: 'rolenav',

  tpl: function(d)
  {
    $('.role-switch_item').removeClass('active');
    $('.role-switch_item[data-info="'+d+'"]').addClass('active');

    $('.role-switch').attr('class','role-switch '+d);

    if(d === 'adv')
      $('.header-balance').removeClass('hide');
    else
      $('.header-balance').addClass('hide');
  },

});

