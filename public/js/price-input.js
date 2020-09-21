(function(){

    var mousestop = function(){
        var el = $(this).siblings('.banner_cpm');
        var loop = parseInt(el.attr('data-loop'));
        clearTimeout( loop );
        clearInterval( loop );
        el.attr('data-loop','0');

        var val = el.val();
        if(val[0] === '$')
            val = val.substr(1);

        if( loop )
            banner_newcpm(el.attr('id'),val);
    }


    $('.banner_cpm:not(.inited)').change(function(){
        var val = cpm_value(this,0);
        banner_newcpm($(this).attr('id'),val);
        $(this).trigger('input');
    }).addClass('inited');

    $('.cpm-minus:not(.inited),.cpm-plus:not(.inited)').mousedown(function(){
        var val = parseFloat($(this).attr('data-val')),
        el = $(this).siblings('.banner_cpm');
        cpm_value(el,val);
        var loop = setTimeout(function(){
            var loop = setInterval(function(){cpm_value(el,val)},50);
            $(el).attr('data-loop',loop);
        },300);
        el.attr('data-loop',loop);
    }).mouseup(mousestop).mouseleave(mousestop).addClass('inited');
    
    function banner_newcpm(bid,val){
        ajaxe.query('/banner/params',{
            bid: bid,
            "params[cpm]": val
        }, function(d){
            if(d.error > 0) return;

            if(d.cpm)
               $('#banner-cpm-'+bid).text(d.cpm).trigger('input');

            if(d.cpc)
               $('#banner-cpc-'+bid).text(d.cpc).trigger('input');

            if(d.reach)
               $('.params-coverage-'+bid).text(d.reach);
        });
    }
})();