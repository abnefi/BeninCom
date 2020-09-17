(function(){

// берем refer_id
var refer_id = 0;
if( /^\/\d+/.test(location.pathname) )
	refer_id = location.pathname.substr(1);
else if( /^\/ext\/\d+/.test(location.pathname) )
	refer_id = location.pathname.substr(5);

console.log('refer_id',refer_id);
if( refer_id )
{

	// отправляем его на сервак
	var xhr = createXHR();
	xhr.onreadystatechange = function()
	{
	    if (xhr.readyState === 4)
	    {
			// на серваке он берется из кэша nginx или
			// берем из бд счетчики и генерируем код для вставки
			eval(xhr.responseText);

	        // var str = xhr.responseText;
		 //    var str = '<!-- Yandex.Metrika counter --> \
			// <script src="https://mc.yandex.ru/metrika/watch.js" type="text/javascript"></script> \
			// <script type="text/javascript" > try { var yaCounter49560670 = new Ya.Metrika({ id:49560670, clickmap:false, trackLinks:true, accurateTrackBounce:true, webvisor:false }); } catch(e) { } </script> \
			// <noscript><div><img src="https://mc.yandex.ru/watch/49560670" style="position:absolute; left:-9999px;" alt="" /></div></noscript>\
			// <!-- /Yandex.Metrika counter -->';

			// вставляем код на страницу
			// var dom = new DOMParser().parseFromString('<counters>'+str+'</counters>', "text/xml");
			// var list = dom.querySelectorAll('counters > *');
			// for(var i = 0; i < list.length; ++i) {
			// 	document.querySelector('head').append(list[i]);
			// }
	    }
	}
	xhr.open('GET', '/api/refer-counter/'+refer_id, true)
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.send();

	function createXHR()
	{
	    var xhr;
	    if (window.ActiveXObject) {
	        try {
	            xhr = new ActiveXObject("Microsoft.XMLHTTP");
	        }
	        catch(e) {
	            console.error(e.message);
	            xhr = null;
	        }
	    }
	    else
	        xhr = new XMLHttpRequest();

	    return xhr;
	}
}

})();