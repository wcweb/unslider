/**
 *   Add infinite scroll functionality
 *   (Default functionality is to move back to the first slide)
 */
(function($) {
    $.Unslider.hook.bind('move', function() {
    	if(typeof this.opts['infinite'] == 'undefined') return;
    	return;
    });
})(window.jQuery);