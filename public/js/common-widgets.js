ajaxe.widgets.add({
  name: 'history_fix',
  tpl: function(d) {
  	history.replaceState(null, null, d);
  }
});



ajaxe.widgets.add({
  name: 'sidenav',
  topen: 0,
  tclose: 0,

  tpl: function(d)
  {
    $('.nav_list li').removeClass('active');
    $('.nav_list').find('a[href="'+d+'"]').parent().addClass('active');
  },
});



ajaxe.widgets.add({
  name: 'scrollTo',
  tpl: function(d) {
    if(location.search === "?no_scroll=1")
      return;
    $('html, body').animate({scrollTop:d}, 200, 'swing');
  }
});



ajaxe.widgets.add({
  name: 'uploadFile',
  tpl: function(d) {

    var domain = location.host === 'surfe.be' ? 'https://static.surfe.be' : 'https://'+location.host+'/static';

    d = domain+d;

    if( /upload\/ava/.test(d) )
    {
      wpopup.hide();
      $('.header-profile_photo img').attr('src',d);
      $('.my-profile_photo img').attr('src',d);
      $('.profile-photo_frame img').attr('src',d);
    }
    else
    {
      $('[name="Banner[img]"]').val(d);
      $('[name="Teaser[img]"]').val(d);
      $('.popup .image-url').val(d).change();
    }
  }
});



ajaxe.widgets.add({
  name: 'banner_remove',

  tpl: function(d)
  {
    $('.task_wrap[data-bid="'+d+'"]').parent().slideUp();
  },

});



ajaxe.widgets.add({
  name: 'adv_balance',

  tpl: function(d)
  {
    $('#adv_bal-dol').text(d.dol);

    if( 'rub' in d )
      $('#adv_bal-rub').text(d.rub);
  },

});



ajaxe.widgets.add({
  name: 'graph',

  tpl: function(d)
  {
    $('#'+d.id).replaceWith(d.content);
    sortSelectInit();
  },

});





ajaxe.widgets.add({
  name: 'loader',
  topen: 0,
  tclose: 0,

  filter: function(link)
  {
    if( !link )
      return false;

    if( /site\/queue/.test(link) )
      return true;
    if( /banner\/check/.test(link) )
      return true;
    if( /banner\/stats/.test(link) )
      return true;
    if( /banner\/params/.test(link) )
      return true;
    if( /profile\/get-notifications/.test(link) )
      return true;
    if( /banner\/load-url/.test(link) )
      return true;
    if( /referral\/bm-conf/.test(link) )
      return true;
    if( /ticket\/get-dialog/.test(link) )
      return true;
    if( /ticket\/view/.test(link) )
      return true;
    if( /ticket\/admin\/answer/.test(link) )
      return true;

    return false;
  },

  fadeIn: function(link)
  {
    if(this.filter(link))
      return;

    this.topen = setTimeout(function(){

      $('#loader').fadeIn(600);
      wloader.topen = 0;

      wloader.tclose = setTimeout(function(){
        $('#loader').fadeOut(1500);
      },30000);

    },1000);
  },

  hide: function(link)
  {
    if(this.filter(link))
      return;

    if(this.topen)
    {
      clearTimeout(this.topen);
      this.topen = 0; 
    }

    if(this.tclose)
    {
      clearTimeout(this.tclose);
      this.tclose = 0; 
    }

    $('#loader').hide();
  }

});
var wloader = ajaxe.widgets.loader;







ajaxe.widgets.add({
  name: 'popup',
  hidden: true,
  icon: '',
  _f: {},
  onclose: null,
  // можно закрыть окно по клику за границами окна
  close: true,
  tpl: function(d)
  {

		if( !$('.popup_over').length ) 
    {
			$('body').append('<div class="popup_over"><div id="popup_close_layer"></div><div class="popup"></div></div>');

  		$('#popup_close_layer').on('mousedown',function(){

        if( wpopup.close && wpopup.onclose && ajaxe.options.eval_scripts ) {
          eval(wpopup.onclose);
          wpopup.onclose = null;
        }

        if( wpopup.close ) 
          wpopup.hide();

	    });
		}


    $('.popup_over .popup').attr('class','popup '+(d.class || 'popup-default') );

  	if(d.content)
    {
      var cnt = '<div class="popup_close__block popup-close"><img src="/static/flatonica/img/close.svg" alt="ico"></div>';

      if(d.title)
        cnt += '<div class="popup-default_title">'+d.title+'</div>';

    	$('.popup_over .popup').html(ajaxe.links(cnt + d.content));
    }
  	else
    	$('.popup_over .popup').html('');

    $('.popup-close').on('click',function(){
      if( wpopup.onclose && ajaxe.options.eval_scripts ) {
        eval(wpopup.onclose);
        wpopup.onclose = null;
      }
      wpopup.hide();
    });

    if(d.onclose)
      wpopup.onclose = d.onclose;

    if(d.ajaxe)
    {
      ajaxe.links();
      ajaxe.forms();
    }

    this.show();

    if(d.close)
    	this.hide();
    
  },
  hide: function()
  {
    this.handler( 'beforeHide' );

  	$('.popup-backdrop').fadeOut();
  	$('.popup_over').fadeOut();

    $('body').removeClass('popuped');
    this.hidden = true;

    this.handler( 'afterHide' );
  },
  show: function()
  {
    this.handler( 'beforeShow' );

  	$('.popup-backdrop').show();
  	$('.popup_over').show();

    $('body').addClass('popuped');
    this.hidden = false;

    this.handler( 'afterShow' );
  },

  handler: function(n,d)
  {
    for(var i in this._f[n])
    {
      this._f[n][i](d);
    }
  },
  bind: function(n,f)
  {
    if(typeof this._f[n] === 'undefined')
      this._f[n] = [f];
    else if(typeof f === 'function')
      this._f[n].push(f);
  },
  unbind: function()
  {
    this._f = {};
  }
}); // popup
var wpopup = ajaxe.widgets.popup;









