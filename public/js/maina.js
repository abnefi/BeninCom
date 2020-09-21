$(wrapErrors(function(){

	detectAdBlock();

	// Role Switch
	$('.role-switch_item').on('click', function() {
		var roleInfo = $(this).attr('data-info');
		
		$('.role-switch_item').removeClass('active');
		$(this).addClass('active');

		$('.role-switch').attr('class','role-switch '+roleInfo);

		var href = $(this).data('href');
		if( href )
			ajaxe.query(href);
	});

	// Expansion Select
	$('body').on('click', '.extension-select', function() {

		var el = $(this).next(), h = 0;

		if(el.height()) {
			el.removeAttr('style');
			$(this).toggleClass('active dropdown-active');
			return;
		}

		el.children().each(function(){
			h += $(this).outerHeight(true);
		});
		el.height(h+16);
		$(this).toggleClass('active dropdown-active');
	});

	$('.nav_list a').on('click',function(){
		ajaxe.widgets.scrollTo.tpl(1)
	});

	// Hide dropdown blocks
	$(document).mouseup(function (e){
		var div = $('.dropdown-active');
		var divDropdown = $('.dropdown-active').next();
		if (!div.is(e.target) 
			&& div.has(e.target).length === 0 
			&&!divDropdown.is(e.target) 
			&& divDropdown.has(e.target).length === 0) { 

			$('.dropdown-active').click();
		}
	});

	// Header Profile
	$('.header-profile').on('click', function() {
		$(this).toggleClass('active dropdown-active');
	});

	$('.header-profile_dropdown__item').on('click', function() {
		$(this).parents('.header-profile_wrap').find('.header-profile').click();
	});


	sortSelectInit();


	// Code not received
	$('.code-not-received_btn').on('click', function() {
		$(this).hide();
		$('.code-not-received').show();
	});

	

	// Tasks performer filter
	$('.tasks-performer_top__filter-item').on('click', function() {
		$('.tasks-performer_top__filter-item').removeClass('active');
		$(this).addClass('active');
	});

	// Report problem
	$('.popup-task-performer_bottom .report-problem').on('click', function() {
		$('.popup ').fadeOut();
		$('.popup-task-performer_problem').fadeIn();
	});

	$('#dark-mode-check').change(function(){
		if( $(this).prop('checked') )
		{
			$('body').addClass('dark-theme');
			document.cookie = 'dark-mode=on; path=/; max-age='+(86400*365);
		}
		else
		{
			$('body').removeClass('dark-theme');
			document.cookie = 'dark-mode=off; path=/; max-age='+(86400+365);
		}
	});



    $(document).on('click','.history-back-btn',function(event){
      if( $(this).data('backpath') )
        ajaxe.query($(this).data('backpath'))
    })
}));




var _index_graphs = {};
function index_banner_graph(id,data)
{
	_index_graphs[id] = data;
	var time = (new Date()).valueOf()/1000;

	var yAxis = data.yAxis ? data.yAxis : [{
			id: 0,
			gridLines: {display: false, drawBorder: false},
			ticks: {display: false}
		},{
			id: 1,
			gridLines: {display: false, drawBorder: false},
			ticks: {display: false}
		}];

	var colors = data.colors ? data.colors : ['#333','#007bff','#5cb85c','#f44'];

	var ctx = document.getElementById(id).getContext('2d');
	_index_graphs[id].chart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: _index_graphs[id].label,
	        datasets: _index_graphs[id].series
	    },
	    options: {
	    	responsive: false,
			title: {display: false},
			legend: {display: false},
			scales: {
				xAxes: [{
					gridLines: {display: false, drawBorder: false},
					ticks: {display: false}
				}],
				yAxes: yAxis
			},
			hover: {
				intersect: false,
				mode: 'index',
				animationDuration: 0
			},
			tooltips: {
				intersect: false,
            	mode: 'index',
				// Disable the on-canvas tooltip
	            enabled: false,

	            custom: function(v){chartjs_tooltip(v,id,this)}
			},
		    layout: {
		        padding: {
		            left: 0,
		            right: 10,
		            top: 15,
		            bottom: 15
		        }
		    }
	    }
	});
}






