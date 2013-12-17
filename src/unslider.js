/**
 *   Unslider 2.0
 *   by @idiot and friends
 */
 
(function($) {
    //  Don't throw errors if we haven't included jQuery
    if(!$) return;
    
    //  Our main object with all its lovely 
    var Unslider = function(el, opts) {
        //  Set our main element wrapper
        //  Should be surrounding the <ul> tag.
        this.el = el;
        
        //  This is the <ul> tag we were talking about.
        this.items = el.children('ul');
        
        //  Move to the first <li> element
        this.index = 0;
        
        //  Set a default object to merge with the opts object.
        //  Don't ever call this.defaults, call this.opts instead.
        this.defaults = {
            //  How fast to move between slides (in ms)
            speed: 500,
            
            //  The length of time to leave between moving slides (in ms)
            interval: 2000,
            
            //  Callback function for a slide has finished sliding
            //  parameters are:
            //   - this, the current active slide
            //   - "el", the base element"
            //   - "index", the current active slide's index
            complete: function(el, index) {}
            
            //  Add keyboard (L/R arrow) support?
            keys: true,
            
            //  Add navigation dots?
            //  This will only append a <nav> element with <ol> in.
            //  If you want to style the dots, you'll need to write
            //  some custom CSS to do that. It doesn't come included with
            //  Unslider, to keep things small.
            dots: true
        };
        
        //  This is the one to use. Merge in options with our defaults.
        this.opts = $.extend(this.defaults, opts);
        
        //  Since jQuery takes away selector context sometimes, we can't always
        //  reliably use "this" to assume "Unslider", so we cache a copy of the
        //  "this" variable and call it "self". If there are variable problems,
        //  it's because you used "this" instead of "self".
        var self = this;
        
        //  Find a slide using either a slide index or a selector (such as an
        //  (such as an ID or attributes, whatever - I don't know).
        this.find = function(wut) {
            //  If we're using an index to find it, assume it's an .eq() call 
            if($.isNumeric(wut)) {
                wut = 'li:eq(' + wut + ')';
            }
            
            //  Find our element, either using a selector or index
            return self.items.find(wut);
        };
        
        //  Move a slide to an index
        this.move = function(to) {
            //  Set the new target element
            var target = self.find(to);
            
            //  Update our index so we know what slide's active
            self.index = target.index();
            
            //  And move it
            if(!self.items.queue('fx').length) {
                //  Update the active classes
                var active = self.items.find('li:eq(' + self.index + ')').addClass('active')
                                 .siblings().removeClass('active');
                    
                //  Animate the slides
                self.items.animate({left: -(self.index) + '%'}, self.opts.speed, function() {
                    $.isFunction(self.opts.complete) && self.opts.complete.call(active, self.el, self.index);
                });
            }
        };
        
        //  If we're hyperlinking to a slide
        if(window.location.hash) {
            this.move(window.location.hash);
        }
    };
    
    //  And set up our jQuery plugin
    $.fn.unslider = function(opts) {
        return this.data('unslider', new Unslider(this, opts));
    };
    
})(window.jQuery || false);