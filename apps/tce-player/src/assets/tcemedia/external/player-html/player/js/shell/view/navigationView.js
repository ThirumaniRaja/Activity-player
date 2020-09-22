/* This module is the view of navigation components.*/

var NavigationView = function() {
  /* ---- Public methods----  */
  this.updatePlayPauseState = function(
    bool,
    aEventBool,
    playBtnRef,
    pauseBtnRef
  ) {
    if (bool) {
      showElement(playBtnRef, false);
      showElement(pauseBtnRef, true);
    } else {
      if (aEventBool) {
        showElement(playBtnRef, true);
        showElement(pauseBtnRef, false);
      } else {
        showElement(playBtnRef, false);
        showElement(pauseBtnRef, false);
      }
    }
  };

  this.enablePlayPause = function(
    aBool,
    playDisableBtnRef,
    pauseDisableBtnRef,
    pauseStatus
  ) {
    if (aBool) {
      showElement(pauseDisableBtnRef, !aBool);
      showElement(playDisableBtnRef, !aBool);
    } else {
      if (pauseStatus) {
        showElement(pauseDisableBtnRef, true);
      } else {
        showElement(pauseDisableBtnRef, true);
      }
    }
  };

  this.enableButton = function(aBool, aButtonRef) {
    if (aBool) {
      aButtonRef.css('opacity', 1);
      aButtonRef.removeAttr('disabled');
      aButtonRef.css('cursor', 'pointer');
    } else {
      aButtonRef.css('opacity', 0.5);
      aButtonRef.attr('disabled', 'disable');
      aButtonRef.css('cursor', 'default');
    }
  };

  this.getButtonState = function(aButtonRef) {
    if (aButtonRef.css('opacity') == 1) {
      return true;
    } else {
      return false;
    }
  };

  this.highlightNext = function(aBool, nextRef, nextHighlightRef) {
    if (aBool) {
      nextHighlightRef.show();
      nextRef.hide();
    }
  };

  this.restoreNext = function(nextRef, nextHighlightRef) {
    nextHighlightRef.hide();
    nextRef.show();
  };

  this.showHidePlayAgain = function(aBool, playAgain) {
    showElement(playAgain, aBool);
  };
  this.updateNavBackPatch = function(navBack, val) {
    if (navBack) {
      $(navBack).css('width', val);
    }
  };
  /* ---- End of Public methods----  */

  /* ---- Private methods----  */

  function showElement(aElemId, aBool) {
    aBool ? aElemId.show() : aElemId.hide();
  }
  /* ---- End of Private methods----  */
};