function flatonica_graph(id,data)
{
	var time = (new Date()).valueOf()/1000;

	var yAxis = data.yAxis ? data.yAxis : [{
			id: 0,
			display: data.axisShow || false,
			gridLines: {display: data.axisShow || false, drawBorder: false},
			ticks: {display: data.axisShow || false}
		},{id:1, display: false},{id:2, display: false}];

	for( var i in yAxis)
	{
		if('ticks' in yAxis[i] && 'callback' in yAxis[i].ticks && typeof yAxis[i].ticks.callback === "string")
		{
			var close = yAxis[i].ticks.callback;
			yAxis[i].ticks.callback = function(value, index, values) {
                return close + Math.round10(value,-5);
            }
		}
	}

	var colors = data.colors ? data.colors : ['#333','#007bff','#5cb85c','#f44'];

	var ctx = document.getElementById(id).getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: data.label,
	        datasets: data.series
	    },
	    options: {
	    	responsive: false,
			title: {display: false},
			legend: {display: false},
			scales: {
				xAxes: [{
					gridLines: {display: false, drawBorder: false},
					ticks: {fontColor: '#ABB2BD'}
				}],
				yAxes: yAxis
			},
			hover: {
				intersect: false,
				mode: 'index',
				animationDuration: 0
			},
			tooltips: {
				intersect: false,
            	mode: 'index',
				// Disable the on-canvas tooltip
	            enabled: false,

	            custom: function(v){chartjs_tooltip(v,id,this)}
			}
	    }
	});
}





function profile_user_graph(id,data)
{
  var time = (new Date()).valueOf()/1000;
  var yAxis = data.yAxis ? data.yAxis : [{
  		visible: data.axisShow || false,
        className: 'highcharts-color-0',
        title: {text: ''},
        labels: {
            formatter: function () {
                return (data.yAxisPrefix||'')+Math.round10(this.value,-2);
            }
        }
    },{visible: false}];
  var colors = data.colors ? data.colors : ['#333','#007bff','#5cb85c','#f44'];


  Highcharts.chart(id,{
    chart: {
      // type: 'spline',
      backgroundColor:'rgba(255, 255, 255, 0.0)'
    },
    title: {text: ''},
    subtitle: {text: ''},
    exporting: {enabled: false},
    credits: {enabled: false},
    legend: {enabled: false},
    colors: colors,
    xAxis: {
        className: 'highcharts-color-0',
      	categories: data.label,
      	visible: true
    },
    yAxis: yAxis,
    plotOptions: {
      areaspline: {
      	fillOpacity: 0.06,
      	lineWidth: 5,
        marker: {
            enabled: false,
            symbol: 'circle',
            radius: 5,
            states: {
                hover: {
                    enabled: true
                }
            }
        }
      }
    },
    tooltip: {
        shared: true,
        padding: 0,
        borderColor: '#EFF0F2',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        useHTML: true,
    	formatter: function () {
			var s = '<div class="tooltip-head" style="color:'+colors[0]+'">' + data.tooltipLabels[this.x] + '</div>';

			$.each(this.points, function () {
				s += '<div class="tooltip-elem"><b>' +(this.series.tooltipOptions.valuePrefix||'') +this.y + '</b><i>' + this.series.name + '</i></div>';
			});

			return s;
        }
    },
    series: data.series
  });
}






function rating_block()
{
    var container = $("#statistics_item__current-income.empty");
    if( !container.length )
      return;

    container.removeClass('empty');

    var bar = new ProgressBar.Circle(container[0], {
      color: '#3F8EFA',
      // This has to be the same size as the maximum width to
      // prevent clipping
      strokeWidth: 4,
      trailWidth: 4,
      trailColor: container.data('bgcolor'),
      easing: 'easeInOut',
      duration: 1400,
      text: {
        autoStyleContainer: false
      },

      // Set default step function for all animate calls
      step: function(state, circle) {

        var value = Math.round(circle.value() * 100);

         circle.setText((100+parseInt(value)) + '%');

      }
    });
    container.css({
      fontFamily:'"Open Sans", Helvetica, sans-serif',
      fontSize:'22px',
      fontWeight:'800',
    });
    bar.animate(parseFloat(container.data('val')));  // Number from 0.0 to 1.0
}