ajaxe.widgets.add({
  name: 'notify',
  play: false,

  tpl: function(d)
  {
    if( d > 0 )
    {
      var cur = 0;
      if( $('.header-notif_badge').length )
      {
        cur = parseInt($('.header-notif_badge').text());
        $('.header-notif_badge').text(d);
      }
      else
        $('.header-notif_icon').prepend('<div class="header-notif_badge">'+d+'</div>');

      if( wnotify.play && cur < d && $('#notif-audio').length )
      {
        wnotify.play = false;
        var audio = $('#notif-audio')[0];
        audio.volume = 0.6;
        audio.play();
      }
    }
    else if( $('.header-notif_badge').length )
        $('.header-notif_badge').remove();
  },

  init: function()
  {
    $('.header-notif').on('click', function() {
      if( !$(this).hasClass('active') )
        wnotify.load();
      $(this).toggleClass('active dropdown-active');
    });
    $('.header-notif_dropdown .ntf-close').on('click',function(){
      $('.header-notif').click();
    });
  },

  load: function()
  {
    ajaxe.query('/profile/get-notifications',function(d){

      if( !'content' in d )
        return;

      $(".header-notif_dropdown-list").html(d.content).niceScroll({
          cursorcolor: "#3f8efa", // change cursor color in hex
          cursoropacitymin: 1, // change opacity when cursor is inactive (scrollabar "hidden" state), range from 1 to 0
          cursoropacitymax: 1, // change opacity when cursor is active (scrollabar "visible" state), range from 1 to 0
          cursorwidth: "3px", // cursor width in pixel (you can also write "5px")
          cursorborder: "0px solid #fff", // css definition for cursor border
          cursorborderradius: "2px",
          background: "#f5f8fc",
      });

      ajaxe.links();

      $(".header-notif_dropdown-list a").click(function(){
        $('.header-notif').click();
      });

      wnotify.tpl(0);

    });
  }
});

var wnotify = ajaxe.widgets.notify
wnotify.init();







ajaxe.widgets.add({
  name: 'poll',
  nonstop_path: false,
  status: false,
  _xhr: null,
  _to : false,
  _f: {},
  resp: null,
  q: null,

  init: function(q,f)
  {
    this.q = q;
    this.unbind();

    if(f)
      this.bind( 'event', f );

    if( !this.status )
        ajaxe.query( '/site/queue?q='+q );
  },
  tpl: function(d) {
    this.resp = d;
    if(wpoll._to)
    {
      clearTimeout(wpoll._to);
      wpoll._to = false;
    }
    setTimeout(function(){wpoll.connect()},1000);
  },
  connect: function()
  {
    if(!wpoll.resp) return;
    wpoll.resp.act = 'a_check';
    wpoll.status = true;
    wpoll._xhr = $.post('/im255', wpoll.resp, function(d){
      if(d.ts)
      {
        wpoll.resp.ts = d.ts;

        for(var i in d.events)
        {
          try{
            wpoll.handler( 'event', JSON.parse(d.events[i]) );
          }catch(e){
            wpoll.handler( 'event', d.events[i] );
          }

        }

        wpoll.handler( 'after', d.events );

        if(wpoll.status)
          wpoll._to = setTimeout(function(){
            wrapErrors(function(){wpoll.connect()})();
          },Math.round(Math.random()*1000)+300);
        else
          wpoll._to = false;
        
      }
      else
      {
        if('failed' in d && d.failed == 2)
        {
          if(d.err !== 4)
            ajaxe.query( '/site/queue?q='+wpoll.q );
        }
        else
          wpoll.status = false;
      }
    },'json').fail(function(e) {
        wpoll.status = false;
    });
  },
  handler: function(n,d)
  {
    for(var i in this._f[n])
    {
      this._f[n][i](d);
    }
  },
  bind: function(n,f)
  {
    if(typeof this._f[n] === 'undefined')
      this._f[n] = [f];
    else if(typeof f === 'function')
      this._f[n].push(f);
  },
  unbind: function()
  {
    this._f = {
      after: [wpoll.default]
    };
  },
  default: function(d)
  {
    for( var i in d ){

      if( d[i] === 'notif_upd' ) {
        wnotify.play = true;
        setTimeout(function(){
          ajaxe.query('/profile/notifications-count');
        },1000);
      }
      else if( d[i].substr(0,13) === 'banner_budget' ) {
        ajaxe.query('/banner/stats?bid='+d[i].substr(13));
      }
      else if( d[i].indexOf('incoming_msg') > 0)
      {
        d[i] = JSON.parse(d[i]);
        if( 'all_msgs' in d[i] )
        {
          if( $(".support_chat").data('id') != d[i].sender )
            wim.play = true;
          wim.badge(d[i].all_msgs);
        }
      }
    }
  }
});
var wpoll = ajaxe.widgets.poll;








