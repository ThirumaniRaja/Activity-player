/*
This module is used to load all required JS files to the HTML player.
To add and delete the script file, please modify the "jsArray". Once all scripts are loaded this module despath an event "scriptLoaded", which is listen by the index file and instantiate the Player.
*/
var Common = function(_parentRef, _jsPath) {
  var parentRef = _parentRef;
  var jsPath = _jsPath;
  var jsArray = ['player/js/shell/common/resizePlayer.js'];
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
            //parentRef.initiatePlayer();
            var loadIndicationSuccess = new CustomEvent("tcePlayerLoaded",
            {
              "detail": "success"
            });
            document.dispatchEvent(loadIndicationSuccess);
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
