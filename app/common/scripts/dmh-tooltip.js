function dmhTooltip(selector) {
  var self = this;

  this.tooltipClass = 'dmh-tooltip-container';

  var tooltipElements = document.querySelectorAll(selector);
  if( !!tooltipElements ) {
    for(var i=0, len=tooltipElements.length; i<len; i++) {
      var el = $(tooltipElements[i]);

      el.on('mouseenter', function () {
        var $this = $(this),
            pos = $this.data('tooltip-position') || '',
            label = $this.data('tooltip-label') || '',
            bubble = $this.data('tooltip-bubble') || '';

        if( !pos ) pos = 'bottom';

        self.append($this, pos, label, bubble);
      });

      el.on('mouseleave', function() {
        $('.'+self.tooltipClass).remove();
      });
    }
  }
}



dmhTooltip.prototype.setPosition = function(container, el, pos) {
  var top = 0,
      left = 0;

  switch(pos) {
    case 'bottom':
    default:
      top = (el.offset().top) + el.outerHeight();
      left = el.offset().left - (el.width() / 2);
      container.classList.add('bottom');
      break;

    case 'top':
      top = (el.offset().top) - $(container).outerHeight();
      left = el.offset().left - (el.width() / 2);
      container.classList.add('top');
      break;
  }

  $(container).css({
    top: top,
    left: left
  });
};


dmhTooltip.prototype.append = function(el, pos, label, bubblePos) {
  var tooltipContainer = document.createElement('div');

  tooltipContainer.classList.add(this.tooltipClass);
  tooltipContainer.innerHTML = label;

  if( !bubblePos ) bubblePos = 'bubble-center';
  tooltipContainer.classList.add(bubblePos);

  $('body').append(tooltipContainer);
  this.setPosition(tooltipContainer, el, pos);
};
