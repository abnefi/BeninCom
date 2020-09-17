(function() {
    /**
     * ÐšÐ¾Ñ€Ñ€ÐµÐºÑ‚Ð¸Ñ€Ð¾Ð²ÐºÐ° Ð¾ÐºÑ€ÑƒÐ³Ð»ÐµÐ½Ð¸Ñ Ð´ÐµÑÑÑ‚Ð¸Ñ‡Ð½Ñ‹Ñ… Ð´Ñ€Ð¾Ð±ÐµÐ¹.
     *
     * @param {String}  type  Ð¢Ð¸Ð¿ ÐºÐ¾Ñ€Ñ€ÐµÐºÑ‚Ð¸Ñ€Ð¾Ð²ÐºÐ¸.
     * @param {Number}  value Ð§Ð¸ÑÐ»Ð¾.
     * @param {Integer} exp   ÐŸÐ¾ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»ÑŒ ÑÑ‚ÐµÐ¿ÐµÐ½Ð¸ (Ð´ÐµÑÑÑ‚Ð¸Ñ‡Ð½Ñ‹Ð¹ Ð»Ð¾Ð³Ð°Ñ€Ð¸Ñ„Ð¼ Ð¾ÑÐ½Ð¾Ð²Ð°Ð½Ð¸Ñ ÐºÐ¾Ñ€Ñ€ÐµÐºÑ‚Ð¸Ñ€Ð¾Ð²ÐºÐ¸).
     * @returns {Number} Ð¡ÐºÐ¾Ñ€Ñ€ÐµÐºÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ðµ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ.
     */

    function decimalAdjust(type, value, exp) {
        // Ð•ÑÐ»Ð¸ ÑÑ‚ÐµÐ¿ÐµÐ½ÑŒ Ð½Ðµ Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð°, Ð»Ð¸Ð±Ð¾ Ñ€Ð°Ð²Ð½Ð° Ð½ÑƒÐ»ÑŽ...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // Ð•ÑÐ»Ð¸ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ Ð½Ðµ ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ñ‡Ð¸ÑÐ»Ð¾Ð¼, Ð»Ð¸Ð±Ð¾ ÑÑ‚ÐµÐ¿ÐµÐ½ÑŒ Ð½Ðµ ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ñ†ÐµÐ»Ñ‹Ð¼ Ñ‡Ð¸ÑÐ»Ð¾Ð¼...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Ð¡Ð´Ð²Ð¸Ð³ Ñ€Ð°Ð·Ñ€ÑÐ´Ð¾Ð²
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // ÐžÐ±Ñ€Ð°Ñ‚Ð½Ñ‹Ð¹ ÑÐ´Ð²Ð¸Ð³
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Ð”ÐµÑÑÑ‚Ð¸Ñ‡Ð½Ð¾Ðµ Ð¾ÐºÑ€ÑƒÐ³Ð»ÐµÐ½Ð¸Ðµ Ðº Ð±Ð»Ð¸Ð¶Ð°Ð¹ÑˆÐµÐ¼Ñƒ
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Ð”ÐµÑÑÑ‚Ð¸Ñ‡Ð½Ð¾Ðµ Ð¾ÐºÑ€ÑƒÐ³Ð»ÐµÐ½Ð¸Ðµ Ð²Ð½Ð¸Ð·
    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Ð”ÐµÑÑÑ‚Ð¸Ñ‡Ð½Ð¾Ðµ Ð¾ÐºÑ€ÑƒÐ³Ð»ÐµÐ½Ð¸Ðµ Ð²Ð²ÐµÑ€Ñ…
    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

})();



function cpm_value(el,val){
    var v = $(el).val().replace(/[^\d\.]/ig,'');

    v = parseFloat(v);

    val = v + val;
    if(val < $(el).data('min'))
        val = $(el).data('min');

    if($(el).data('max') && val > $(el).data('max'))
        val = $(el).data('max');

    val = String(Math.round10(val,-3));

    var sp = val.split('.'), dec = parseInt($(el).data('dec')) || 3;

    if( dec )
    {
        if(sp.length < 2)
        {
            val += '.';
            for(var i = 0; i < dec; ++i)
                val += '0';
        }
        else
        {

            for(var i = 0; i < dec-sp[1].length; ++i)
                val += '0';
        }
    }


    $(el).val('$'+val);
    return val;
}

// $.style
(function($) {
    if ($.fn.style) {
        return;
    }

    // Escape regex chars with \
    var escape = function(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    // For those who need them (< IE 9), add support for CSS functions
    var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
    if (!isStyleFuncSupported) {
        CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
            return this.getAttribute(a);
        };
        CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
            this.setAttribute(styleName, value);
            var priority = typeof priority != 'undefined' ? priority : '';
            if (priority != '') {
                // Add priority manually
                var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
                    '(\\s*;)?', 'gmi');
                this.cssText =
                    this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
            }
        };
        CSSStyleDeclaration.prototype.removeProperty = function(a) {
            return this.removeAttribute(a);
        };
        CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
            var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
                'gmi');
            return rule.test(this.cssText) ? 'important' : '';
        }
    }

    // The style function
    $.fn.style = function(styleName, value, priority) {
        // DOM node
        var node = this.get(0);
        // Ensure we have a DOM node
        if (typeof node == 'undefined') {
            return this;
        }
        // CSSStyleDeclaration
        var style = this.get(0).style;
        // Getter/Setter
        if (typeof styleName != 'undefined') {
            if (typeof value != 'undefined') {
                // Set style property
                priority = typeof priority != 'undefined' ? priority : '';
                style.setProperty(styleName, value, priority);
                return this;
            } else {
                // Get style property
                return style.getPropertyValue(styleName);
            }
        } else {
            // Get CSSStyleDeclaration
            return style;
        }
    };
})(jQuery);

function detectAdBlock()
{
    if( !$('#rwMF6bhc5P').length )
    {
        $('.main-tabs').parent().after('<div class="row">\
      <div class="top__attention">\
        <img src="/static/flatonica/img/alert.svg" alt="ico">\
        <p>\
          '+($('html').attr('lang')==='en-US' ?
            'Ad blockers can break some site features. For the correct operation of our site, \
please add domains surfe.be and surfe.pro to the exclusions or temporarily disable the blocker.' :
            'Ð‘Ð»Ð¾ÐºÐ¸Ñ€Ð¾Ð²Ñ‰Ð¸ÐºÐ¸ Ñ€ÐµÐºÐ»Ð°Ð¼Ñ‹ Ð¼Ð¾Ð³ÑƒÑ‚ Ð»Ð¾Ð¼Ð°Ñ‚ÑŒ Ð½ÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸ ÑÐ°Ð¹Ñ‚Ð°. Ð”Ð»Ñ ÐºÐ¾Ñ€Ñ€ÐµÐºÑ‚Ð½Ð¾Ð¹ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹ Ð½Ð°ÑˆÐµÐ³Ð¾ ÑÐ°Ð¹Ñ‚Ð°, \
Ð¿Ð¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°, Ð´Ð¾Ð±Ð°Ð²ÑŒÑ‚Ðµ Ð´Ð¾Ð¼ÐµÐ½Ñ‹ surfe.be Ð¸ surfe.pro Ð² Ð¸ÑÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾ Ð¾Ñ‚ÐºÐ»ÑŽÑ‡Ð¸Ñ‚Ðµ Ð±Ð»Ð¾ÐºÐ¸Ñ€Ð¾Ð²Ñ‰Ð¸Ðº.')+'\
        </p>\
      </div>\
    </div>');
    }
}