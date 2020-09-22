/* This is a Global module and is used to display loader while data loads  
During initialization, main container id should be passed and the required div elements should be created in the DOM. We need to then display the loader using "displayLoader(textContent)"
*/
var PreLoader = function() {
  var elementRef;
  var currentPercent = 0;
  var totalPercent = 100;
  var preloadAnimElement;
  var preloadShellElement;
  var preloadStatusElement;
  /* ====== Public functions ========	*/

  this.init = function(element, contentType) {
    elementRef = element;
    var childCount = $(elementRef).children().length;
    for (var i = 0; i < childCount; i++) {
      if (
        $(elementRef)
          .children()
          .eq(i)
          .data('uniqueId') == 'preloaderAnimation'
      ) {
        preloadAnimElement = $(elementRef)
          .children()
          .eq(i);
      }
      if (
        $(elementRef)
          .children()
          .eq(i)
          .data('uniqueId') == 'preloaderShell'
      ) {
        preloadShellElement = $(elementRef)
          .children()
          .eq(i);
      }
    }
    preloadShellElement.hide();
  };

  this.displayLoader = function() {
    preloadAnimElement.hide();
    preloadShellElement.show();
    elementRef.show();
  };

  this.displayVideoLoader = function(txt) {
    preloadAnimElement.show();
    preloadShellElement.hide();
    elementRef.show();
  };

  this.hideLoader = function() {
    elementRef.hide();
  };

  this.setCurrentPercentage = function(_cPercent) {
    currentPercent = _cPercent;
  };
  this.getCurrentPercentage = function() {
    return currentPercent;
  };
  this.destroy = function() {
    elementRef = null;
    currentPercent = null;
    totalPercent = null;
    preloadAnimElement = null;
    preloadShellElement = null;
    preloadStatusElement = null;
  };

  /* ====== End Public functions ========	*/
};
