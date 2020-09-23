/* This module will read the config files and read the parameters for vieo path, JSON path and the main container reference where the plaer will get instantiated and then intantiate the player.
 */
//resizeWindowObj;
var tcePlayer = function(
  _configXMLData,
  _callBackUrl,
  _jsPath,
  _iFrameParam,
  _clientIp,
  _orgId,
  _mode
) {
  var _classRef = this;
  var shellViewObj, annotationTool;
  var playerDiv;
  var configData = _configXMLData;
  var callBackPath = _callBackUrl;
  var pageJsonName, pageVideoName;
  var dependentFolders = [];
  var iframe;
  var jsPath = _jsPath;
  var mode = _mode;
  var iFrameParam = _iFrameParam;
  var clientIp = _clientIp;
  var orgId = _orgId;
  var tempDiv;
  var securityLayer;
  var sInterval;
  var commonObj;
  var debugFrameNoEnabled = true;
  _classRef.resizeWindowObj = null;
  //================================================================================
  this.init = function() {
    //console.log(clientIp, orgId);
    parseConfigXml();
  };
  //================================================================================
  this.getShellView = function() {
    return shellViewObj;
  };
  //================================================================================
  this.sleep = function() {
    shellViewObj.destroyPlayer();
    shellViewObj = null;
    playerDiv = null;
    dependentFolders = null;
    pageJsonName = pageVideoName = null;
    var frameDoc = iframe.contentDocument || iframe.contentWindow.document;
    frameDoc.removeChild(frameDoc.documentElement);
    $(iframe).remove();
  };
  //================================================================================
  this.getNavigationController = function() {
    //console.log("TYPE-->>",  shellViewObj)
    if(shellViewObj !== undefined){
      if(shellViewObj.getNavController() !== undefined){
        //console.log("__IN 1")
        return shellViewObj.getNavController();
      }
    }


  };
  //================================================================================
  this.getPlayerCreationStatus = function() {
    return shellViewObj.getCreationStatus();
  };
  //================================================================================
  this.externalPlay = function() {
    this.getNavigationController().start();
  };
  //================================================================================
  this.externalPause = function() {
    if(this.getNavigationController()){
      this.getNavigationController().pause();
    }

  };

  this.externalPauseStatus = function() {
    //this.getNavigationController().pauseStatus;
    //console.log("hello--", this.getNavigationController().pauseStatus);
  };

  this.playerIsPaused = function() {
    if(this.getNavigationController() !== undefined){
      //console.log("this.getNavigationController()-->>> ",this.getNavigationController())
      if(typeof this.getNavigationController().isPaused() == "function"){
        if(typeof this.getNavigationController().isPaused() == "boolean"){
          return this.getNavigationController().isPaused();
        }
      }
    }else{
      //console.log("--NO NAV CTRL --")
    }

	};
  //================================================================================
  this.externalStop = function() {
    this.getNavigationController().stop();
  };
  //================================================================================
  /*console.log = function(msg)
	{
	}*/
  //======================= Private Methods =========================================================
  function parseConfigXml() {
    /* Read config.xml and store filesNames of the assets */
    var data = $.parseXML(configData);
    console.log("parse config data--1 >> ", configData.tcetype)
    console.log("parse config data--2 >> ", data)
    

    if(data !== null){
      pageJsonName = $(data).find('asset') .attr('xmlSrc');
      pageVideoName = $(data).find('asset').attr('filenamesrc');
      var dependentLength = $(data).find('dependent').find('file').length;
      for (var i = 0; i < dependentLength; i++) {
        dependentFolders.push( $(data).find('dependent').find('file').attr('src') );
      }
      var mimeType = $(data).find('metadata').find('mimetype').text();
      decidePlayerType(mimeType);
    }else{
      decidePlayerType(configData.tcetype);
    }
  }
  //=========================================
  function decidePlayerType(_mimeType) {
    //console.log("hello_mimeType--"+_mimeType)
    switch (_mimeType) {
      case 'tce-html':
        loadCommonScriptForHtmlPlayer(jsPath + 'player/js/shell/common/common.js' );
        break;
      case 'tce-shell':
        // 02 Aug: Arijit - intorduced HTML shell
        var updatedMediaPath = callBackPath;
        loadCommonScriptForHtmlPlayer(jsPath + 'player/js/shell/common/commonShell.js');
        iframe = document.createElement('iframe');
        $(iframe).attr('frameborder', 0);
        $(iframe).attr('id', 'iframe_' + Math.random(999));

        $(iframe).css({
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '993px',
          height: '610px',
          'overflow-x': 'hidden',
          'overflow-y': 'hidden'
        });

        $(iframe).data('uniqueId', 'mainFrame');
        $(tempDiv).append(iframe);
        if (targetContainer instanceof HTMLElement) {
          $(targetContainer).html(iframe);
        } else {
          $('#' + targetContainer).html(iframe);
        }

        $(iframe).ready(function() {
          setTimeout(function() {
            //console.log("babloo---pageVideoName--",pageVideoName)
            $(iframe).attr('src', updatedMediaPath + pageVideoName);
            onResizeFn();
          }, 500);
        });
        //generateSecurityLayer();
        break;

       // ------- new case - 13 dec 2019
       case 'tool':
        // 13 dec: satyajit - intorduced tool
        var updatedMediaPath = callBackPath;
        loadCommonScriptForHtmlPlayer(jsPath + 'player/js/shell/common/commonShell.js');
        iframe = document.createElement('iframe');
        $(iframe).attr('frameborder', 0);
        $(iframe).attr('id', 'iframe_' + Math.random(999));
        $(iframe).css({
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '993px',
          height: '610px',
          'overflow-x': 'hidden',
          'overflow-y': 'hidden'
        });

        $(iframe).data('uniqueId', 'mainFrame');
        $(tempDiv).append(iframe);
        
        if (targetContainer instanceof HTMLElement) {
          $(targetContainer).html(iframe);
        } else {
          $('#' + targetContainer).html(iframe);
        }
        $(iframe).ready(function() {
          //console.log("iframe ready!!")
          setTimeout(function() {
            //console.log("bablooo updatedMediaPath + resorceData.fileName--",updatedMediaPath + " (+) " + resorceData.fileName)
            $(iframe).attr('src', updatedMediaPath + resorceData.fileName);
            onResizeFn();
          }, 500);
        });
        //generateSecurityLayer();
        // ----------- end of new case 13 dec  ---------------
        break;
       

       // ---------- start of game june 2020 ------------------- 
       case 'game':
        // june 2020: satyajit - intorduced game
        var updatedMediaPath = callBackPath;
        loadCommonScriptForHtmlPlayer(jsPath + 'player/js/shell/common/commonShell.js');
        iframe = document.createElement('iframe');
        $(iframe).attr('frameborder', 0);
        $(iframe).attr('id', 'iframe_' + Math.random(999));
        $(iframe).css({
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '993px',
          height: '610px',
          'overflow-x': 'hidden',
          'overflow-y': 'hidden'
        });

        $(iframe).data('uniqueId', 'mainFrame');
        $(tempDiv).append(iframe);
        
        if (targetContainer instanceof HTMLElement) {
          $(targetContainer).html(iframe);
        } else {
          $('#' + targetContainer).html(iframe);
        }

        $(iframe).ready(function() {
          //console.log("iframe ready!!")
          setTimeout(function() {

            //console.log("bablooo updatedMediaPath + resorceData.fileName--",updatedMediaPath + " (+) " + resorceData.gameFileName)
            $(iframe).attr('src', updatedMediaPath + resorceData.gameFileName);
            //$(iframe).attr('src', updatedMediaPath + 'Game_Cricket_Challenge.html');
            //$(iframe).attr('src', 'http://localhost:4200/canvas?cmode=1');
            onResizeFn();
          }, 500);
        });
        //generateSecurityLayer();
        break;
       

       // ---------- end of game june 2020 ------------------- 




      case 'swf':
        //console.log("SWF Player need to instantiate here.");
        break;
      case 'xml':
        console.log('XML Player need to instantiate here.');
        break;
      case 'pdf':
        console.log('SWF Player need to instantiate here.');
        break;
      default:
        console.log('mime type was not set properly.');
        break;
    }
  }
  //================================================================================
  this.initiatePlayer = function() {
    //console.log("1 -- targetContainer-->>"+targetContainer)
    //tempDiv.remove();
    shellViewObj = new ShellView();
    /* Instantiate service object and dynamically create iFrame and main div container before player controller is called */
    var serviceObj = new Service(callBackPath, jsPath, mode);
    var initialImageName = 'images/' + pageJsonName.split('.json')[0] + '.png';
    var cssUrl = [
      'player/js/libs/jquery-ui-1.11.4/jquery-ui.css',
      'player/css/player.css',
      'player/css/annotation.css'
    ];
    iframe = document.createElement('iframe');
    $(iframe).attr('frameborder', 0);
    $(iframe).attr('id', 'iframe_' + Math.random(999));
    //$(iframe).attr("id",targetContainer);
    /* var width = iFrameParam.maxHeight*(993/610); */
    $(iframe).css({
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '993px',
      height: '610px',
      'overflow-x': 'hidden',
      'overflow-y': 'hidden'
    });
    $(iframe).data('uniqueId', 'mainFrame');
    //$("body").append(iframe);
    //console.log("1---targetContainer-->> "+targetContainer)
    if (targetContainer instanceof HTMLElement) {
      $(targetContainer).html(iframe);
    } else {
      $('#' + targetContainer).html(iframe);
    }
    //$("#"+targetContainer).append('<div id="fake"></div>');
    playerDiv = iframe.contentWindow.document.createElement('div');
    $(playerDiv)
      .data('uniqueId', 'mainDiv')
      .addClass('indexPreloader');
    //$(playerDiv).append('<div id="fake"></div>');
    $(iframe).ready(function() {
      setTimeout(function() {
        for (var i = 0; i < cssUrl.length; i++) {
          var link = document.createElement('link');
          link.href = jsPath + cssUrl[i];
          link.rel = 'stylesheet';
          link.type = 'text/css';
          $(iframe)
            .contents()
            .find('head')
            .append(link);
        }
        //console.log("ready..................")
        $(iframe)
          .contents()
          .find('body').on('click', function(evnt) {
            var customEvent = new Event('tcePlayerClick', {
              bubbles: true
            });
            iframe.dispatchEvent(customEvent);
          });
        $(iframe)
          .contents()
          .find('body')
          .append(playerDiv);
        shellViewObj.init(
          serviceObj,
          playerDiv,
          pageJsonName,
          pageVideoName,
          initialImageName,
          iframe,
          jsPath,
          debugFrameNoEnabled
        );
        //
        onResizeFn();
        //$(window).resize(onResizeFn);
      }, 500);
    });
    // Event Listener for annotation canvas ready status.

    //TCE PLAYER INTERNAL ANNOTAION - uncomment to turn on
    //EventBus.addEventListener("annotationCanvasReady", onAnnotationCanvasReady, this);
    generateSecurityLayer();
  };
  //================================================================================
  function generateSecurityLayer() {
    //console.log("TES-->>",commonObj.getSecurityLayerObj().isShow)
    if (!commonObj.getSecurityLayerObj().isShow) {
      return false;
    }
    if (securityLayer) {
      $(securityLayer).remove();
    }
    securityLayer = document.createElement('div');
    $(securityLayer).css({
      position: 'absolute',
      'z-index': 1000,
      'background-color': commonObj.getSecurityLayerObj().bgColor,
      padding: '1px 4px',
      'font-family': commonObj.getSecurityLayerObj().fontFamily,
      'font-size': commonObj.getSecurityLayerObj().fontSize,
      color: commonObj.getSecurityLayerObj().txtColor,
      'text-align': 'center',
      'pointer-events': 'none'
    });
    if (clientIp != '') {
      $(securityLayer).append(clientIp + '<br>');
    }
    if (orgId != '') {
      $(securityLayer).append(orgId + '<br>');
    }
    sInterval = setInterval(function() {
      clearInterval(sInterval);
      $(playerDiv).append(securityLayer);
      var divsize = [
        parseInt($(securityLayer).innerWidth()),
        parseInt($(securityLayer).innerHeight())
      ];
      var posx = (Math.random() * (993 - divsize[0])).toFixed();
      var posy = (Math.random() * (500 - divsize[1])).toFixed();
      var d = new Date();
      var n = d.getTime();
      $(securityLayer).append(n);
      $(securityLayer).css({
        left: posx + 'px',
        top: Number(posy) + 0 + 'px'
      });
      sInterval = setInterval(function() {
        if (securityLayer) {
          clearInterval(sInterval);
          $(securityLayer).remove();
          generateSecurityLayer();
        }
      }, commonObj.getSecurityLayerObj().hideDuration);
    }, commonObj.getSecurityLayerObj().appearenceDuration);
  }
  //================================================================================
  function onAnnotationCanvasReady(e) {
    // Annotation featue initates here...
    var canvasRef = arguments[2];
    annotationTool = new Annotation();
    annotationTool.init(
      canvasRef,
      '#nav-container',
      iframe.contentWindow.document,
      shellViewObj.getNavController()
    );
  }
  //================================================================================
  function onResizeFn() {
    console.log("TCE PLAYER RESIZE_TEST")
    _classRef.resizeWindowObj = new resizeWindow(
      iframe,
      iFrameParam.maxHeight,
      iFrameParam.left,
      iFrameParam.top
    );
    _classRef.resizeWindowObj.onResize(); 
    
  }

  _classRef.doResizeFn = function() {
    _classRef.resizeWindowObj = new resizeWindow(
      iframe,
      iFrameParam.maxHeight,
      iFrameParam.left,
      iFrameParam.top
    );
    _classRef.resizeWindowObj.onResize();
  };
  //================================================================================
  function loadCommonScriptForHtmlPlayer(path) {
    //console.log("babloo - loadCommonScriptForHtmlPlayer -path- ",path)
    $.getScript(path)
      .done(function(script, textStatus) {
        /* Instantiate Common Class and ask to include all required script files. Once loading is done an event called "scriptLoaded" is despatched. Index.html will listen this event folled by Player instantiation with the required parameter. */
        //console.log("jsPathsss-->> "+jsPath)
        //console.log("_classRefsss-->> "+_classRef)
        commonObj = new Common(_classRef, jsPath);
        commonObj.includeJs();
        
      })
      .fail(function(jqxhr, settings, exception) {
        console.log( "common.js not loaded." );
      });
  }
  //==============
};
