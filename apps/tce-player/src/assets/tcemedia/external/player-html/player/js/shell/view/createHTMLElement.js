/* ====== This Module is used to generate DOM elment as per the JSON content. This module would be used Globally for all the DOM element creation. This module will also take care of the additing Event Listeners to the elements as and when required. 
"createNewElement" - needs to ba called with the parent DIV reference and the json values for the elements that is to be created in DOM.
"updateLoadingStatus" needs to be added to the calle method to check the DOM element creation status.
====== */

var CreateHTMLElement = function(ref) {
  var parentRef = ref;

  // ====== Public functions ========

  /* Generating HTML elements in DOM */
  this.createNewElement = function(aHolder, aElemList) {
    var _thisObj = this;
    var _element = document.createElement(aElemList.type);
    //document.getElementById(aHolder).appendChild(_element);
    $(aHolder).append(_element);
    for (var _i in aElemList) {
      if (
        _i != 'type' &&
        _i != 'buttonEvent' &&
        _i != 'subelements' &&
        _i != 'depth' &&
        _i != 'htmllink' &&
        _i != 'position' &&
        _i != 'data'
      ) {
        _element.setAttribute(_i, aElemList[_i]);
      } else if (_i == 'depth') {
        $(_element).css('z-index', aElemList[_i]);
      } else if (_i == 'data') {
        $(_element).data('uniqueId', aElemList.data);
      }
    }
    if (aElemList.clickEvent) {
      $(_element).addTouch();
      var THIS = this;
      this.enableButtonEvent($(_element), 'click', function(e) {
        executeEvents(e, $(this));
      });
    }
    if (aElemList.onLoadEvent) {
      eval(aElemList.onLoadEvent)();
    }
    if (aElemList.dragEvent) {
      $(_element).addTouch();
      this.addDragEvent(_element);
    }
    if (aElemList.overEvent || aElemList.hoverStyle || aElemList.touchstart) {
      $(_element).addTouch();
      this.enableButtonEvent($(_element), 'mouseover', function(e) {
        executeEvents(e, $(this));
      });
      this.enableButtonEvent($(_element), 'touchstart', function(e) {
        executeEvents(e, $(this));
      });
    }
    if (aElemList.outEvent || aElemList.hoverStyle || aElemList.touchend) {
      $(_element).addTouch();
      this.enableButtonEvent($(_element), 'mouseout', function(e) {
        executeEvents(e, $(this));
      });
      this.enableButtonEvent($(_element), 'touchend', function(e) {
        executeEvents(e, $(this));
      });
    }
    if (aElemList.flip) {
      if (aElemList.flip == 'true') {
        this.flipIdArr.push(aElemList.id);
      }
    }
    if (aElemList.keyCode) {
    }
    if (aElemList.position) {
      $(_element).css({
        top: aElemList.position[0],
        left: aElemList.position[1]
      });
    }
    if (aElemList.text) {
      var t = document.createTextNode(aElemList.text);
      _element.appendChild(t);
    }

    parentRef.updateLoadingStatus(true, $(_element));

    return _element;
  };

  this.enableButtonEvent = function(aId, aEventType, aFunctionRef) {
    $(aId)
      .unbind(aEventType, aFunctionRef)
      .bind(aEventType, aFunctionRef);
  };

  // === common view for navigation needs to be seperated ==== //

  /* Events attached to the DOM elements */
  function executeEvents(_event, _ref) {
    isMediaEneded = false;
    var _thisObj = this;
    var _winObj = window;
    if (_event.type == 'click') {
      switch (_ref.attr('clickevent')) {
        case 'managePlayPause':
          //console.log("this.executeEvents ... " + _event.type);
          parentRef.managePlayPause('video', _ref);
          break;
        case 'playAgain':
          parentRef.removeTooltip();
          parentRef.playMediaAgain(_ref);
          break;
        case 'manageNext':
          parentRef.loadNextScreen(_ref);
          break;
        case 'manageBack':
          parentRef.loadBackScreen(_ref);
          break;
        case 'manageReplay':
          parentRef.replayScreen(_ref);
          break;
        case 'manageAnnotationPanel':
          parentRef.manageAnnotationPanel(_ref);
          break;
        case 'manageColorYellow':
          parentRef.manageAnnotationColor(_ref, '#FFCC00');
          break;
        case 'manageColorGreen':
          parentRef.manageAnnotationColor(_ref, '#999900');
          break;
        case 'manageColorOrange':
          parentRef.manageAnnotationColor(_ref, '#FF6600');
          break;
        case 'manageColorRed':
          parentRef.manageAnnotationColor(_ref, '#CC3300');
          break;
        case 'manageAnnotationTool':
          parentRef.manageAnnotationTool(_ref);
          break;
        case 'manageClearAll':
          parentRef.manageClearAll(_ref);
          break;
      }
    }
    if (_event.type == 'mouseover' || _event.type == 'touchstart') {
      switch (_ref.attr('hoverStyle')) {
        case 'play-button-over':
          parentRef.displayTooltip(_ref.attr('tooltip'), $(_ref));
          break;
        case 'pause-button-over':
          parentRef.displayTooltip(_ref.attr('tooltip'), $(_ref));
          break;
        case 'next-over':
          parentRef.displayTooltip(_ref.attr('tooltip'), $(_ref));
          break;
        case 'back-over':
          parentRef.displayTooltip(_ref.attr('tooltip'), $(_ref));
          break;
        case 'replay-over':
          parentRef.displayTooltip(_ref.attr('tooltip'), $(_ref));
          break;
        case 'play-again-over':
          parentRef.displayTooltip(_ref.attr('tooltip'), $(_ref));
          break;
      }
    }
    if (_event.type == 'mouseout' || _event.type == 'touchend') {
      switch (_ref.attr('hoverStyle')) {
        case 'play-button-over':
          parentRef.removeTooltip();
          break;
        case 'pause-button-over':
          parentRef.removeTooltip();
          break;
        case 'next-over':
          parentRef.removeTooltip();
          break;
        case 'back-over':
          parentRef.removeTooltip();
          break;
        case 'replay-over':
          parentRef.removeTooltip();
          break;
        case 'play-again-over':
          parentRef.removeTooltip();
          break;
      }
    }
  }

  // ====== End of Public functions ========
};

//==============Global functions is used for frame based animation=========================
var requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
//=======================================