ajaxe.widgets.add({
  name: 'show_more',

  init: function()
  {
    $('[data-pagination="show-more"]:not(.inited)').addClass('inited').on('click',function(){
      ajaxe.query($(this).attr('href'),{show_more:true});
      ajaxe.widgets.history_fix.tpl($(this).attr('href'));
      return false;
    });

  },
  tpl: function(d) {
    if( d.mode === 'table' )
    {
      var table = d.content.substr(d.content.indexOf('<tbody>')+7);
      table = table.substr(0,table.indexOf('</tbody>'));

      if( 'replace' in d && d.replace )
        $('#content tbody').html(table);
      else
        $('#content tbody').append(table);
    }
    else if( d.mode === 'mark' )
    {
      var data = d.content.substr(d.content.indexOf('<!--ShowMore-start-->')+21);
      data = data.substr(0,data.indexOf('<!--ShowMore-end-->'));

      if( 'replace' in d && d.replace )
        $('.show_more-placeholder').parents('.table_body').html(data);
      else
        $('.show_more-placeholder').replaceWith(data);
    }
    ajaxe.links();

    var html = $.parseHTML('<div>'+d.content+'</div>');
    $('.show_more-row').replaceWith($(html).find('.show_more-row'));
    $('.pagination-row').replaceWith($(html).find('.pagination-row'));
  },
});
var wshow_more = ajaxe.widgets.show_more;








ajaxe.widgets.add({
  name: 'charts',

  tpl: function(d)
  {
    var els = [];

    if(d.el) {
      els[0] = d;
    } else {
      els = d;
    }

    for(var k in els) {
      if(
        typeof els[k].data.tooltip !== 'undefined'
        && els[k].data.tooltip.formatter
      ) {
        els[k].data.tooltip.formatter =function() {
          var s;
          if (this.point) { // the pie chart
            console.log(this);
            s = '' +
                    this.point.name + ': <b>' + this.y + '</b>';
          } else {
            s = '' + this.x + ' <br/>';

            for (var i in this.points)
            {
              var p = this.points[i];
              s += p.series.name + ': <b>' + p.y + '</b><br/>';
            }
          }
          return s;
        };
      }
      $(els[k].el).highcharts(els[k].data);
    }
  }

});
var wcharts = ajaxe.widgets.charts;









