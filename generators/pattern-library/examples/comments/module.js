/*
    TODO WIP. This is not currently supported.
*/

/**
 * Takes a specified element by its `class` and extracts its content, wrapping it in a tooltip container. The tooltip is set to show where the mouse originally entered the event target.
 *
 * @example
 *  $('.any-class').simpleTip();
 *  @before
 *  <div class="any-class">
 *      <div>Any content. Blah, blah, blah.</div>
 *      <div class="tip-content">
 *          <p>Lorem ipsum dolor sit amet.</p>
 *      </div>
 *  </div>
 * @result
 *  <div id="tooltip-wrapper">
 *      <div class="tip-content">
 *          <p>Lorem ipsum dolor sit amet.</p>
 *      </div>
 *  </div>
 * @syntax javascript
 * @title Default Usage
 * @desc The `class` supplied to the plugin should contain an element that wraps the content needed to show in the tooltip. When the user's mouse enters the `any-class` element the`tip-content` html is copied and inserted into the `tooltip-wrapper` container and shown. The `tooltip-wrapper` is automatically added to the DOM just before the closing `body` element.
 *
 * @example
 *  $('.any-class').simpleTip({
 *      x: -20,
 *      y: -10,
 *      tooltipID: 'my-custom-tooltip-wrapper',
 *      tooltipContentClass: 'custom-content'
 *  });
 * @before
 *  <div class="any-class">
 *      <div class="custom-content">
 *          <p>Lorem ipsum dolor sit amet.</p>
 *      </div>
 *  </div>
 * @result
 *  <div id="my-custom-tooltip-wrapper">
 *      <div class="tooltip-content">
 *          <p>Lorem ipsum dolor sit amet.</p>
 *      </div>
 *  </div>
 * @syntax javascript
 *
 * @title Customize the Tooltip
 * @desc The plugin will copy the tooltip content from the `custom-content` element inside of the `any-class` element. The tooltip will have an `left` offset of `-20px` and `top` offset of `-10px` from where the user's mouse first entered the `any-class` element. The tooltip container will have an `id` of `my-custom-tooltip-wrapper`.
 *
 * @param {Object} options (optional) Customize position, tip content `class` and tip wrapper `id`.
 * @option {Number} x This value is added or subtracted (if a negative number is supplied) from the tooltip's x position. Default is `0`.
 * @option {Number} y This value is added or subtracted (if a negative number is supplied) from the tooltip's y position. Default is `0`.
 * @option {String} width Define the tooltip's `width` (can also be done in stylesheet). Default is `null`.
 * @option {String} height Define the tooltip's `height` (can also be done in stylesheet). Default is `null`.
 * @option {String} tooltipID The `id` for the element to wrap the tooltip. This element is appended to the `body` element on page load. Default is `tooltip-wrapper`.
 * @option {String} tooltipContentClass The `class` from which the plugin extracts the tooltip content for each matched element. Default is `tip-content`.
 * @option {Boolean} useTitle Use the value of the element's `title` attribute as the tooltip content for each matched element. Default is `false`.
 * @option {Boolean} useAlt Use the value of the element's `alt` attribute as the tooltip content for each matched element. Default is `false`.
 *
 * @author Ryan Fitzer
 */

!(function($) {

    $.fn.simpleTip = function(options) {

        if(!this.length) return;

        return this.each(function() {

            if ( $.data( this, 'simpleTip' ) ) return this;

            $.data( this, 'simpleTip', new $.SimpleTip( this, options ) );
        });
    };

    $.SimpleTip = function(element, options) {

        var defaults = {
            x: 0,
            y: 0,
            width: null,
            height: null,
            tooltipID: 'tooltip-wrapper',
            tooltipContentClass: 'tip-content',
            useTitle: false,
            useAlt: false
        };

        this.options = $.extend({}, defaults, options || {});
        this.element = $(element);

        if(!this.element.length) return;

        this.title = this.element.attr('title');
        this.element.removeAttr('title');
        this.setup();

    };

    $.SimpleTip.prototype = {

        setup: function() {

            var self = this;

            // If no tip wrapper is present than add one.
            if(!$('#' + self.options.tooltipID).length) {
                self.tooltip = $('<div id="' + this.options.tooltipID + '"><div class="tooltip-content"></div></div>');
                $('body').append(self.tooltip);
            }
            else {
                self.tooltip = $('#' + self.options.tooltipID);
            }

            self.element.bind('mouseenter', function(e) {
                self.display(e);
            });

            self.element.bind('mouseleave', function() {
                self.hide();
            });

        },

        display: function(e) {

            var content
                , self = this
                ;

            var cssProps = {
                'display': 'block',
                'visibility': 'visible'
            };

            self.tooltip.css({
                'opacity': '0',
                'display': 'none',
                'height': 'auto',
                'visibility': 'hidden'
            });

            cssProps.left = e.pageX - self.options.x
            cssProps.top = e.pageY + self.options.y - self.tooltip.height();

            if( self.options.width ) {
                cssProps.width = self.options.width;
            }

            if( self.options.height ) {
                cssProps.height = self.options.height;
            }

            if ( self.options.useTitle ) {
                content = e.currentTarget.title;
            }
            else if ( self.options.useAlt ) {
                content = e.currentTarget.alt;
            }
            else {
                content = self.element.find('.' + self.options.tooltipContentClass).html();
            }

            self.tooltip.find('.tooltip-content').html(content);

            self.tooltip.stop().css(cssProps).animate({
                'opacity': '1',
                'display': 'block',
                'visibility': 'visible'
            }, 200);

        },

        hide: function() {

            var self = this;

            self.element.removeClass('tooltip-open');

            $('#' + self.options.tooltipID).stop().animate({
                'opacity': '0',
                'display': 'none',
                'visibility': 'hidden'
            }, 200);

        }
    };

})( jQuery );