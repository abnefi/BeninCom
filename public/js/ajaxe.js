/**
 * AjaxEase
 *
 * README - http://ajaxe.davemodis.com/
 *
 *  @author Dave Modis dumbashable@gmail.com
 *  @version 1rc
 */

(function(){
    ajaxe = {
        version: '0.8.7',
        browser: '?',
        current: null,
        working: false,
        inited: false,
        loading: false,
        options: {
            content_only: false,
            show_errors: true,
            same_request: true, // allow same request
            eval_scripts: false,
            content_id: '#content',
            autostart_widgets: true,
            history5: true,
            rel_nofollow: true,
            reload_onstart: false
        },
        DEFAULT_SENDDATA : {ajaxe: true},

        init:  function(o)
        {
            if(o && o.constructor === Object)
                for(var p in o)
                    if(this.options[p] !== undefined)
                        this.options[p] = o[p];

            this.events.onerror.bind(function(e){
                console.error('AjaxEase error occurred: '+e.type+' "'+e.msg+'" ', (e.data ? e.data : null));
            });

            if(this.working){console.error('AjaxEase already working!');return this;}

            if(this.options.history5) this.options.history5 = window.history.pushState !== null && window.history.pushState !== undefined;

            // for IE 7
            if(typeof JSON !== 'object')
            {
                dom.include(this.scripts.json, null, function(e){
                    ajaxe.events.onerror.run({type:'include_JSON',
                        msg:'Can\'t load '+this.scripts.json, data: e});
                    ajaxe.working = false;
                });
                this.options.hook_hash = true;
            }

            if(this.options.history5)
            {
                try{
                    window.addEventListener('popstate', function(e){
                        if ( !ajaxe.working ) return;
                        var data = e.state;
                        if(data && typeof data === 'object'){
                            ajaxe.tpl(data);
                        }else{
                            ajaxe.query(data ? data : location.href.split(location.origin).join(''));
                        }
                    }, false);
                }catch(e){
                    this.options.history5 = false;
                    this.options.hook_hash = true;
                }
            }

            var cur_link = (location.href.split(location.hostname))[1];
            this.links().forms();

            this.working = true;
            this.inited = true;
            console.log('AjaxEase ready! v. '+this.version);

            if(this.options.reload_onstart) {
                this.query( {
                    link: location.href,
                    post: { ajaxe: true, get_source: true, reloading: true },
                });
            }

            this.events.oninit.run( this.options.reload_onstart );
            return this;
        },
        links: function()
        {
            var data = arguments[0] ? arguments[0] : document;

            if(data !== document){
                var div = document.createElement('div');
                div.innerHTML = data;//data.split('href="/').join('href="#/');
                data = div;
            }

            dom.find('a', data).each(function(el){
                if(dom.el(el).attr('ajaxe') === 'false' || dom.attr('data-ajaxe') === 'false')return;
                if(dom.attr('data-ajaxe') === 'true')return;
                if(ajaxe.options.rel_nofollow && dom.attr('rel') === 'nofollow')return;

                var href = dom.attr('href'), hash = el.hash || el.href,
                    reg = /^[\s]*(?:(.*:\/\/.*)|(#.*)|(mailto:.*)|(tel:.*)|(javascript:.*))/;

                if(ajaxe.browser==="msie<=7")
                    href = (href.split(location.hostname))[1];

                if(href !== undefined && href.indexOf(location.hostname) > -1)
                    href = /#/.test(hash) ? hash.substr(1) : href;

                if(!reg.test(href)){
                    dom.attr('data-ajaxe','true').attr('href',ajaxe.options.history5 ? href : '#'+href);
                    if(ajaxe.options.history5){
                        var ofn = dom.elem.onclick ? dom.elem.onclick : false;
                        var nfn = function(el)
                        {
                            if(ofn)
                            {
                                if(ofn(this))
                                    return ajaxe.query(href);
                                return false;
                            }
                            else
                                return ajaxe.query(href);
                        };
                        dom.elem.onclick = nfn;
                    }

                }
                return;
            });

            if(arguments[0])
                return data.childNodes;

            if(!this.working)
                dom.live('a[data-ajaxe="true"]','click',function(el){
                    var link = dom.el(el).attr('href');
                    if(ajaxe.options.history5){
                        history.pushState(link,'',link);
                    }else{
                        return ajaxe.query(link);
                    }
                });

            return this;
        },
        forms: function(s)
        {
            if(!s)s='form';

            $(s).on('submit', function() {
                var el = this;

                if($(el).attr('ajaxe') === 'false' || $(el).attr('data-ajaxe') === 'false')
                    return true;

                var link = location.href;
                var post = clone(ajaxe.DEFAULT_SENDDATA), data = {},
                    get = [], same = ajaxe.options.same_request;

                $(this).find('[name]').each(function() {
                    var type = $(this).attr('type'),
                        name = $(this).attr('name'),
                        val = $(this).val();

                    if(type === 'radio')
                    {
                        data[name] = $('[name="'+name+'"]:checked').val();
                    }
                    else if(type === 'checkbox' || /\[\]/.test(name))
                    {
                        if($('[name="'+name+'"]').length > 1)
                        {
                            if(/\[\]/.test(name))name = name.replace('[]','');
                            if(data[name] === undefined) data[name] = [];

                            if(type !== 'checkbox' || this.checked) {
                                if(data[name] && data[name].constructor === Array) {
                                    if(val.constructor === Array)
                                        data[name] = val;
                                    else
                                        data[name].push(val);
                                }
                                else
                                    data[name] = val;
                            }
                        }
                        else
                        {
                            if(type === 'checkbox')
                                data[name] = this.checked ? val ? val : 1 : 0; //dom.el(el).attr('checked') ||
                            else if( typeof val === "object")
                            {
                                name = name.replace('[]','');
                                data[name] = val;
                            }
                            else
                                data[name] = val;
                        }
                    }else{
                        data[name] = val;
                    }
                });

                dom.el(el);
                if(dom.attr('action'))
                    link = dom.attr('action');
                if(dom.attr('method').toUpperCase() === 'POST'){
                    for(var p in data){
                        post[p] = data[p];
                    }
                }else{
                    for(p in data){
                        get.push(p+'='+data[p]);
                    }
                    link += (link.split('?')[1]!==undefined?'&':'?')+get.join('&');
                }
                if(ajaxe.options.history5)
                    history.pushState({header:{tpl:[]}},'',link);


                if($(el).attr('enctype') === 'multipart/form-data')
                {
                    var data = new FormData(el);
                    $.ajax({
                        url: link,
                        data: data,
                        cache: false,
                        contentType: false,
                        processData: false,
                        method: 'POST',
                        type: 'POST', // For jQuery < 1.9
                        success: function(data){
                            if( !data )
                                return;

                            if (!ajaxe.options.content_only)
                            {
                                try{data = JSON.parse(data);
                                }catch(e){
                                    ajaxe.events.onerror.run({
                                        error: e,
                                        type: 'response_parse',
                                        msg: 'Can\'t parse the server response',
                                        data: data
                                    });
                                }
                            }
                            else
                            {
                                data = {header:{notpl:false,tpl:[]},content:data,sig:''}
                            }
                            //----------------------------------
                            ajaxe.events.onresponse.run(data);
                            ajaxe.loading = false;
                            if(data.constructor !== String){
                                ajaxe.current = data;
                                ajaxe.tpl(data);
                            }
                        }
                    });
                    return false;
                } else {
                    ajaxe.options.same_request = 1;
                    return ajaxe.query(link, post, function(){ajaxe.options.same_request = same;});
                }

            });
            return this;
        },

        query: function()
        {
            if(!arguments.length || !this.working)return true;
            var post={},link,cb;
            link = arguments[0];

            if( link.constructor === Object )
            {
                if( 'undefined' === typeof link.link ) return true;
                post = link.post ? link.post : post;
                cb = link.callback ? link.callback : cb;
                link = link.link;
            }
            if( link.constructor !== String) return true;

            if(link[0]==='#'&&link[1]==='#') return false;

            if(arguments[1])
            {
                if(arguments[1].constructor === Object){
                    post = arguments[1];
                    if(arguments[2] && arguments[2].constructor === Function)cb = arguments[2];
                }else if(arguments[1].constructor === Function)
                    cb = arguments[1];
            }

            link = link.split('#');
            if( link.length > 1 ) link = link[link[0].length?0:1];
            else link = link[0];

            this.CURRENT_SENDDATA = post;
            link = this.rules.check(link);
            if(link === false || !this.options.same_request && this.current.header.link === link)
                return false;

            if(this.DEFAULT_SENDDATA)
                copy_props(this.DEFAULT_SENDDATA, post);

            if(this.CUSTOM_SENDDATA)
            {
                copy_props(this.CUSTOM_SENDDATA, post);
                this.CUSTOM_SENDDATA = false;
            }

            if( this.events.onrequest.run(link) )
            {
                this.loading = true;
                dom.ajax(link,post,
                    function (data){
                        if (data && !ajaxe.options.content_only)
                        {
                            try{data = JSON.parse(data);
                            }catch(e){
                                ajaxe.events.onerror.run({
                                    error:e,
                                    type:'response_parse',
                                    msg:'Can\'t parse the server response',
                                    data:data
                                });
                                if( cb && cb.constructor === Function )
                                    cb(data);
                            }
                        }
                        else
                        {
                            data = {header:{notpl:false,tpl:[]},content:data,sig:''}
                        }
                        //----------------------------------
                        ajaxe.events.onresponse.run(data);
                        ajaxe.loading = false;
                        if(data.constructor !== String){
                            ajaxe.current = data;
                            ajaxe.tpl(data);
                        }
                        if(cb)cb(data);
                        ajaxe.CUSTOM_SENDDATA = false;
                    },
                    function (data){
                        ajaxe.events.onerror.run({type:'server_response',
                            msg:'Check for the status of server response',data:data});
                    }
                );
            }

            return false;
        },
        tpl: function(data)
        {
            if(!data.header){
                this.events.onerror.run({type:'tpl_response',
                    msg:'Response must contain header',data:data});
                return this;
            }

            if(data.header.redirect)
            {
                if(data.header.redirect_location)
                {
                    location.href = data.header.redirect;
                    return;
                }
                else
                {
                    if(typeof data.header.redirect === 'string')
                        data.header.redirect = [data.header.redirect];

                    for(var i in data.header.redirect)
                        this.query(data.header.redirect[i]);
                }
            }

            if(data.content && data.header.notpl === false)
            {
                var content = this.options.history5 ? data.content : this.links(data.content);
                dom.el(this.options.content_id).html(content);

                if( this.options.history5 )
                    window.history.replaceState(
                        data,
                        data.header.title || '',
                        location.pathname+location.search
                    );

                if(this.browser === 'msie<=7' || this.options.history5)
                    this.links();

                this.forms().events.oncontentdisp.run();
            }

            if(data.header.title) dom.el('title').text(data.header.title);


            // autostart_widgets
            if(this.options.autostart_widgets)
            {
                for(var w in data.widgets)
                {
                    if (this.widgets[w]) this.widgets[w]._ontpl(data.widgets[w]);
                }
            }

            this.events.ontpl.run(data);

            if(this.options.eval_scripts && data.header.script)
            {
                eval(data.header.script);
            }

            return this;
        },

        rules: {
            list:[{rule:'',act:false}],
            check:function rules_check(link, rule){
                var list = !rule ? this.list : rule;
                if(list.constructor !== Array)list = [list];

                for(var r in list){r = list[r];
                    if(typeof r.rule === 'string' || r.rule === undefined){
                        if(r.rule === link)link = act(link, r.act);
                    }else if(r.rule.constructor === RegExp){
                        if(r.rule.test(link))link = act(link, r.act);
                    }else if(r.rule.constructor === Array){
                        for(var i=0;i<r.rule.length;++i){
                            if(true === this.check(link,{rule:r.rule[i],act:function(){return true}}))
                                link = act(link, r.act);
                        }
                    }else if(r.rule.constructor === Function){
                        if(r.rule(link))link = act(link, r.act);
                    }
                }
                return link;
                function act(l, a){
                    if(a === undefined || a === null)return l;
                    if(typeof a === 'string' || a === false)return a;
                    if(a.constructor === Function)return a(l);
                    return l;
                }
            },
            add:function rules_add(r,a){
                this.list.push({rule:r,act:a});
                return this;
            }
        },

        widgets: {
            add: function widgets_add(w){
                if(!w.name){
                    ajaxe.events.onerror.run({type:'widget_add',
                        msg:'Widget necessary property "name"',data:w});
                    return;
                }
                this[w.name] = new Widget(w);

                if( typeof this[w.name]._init === 'function' )
                    this[w.name]._init();
            }
        },

        events: {
            bind: function events_bind(n, f){
                for(var e in this){
                    if(this[e].constructor == Event && this[e].name == n)
                        this[e].bind(f);
                }
            },
            oninit: new Event_('oninit'),
            onrequest: new Event_('onrequest'),
            onresponse: new Event_('onresponse'),
            oncontentdisp: new Event_('oncontentdisp'),
            ontpl: new Event_('ontpl'),
            onerror: new Event_('error')
        }
    };
    function Event_(name){
        this.name = name;
        this.listeners = []; //"function(){console.log('event: "+name+"')}"
        this.tmp = null;
    }
    Event_.prototype.bind = function(f){
        if(!f || f.constructor !== Function)return false;
        this.listeners.push(f);
        return true;
    };
    Event_.prototype.run = function(data){
        for(var i = 0; i < this.listeners.length; i++){
            if(this.listeners[i].constructor === Function)
                if(this.listeners[i](data) === false)
                    return false;
        }
        return true;
    };

    function Widget(obj){
        for(var p in obj){
            this[p] = obj[p];
        }
    }
    Widget.prototype.show = function(){
        if(this.id)
            dom.el(this.id).show();
        return this;
    };
    Widget.prototype.hide = function(){
        if(this.id)
            dom.el(this.id).hide();
        return this;
    };
    Widget.prototype.toggle = function(){
        if(this.toggle && this.toggle.constructor == Function){
            this.toggle();
            return this;
        }

        if(this.id)
            dom.el(this.id).elem.style.display == 'none' ? dom.show() : dom.hide();
        return this;
    };
    Widget.prototype._ontpl = function(data){
        if('tpl' in this && this.tpl.constructor === Function){
            this.tpl(data);
        }else{
            ajaxe.events.onerror.run({type:'widget_tpl', data:this,
                msg:'Can\'t find "tpl" function for "'+this.name+'" widget'});
        }
        return this;
    };
    Widget.prototype.html = function(data){
        dom.el(this.id).html(data);
        return this;
    };

    function clone(o)
    {
        try{return JSON.parse(JSON.stringify(o));}catch(e){
            if(!o || 'object' !== typeof o){return o;}
            var c = 'function' === typeof o.pop ? [] : {}, p, v;
            for(p in o) {
                if(o.hasOwnProperty(p)) {v = o[p];if(v && 'object' === typeof v) {c[p] = clone(v);}else {c[p] = v;}}
            }
            return c;
        }
    }
    function copy_props(from, to)
    {
        if(from.constructor !== Object || to.constructor !== Object)
            return;
        for(var i in from)
            to[i] = from[i];
    }

    var dom = {
        elem: null,
        handls:{},
        el: function dom_el(st){
            if(st === undefined)return this;
            if(document.querySelectorAll == undefined){
                ajaxe.browser = 'msie<=7';
            }
            if(typeof st == 'string'){
                var els = Sizzle(st);
            }else if(st.nodeType){
                els = [st];
            }

            this.elem = els.length > 1 ? els : els[0];
            return this;
        },
        find: function dom_find(st, context){
            if(!context)context = this.elem.constructor === Array ? this.elem[0] : this.elem;
            this.elem = Sizzle(st, context);
            return this;
        },
        each: function dom_each(fn){
            var els = this.elem.constructor == Array ? this.elem : [this.elem];
            for(var el in els)
                if(els.hasOwnProperty(el))
                    fn(els[el]);
            return this;
        },
        attr: function dom_attr(key, val){
            if(this.elem && this.elem.constructor !== Array)this.elem = [this.elem];
            if(!this.elem) return val ? this : undefined;
            if(val !== undefined){
                for(var i = 0; i < this.elem.length; ++i){
                    if(this.elem[i].attributes[key]){
                        this.elem[i].attributes[key].nodeValue = val;
                    }else{
                        var attr = document.createAttribute(key);
                        attr.nodeValue = val;
                        this.elem[i].attributes.setNamedItem(attr);
                    }
                }
            }else{
                return this.elem[0].attributes[key] ? this.elem[0].attributes[key].nodeValue : undefined;
            }
            if(this.elem.length == 1)this.elem = this.elem[0];
            return this;
        },
        html: function dom_html(val){
            if(!this.elem) return this;
            if(this.elem.constructor !== Array)this.elem = [this.elem];
            for(var i = 0; i < this.elem.length; ++i){
                try{
                    this.elem[i].innerHTML = val;
                }catch(e){
                    ajaxe.events.onerror.run({type:'dom_html', error:e});
                }
            }
            if(this.elem.length == 1)this.elem = this.elem[0];
            return this;
        },
        text: function dom_text(val){
            if(!this.elem) return this;
            if(this.elem.constructor !== Array)this.elem = [this.elem];
            for(var i = 0; i < this.elem.length; ++i){
                try{
                    this.elem[i].innerText = val;
                }catch(e){
                    ajaxe.events.onerror.run({type:'dom_text', error:e});
                }
            }
            if(this.elem.length == 1)this.elem = this.elem[0];
            return this;
        },
        val: function dom_val(val){
            if(this.elem.constructor !== Array)this.elem = [this.elem];
            if(val !== undefined){
                if(!this.elem) return this;
                for(var i = 0; i < this.elem.length; ++i){
                    try{
                        this.elem[i].value = val;
                    }catch(e){
                        ajaxe.events.onerror.run({type:'dom_val', error:e});
                    }
                }
                if(this.elem.length == 1)this.elem = this.elem[0];
                return this;
            }else{
                if(!this.elem) return "";

                if(this.elem[0].nodeName === 'SELECT' && this.elem[0].multiple) {
                    val = [];
                    for(var i = 0; i < this.elem[0].selectedOptions.length; ++i) {
                        val.push(this.elem[0].selectedOptions[i].value)
                    }
                    return val;
                }

                try{
                    val = this.elem[0].value;
                }catch(e){
                    ajaxe.events.onerror.run({type:'dom_val', error:e});
                }
                return val == null ? "" : val;
            }
            return this;
        },
        show: function dom_show(){
            if(!this.elem) return this;
            if(this.elem && this.elem.constructor !== Array)this.elem = [this.elem];
            for(var i = 0; i < this.elem.length; ++i){
                var els = this.elem[i].style;
                els.display = els._display !== undefined ? els._display :
                    els.display !== 'none' && els.display !== '' ? els.display : 'block';
            }
            if(this.elem.length == 1)this.elem = this.elem[0];
            return this;
        },
        hide: function dom_hide(){
            if(!this.elem) return this;
            if(this.elem.constructor !== Array)this.elem = [this.elem];
            for(var i = 0; i < this.elem.length; ++i){
                var els = this.elem[i].style;
                if(els && els.display !== 'none')els._display = els.display;
                els.display = 'none';
            }
            if(this.elem.length == 1)this.elem = this.elem[0];
            return this;
        },
        live: function dom_live(s,n,f){
            this.elem = n == 'click' ? document : this.el(s).elem;
            if(!this.handls[n])this.handls[n] = [];
            this.handls[n].push({s:s,f:f});

            this.addEvent(n, function(e){
                var a = e.target || e.srcElement;
                while(ajaxe._dom.matches(s,a).length < 1){
                    a = a.parentNode;if(!a || a.tagName == 'BODY')return true;
                }

                var o = ajaxe._dom.handls[e.type] || ajaxe._dom.handls['on'+e.type];
                if(o) for(var i in o) if(o[i].s == s) return o[i].f(a);
                return true;
            });
        },
        die: function dom_die(s,n){
            this.elem = document;
            if(!this.handls[n])return this;
            for(var i in this.handls[n]){
                if(this.handls[n][i].s == s){
                    this.remEvent(n, this.handls[n][i].f);
                    this.handls[n].splice(i,1);
                }
            }

            return this;
        },
        addEvent: function dom_addEvent(n,f){
            if (!this.elem)return this;
            if(this.elem.constructor !== Array)this.elem = [this.elem];

            for(var i = 0; i < this.elem.length; ++i)
            {
                if(this.elem[i].tagName === 'FORM'){
                    this.elem[i].onsubmit = f;
                }else if(this.elem[i].addEventListener){
                    this.elem[i].addEventListener(n,f,false);
                }else if(this.elem[i].attachEvent){
                    this.elem[i].attachEvent("on"+n,f);
                }
            }

            if(this.elem.length == 1)this.elem = this.elem[0];
            return this;
        },
        remEvent: function dom_remEvent(n,f){
            if(this.elem.addEventListener){
                this.elem.removeEventListener(n,f,false);
            }else if(this.elem.attachEvent){
                this.elem.detachEvent("on"+n,f);
            }
            return this;
        },
        ajax: function dom_ajax(adr, args, handl, errf) {
            var oXmlHttp = createXMLHttp();

            oXmlHttp.open("POST", adr, true);
            oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            oXmlHttp.onreadystatechange = function() {
                if(oXmlHttp.readyState === 4) {
                    if(oXmlHttp.status === 200 || oXmlHttp.status === 400 || oXmlHttp.status >= 500) {
                        handl(oXmlHttp.responseText);
                    }
                    else {
                        errf(oXmlHttp.statusText);
                    }
                    delete oXmlHttp;
                }
            };
            if(typeof args === 'object'){
                var _args = [];
                for(var n in args)
                {
                    if(typeof args[n] === 'object')
                        for( var ni in args[n] )
                        {
                            _args.push(encodeURIComponent(n)+'['+ni+']='+encodeURIComponent(args[n][ni]));
                        }
                    else
                        _args.push(encodeURIComponent(n)+'='+encodeURIComponent(args[n]));
                }
                args = _args.join('&');
            }

            oXmlHttp.send(args);
            function createXMLHttp() {
                if(typeof XMLHttpRequest != "undefined") {
                    return new XMLHttpRequest();
                }
                else if(window.ActiveXObject) {
                    var aVersions = ["MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0",
                        "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp",
                        "Microsoft.XMLHttp"];
                    for (var i = 0; i < aVersions.length; i++) {
                        try { //
                            var oXmlHttp = new ActiveXObject(aVersions[i]);
                            return oXmlHttp;
                        } catch (oError) {}
                    }
                    ajaxe.events.onerror.run({type:'ajax_request', msg:'Can\'t create request'});

                }
            }
        },
        matches: function dom_matches(s,e){
            if(!e)e = this.elem;
            if(e.constructor !== Array)e = [e];
            return Sizzle.matches(s,e);
        },
        include: function dom_include(src, callback, onerror)
        {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            if(callback) {
                if(script.readyState && !script.onload) {
                    script.onreadystatechange = function() {
                        if(script.readyState == "loaded" || script.readyState == "complete"){
                            script.onreadystatechange = null;
                            callback();
                        }
                    }
                } else {
                    script.onload = callback;
                }
            }
            if(onerror)script.onerror = onerror;
            script.src = src;
            head.appendChild(script);
        }
    }
    ajaxe._dom=dom;
    ajaxe._clone=clone;
    eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(u(n,o){v i,2D,z,2b,3a,2d,1Y,2A,1J,P,15,1g,1k,1B,1p,1j,39,I="5z"+ -(O 5u()),1K=n.P,N={},1q=0,4o=0,3C=35(),3x=35(),3u=35(),1n=17 o,3r=1<<31,2l=[],21=2l.21,A=2l.A,G=2l.G,1l=2l.1l||u(a){v i=0,1a=3n.y;R(;i<1a;i++){q(3n[i]===a){p i}}p-1},K="[\\\\25\\\\t\\\\r\\\\n\\\\f]",1H="(?:\\\\\\\\.|[\\\\w-]|[^\\\\57-\\\\4K])+",3l=1H.V("w","w#"),3Z="([*^$|!~]?=)",2B="\\\\["+K+"*("+1H+")"+K+"*(?:"+3Z+K+"*(?:([\'\\"])((?:\\\\\\\\.|[^\\\\\\\\])*?)\\\\3|("+3l+")|)|)"+K+"*\\\\]",1b=":("+1H+")(?:\\\\((([\'\\"])((?:\\\\\\\\.|[^\\\\\\\\])*?)\\\\3|((?:\\\\\\\\.|[^\\\\\\\\()[\\\\]]|"+2B.V(3,8)+")*)|.*)\\\\)|)",2g=O Z("^"+K+"+|((?:^|[^\\\\\\\\])(?:\\\\\\\\.)*)"+K+"+$","g"),3W=O Z("^"+K+"*,"+K+"*"),3V=O Z("^"+K+"*([\\\\25\\\\t\\\\r\\\\n\\\\f>+~])"+K+"*"),3T=O Z(1b),3S=O Z("^"+3l+"$"),2x={"1U":O Z("^#("+1H+")"),"3i":O Z("^\\\\.("+1H+")"),"3R":O Z("^\\\\[1M=[\'\\"]?("+1H+")[\'\\"]?\\\\]"),"2J":O Z("^("+1H.V("w","w*")+")"),"3g":O Z("^"+2B),"3e":O Z("^"+1b),"2T":O Z("^:(4F|2a|2n|24|24-2n)-(5l|4r-C)(?:\\\\("+K+"*(2Q|2z|(([+-]|)(\\\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\\\d+)|))"+K+"*\\\\)|)","i"),"4k":O Z("^"+K+"*[>+~]|:(2Q|2z|3z|4e|47|24|2a|2n)(?:\\\\("+K+"*((?:-\\\\d)?\\\\d*)"+K+"*\\\\)|)(?=[^-]|$)","i")},2P=/[\\25\\t\\r\\n\\f]*[+~]/,45=/^[^{]+\\{\\s*\\[5q 5b/,3P=/^(?:#([\\w-]+)|(\\w+)|\\.([\\w-]+))$/,4E=/^(?:1x|1V|4X|2o)$/i,4z=/^h\\d$/i,4y=/\'|\\\\/g,4x=/\\=[\\25\\t\\r\\n\\f]*([^\'"\\]]*)[\\25\\t\\r\\n\\f]*\\]/g,1u=/\\\\([\\5A-5v-F]{1,6}[\\25\\t\\r\\n\\f]?|.)/g,1s=u(5y,a){v b="5s"+a-3Q;p b!==b?a:b<0?4D.4A(b+3Q):4D.4A(b>>10|5w,b&5g|5a)};2M{G.1h(1K.2i.3U,0)[0].B}2L(e){G=u(i){v a,1w=[];E((a=3n[i++])){1w.A(a)}p 1w}}u 2K(a){p 45.19(a+"")}u 35(){v c,3q=[];p(c=u(a,b){q(3q.A(a+=" ")>z.4h){4Y c[3q.2I()]}p(c[a]=b)})}u 1f(a){a[I]=D;p a}u 1v(a){v b=P.5j("1D");2M{p a(b)}2L(e){p 1d}46{b=U}}u H(a,b,c,d){v e,S,m,B,i,1o,2C,1L,2S,2v;q((b?b.1I||b:1K)!==P){1J(b)}b=b||P;c=c||[];q(!a||17 a!=="3k"){p c}q((B=b.B)!==1&&B!==9){p[]}q(!1g&&!d){q((e=3P.2V(a))){q((m=e[1])){q(B===9){S=b.1X(m);q(S&&S.L){q(S.1c===m){c.A(S);p c}}J{p c}}J{q(b.1I&&(S=b.1I.1X(m))&&1j(b,S)&&S.1c===m){c.A(S);p c}}}J q(e[2]){A.20(c,G.1h(b.2e(a),0));p c}J q((m=e[3])&&N.3D&&b.1P){A.20(c,G.1h(b.1P(m),0));p c}}q(N.4i&&!1k.19(a)){2C=D;1L=I;2S=b;2v=B===9&&a;q(B===1&&b.13.T()!=="5e"){1o=2F(a);q((2C=b.18("1c"))){1L=2C.V(4y,"\\\\$&")}J{b.5r("1c",1L)}1L="[1c=\'"+1L+"\'] ";i=1o.y;E(i--){1o[i]=1L+2s(1o[i])}2S=2P.19(a)&&b.L||b;2v=1o.3G(",")}q(2v){2M{A.20(c,G.1h(2S.1W(2v),0));p c}2L(5B){}46{q(!2C){b.5C("1c")}}}}}p 1V(a.V(2g,"$1"),b,c,d)}3a=H.3a=u(a){v b=a&&(a.1I||a).2i;p b?b.13!=="5I":1d};1J=H.1J=u(e){v f=e?e.1I||e:1K;q(f===P||f.B!==9||!f.2i){p P}P=f;15=f.2i;1g=3a(f);N.44=1v(u(a){a.58(f.59(""));p!a.2e("*").y});N.2B=1v(u(a){a.28="<1V></1V>";v b=17 a.3K.18("48");p b!=="5f"&&b!=="3k"});N.3D=1v(u(a){a.28="<1D 3b=\'3d e\'></1D><1D 3b=\'3d\'></1D>";q(!a.1P||!a.1P("e").y){p 1d}a.3K.4j="e";p a.1P("e").y===2});N.4n=1v(u(a){a.1c=I+0;a.28="<a 1M=\'"+I+"\'></a><1D 1M=\'"+I+"\'></1D>";15.5t(a,15.1T);v b=f.2w&&f.2w(I).y===2+f.2w(I+0).y;N.4v=!f.1X(I);15.5x(a);p b});z.4w=1v(u(a){a.28="<a 2u=\'#\'></a>";p a.1T&&17 a.1T.18!==1n&&a.1T.18("2u")==="#"})?{}:{"2u":u(a){p a.18("2u",2)},"C":u(a){p a.18("C")}};q(N.4v){z.1e["1U"]=u(a,b){q(17 b.1X!==1n&&!1g){v m=b.1X(a);p m&&m.L?[m]:[]}};z.2r["1U"]=u(b){v c=b.V(1u,1s);p u(a){p a.18("1c")===c}}}J{z.1e["1U"]=u(a,b){q(17 b.1X!==1n&&!1g){v m=b.1X(a);p m?m.1c===a||17 m.2p!==1n&&m.2p("1c").1y===a?[m]:o:[]}};z.2r["1U"]=u(c){v d=c.V(1u,1s);p u(a){v b=17 a.2p!==1n&&a.2p("1c");p b&&b.1y===d}}}z.1e["2J"]=N.44?u(a,b){q(17 b.2e!==1n){p b.2e(a)}}:u(a,b){v c,3f=[],i=0,1w=b.2e(a);q(a==="*"){E((c=1w[i++])){q(c.B===1){3f.A(c)}}p 3f}p 1w};z.1e["3R"]=N.4n&&u(a,b){q(17 b.2w!==1n){p b.2w(1M)}};z.1e["3i"]=N.3D&&u(a,b){q(17 b.1P!==1n&&!1g){p b.1P(a)}};1B=[];1k=[":4C"];q((N.4i=2K(f.1W))){1v(u(a){a.28="<1V><3h 29=\'\'></3h></1V>";q(!a.1W("[29]").y){1k.A("\\\\["+K+"*(?:2j|2h|5c|48|5d|29|1y)")}q(!a.1W(":2j").y){1k.A(":2j")}});1v(u(a){a.28="<1x C=\'3d\' i=\'\'/>";q(a.1W("[i^=\'\']").y){1k.A("[*^$]="+K+"*(?:\\"\\"|\'\')")}q(!a.1W(":3j").y){1k.A(":3j",":2h")}a.1W("*,:x");1k.A(",.*:")})}q((N.2N=2K((1p=15.2N||15.5h||15.5m||15.5n||15.5o)))){1v(u(a){N.3Y=1p.1h(a,"1D");1p.1h(a,"[s!=\'\']:x");1B.A("!=",1b)})}1k=O Z(1k.3G("|"));1B=1B.y&&O Z(1B.3G("|"));1j=2K(15.1j)||15.1F?u(a,b){v c=a.B===9?a.2i:a,1r=b&&b.L;p a===1r||!!(1r&&1r.B===1&&(c.1j?c.1j(1r):a.1F&&a.1F(1r)&16))}:u(a,b){q(b){E((b=b.L)){q(b===a){p D}}}p 1d};39=15.1F?u(a,b){v c;q(a===b){1Y=D;p 0}q((c=b.1F&&a.1F&&a.1F(b))){q(c&1||a.L&&a.L.B===11){q(a===f||1j(1K,a)){p-1}q(b===f||1j(1K,b)){p 1}p 0}p c&4?-1:1}p a.1F?-1:1}:u(a,b){v c,i=0,2O=a.L,1r=b.L,2H=[a],2G=[b];q(a===b){1Y=D;p 0}J q(!2O||!1r){p a===f?-1:b===f?1:2O?-1:1r?1:0}J q(2O===1r){p 3t(a,b)}c=a;E((c=c.L)){2H.4a(c)}c=b;E((c=c.L)){2G.4a(c)}E(2H[i]===2G[i]){i++}p i?3t(2H[i],2G[i]):2H[i]===1K?-1:2G[i]===1K?1:0};1Y=1d;[0,0].4b(39);N.4c=1Y;p P};H.1p=u(a,b){p H(a,U,U,b)};H.2N=u(a,b){q((a.1I||a)!==P){1J(a)}b=b.V(4x,"=\'$1\']");q(N.2N&&!1g&&(!1B||!1B.19(b))&&!1k.19(b)){2M{v c=1p.1h(a,b);q(c||N.3Y||a.P&&a.P.B!==11){p c}}2L(e){}}p H(b,P,U,[a]).y>0};H.1j=u(a,b){q((a.1I||a)!==P){1J(a)}p 1j(a,b)};H.4d=u(a,b){v c;q((a.1I||a)!==P){1J(a)}q(!1g){b=b.T()}q((c=z.4w[b])){p c(a)}q(1g||N.2B){p a.18(b)}p((c=a.2p(b))||a.18(b))&&a[b]===D?b:c&&c.5D?c.1y:U};H.1R=u(a){4G O 4H("4O 1R, 4S 4V: "+a);};H.4g=u(a){v b,3w=[],i=1,j=0;1Y=!N.4c;a.4b(39);q(1Y){R(;(b=a[i]);i++){q(b===a[i-1]){j=3w.A(i)}}E(j--){a.3B(3w[j],1)}}p a};u 3t(a,b){v c=b&&a,X=c&&(~b.4l||3r)-(~a.4l||3r);q(X){p X}q(c){E((c=c.2y)){q(c===b){p-1}}}p a?1:-1}u 4p(c){p u(a){v b=a.13.T();p b==="1x"&&a.C===c}}u 4q(c){p u(a){v b=a.13.T();p(b==="1x"||b==="2o")&&a.C===c}}u 1z(d){p 1f(u(c){c=+c;p 1f(u(a,b){v j,3E=d([],a.y,c),i=3E.y;E(i--){q(a[(j=3E[i])]){a[j]=!(b[j]=a[j])}}})})}2b=H.2b=u(a){v b,2R="",i=0,B=a.B;q(!B){R(;(b=a[i]);i++){2R+=2b(b)}}J q(B===1||B===9||B===11){q(17 a.3J==="3k"){p a.3J}J{R(a=a.1T;a;a=a.2y){2R+=2b(a)}}}J q(B===3||B===4){p a.5i}p 2R};z=H.5N={4h:50,5k:1f,Q:2x,1e:{},1Q:{">":{1i:"L",2a:D}," ":{1i:"L"},"+":{1i:"3c",2a:D},"~":{1i:"3c"}},4B:{"3g":u(a){a[1]=a[1].V(1u,1s);a[3]=(a[4]||a[5]||"").V(1u,1s);q(a[2]==="~="){a[3]=" "+a[3]+" "}p a.G(0,4)},"2T":u(a){a[1]=a[1].T();q(a[1].G(0,3)==="24"){q(!a[3]){H.1R(a[0])}a[4]=+(a[4]?a[5]+(a[6]||1):2*(a[3]==="2Q"||a[3]==="2z"));a[5]=+((a[7]+a[8])||a[3]==="2z")}J q(a[3]){H.1R(a[0])}p a},"3e":u(a){v b,1C=!a[5]&&a[2];q(2x["2T"].19(a[0])){p U}q(a[4]){a[2]=a[4]}J q(1C&&3T.19(1C)&&(b=2F(1C,D))&&(b=1C.1l(")",1C.y-b)-1C.y)){a[0]=a[0].G(0,b);a[2]=1C.G(0,b)}p a.G(0,3)}},2r:{"2J":u(b){q(b==="*"){p u(){p D}}b=b.V(1u,1s).T();p u(a){p a.13&&a.13.T()===b}},"3i":u(b){v c=3C[b+" "];p c||(c=O Z("(^|"+K+")"+b+"("+K+"|$)"))&&3C(b,u(a){p c.19(a.4j||(17 a.18!==1n&&a.18("3b"))||"")})},"3g":u(c,d,e){p u(a){v b=H.4d(a,c);q(b==U){p d==="!="}q(!d){p D}b+="";p d==="="?b===e:d==="!="?b!==e:d==="^="?e&&b.1l(e)===0:d==="*="?e&&b.1l(e)>-1:d==="$="?e&&b.G(-e.y)===e:d==="~="?(" "+b+" ").1l(e)>-1:d==="|="?b===e||b.G(0,e.y+1)===e+"-":1d}},"2T":u(e,f,g,h,i){v j=e.G(0,3)!=="24",2U=e.G(-4)!=="2n",2f=f==="4r-C";p h===1&&i===0?u(a){p!!a.L}:u(a,b,c){v d,1A,M,X,1t,2c,1i=j!==2U?"2y":"3c",1E=a.L,1M=2f&&a.13.T(),2W=!c&&!2f;q(1E){q(j){E(1i){M=a;E((M=M[1i])){q(2f?M.13.T()===1M:M.B===1){p 1d}}2c=1i=e==="4F"&&!2c&&"2y"}p D}2c=[2U?1E.1T:1E.3K];q(2U&&2W){1A=1E[I]||(1E[I]={});d=1A[e]||[];1t=d[0]===1q&&d[1];X=d[0]===1q&&d[2];M=1t&&1E.3U[1t];E((M=++1t&&M&&M[1i]||(X=1t=0)||2c.21())){q(M.B===1&&++X&&M===a){1A[e]=[1q,1t,X];1N}}}J q(2W&&(d=(a[I]||(a[I]={}))[e])&&d[0]===1q){X=d[1]}J{E((M=++1t&&M&&M[1i]||(X=1t=0)||2c.21())){q((2f?M.13.T()===1M:M.B===1)&&++X){q(2W){(M[I]||(M[I]={}))[e]=[1q,X]}q(M===a){1N}}}}X-=i;p X===h||(X%h===0&&X/h>=0)}}},"3e":u(d,e){v f,1O=z.1b[d]||z.23[d.T()]||H.1R("3X 5G: "+d);q(1O[I]){p 1O(e)}q(1O.y>1){f=[d,d,"",e];p z.23.5H(d.T())?1f(u(a,b){v c,2X=1O(a,e),i=2X.y;E(i--){c=1l.1h(a,2X[i]);a[c]=!(b[c]=2X[i])}}):u(a){p 1O(a,0,f)}}p 1O}},1b:{"5L":1f(u(f){v g=[],1w=[],W=2d(f.V(2g,"$1"));p W[I]?1f(u(a,b,c,d){v e,1S=W(a,U,d,[]),i=a.y;E(i--){q((e=1S[i])){a[i]=!(b[i]=e)}}}):u(a,b,c){g[0]=a;W(g,U,c,1w);p!1w.21()}}),"4I":1f(u(b){p u(a){p H(b,a).y>0}}),"1j":1f(u(b){p u(a){p(a.3J||a.4J||2b(a)).1l(b)>-1}}),"2q":1f(u(c){q(!3S.19(c||"")){H.1R("3X 2q: "+c)}c=c.V(1u,1s).T();p u(a){v b;4L{q((b=1g?a.18("4M:2q")||a.18("2q"):a.2q)){b=b.T();p b===c||b.1l(c+"-")===0}}E((a=a.L)&&a.B===1);p 1d}}),"4N":u(a){v b=n.40&&n.40.4P;p b&&b.G(1)===a.1c},"4Q":u(a){p a===15},"4C":u(a){p a===P.4R&&(!P.41||P.41())&&!!(a.C||a.2u||~a.4T)},"3j":u(a){p a.2h===1d},"2h":u(a){p a.2h===D},"2j":u(a){v b=a.13.T();p(b==="1x"&&!!a.2j)||(b==="3h"&&!!a.29)},"29":u(a){q(a.L){a.L.4U}p a.29===D},"42":u(a){R(a=a.1T;a;a=a.2y){q(a.13>"@"||a.B===3||a.B===4){p 1d}}p D},"1E":u(a){p!z.1b["42"](a)},"4W":u(a){p 4z.19(a.13)},"1x":u(a){p 4E.19(a.13)},"2o":u(a){v b=a.13.T();p b==="1x"&&a.C==="2o"||b==="2o"},"43":u(a){v b;p a.13.T()==="1x"&&a.C==="43"&&((b=a.18("C"))==U||b.T()===a.C)},"2a":1z(u(){p[0]}),"2n":1z(u(a,b){p[b-1]}),"3z":1z(u(a,b,c){p[c<0?c+b:c]}),"2Q":1z(u(a,b){v i=0;R(;i<b;i+=2){a.A(i)}p a}),"2z":1z(u(a,b){v i=1;R(;i<b;i+=2){a.A(i)}p a}),"47":1z(u(a,b,c){v i=c<0?c+b:c;R(;--i>=0;){a.A(i)}p a}),"4e":1z(u(a,b,c){v i=c<0?c+b:c;R(;++i<b;){a.A(i)}p a})}};R(i 3m{4Z:D,51:D,52:D,53:D,54:D}){z.1b[i]=4p(i)}R(i 3m{55:D,56:D}){z.1b[i]=4q(i)}u 2F(a,b){v c,Q,14,C,12,1o,2Y,1m=3x[a+" "];q(1m){p b?0:1m.G(0)}12=a;1o=[];2Y=z.4B;E(12){q(!c||(Q=3W.2V(12))){q(Q){12=12.G(Q[0].y)||12}1o.A(14=[])}c=1d;q((Q=3V.2V(12))){c=Q.2I();14.A({1y:c,C:Q[0].V(2g," ")});12=12.G(c.y)}R(C 3m z.2r){q((Q=2x[C].2V(12))&&(!2Y[C]||(Q=2Y[C](Q)))){c=Q.2I();14.A({1y:c,C:C,1p:Q});12=12.G(c.y)}}q(!c){1N}}p b?12.y:12?H.1R(a):3x(a,1o).G(0)}u 2s(a){v i=0,1a=a.y,3o="";R(;i<1a;i++){3o+=a[i].1y}p 3o}u 2Z(e,f,g){v h=f.1i,30=g&&h==="L",49=4o++;p f.2a?u(a,b,c){E((a=a[h])){q(a.B===1||30){p e(a,b,c)}}}:u(a,b,c){v d,1Z,1A,3s=1q+" "+49;q(c){E((a=a[h])){q(a.B===1||30){q(e(a,b,c)){p D}}}}J{E((a=a[h])){q(a.B===1||30){1A=a[I]||(a[I]={});q((1Z=1A[h])&&1Z[0]===3s){q((d=1Z[1])===D||d===2D){p d===D}}J{1Z=1A[h]=[3s];1Z[1]=e(a,b,c)||2D;q(1Z[1]===D){p D}}}}}}}u 32(d){p d.y>1?u(a,b,c){v i=d.y;E(i--){q(!d[i](a,b,c)){p 1d}}p D}:d[0]}u 2t(a,b,c,d,e){v f,3v=[],i=0,1a=a.y,4f=b!=U;R(;i<1a;i++){q((f=a[i])){q(!c||c(f,d,e)){3v.A(f);q(4f){b.A(i)}}}}p 3v}u 33(f,g,h,j,k,l){q(j&&!j[I]){j=33(j)}q(k&&!k[I]){k=33(k,l)}p 1f(u(a,b,c,d){v e,i,S,3y=[],34=[],3A=b.y,2m=a||4m(g||"*",c.B?[c]:c,[]),2k=f&&(a||!g)?2t(2m,3y,f,c,d):2m,Y=h?k||(a?f:3A||j)?[]:b:2k;q(h){h(2k,Y,c,d)}q(j){e=2t(Y,34);j(e,[],c,d);i=e.y;E(i--){q((S=e[i])){Y[34[i]]=!(2k[34[i]]=S)}}}q(a){q(k||f){q(k){e=[];i=Y.y;E(i--){q((S=Y[i])){e.A((2k[i]=S))}}k(U,(Y=[]),e,d)}i=Y.y;E(i--){q((S=Y[i])&&(e=k?1l.1h(a,S):3y[i])>-1){a[e]=!(b[e]=S)}}}}J{Y=2t(Y===b?Y.3B(3A,Y.y):Y);q(k){k(U,b,Y,d)}J{A.20(b,Y)}}})}u 36(d){v e,W,j,1a=d.y,37=z.1Q[d[0].C],3F=37||z.1Q[" "],i=37?1:0,4s=2Z(u(a){p a===e},3F,D),4t=2Z(u(a){p 1l.1h(e,a)>-1},3F,D),22=[u(a,b,c){p(!37&&(c||b!==2A))||((e=b).B?4s(a,b,c):4t(a,b,c))}];R(;i<1a;i++){q((W=z.1Q[d[i].C])){22=[2Z(32(22),W)]}J{W=z.2r[d[i].C].20(U,d[i].1p);q(W[I]){j=++i;R(;j<1a;j++){q(z.1Q[d[j].C]){1N}}p 33(i>1&&32(22),i>1&&2s(d.G(0,i-1)).V(2g,"$1"),W,i<j&&36(d.G(i,j)),j<1a&&36((d=d.G(j))),j<1a&&2s(d))}22.A(W)}}p 32(22)}u 4u(g,h){v k=0,38=h.y>0,3H=g.y>0,3I=u(a,b,c,d,e){v f,j,W,1G=[],27=0,i="0",1S=a&&[],2E=e!=U,3L=2A,2m=a||3H&&z.1e["2J"]("*",e&&b.L||b),3M=(1q+=3L==U?1:5E.5F()||0.1);q(2E){2A=b!==P&&b;2D=k}R(;(f=2m[i])!=U;i++){q(3H&&f){j=0;E((W=g[j++])){q(W(f,b,c)){d.A(f);1N}}q(2E){1q=3M;2D=++k}}q(38){q((f=!W&&f)){27--}q(a){1S.A(f)}}}27+=i;q(38&&i!==27){j=0;E((W=h[j++])){W(1S,1G,b,c)}q(a){q(27>0){E(i--){q(!(1S[i]||1G[i])){1G[i]=21.1h(d)}}}1G=2t(1G)}A.20(d,1G);q(2E&&!a&&1G.y>0&&(27+h.y)>1){H.4g(d)}}q(2E){1q=3M;2A=3L}p 1S};p 38?1f(3I):3I}2d=H.2d=u(a,b){v i,3N=[],3O=[],1m=3u[a+" "];q(!1m){q(!b){b=2F(a)}i=b.y;E(i--){1m=36(b[i]);q(1m[I]){3N.A(1m)}J{3O.A(1m)}}1m=3u(a,4u(3O,3N))}p 1m};u 4m(a,b,c){v i=0,1a=b.y;R(;i<1a;i++){H(a,b[i],c)}p c}u 1V(a,b,c,d){v i,14,26,C,1e,Q=2F(a);q(!d){q(Q.y===1){14=Q[0]=Q[0].G(0);q(14.y>2&&(26=14[0]).C==="1U"&&b.B===9&&!1g&&z.1Q[14[1].C]){b=z.1e["1U"](26.1p[0].V(1u,1s),b)[0];q(!b){p c}a=a.G(14.2I().1y.y)}i=2x["4k"].19(a)?0:14.y;E(i--){26=14[i];q(z.1Q[(C=26.C)]){1N}q((1e=z.1e[C])){q((d=1e(26.1p[0].V(1u,1s),2P.19(14[0].C)&&b.L||b))){14.3B(i,1);a=d.y&&2s(14);q(!a){A.20(c,G.1h(d,0));p c}1N}}}}}2d(a,Q)(d,b,1g,c,2P.19(a));p c}z.1b["24"]=z.1b["3z"];u 23(){}z.5J=23.5K=z.1b;z.23=O 23();1J();q(17 3p==="u"&&3p.5M){3p(u(){p H})}J{n.H=H}})(5p);',62,360,'|||||||||||||||||||||||||return|if||||function|var|||length|Expr|push|nodeType|type|true|while||slice|Sizzle|expando|else|whitespace|parentNode|node|support|new|document|match|for|elem|toLowerCase|null|replace|matcher|diff|matcherOut|RegExp|||soFar|nodeName|tokens|docElem||typeof|getAttribute|test|len|pseudos|id|false|find|markFunction|documentIsXML|call|dir|contains|rbuggyQSA|indexOf|cached|strundefined|groups|matches|dirruns|bup|funescape|nodeIndex|runescape|assert|results|input|value|createPositionalPseudo|outerCache|rbuggyMatches|unquoted|div|parent|compareDocumentPosition|setMatched|characterEncoding|ownerDocument|setDocument|preferredDoc|nid|name|break|fn|getElementsByClassName|relative|error|unmatched|firstChild|ID|select|querySelectorAll|getElementById|hasDuplicate|cache|apply|pop|matchers|setFilters|nth|x20|token|matchedCount|innerHTML|selected|first|getText|start|compile|getElementsByTagName|ofType|rtrim|disabled|documentElement|checked|matcherIn|arr|elems|last|button|getAttributeNode|lang|filter|toSelector|condense|href|newSelector|getElementsByName|matchExpr|nextSibling|odd|outermostContext|attributes|old|cachedruns|outermost|tokenize|bp|ap|shift|TAG|isNative|catch|try|matchesSelector|aup|rsibling|even|ret|newContext|CHILD|forward|exec|useCache|matched|preFilters|addCombinator|checkNonElements||elementMatcher|setMatcher|postMap|createCache|matcherFromTokens|leadingRelative|bySet|sortOrder|isXML|class|previousSibling|hidden|PSEUDO|tmp|ATTR|option|CLASS|enabled|string|identifier|in|this|selector|define|keys|MAX_NEGATIVE|dirkey|siblingCheck|compilerCache|newUnmatched|duplicates|tokenCache|preMap|eq|preexisting|splice|classCache|getByClassName|matchIndexes|implicitRelative|join|byElement|superMatcher|textContent|lastChild|contextBackup|dirrunsUnique|setMatchers|elementMatchers|rquickExpr|0x10000|NAME|ridentifier|rpseudo|childNodes|rcombinators|rcomma|unsupported|disconnectedMatch|operators|location|hasFocus|empty|text|tagNameNoComments|rnative|finally|lt|multiple|doneName|unshift|sort|detectDuplicates|attr|gt|mapped|uniqueSort|cacheLength|qsa|className|needsContext|sourceIndex|multipleContexts|getByName|done|createInputPseudo|createButtonPseudo|of|matchContext|matchAnyContext|matcherFromGroupMatchers|getIdNotName|attrHandle|rattributeQuotes|rescape|rheader|fromCharCode|preFilter|focus|String|rinputs|only|throw|Error|has|innerText|xa0|do|xml|target|Syntax|hash|root|activeElement|unrecognized|tabIndex|selectedIndex|expression|header|textarea|delete|radio||checkbox|file|password|image|submit|reset|x00|appendChild|createComment|0xDC00|code|ismap|readonly|object|boolean|0x3FF|mozMatchesSelector|nodeValue|createElement|createPseudo|child|webkitMatchesSelector|oMatchesSelector|msMatchesSelector|window|native|setAttribute|0x|insertBefore|Date|fA|0xD800|removeChild|_|sizzle|da|qsaError|removeAttribute|specified|Math|random|pseudo|hasOwnProperty|HTML|filters|prototype|not|amd|selectors'.split('|'),0,{}));
    try{
        console.log();
    }catch(e){
        console = {log:function(){},error:function(){}};
    }
})();