ajaxe.widgets.add({
  name: 'ticket',

  tpl: function(d)
  {
    if( 'new' in d )
      this.new(d.new);
    if( 'answer' in d )
    {
      this.answer(d.answer);
      this.messageFormFlush();
    }
    if( 'action' in d )
      $('form.support_chat__message-form').attr('action',d.action);

    if( 'title' in d )
      $('.support_chat__title').text( d.title );
    if( 'subtitle' in d )
      $('.support_chat__subtitle').text( d.subtitle );

    if( 'menu' in d )
      $('.extension-select_wrap.ticket').replaceWith( d.menu );

    if( 'status' in d )
    {
      if( d.status === 3 )
      {
        $('.support_chat__bottom').hide();
        $('.support_chat__top-status').show();
        $('.support_chat__top-status.succeed').removeClass('d-none');
      }
      else
      {
        $('.support_chat__bottom').show();
        $('.support_chat__top-status').hide();
        $('.support_chat__top-status.succeed').addClass('d-none');
      }
    }
    
    if( 'open' in d )
    {
      this.open(d.open);
      $('.my-ticket').removeClass('active');
      $('.my-ticket[data-id="'+d.id+'"]').addClass('active');
    }
  },

  open: function(data)
  {
    var cur_day = null, html = '', mark = false;

    for(var i in data)
    {
      i = data[i];

      if( !mark && !i.readed )
        mark = true;

      if( cur_day !== i.date )
      {
        cur_day = i.date;
        html += '<div class="support_chat__main-date">'+cur_day+'</div>';
      }

      if( i.files.length )
        i.text += '<br>';

      for( var f in i.files )
      {
        i.text += '<a class="ticket_msg-img_preview" href="//static.surfe.be/upload/fileTicket/'+i.files[f]+'" target="_blank">\
        <img src="//static.surfe.be/upload/fileTicket/reduced/'+i.files[f]+'" alt="file">\
        </a>';
      }


      html += '<div class="support_chat__main-item '+(i.is_agent?'interlocutor':'user')+'">\
        <div class="support_chat__main-text">'+i.text+'</div>\
        <div class="support_chat__main-item--date">'+i.time+'</div>\
      </div>';
    }

    $('.support_chat__area').html(html);

    $('.support_chat__empty').hide();
    $('.support_chat__full').show();

    if( !$('body').hasClass('is-mobile') )
    {

      if( !$(".support_chat__main").getNiceScroll().length )
        $(".support_chat__main").niceScroll({
            cursorcolor: "#3F8EFA", // change cursor color in hex
            cursoropacitymin: 1, // change opacity when cursor is inactive (scrollabar "hidden" state), range from 1 to 0
            cursoropacitymax: 1, // change opacity when cursor is active (scrollabar "visible" state), range from 1 to 0
            cursorwidth: "4px", // cursor width in pixel (you can also write "5px")
            cursorborder: "0px solid #fff", // css definition for cursor border
            cursorborderradius: "2px",
            background: "#E1EBF5",
            preservenativescrolling: false
        });
      else
        $(".support_chat__main").getNiceScroll().resize();

      setTimeout(function(){
        $(".support_chat__main").getNiceScroll().resize();
      },1500);

    }
    else
    {
      $('.my-tickets').hide();
      $('.support_chat__wrap').show();
      wticket.mobileHeight();
    }

    $(".support_chat__main").scrollTop($(".support_chat__main").prop("scrollHeight"));
    $('#ticket-'+i.id_head).find('.my-tickets_indicator').remove();
    $(".support_chat").data('id',i.id_head);

    if( mark )
    ajaxe.query('/ticket/ticket/mark-as-read?id='+i.id_head,function(status){
      if(status)
      {
        $('#ticket-'+i.id_head).find('.my-tickets_indicator').remove();
        $('#ticket-'+i.id_head).find('.my-ticket_ico.unread').replaceWith('<div class="my-ticket_ico wait">\
          <img src="/static/flatonica/img/mail-open-line.svg" alt="ico">\
        </div>');
      }
    });
  },

  new: function(d)
  {
    $('.my-tickets_list-empty').remove();
    $('.my-ticket').removeClass('active');
    $('.my-tickets_list').prepend('<a href="/ticket/view?id='+d.id+'" class="my-ticket active" id="ticket-'+d.id+'" data-id="'+d.id+'" data-status="0">\
        <div class="my-ticket_ico wait">\
          <img src="/static/flatonica/img/ticket-wait.svg" alt="ico">\
        </div>\
        <div class="my-ticket_info">\
          <div class="my-ticket_title">'+d.topic+'</div>\
          <div class="my-ticket_subtitle">'+d.department+'</div>\
        </div>\
        <div class="my-ticket_details">\
          <div class="my-ticket_time">'+d.time+'</div>\
        </div>\
      </a>');

    if( 'onticket_click' in window )
      onticket_click();

    $('#ticket-'+d.id).click();
  },

  answer: function(d)
  {
    if( d.files.length )
      d.text += '<br>';

    for( var f in d.files )
    {
      d.text += '<a href="//static.surfe.be/upload/fileTicket/'+d.files[f]+'" target="_blank">\
      <img src="//static.surfe.be/upload/fileTicket/reduced/'+d.files[f]+'" alt="file">\
      </a>';
    }

    if( $('.support_chat__main-date:last').text().trim() !== d.date)
      $('.support_chat__area').append('<div class="support_chat__main-date">'+d.date+'</div>');


    $('.support_chat__area').append('<div class="support_chat__main-item interlocutor">\
      <div class="support_chat__main-text">'+d.text+'</div>\
      <div class="support_chat__main-item--date">'+d.time+'</div>\
    </div>');

    $(".support_chat__main").getNiceScroll().resize();
    $(".support_chat__main").scrollTop($(".support_chat__main").prop("scrollHeight"));
  },

  queue: function(d)
  {
    if( typeof d !== 'object' || !'ticket_id' in d )
      return;

    var tck = $('#ticket-'+d.id_head);
    if( !tck.length )
      return;

    if( tck.hasClass('active') )
      wticket.answer(d);
    else
    {
      tck.find('.my-ticket_ico').addClass('unread');
      tck.find('.my-ticket_ico img').attr('src','https://static.surfe.be/flatonica/img/mail-unread-line.svg');

      if( tck.find('.my-tickets_indicator').length )
        tck.find('.my-tickets_indicator').text( parseInt(tck.find('.my-tickets_indicator').text().trim())+1 );
      else
        tck.find('.my-ticket_details').append('<div class="my-tickets_indicator">1</div>');
    }
  },

  close: function()
  {
    var id = $(".support_chat").data('id');
    if( id )
      ajaxe.query('/ticket/admin/closed?id='+id);
  },

  remove: function()
  {
    var id = $(".support_chat").data('id');
    if( id )
      ajaxe.query('/ticket/admin/delete?id='+id);
  },

  fileUploader: function() {

    console.log(this.files);

    if (this.files && this.files[0]) {
      var context = $(this).parents('.support-context');
      $(context).find('.support_chat__attachment-items--block').show();
      $(".support_chat__main").getNiceScroll().resize();

      var id = parseInt(Math.random() * 100000);

      $(this).parent().addClass('loaded').addClass('file-'+id);

      var reader = new FileReader();
      reader.onload = function(e) {
        console.log('FileReader onload',e);

        var item = $(context).find('.support_chat__attachment-item.d-none').clone();
        item.attr('id','preview-'+id).removeClass('d-none');
        item.find('img.img-preview').attr('src', e.target.result).on('load',wticket.mobileHeight);
        item.find('.support_chat__attachment-item--del').on('click',function(){
          $('.support_chat__attachment .file-'+id).remove();
          $(this).parent().remove();

          if( !$(context).find('.support_chat__attachment-item:not(.d-none)').length )
          {
            $(context).find('.support_chat__attachment-items--block').hide();
            wticket.mobileHeight();
          }
        });
        
        $(context).find('.support_chat__attachment-items').append(item);
        $(context).find('.support_chat__attachment .loaded').hide();

        wticket.newFileInput(context)
      }
      reader.readAsDataURL(this.files[0]); // convert to base64 string

    }
    else
      $(context).find('.support_chat__attachment-items--block').hide();

  },

  newFileInput: function(context) {
    console.log('newFileInput');
    if( !context )
      context = $('.support-context');
    var input = $(context).find('.support_chat__attachment label.empty').clone().removeClass('empty d-none');
    input.find('input').addClass('inited').change(wticket.fileUploader)
    $(context).find('.support_chat__attachment').append(input)
  },

  messageFormFlush: function() {
    $('.support_chat__message textarea').val('')[0].style.height = '40px';
    $('[name="TicketFile[fileName][]"]').val('');

    $('.support_chat__attachment-items--block').hide();
    $('.support_chat__attachment-item:not(.d-none)').remove();

    $('.support_chat__attachment label:not(.empty)').remove();
    wticket.newFileInput();

    $('.support_chat__message').removeClass('loader');
    wticket.mobileHeight();
  },

  mobileHeight: function()
  {
    if( !$('body').hasClass('is-mobile') )
      return;

    var h = $(window).height() - $('header').outerHeight() - $('.main-tabs_row').outerHeight();
    h = h - $('.support_chat__bottom').outerHeight() - $('nav').outerHeight();  

    $('.support_chat').height(h);
    $('.support_chat__main').height(h - $('.support_chat__top').outerHeight());
    $(".support_chat__main").scrollTop($(".support_chat__main").prop("scrollHeight"));
  }
});
var wticket = ajaxe.widgets.ticket;


















