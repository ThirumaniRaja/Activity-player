/*
This module is used to load all required JS files to the HTML player.
To add and delete the script file, please modify the "jsArray". Once all scripts are loaded this module despath an event "scriptLoaded", which is listen by the index file and instantiate the Player.
*/
var Common = function(_parentRef, _jsPath) {
  var parentRef = _parentRef;
  var jsPath = _jsPath;
  var jsArray = [
    'player/js/libs/jquery-ui-1.11.4/jquery-ui.min.js',
    'player/js/libs/jquery.ui.touch.js',
    'player/js/libs/jsxcompressor.min.js',
    'player/js/shell/common/resizePlayer.js',
    'player/js/shell/common/eventBus.js',
    'player/js/shell/common/preLoader.js',
    'player/js/shell/common/browserdetect.js',
    'player/js/shell/common/toolTip.js',
    'player/js/shell/view/createHTMLElement.js',
    'player/js/shell/view/videoSlider.js',
    'player/js/shell/controller/annotation.js',
    'player/js/shell/controller/navigationController.js',
    'player/js/shell/controller/starController.js',
    'player/js/shell/view/navigationView.js',
    'player/js/shell/controller/stepGenerator.js',
    'player/js/shell/view/drawText.js',

    'player/js/shell/view/videoManagerComp.js',
    'player/js/shell/common/globalAnimClass.js',
    'player/js/shell/view/buttonAnimation.js',
    'player/js/shell/model/shellModel.js',
    'player/js/shell/controller/shellController.js',
    'player/js/shell/view/shellView.js',
    'player/js/shell/service.js'
  ];
  //================================================================================
  var securityPopUp = {
    appearenceDuration: 30000,
    hideDuration: 5000,
    bgColor: 'rgba(208,206,206,0.5)',
    txtColor: 'rgba(255, 255, 255, 0.59)',
    fontFamily: 'Verdana',
    fontSize: '9px',
    isShow: true
  };
  //================================================================================
  var scriptLoaded = 0;

  //================================================================================
  this.getSecurityLayerObj = function() {
    return securityPopUp;
  };
  //================================================================================
  this.includeJs = function() {
    for (var i = 0; i < jsArray.length; i++) {
      loadScript(jsPath + jsArray[i], jsLoaded);
    }
  };
  //================================================================================
  function loadScript(path, callback) {
    var done = false;
    $.getScript(path)
      .done(function(script, textStatus) {
        done = true;
        scriptLoaded++;
        callback(path, 'ok');
      })
      .fail(function(jqxhr, settings, exception) {
        //console.log( "Triggered ajaxError handler." );
      });
  }
  //================================================================================
  function jsLoaded(path, status) {
    if (status == 'ok') {
      //console.log("scriptLoaded == "+scriptLoaded);
      if (scriptLoaded == jsArray.length) {
        // === Entire scripts are loaded ===
        // Touch punch is to be loaded once jquery ui is loaded completely. //
        $.getScript(jsPath + 'player/js/libs/jquery.ui.touch-punch.min.js')
          .done(function(script, textStatus) {
            parentRef.initiatePlayer();
          })
          .fail(function(jqxhr, settings, exception) {
            //console.log( "Triggered ajaxError handler because touch-punch script file got error. exception = "+exception);
          });
      }
    } else if (status == 'error') {
      //console.log("Js files are not loaded through common.js.")
    }
  }
};
//=============