// Sorting Select
function sortSelectInit()
{
	$('.sorting-select:not(.inited)').addClass('inited').on('click', function() {
		$(this).toggleClass('active dropdown-active');
	});

	$('.sorting-select_dropdown:not(.inited) li').on( 'click', function() {
	  	$(this).parent().find('li').removeClass('active');
	  	$(this).addClass('active');

	  	var itemContent = $(this).find('span').text();
		$(this).parents('.sorting-select_wrap').find('.sorting-select span').html(itemContent);

		$(this).parents('.sorting-select_wrap').find('.sorting-select').click();

		var href = $(this).data('href');
		if( href )
			ajaxe.query(href);
	});
	$('.sorting-select_dropdown:not(.inited)').addClass('inited');
}

function chartSwitchInit()
{
	// Chart Switch
	$('.chart-switch_item:not(.inited)').on('click', function() {
		var roleInfo = $(this).attr('data-info');
		
		$('.chart-switch_item').removeClass('active');
		$(this).addClass('active');
		if( $(this).siblings().length === 1 )
			roleInfo += ' double';
		$(this).parent().attr('class','chart-switch '+roleInfo);

		var href = $(this).data('href');
		if( href )
			ajaxe.query(href);
	}).addClass('inited');

	$('.chart-switch:not(.inited)').each(function(){
		var name = $(this).find('.chart-switch_item.active').data('info');
		$(this).addClass('inited').addClass(name);
	});
}






function chartjs_tooltip(tooltipModel, id, element) {
    // Tooltip Element
    var tooltipEl = document.getElementById('chartjs-tooltip-'+id);

    // Create element on first render
    if (!tooltipEl) {
        tooltipEl = $('<div>').attr('id','chartjs-tooltip-'+id)
        	.addClass('chartjs-tooltip').addClass('highcharts-tooltip').addClass('highcharts-color-0')[0];
        document.body.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
        tooltipEl.classList.add('no-transform');
    }

    function getBody(bodyItem) {
        return bodyItem.lines;
    }

    // Set Text
    if (tooltipModel.body) {
        var titleLines = tooltipModel.title || [];
        var bodyLines = tooltipModel.body.map(getBody);

		var innerHtml = '<div class="tooltip-head" style="color:'+tooltipModel.labelColors[0].borderColor+'">' + 
			titleLines[0] + '</div>';

        bodyLines.forEach(function(body, i) {

        	var col = tooltipModel.labelColors[i].borderColor || tooltipModel.labelColors[i].backgroundColor;
        	var index = tooltipModel.dataPoints[i].index;

        	body = String(body).split(': ');

        	var raw_val = Math.round10(body[1],-7);
        	var val = new Intl.NumberFormat($('html').attr('lang'), {maximumFractionDigits:5}).format( raw_val )

        	if( $('html').attr('lang') === 'ru-RU' )
        		val = val.replace(',','.');

        	if( body[0] === 'Spent' || body[0] === 'Потрачено' )
        		val = '$'+val;
        	if( body[0] === 'Total income' || body[0] === 'Общий доход' )
        		val = '$'+val;
        	if( body[0] === 'Income' || body[0] === 'Доход' )
        		val = '$'+val;

			innerHtml += '<div class="tooltip-elem"><b class="ch-type-'+i+'-'+index+'">'+val+'</b>\
			<i style="color:'+col+' !important">'+body[0]+'</i></div>';

        });

        tooltipEl.innerHTML = innerHtml;
    }

    // `this` will be the overall tooltip
    var position = element._chart.canvas.getBoundingClientRect();

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
    tooltipEl.style.fontFamily = 'inherit';//tooltipModel._bodyFontFamily;
    tooltipEl.style.fontSize = 'inherit';//tooltipModel.bodyFontSize + 'px';
    tooltipEl.style.fontStyle = 'inherit';//tooltipModel._bodyFontStyle;
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
    tooltipEl.style.pointerEvents = 'none';
}