ajaxe.widgets.add({
  name: 'im',
  play: false,

  tpl: function(d)
  {
    if( 'send' in d )
    {
      this.msg_placeholder(d.send.peer, $('.my-tickets').data('you')+d.send.text)
      this.send(d.send);
    }
    if( 'action' in d )
      $('form.support_chat__message-form').attr('action',d.action);


    if( 'im_enabled' in d )
      this.im_enabled(d.im_enabled);
    if( 'badge' in d )
      this.badge(d.badge);

    if( 'title' in d )
      $('.support_chat__title').text( d.title );
    if( 'subtitle' in d )
      $('.support_chat__subtitle').text( d.subtitle );

    if( 'unicue' in d )
      this.unicue(d.unicue);

    if( 'menu' in d )
      $('.extension-select_wrap.ticket').replaceWith( d.menu );

    if( 'status' in d )
    {
      if( d.status === 3 )
      {
        $('.support_chat__bottom').hide();
        $('.support_chat__top-status').show();
        $('.support_chat__top-status.succeed').removeClass('d-none');
      }
      else
      {
        $('.support_chat__bottom').show();
        $('.support_chat__top-status').hide();
        $('.support_chat__top-status.succeed').addClass('d-none');
      }
    }
    
    if( 'history' in d )
    {
      this.history(d.history);
      if( !$('body').hasClass('is-mobile') )
      {
        $('.my-ticket').removeClass('active');
        $('#peer-'+d.history.peer_id).addClass('active');
      }
    }
  },

  badge: function(d)
  {
    if( d > 0 )
    {
      var cur = 0;
      if( $('.header-dialog_badge').length )
      {
        cur = parseInt($('.header-dialog_badge').text());
        $('.header-dialog_badge').text(d);
      }
      else
        $('.header-dialog_icon').prepend('<div class="header-dialog_badge">'+d+'</div>');

      if( wim.play && cur < d && $('#notif-audio').length )
      {
        wim.play = false;
        var audio = $('#notif-audio')[0];
        audio.volume = 0.6;
        audio.play();
      }
    }
    else if( $('.header-dialog_badge').length )
        $('.header-dialog_badge').remove();
  },

  im_enabled: function(d)
  {
    $('.support_chat__message').removeClass('loader');

    if( 'peer_id' in d )
    {
      $('.support_chat__from-disabled p.peer').data('peer',d.peer_id);
    }

    if( 'im' in d && d.im === 0 )
    {
      $('.support_chat__from-disabled p').hide();
      $('.support_chat__from-disabled p.im').show();
      $('.support_chat__from-disabled').addClass('active');
      return;
    }

    if( 'peer' in d && d.peer === 0 )
    {
      $('.support_chat__from-disabled p').hide();
      $('.support_chat__from-disabled p.peer').show();
      $('.support_chat__from-disabled').addClass('active');
      return;
    }
    
    // var cur_peer = $(".support_chat").data('id');
    // if( 'im' in d && d.im === 1 && cur_peer 
    //   && cur_peer === $('.support_chat__from-disabled p.peer').data('peer') )
    // {
    //   $('.support_chat__from-disabled p').hide();
    //   $('.support_chat__from-disabled p.peer').show();
    //   $('.support_chat__from-disabled').addClass('active');
    //   return;
    // }

    if( 'im' in d && d.im === 1 && 'peer' in d && d.peer === 1 )
     $ ('.support_chat__from-disabled').removeClass('active');

  },

  history: function(data)
  {
    var cur_day = null, html = '', mark = false, 
    cl,photo,my_photo,prof_link,prev={sender:0},
    cur_time = (new Date()).valueOf(),
    $main = $(".support_chat__main");

    if( data.online )
    {
      $('#peer-'+data.peer_id).addClass('online');
      $('.message_chat__subtitle span').text($('.message_chat__top-info').data('online'));
    }
    else
    {
      $('#peer-'+data.peer_id).removeClass('online');
      $('.message_chat__subtitle span').text($('.message_chat__top-info').data('was')+data.last_up);
    }

    if( data.blocked )
    {
      $('.message_chat__block-user').data('state','unblock');
      $('.message_chat__block-user span').text($('.message_chat__block-user').data('unblock'));
    }

    $('.message_chat__user .peer_name').text(data.peer_name).attr('href',data.peer_link);

    for(var i in data.history)
    {
      i = data.history[i];

      if( !mark && i.unread )
        mark = true;

      if( cur_day !== i.date )
      {
        cur_day = i.date;
        html += '<div class="support_chat__main-date">'+cur_day+'</div>';
      }

      // if( i.files.length )
      //   i.text += '<br>';

      // for( var f in i.files )
      // {
      //   i.text += '<a class="ticket_msg-img_preview" href="//static.surfe.be/upload/fileTicket/'+i.files[f]+'" target="_blank">\
      //   <img src="//static.surfe.be/upload/fileTicket/reduced/'+i.files[f]+'" alt="file">\
      //   </a>';
      // }

      my_photo = $('body').hasClass('is-mobile') ? $('.profile-photo_frame img').attr('src') : $('.header-profile_photo img').attr('src');

      cl = data.user_id === i.sender;
      photo = cl ? my_photo : data.peer_photo;
      prof_link = cl ? $('.header-profile_dropdown__item:first').attr('href') : data.peer_link;
      html += '<div class="support_chat__main-item '+(cl?'interlocutor':'user')+' '+(i.unread?'unread':'')+'">';
      if(i.sender !== prev.sender)
      html += '<a href="'+prof_link+'" target="_blank" class="message_chat__main-item--photo"><img src="'+photo+'" alt="img"></a>';
      html += '<div class="support_chat__main-text">'+i.text+'</div>';
      if(i.sender !== prev.sender)
      html += '<div class="support_chat__main-item--date">'+i.time+'</div>';
      html += '</div>';
      prev = i;
    }
    $(".support_chat").data('id',data.peer_id);

    if( !data.history.length )
      html = data.empty_msg;

    if( data.show_more )
    {
      // $('.support_chat__area').find('.support_chat__main-date:first').remove();
      var scrollH = $main.prop("scrollHeight"),
      scrollT = $main.scrollTop();
      $('.support_chat__area').prepend(html);
    }
    else
      $('.support_chat__area').html(html);

    $('.support_chat__area .support_chat__main-date:first')
    .data('href',data.next_page).data('time',cur_time);

    wim.im_enabled({
      im: data.im_enabled,
      peer: data.peer_enabled,
      peer_id: data.peer_id
    });



    if( !$('body').hasClass('is-mobile') )
    {
      $('.support_chat__empty').hide();
      $('.support_chat__full').show();

      if( !$main.getNiceScroll().length )
        $main.niceScroll({
            cursorcolor: "#3F8EFA", // change cursor color in hex
            cursoropacitymin: 1, // change opacity when cursor is inactive (scrollabar "hidden" state), range from 1 to 0
            cursoropacitymax: 1, // change opacity when cursor is active (scrollabar "visible" state), range from 1 to 0
            cursorwidth: "4px", // cursor width in pixel (you can also write "5px")
            cursorborder: "0px solid #fff", // css definition for cursor border
            cursorborderradius: "2px",
            background: "#E1EBF5",
            preservenativescrolling: false
        });
      else
        $main.getNiceScroll().resize();

      // setTimeout(function(){
      //   $main.getNiceScroll().resize();
      // },1500);
      setTimeout(function(){
        if( data.show_more )
          $main.scrollTop($main.prop("scrollHeight") - scrollH + scrollT);
      },10);

    }
    else
    {
      $('.support_chat__top .message-item_photo img').attr('src', data.peer_photo);
      $('.my-tickets').hide();
      $('.support_chat__wrap').show();
      wim.mobileHeight();scrollT
    }

    if( !data.show_more )
      $main.scrollTop($main.prop("scrollHeight"));
    
    $('#peer-'+data.peer_id).find('.my-tickets_indicator').remove();

    $('.support_chat__bottom .support_chat__typing').attr('class','support_chat__typing typing_'+data.peer_id);

    if( mark )
      wim.read(data.peer_id);
  },

  endlessScroll: function()
  {
    console.log('chat scroll',this.scrollTop,this.clientHeight);
    if(this.scrollTop < 100)
    {
      var el = $(this).find('.support_chat__main-date:first'),
      cur_time = (new Date()).valueOf();
      // console.log(el.data(),cur_time)
      if( el.data('href') && cur_time > el.data('time')+1000 )
      {
        ajaxe.query(el.data('href'), {show_more:true})
        el.data('href', false);
      }
    }
  },

  send: function(d)
  {
    // if( d.files.length )
    //   d.text += '<br>';

    // for( var f in d.files )
    // {
    //   d.text += '<a href="//static.surfe.be/upload/fileTicket/'+d.files[f]+'" target="_blank">\
    //   <img src="//static.surfe.be/upload/fileTicket/reduced/'+d.files[f]+'" alt="file">\
    //   </a>';
    // }

    if( $('.history_empty').length )
      $('.history_empty').remove();

    if( $('.support_chat__main-date:last').text().trim() !== d.date)
      $('.support_chat__area').append('<div class="support_chat__main-date">'+d.date+'</div>');

    var peer_photo = $('body').hasClass('is-mobile') ? $('.support_chat__top .message-item_photo img').attr('src') : $('#peer-'+d.sender+' .message-item_photo img').attr('src');
    var my_photo = $('body').hasClass('is-mobile') ? $('.profile-photo_frame img').attr('src') : $('.header-profile_photo img').attr('src');

    var cl = d.user_id === d.sender, 
    prev_same = $('.support_chat__main-item:last').length && $('.support_chat__main-item:last').hasClass(cl?'interlocutor':'user'),
    photo = cl ? my_photo : peer_photo,
    prof_link = cl ? $('.header-profile_dropdown__item:first').attr('href') : d.peer_link;

    var html = '<div class="support_chat__main-item '+(cl?'interlocutor':'user')+' '+(d.unread?'unread':'')+'">';
    if( !prev_same )
    html += '<a href="'+prof_link+'" target="_blank" class="message_chat__main-item--photo"><img src="'+photo+'" alt="img"></a>';
    html += '<div class="support_chat__main-text">'+d.text+'</div>';
    if( !prev_same )
    html += '<div class="support_chat__main-item--date">'+d.time+'</div>';
    html += '</div>';
    $('.support_chat__area').append(html);

    wim.messageFormFlush();

    $(".support_chat__main").getNiceScroll().resize();
    $(".support_chat__main").scrollTop($(".support_chat__main").prop("scrollHeight"));
  },

  keyup: function(){
    if(this.scrollTop > 0){
      this.style.height = this.scrollHeight + "px";
      $(".support_chat__main").getNiceScroll().resize();
    }
    wim.typing();
  },
  keydown: function(e){
    e = e || window.event;
    // if (e.keyCode == 10 && (e.ctrlKey || e.metaKey && /mac/i.test(navigator.userAgent.toLowerCase()))) {
    //   $('#im_text').val($('#im_text').val()+'\n');
    //   return;
    // }
    if(e.ctrlKey && e.keyCode == 13) {
      e.preventDefault();
      $('form.support_chat__message-form').submit();
    }
  },

  last_typing: 0,
  typing: function(){
    var ts = new Date().getTime();
    if(ts-5000 > wim.last_typing){
      wim.last_typing = ts;
      ajaxe.query('/im/dialog/typing', {peer: $('.support_chat').data('id')}, function(){
        wim.last_typing = new Date().getTime();
      });
    }
  },

  read: function(uid)
  {
    $('support_chat__main-item.unread').removeClass('unread');
    $('#peer-'+uid+' .my-tickets_indicator').remove();

    ajaxe.query('/im/dialog/read', {peer: uid}, function(d){

      $('#read-'+uid).find('.my-tickets_indicator').remove();
      // document.title = d.dialog_num > 0 ? gram(d.dialog_num, ['новое сообщение', 'новых сообщения', 'новых сообщений']) : 'FastChat';
    });
  },

  unicue: function (cnt)
  {
    if(!cnt)
      $('.my-tickets_top .my-tickets_indicator').hide();
    else
      $('.my-tickets_top .my-tickets_indicator').text(cnt).show();
  },

  queue: function(d)
  {
    console.log('queue',d);
    if( typeof d !== 'object' || !('type' in d) )
      return;

    if( d.type === 'read' )
    {

    }

    if( d.type === 'typing' )
    {
      // if(im.offline){
      //   $('#im_typing, #im_head_online').show();
      //   $('#im_offline').hide();
      // }
      $('.typing_'+d.peer).addClass('show');
      setTimeout("$('.typing_"+d.peer+"').removeClass('show');", 5000);
    }

    if( d.type === 'peer_online' )
    {
      if(d.online)
        $('#peer-'+d.peer).addClass('online')
      else
        $('#peer-'+d.peer).removeClass('online')

      if( $(".support_chat").data('id') === d.peer )
      {
        var info = $('.message_chat__top-info');
        if(d.online)
        {
          $('.message_chat__subtitle span').text( info.data('online') );
        }
        else if( $('.message_chat__subtitle span').text() === info.data('online') )
        {
          $('.message_chat__subtitle span').text( info.data('recently') );
        }
      }

    }

    if( d.type === 'incoming_msg' )
    {

      $('#peer-'+d.sender).addClass('online');
      wim.msg_placeholder(d.sender,d.text);

      $('.typing_'+d.sender).removeClass('show');

      if($('.support_chat.message_chat').data('id') !== d.sender)
      {
        $('#peer-'+d.sender).find('.my-ticket_details')
          .html('<div class="my-tickets_indicator">'+d.cnt+'</div>');
        wim.unicue(d.unicue);
      }
      else
      {
        wim.send(d);
        wim.read(d.sender);
      }
    }

  },

  msg_placeholder: function(peer_id, msg)
  {
    var pos = msg.indexOf('<br />') > 0 ? msg.indexOf('<br />') : 65;
    var prv = msg.substr(0,pos)+(msg.length > pos ? '...':'');
      $('#peer-'+peer_id).find('.message-item_info > p')
        .html(prv);
  },

  messageFormFlush: function() {
    $('#im_text').val('')[0].style.height = '40px';

    $('.support_chat__message').removeClass('loader');
    $('#im_text').focus();
    wim.mobileHeight();
  },

  mobileHeight: function()
  {
    if( !$('body').hasClass('is-mobile') )
      return;

    var h = $(window).height() - $('header').outerHeight() - $('.main-tabs_row').outerHeight();
    h = h - $('.support_chat__bottom').outerHeight() - $('nav').outerHeight();  

    $('.support_chat').height(h);
    $('.support_chat__main').height(h - $('.support_chat__top').outerHeight());
    $(".support_chat__main").scrollTop($(".support_chat__main").prop("scrollHeight"));
  }
});
var wim = ajaxe.widgets.im;
