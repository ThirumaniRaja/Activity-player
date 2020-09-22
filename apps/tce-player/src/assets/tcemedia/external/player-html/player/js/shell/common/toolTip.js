/*---- This is a Global Module used to display the Tooltip of buttons
"myToolTip.showToolTip" should be called with the below parameters to have the tooltip of the elements.
parentTop - top value of the DOM element where the tooltip should display, 
parentLeft - left value of the DOM element where the tooltip should display, 
parentWidth - width of the DOM element where the tooltip should display,
tipText - text contain of the tooltip.
*/
var ToolTip = function(_tipElemRef, _tipArrowElemRef) {
  var tooltipElemRef = _tipElemRef;
  var tipArrowElemRef = _tipArrowElemRef;
  var tipContent;

  //---- Public Functions -----
  this.showToolTip = function(
    parentTop,
    parentLeft,
    parentWidth,
    tipText,
    arrowAlign
  ) {
    if (tipText) {
      tipContent = tipText;
      $(tooltipElemRef).css('z-index', 3010);
      $(tooltipElemRef).show();
      $(tooltipElemRef).text(tipContent);
      $(window).unbind('mousemove');
      $(tipArrowElemRef).css('z-index', 3000);
      $(tipArrowElemRef).show();

      $(tipArrowElemRef).removeClass('toolTipArrowLeft');
      if (arrowAlign == 'left') {
        $(tooltipElemRef).css(
          'top',
          parentTop + $(tooltipElemRef).height() / 3
        );
        $(tooltipElemRef).css(
          'left',
          parentLeft - 1.8 * $(tooltipElemRef).width()
        );
        $(tipArrowElemRef).css({
          top:
            $(tooltipElemRef).position().top + $(tooltipElemRef).height() / 2,
          left:
            $(tooltipElemRef).position().left + $(tooltipElemRef).width() + 14
        });
        $(tipArrowElemRef).addClass('toolTipArrowLeft');
      } else {
        $(tooltipElemRef).css(
          'top',
          parentTop - $(tooltipElemRef).height() - 20
        );
        $(tooltipElemRef).css(
          'left',
          parentLeft + (parentWidth - ($(tooltipElemRef).width() + 16)) / 2
        );
        $(tipArrowElemRef).css({
          top:
            $(tooltipElemRef).position().top + $(tooltipElemRef).height() + 10,
          left:
            $(tooltipElemRef).position().left +
            $(tooltipElemRef).width() / 2 -
            2
        });
      }
    }
  };

  this.moveToolTip = function(e) {
    $(tooltipElemRef).css('top', e.pageY - 40 - $(tooltipElemRef).height());
    $(tooltipElemRef).css('left', e.pageX - $(tooltipElemRef).width() / 2);
  };

  this.hideToolTip = function() {
    $(tooltipElemRef).text('');
    $(tooltipElemRef).hide();
    $(tipArrowElemRef).hide();
    $(window).unbind('mousemove');
  };

  //---- End of Public Functions -----
};
