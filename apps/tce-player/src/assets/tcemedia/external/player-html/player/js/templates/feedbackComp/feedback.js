var feedBackClass = function() {
  var p = {
    audioFinish: false,
    popupPresent: false,
    popupCloseBtnPresent: false,
    pElem: {},
    canvasctx: null
  };
  var _thisObj = this;
  var audioObj;
  var pageDataJson;
  var drawTextObj = new DrawText();
  var sliderObj = new VideoSliderClass();
  var videoManagerObj = new VideoManagerClass();
  var loadImgCnt = 0,
    loadedImgCnt = 0;
  var activityImageObj = new Object();
  var commonAssetPath;
  /* 	
	videoFb:{
	pageDataParam:{fileName:"json/pageData.json",//path
                   textDivId:"textDivId"//text holder
				   }
	sliderParam:{ sliderDivId:"mySlider", //slider holder
	              type: "video", 
				  sliderStart:0,
				  showDurationToolTip:true, 
				  duration:null,
				  cssParam:{"x": 400,    // slider position
				            "y": 550,
				            "width": 220,
							"height": 8,
							"color": "#000"}  
				}
	
	videoManagerParam:{
				videoId:"pageVideo", // video holder
				dummyImgCanvas:"pageCnv", // before video load dummy img
				dummyImg:"",//path
				videoPath:"audio_video/screenVideo1.mp4", // video path 
	}
	
	otherParam:
				{
				hideVideo:true
				
				}
	} */
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  this.init = function(_obj) {
    var _tempObj = new Object();
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    commonAssetPath = p._shellModel.getServiceObj().getCommonAssetPath();
    audioObj = new AudioPlayerNormalClass();
    for (var i = 0; i <= 8; i++) {
      _tempObj[i] =
        commonAssetPath +
        'commonAssets/images/fb/type1/fb1_' +
        (i + 1) +
        '.png';
    }
    makeImgObj(_tempObj);
  };

  function makeImgObj(_tempObj) {
    var preloadBool = false;
    if (p.feedbackParam) {
      for (var i in p.feedbackParam) {
        if (
          i.indexOf('_popup') != -1 &&
          p.feedbackParam[i].type &&
          p.feedbackParam[i].type == 'type1'
        )
          preloadBool = true;
      }
      //  preload circle images
      if (preloadBool) {
        _tempObj.circle1 =
          commonAssetPath + 'commonAssets/images/fb/type1/circle1.png';
        _tempObj.circle2 =
          commonAssetPath + 'commonAssets/images/fb/type1/circle2.png';
        _tempObj.circle3 =
          commonAssetPath + 'commonAssets/images/fb/type1/circle3.png';
      }
      //  preload close button images
      if (p.feedbackParam.closeBtnImg) {
        if (p.feedbackParam.closeBtnImg.normal)
          _tempObj.closeImg_normal =
            p._shellModel.getMediaPath() + p.feedbackParam.closeBtnImg.normal;
        if (p.feedbackParam.closeBtnImg.over)
          _tempObj.closeImg_over =
            p._shellModel.getMediaPath() + p.feedbackParam.closeBtnImg.over;
      } else {
        _tempObj.closeImg_normal =
          commonAssetPath + 'commonAssets/images/fb/type1/closeMc.png';
        _tempObj.closeImg_over =
          commonAssetPath + 'commonAssets/images/fb/type1/closeMc_H.png';
      }
    }
    preloadImages(_tempObj);
  }

  function preloadImages(_obj, _var) {
    loadedImgCnt = 0;
    loadImgCnt = 0;
    if (Object.keys(_obj).length) {
      for (var i in _obj) {
        var _tempImg = new Image();
        //_tempImg.onload = _var=="1"? imgloaded : imgloader ;
        _tempImg.onload = imgloaded;
        _tempImg.src = _obj[i];
        activityImageObj[i] = _tempImg;
        loadImgCnt++;
      }
    }
    //else
    //{
    //	_var == "1" ? startActivity() : startFeedback();
    //}
  }

  function imgloaded() {
    loadedImgCnt++;
    if (loadedImgCnt == loadImgCnt) {
      startActivity();
    }
  }

  function imgloader() {
    loadedImgCnt++;
    if (loadedImgCnt == loadImgCnt) {
      startFeedback();
    }
  }

  function startActivity() {
    //audioObj = new AudioPlayerNormalClass();
  }

  function startFeedback() {
    gotoAndPlayFb();
  }
  this.handleFeedBack = function(e) {
    p.pElem = e;
    customcloseBtnPresent = false;
    var _tempObj = new Object();
    if (
      p.pElem.feedbackParam &&
      p.pElem.feedbackParam[p.pElem.popup + '_popup'] &&
      p.pElem.feedbackParam[p.pElem.popup + '_popup'].type == 'type1'
    ) {
      //_tempObj.closeImg_normal = "commonAssets/images/fb/type1/closeMc.png";
      //_tempObj.closeImg_over="commonAssets/images/fb/type1/closeMc_H.png"
      /*if(p.pElem.feedbackParam[p.pElem.popup+"_popup"].circleType == "1")
				_tempObj.circle = "commonAssets/images/fb/type1/circle1.png"
			if(p.pElem.feedbackParam[p.pElem.popup+"_popup"].circleType == "2")
				_tempObj.circle = "commonAssets/images/fb/type1/circle2.png"
			if(p.pElem.feedbackParam[p.pElem.popup+"_popup"].circleType == "3")
				_tempObj.circle = "commonAssets/images/fb/type1/circle3.png"*/
    }
    //if(p.pElem.feedbackParam && p.pElem.feedbackParam.closeBtnImg)
    //{
    //	if(p.pElem.feedbackParam.closeBtnImg.normal)
    //		_tempObj.closeImg_normal = p._shellModel.getMediaPath()+p.pElem.feedbackParam.closeBtnImg.normal;
    //	if(p.pElem.feedbackParam.closeBtnImg.over)
    //		_tempObj.closeImg_over = p._shellModel.getMediaPath()+p.pElem.feedbackParam.closeBtnImg.over;
    //}
    //if(p.domObj[e.popup] || e.audioPath || e.jsflObj || Object.keys(e.feedbackParam).length || e.feedbackParam[e.popup+"_popup"])
    if (
      p.domObj[e.popup] ||
      e.audioPath ||
      e.jsflObj ||
      e.feedbackParam[e.popup + '_popup']
    ) {
      // //console.log("nothing")
      //preloadImages(_tempObj);
      gotoAndPlayFb();
    } else {
      p.feedBackComplete(e);
      //gotoAndPlayFb()
    }
  };
  this.stopAudio = function() {
    audioObj.stop();
  };
  this.stopAll = function() {
    audioObj.stop();
    for (var i in p.domObj) {
      $(p.domObj[i]).remove();
    }
  };

  function gotoAndPlayFb() {
    var _audio = p.pElem.audioPath;
    var _popup = p.pElem.popup;
    //console.log(_popup)
    if (p.pElem.jsflObj)
      p.pElem.jsflObj.syncWithJsfl =
        p.pElem.jsflObj.syncWithJsfl == undefined
          ? false
          : p.pElem.jsflObj.syncWithJsfl;
    var con = p.pElem.jsflObj ? p.pElem.jsflObj.syncWithJsfl : false;
    if (_audio && (p.pElem.jsflObj == undefined && !con)) {
      playSound(_audio, p.pElem.playBack);
    }
    checkForPopUP(_popup);
    // //console.log(p.pElem)
    if (p.pElem.videoFb) {
      showVideo();
    }
    if (p.pElem.jsflObj) {
      showJSFL();
    }
  }

  function checkForPopUP(_popup) {
    if (p.domObj[_popup]) {
      createDynamicFeedbackBox();
      p.popupPresent = true;
      var corFb = p.domObj[_popup];
      var closeBtn = p.domObj[_popup + '_Close'];
      $(corFb).show();
      if (closeBtn) {
        p.popupCloseBtnPresent = true;
        $(closeBtn).show();
        //$(closeBtn).addClass("addPointer")
        if (p.pElem.feedbackParam.closeBtnCss) {
          $(closeBtn).addClass(p.pElem.feedbackParam.closeBtnCss['_normal']);
        }
        $(closeBtn)
          .off('mousemove', overCloseBtn)
          .on('mousemove', overCloseBtn);
        $(closeBtn)
          .off('mouseout', overCloseBtn)
          .on('mouseout', overCloseBtn);
        $(closeBtn)
          .off('click', clickedCloseBtn)
          .on(
            'click',
            {
              popElem: corFb
            },
            clickedCloseBtn
          );
      }
    }
  }

  function overCloseBtn(e) {
    $(p.domObj[e.target.id]).removeClass('addPointer');
    if (e.type == 'mousemove') {
      if (p.pElem.feedbackParam.closeBtnCss) {
        $(p.domObj[e.target.id]).addClass('addPointer');
        $(p.domObj[e.target.id]).removeClass(
          p.pElem.feedbackParam.closeBtnCss['_normal']
        );
        $(p.domObj[e.target.id]).addClass(
          p.pElem.feedbackParam.closeBtnCss['_over']
        );
      } else {
        if (customcloseBtnPresent) {
          // added by Ajay  for custom close button present in XML
          $(p.domObj[e.target.id]).addClass('addPointer');
          if (p.pElem.feedbackParam.closeBtnImg) {
            if (activityImageObj.closeImg_over) {
              $(p.domObj[e.target.id]).css({
                background:
                  'url(' + activityImageObj.closeImg_over.src + ') no-repeat',
                'background-size': '100% 100%'
              });
            }
          }
        } else {
          var _tempContext = p.domObj[e.target.id].getContext('2d');
          var color = _tempContext.getImageData(
            Math.round(e.pageX - $(p.domObj[e.target.id]).offset().left),
            Math.round(e.pageY - $(p.domObj[e.target.id]).offset().top),
            1,
            1
          ).data;
          if (color[3] > 0) {
            $(p.domObj[e.target.id]).addClass('addPointer');
            p.domObj[e.target.id].width = p.domObj[e.target.id].width;
            _tempContext.drawImage(
              activityImageObj.closeImg_over,
              0,
              0,
              activityImageObj.closeImg_over.width,
              activityImageObj.closeImg_over.height
            );
          } else {
            p.domObj[e.target.id].width = p.domObj[e.target.id].width;
            _tempContext.drawImage(
              activityImageObj.closeImg_normal,
              0,
              0,
              activityImageObj.closeImg_normal.width,
              activityImageObj.closeImg_normal.height
            );
          }
        }
        /* $(p.domObj[e.target.id]).css({
					"background": "url(" + activityImageObj.closeImg_over.src + ") no-repeat",
					"background-size": "100% 100%",
				}); */
      }
      if (p.pElem.feedbackParam.btnFontCss) {
        $($(p.domObj[e.target.id]).find('span')[0]).css('color', '');
        $(p.domObj[e.target.id]).removeClass(
          p.pElem.feedbackParam.btnFontCss['_normal']
        );
        $(p.domObj[e.target.id]).addClass(
          p.pElem.feedbackParam.btnFontCss['_over']
        );
      }
    } else {
      if (p.pElem.feedbackParam.btnFontCss) {
        $($(p.domObj[e.target.id]).find('span')[0]).css('color', '');
        $(p.domObj[e.target.id]).removeClass(
          p.pElem.feedbackParam.closeBtnCss['_over']
        );
        $(p.domObj[e.target.id]).addClass(
          p.pElem.feedbackParam.closeBtnCss['_normal']
        );
      } else {
        if (customcloseBtnPresent) {
          //console.log("herererererererrerere")
          // added by Ajay  for custom close button present in XML
          $(p.domObj[e.target.id]).removeClass('addPointer');
          if (p.pElem.feedbackParam.closeBtnImg) {
            if (activityImageObj.closeImg_normal) {
              $(p.domObj[e.target.id]).css({
                background:
                  'url(' + activityImageObj.closeImg_normal.src + ') no-repeat',
                'background-size': '100% 100%'
              });
            } else {
              $(p.domObj[e.target.id]).css({
                background: '',
                'background-size': '100% 100%'
              });
            }
          }
        } else {
          var _tempContext = p.domObj[e.target.id].getContext('2d');
          p.domObj[e.target.id].width = p.domObj[e.target.id].width;
          _tempContext.drawImage(
            activityImageObj.closeImg_normal,
            0,
            0,
            activityImageObj.closeImg_normal.width,
            activityImageObj.closeImg_normal.height
          );
          /* $(p.domObj[e.target.id]).css({
						"background": "url(" + activityImageObj.closeImg_normal.src + ") no-repeat",
						"background-size": "100% 100%",
					}); */
        }
      }
    }
    if (p.pElem.feedbackParam.btnFontCss) {
      $(p.domObj[e.target.id]).removeClass(
        p.pElem.feedbackParam.btnFontCss['_over']
      );
      $(p.domObj[e.target.id]).addClass(
        p.pElem.feedbackParam.btnFontCss['_normal']
      );
    }
  }
  var customcloseBtnPresent = false;

  function clickedCloseBtn(e) {
    var _flag;
    if (
      p.pElem.feedbackParam[p.pElem.popup + '_popup'] &&
      p.pElem.feedbackParam[p.pElem.popup + '_popup'].type == 'type1'
    ) {
      var _color = p.domObj[e.target.id]
        .getContext('2d')
        .getImageData(
          Math.round(e.pageX - $(p.domObj[e.target.id]).offset().left),
          Math.round(e.pageY - $(p.domObj[e.target.id]).offset().top),
          1,
          1
        ).data;
      _flag = _color[3] > 0 ? true : false;
    }
    if (
      p.pElem.feedbackParam[p.pElem.popup + '_popup'] &&
      p.pElem.feedbackParam[p.pElem.popup + '_popup'].type == 'type2'
    ) {
      _flag = true;
    }
    if (_flag) {
      unbindCloseButtonEvent();
      $(p.domObj[e.target.id]).removeClass('addPointer');
      $(p.domObj[e.target.id]).hide();
      $(e.data.popElem).hide();
      audioObj.stop();
      videoManagerObj.pauseVideo();
      p.feedBackComplete(p.pElem);
      p.videoFinish = false;
      p.audioFinish = false;
      p.popupCloseBtnPresent = false;
      p.popupPresent = false;
      customcloseBtnPresent = false; // added by Ajay
      var tempName = p.pElem.popup + '_popup';
      if (p.pElem.feedbackParam[tempName]) {
        $(_elemFB).remove();
        $(_circleDiv).remove();
        $(p.domObj[p.pElem.popup + '_Close']).remove();
      }
    }
    if (customcloseBtnPresent) {
      unbindCloseButtonEvent();
      $(p.domObj[e.target.id]).removeClass('addPointer');
      $(p.domObj[e.target.id]).hide();
      $(e.data.popElem).hide();
      audioObj.stop();
      videoManagerObj.pauseVideo();
      p.feedBackComplete(p.pElem);
      p.videoFinish = false;
      p.audioFinish = false;
      p.popupCloseBtnPresent = false;
      p.popupPresent = false;
      customcloseBtnPresent = false; // added by Ajay
      var tempName = p.pElem.popup + '_popup';
      if (p.pElem.feedbackParam[tempName]) {
        $(_elemFB).remove();
        $(_circleDiv).remove();
        $(p.domObj[p.pElem.popup + '_Close']).remove();
      }
    }
  }

  function unbindCloseButtonEvent() {
    var _popup = p.pElem.popup;
    var corFb = p.domObj[_popup];
    var closeBtn = p.domObj[_popup + '_Close'];
    if (closeBtn) {
      $(closeBtn).off('mousemove', overCloseBtn);
      $(closeBtn).off('mouseout', overCloseBtn);
      $(closeBtn).off('click', clickedCloseBtn);
    }
  }
  /* function playSound(_audio, _fun) 
	{
		audioObj.stop();
		if (_audio) 
		{
			audioObj.playAudio(_audio, function() 
			{
				p.audioFinish = true
				if (!p.popupPresent || !p.popupCloseBtnPresent) 
				{
					if (p.popupPresent) 
					{
						$(p.domObj[p.pElem.popup]).hide()
					}
					p.feedBackComplete(p.pElem);
					p.audioFinish = false
					p.popupCloseBtnPresent = false
					p.popupPresent = false
				}
			},false,1,"",_fun)
		}
	} */
  function playSound(_audio, _fun) {
    ////console.log(_audio)
    isFirstPlay = false;
    _function = null;
    if (_fun) {
      _function = _fun;
    }
    audioObj.stop();
    if (_audio) {
      //console.log(p.pElem.feedbackParam)
      audioObj.playAudio(
        _audio,
        function() {
          p.audioFinish = true;
          if (!p.popupPresent || !p.popupCloseBtnPresent) {
            if (p.popupPresent) {
              if (
                p.pElem.feedbackParam.popupShowOnEnd &&
                p.pElem.feedbackParam.popupShowOnEnd[p.pElem.popup]
              ) {
                $(p.domObj[p.pElem.popup]).show();
              } else {
                $(p.domObj[p.pElem.popup]).hide();
              }
            }
            // p.feedBackComplete(p.pElem);
            p.audioFinish = false;
            p.popupCloseBtnPresent = false;
            p.popupPresent = false;
          }
          if (p.pElem.jsflObj && p.pElem.jsflObj.autoHide) {
            for (var i = 0; i < p.pElem.jsflObj.canvasID.length; i++) {
              $(p.domObj[p.pElem.jsflObj.canvasID[i]]).hide();
            }
            if (p.pElem.jsflObj) {
              for (var i = 0; i < p.pElem.jsflObj.canvasID.length; i++) {
                correctjsfl[i].stop();
              }
            }
            // p.feedBackComplete(p.pElem);
          } else {
            if (p.pElem.jsflObj) {
              // p.feedBackComplete(p.pElem);
              for (var i = 0; i < p.pElem.jsflObj.canvasID.length; i++) {
                correctjsfl[i].stop();
              }
            }
          }
          if (
            !p.popupPresent ||
            (p.pElem.jsflObj && p.pElem.jsflObj.autoHide) ||
            p.pElem.jsflObj
          ) {
            if (!p.popupCloseBtnPresent) {
              p.feedBackComplete(p.pElem);
            }
          }
          if (p['audioEnd'])
            p['audioEnd']({
              end: true
            });
        },
        false,
        1,
        '',
        p.pElem.jsflObj ? audioPlayBack : _function
      );
    }
  }
  var _function = null;

  function audioPlayBack(t) {
    if (_function) {
      _function(t);
    }
    if (p.pElem.jsflObj) {
      for (var i = 0; i < p.pElem.jsflObj.canvasID.length; i++) {
        ////console.log(p.pElem.jsflObj.startFrame[i] , Math.floor(t*24) , correctjsfl[i] , i)
        if (p.pElem.jsflObj.textObj) {
          drawTextObj.drawTextFrame(
            p.pElem.jsflObj.startFrame[i] + Math.floor(t * 24)
          );
        }
        //console.log(p.pElem.jsflObj.startFrame[i] + Math.floor(t*24),"fff")
        //console.log( Math.floor(t*24),"Ddd")
        correctjsfl[i].setFrame(
          p.pElem.jsflObj.startFrame[i] + Math.floor(t * 24)
        );
      }
    }
  }
  var correctjsfl = [];
  var jsflCounter = 0;

  function showJSFL() {
    if (p.pElem.jsflObj && p.pElem.jsflObj.syncWithJsfl) {
      playSound(p.pElem.audioPath, p.pElem.playBack);
      audioObj.addEventListener('audioLoaded', function() {
        audioObj.pauseAudio();
        audioObj.removeEventListener('audioLoaded');
        loadJsfl();
      });
    } else {
      loadJsfl();
    }
  }

  function loadJsfl() {
    var canvas = [];
    correctjsfl = [];
    jsflCounter = 0;
    for (var i = 0; i < p.pElem.jsflObj.canvasID.length; i++) {
      canvas[i] = p.domObj[p.pElem.jsflObj.canvasID[i]];
      $(canvas[i]).show();
      correctjsfl[i] = new AnimationManager({
        stage: canvas[i],
        width: p.pElem.jsflObj.width[i],
        height: p.pElem.jsflObj.height[i],
        id: p.pElem.jsflObj.canvasID[i],
        timeline:
          p._shellModel.getMediaPath() + p.pElem.jsflObj.jsflPageDataPath[i],
        images: p._shellModel.getMediaPath() + p.pElem.jsflObj.jsflImagePath[i],
        fps: 24,
        progress: function(_per) {},
        ready: function() {
          jsflCounter++;
          if (jsflCounter == p.pElem.jsflObj.canvasID.length) {
            if (p.pElem.jsflObj && p.pElem.jsflObj.syncWithJsfl) {
              //playSound(p.pElem.audioPath,p.pElem.playBack);
              loadJSONJSFL();
            } else {
              runFirstJSFL();
            }
          }
        }
      });
    }
  }

  function runFirstJSFL() {
    for (var z = 0; z < p.pElem.jsflObj.canvasID.length; z++) {
      correctjsfl[z].playSegment({
        start: p.pElem.jsflObj.startFrame[z],
        end: p.pElem.jsflObj.endFrame[z],
        fps: 24,
        loop: false,
        frame: function() {},
        stop: function() {}
      });
    }
  }

  function showVideo() {
    ////////console.log("entered",p.pElem.feedbackParam.videoFb)
    if (p.pElem.videoFb) {
      /* ==== loading JSON for Text Data ====*/
      videoSlider();
      loadJSON();
    }
  }

  function loadJSON() {
    if (p.pElem.videoFb.pageDataParam) {
      var jqxhr = $.getJSON(
        p._shellModel.getMediaPath() + p.pElem.videoFb.pageDataParam.fileName,
        function(jsonData) {
          pageDataJson = jsonData;
          /* if(p.pElem.videoFb.pageDataParam.textDivId){
					drawTextObj.init(pageDataJson,$(p.domObj[p.pElem.videoFb.pageDataParam.textDivId]),pageDataJson.dataObj.totalFrames,[]);
					 videoSlider() 
				} */
          //console.log("Video File Loadoing............")
          if (p.pElem.videoFb.pageDataParam.textDivId) {
            var _filePath = p.pElem.videoFb.pageDataParam.fileName.replace(
              'json',
              'images'
            );
            _filePath = _filePath.replace('.json', '.txt');
            p._shellModel.getServiceObj().getImageTextFile(_filePath, _thisObj); //need to change replace function  in future in require
          }
        }
      )
        .done(function(jsonData) {
          if (!p.pElem.videoFb.pageDataParam.textDivId) {
            setVideo();
          }
        })
        .fail(function() {});
    } else {
      // videoSlider() // removed by Ajay
      setVideo();
    }
  }
  //====================================================
  var imageDataLoaded,
    loadedCnt = 0,
    loadCnt = 0;
  //====================================================
  EventBus.addEventListener('imgageTextLoaded', checkImageTextLoad, _thisObj);
  //====================================================
  function checkImageTextLoad(event, parentClass, data) {
    if (parentClass === _thisObj) {
      var imgData = p._shellModel.getServiceObj().getImgData();
      loadImages(JXG.decompress(imgData));
    }
  }
  //====================================================
  function loadImages(imageDataObj) {
    var _imgArr = imageDataObj.split('~^');
    imageDataLoaded = new Object();
    for (var j = 0; j < _imgArr.length - 1; j++) {
      var _arr1 = _imgArr[j].split('^~');
      ////console.log(" in j " , loadCnt , _arr1[0]);
      imageDataLoaded[_arr1[0]] = new Image();
      imageDataLoaded[_arr1[0]].onload = imgloadedCheck;
      imageDataLoaded[_arr1[0]].src = _arr1[1];
      loadCnt++;
    }
  }
  //====================================================
  function imgloadedCheck() {
    loadedCnt++;
    if (loadedCnt == loadCnt) {
      if (
        p.pElem.jsflObj &&
        p.pElem.jsflObj.textObj &&
        p.pElem.jsflObj.textObj.textDivId
      ) {
        drawTextObj.init(
          pageDataJson,
          $(p.domObj[p.pElem.jsflObj.textObj.textDivId]),
          pageDataJson.dataObj.totalFrames,
          [],
          [],
          p._shellModel.getiFrameRef(),
          imageDataLoaded
        );
      } else {
        drawTextObj.init(
          pageDataJson,
          $(p.domObj[p.pElem.videoFb.pageDataParam.textDivId]),
          pageDataJson.dataObj.totalFrames,
          [],
          [],
          p._shellModel.getiFrameRef(),
          imageDataLoaded
        );
        setVideo();
        //videoSlider();   //
      } //console.log("helloooo in")
      //shellModel.setPlayerImageObj(imageDataLoaded);
      //_classRef.loadStatus("playerJsonLoaded");
    }
  }
  //====================================================
  function loadJSONJSFL() {
    if (p.pElem.jsflObj.textObj) {
      var jqxhr = $.getJSON(
        p._shellModel.getMediaPath() + p.pElem.jsflObj.textObj.fileName,
        function(jsonData) {
          pageDataJson = jsonData;
          /* if(p.pElem.jsflObj.textObj.textDivId){
					drawTextObj.init(pageDataJson,$(p.domObj[p.pElem.jsflObj.textObj.textDivId]),pageDataJson.dataObj.totalFrames,[]);
					 // videoSlider() 
				} */
          //console.log("Json File JSFL............")
          if (p.pElem.jsflObj.textObj.textDivId) {
            var _filePath = p.pElem.jsflObj.textObj.fileName.replace(
              'json',
              'images'
            );
            _filePath = _filePath.replace('.json', '.txt');
            p._shellModel.getServiceObj().getImageTextFile(_filePath, _thisObj); //need to change replace function  in future in require
          }
        }
      )
        .done(function(jsonData) {
          audioObj.play();
        })
        .fail(function() {});
    } else {
      // videoSlider()
      audioObj.play();
    }
  }

  function videoSlider() {
    /* Initialize the slider with below parameter
				sliderElementId, animType(video/jsfl), duration(in sec), minVal, timeDisplay(tooltip), videoObj(Reference of video Obj)
				Now please call displaySlider with below parameter to display the slider
				xPos, yPos, width, height, color
				*/
    if (p.pElem.videoFb.sliderParam) {
      var sliderObjCopy = null;
      var slideCssParam = {};
      if (!p.pElem.videoFb.sliderParam.duration) {
        p.pElem.videoFb.sliderParam.duration =
          pageDataJson.dataObj.totalFrames / pageDataJson.dataObj.frameRate;
      }
      if (p.pElem.videoFb.sliderParam.sliderDivId) {
        //////console.log(p.pElem.videoFb.sliderParam,"dddddddddd")
        sliderObj.init(
          $(p.domObj[p.pElem.videoFb.sliderParam.sliderDivId]),
          p.pElem.videoFb.sliderParam.type,
          p.pElem.videoFb.sliderParam.duration,
          p.pElem.videoFb.sliderParam.sliderStart,
          p.pElem.videoFb.sliderParam.showDurationToolTip,
          videoManagerObj
        );
        sliderObjCopy = sliderObj;
        slideCssParam = p.pElem.videoFb.sliderParam.cssParam;
      }
    }
    //----- Initialize the Video Manager with below parameter (videoElemId - to display the video, canVasId - to display the poster Image) --- //
    var dummyImg = null;
    if (p.pElem.videoFb.videoManagerParam.dummyImgCanvas) {
      dummyImg = $(p.domObj[p.pElem.videoFb.videoManagerParam.dummyImgCanvas]);
    }
    videoManagerObj.init(
      $(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]),
      dummyImg,
      p.pElem.playBack
    );
    /*----- Call LoadVideo Methods with the below parameters  
		videoSrc, autoplay, isPosterImage, controls, xPos, yPos, width, height, sliderRef(null if no slider is there), json data for the slider details like (x, y, width, height and color)
		--- */
    var isPosterImage = false;
    if (p.pElem.videoFb.videoManagerParam.dummyImgCanvas) {
      //isPosterImage=true;
    }
    var posterImgPath = null;
    if (p.pElem.videoFb.videoManagerParam.posterImgPath) {
      isPosterImage = true;
      posterImgPath =
        p._shellModel.getMediaPath() +
        p.pElem.videoFb.videoManagerParam.posterImgPath;
    }
    var vLeft = parseFloat(
      $(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]).css('left')
    );
    var vTop = parseFloat(
      $(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]).css('top')
    );
    var vWidth = parseFloat(
      $(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]).css('width')
    );
    var vHeight = parseFloat(
      $(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]).css('height')
    );
    //console.log(p.pElem.videoFb.videoManagerParam.videoPath,"video")
    videoManagerObj.loadVideo(
      p._shellModel.getMediaPath() +
        p.pElem.videoFb.videoManagerParam.videoPath,
      false,
      isPosterImage,
      false,
      vLeft,
      vTop,
      vWidth,
      vHeight,
      sliderObjCopy,
      slideCssParam,
      posterImgPath
    );
    //  added by Ajay for playVideo on devices
    videoManagerObj.playVideo();
    EventBus.removeEventListener('videoDataLoaded', videoLoaded, this);
    EventBus.addEventListener('videoDataLoaded', videoLoaded, this);
    //videoManagerObj.pauseVideo();  // added by Ajay
    //setVideo(); // removed by Ajay
  }

  function videoLoaded() {
    // added
    videoManagerObj.pauseVideo();
    EventBus.removeEventListener('videoDataLoaded', videoLoaded, this);
  }
  /* Check the video loading status with setInterval */
  var myInterval;

  function setVideo() {
    //console.log("inaterval started");
    myInterval = setInterval(function() {
      checkVideoLoadStatus();
    }, 200);
  }

  function checkVideoLoadStatus() {
    var status = videoManagerObj.getVideoLoadedStatus();
    //console.log(status, " :: status");
    if (status) {
      //---- for Slider --//
      //console.log("inaide status");
      videoManagerObj.playVideo();
      clearInterval(myInterval);
      checkVideoTime();
    }
  }
  /* Use requestAnimFrame to continuously display the text frame-wise
   */
  function checkVideoTime() {
    var reqID = requestAnimFrame(checkVideoTime);
    if (videoManagerObj.getVideoPlayStatus()) {
      if (
        p.pElem.videoFb.pageDataParam &&
        p.pElem.videoFb.pageDataParam.textDivId
      ) {
        var currentTime = videoManagerObj.getVideoCurrentTime();
        var frameRate = 24;
        if (p.pElem.videoFb.pageDataParam.fileName) {
          frameRate = pageDataJson.dataObj.frameRate;
        }
        currentFrame = Math.ceil(
          (currentTime * 1000) / ((1 / frameRate) * 1000)
        );
        drawTextObj.drawTextFrame(currentFrame);
      }
    } else {
      if (p.pElem.videoFb.otherParam.hideVideo) {
        cancelAnimationFrame(reqID);
        if (!p.popupPresent || !p.popupCloseBtnPresent) {
          if (p.popupPresent) {
            if (
              p.pElem.feedbackParam.popupShowOnEnd &&
              p.pElem.feedbackParam.popupShowOnEnd[p.pElem.popup]
            ) {
              $(p.domObj[p.pElem.popup]).show();
            } else {
              $(p.domObj[p.pElem.popup]).hide();
            }
            $(p.domObj[p.pElem.videoFb.videoManagerParam.videoId]).hide();
            if (p.pElem.videoFb.sliderParam) {
              $(p.domObj[p.pElem.videoFb.sliderParam.sliderDivId]).hide();
            }
            if (p.pElem.videoFb.pageDataParam) {
              $(p.domObj[p.pElem.videoFb.pageDataParam.textDivId]).hide();
            }
            $(
              p.domObj[p.pElem.videoFb.videoManagerParam.dummyImgCanvas]
            ).hide();
          }
          videoManagerObj.pauseVideo();
          p.feedBackComplete(p.pElem);
          p.audioFinish = false;
          p.popupCloseBtnPresent = false;
          p.popupPresent = false;
        }
      } else {
        cancelAnimationFrame(reqID);
        if (!p.popupPresent || !p.popupCloseBtnPresent) {
          videoManagerObj.pauseVideo();
          p.feedBackComplete(p.pElem);
          p.audioFinish = false;
          p.popupCloseBtnPresent = false;
          p.popupPresent = false;
        }
      }
    }
  }
  var popupParam;
  var _elemFB;
  var _elemFBCanvas;
  var _elemFBCtx;
  var newImg = [];
  var _circleDiv;

  function createDynamicFeedbackBox() {
    var tempName = p.pElem.popup + '_popup';
    if (
      p.pElem.feedbackParam[tempName] &&
      p.pElem.feedbackParam[tempName].type == 'type1'
    ) {
      fbType1();
    } else if (
      p.pElem.feedbackParam[tempName] &&
      p.pElem.feedbackParam[tempName].type == 'type2'
    ) {
      fbType2();
    } else {
      //  added by Ajay for custom close btn present
      if (p.domObj[p.pElem.curStatus + '_Close']) {
        customcloseBtnPresent = true;
      }
      /* if(p.pElem.feedbackParam.closeBtnImg && p.pElem.feedbackParam.closeBtnImg.over)
			{
				p.pElem.feedbackParam.closeBtnImg.over=p._shellModel.getMediaPath()+p.pElem.feedbackParam.closeBtnImg.over
			}
			if(p.pElem.feedbackParam.closeBtnImg && p.pElem.feedbackParam.closeBtnImg.normal)
			{
				p.pElem.feedbackParam.closeBtnImg.normal=p._shellModel.getMediaPath()+p.pElem.feedbackParam.closeBtnImg.normal 
			} */
    }
  }

  function fbType2() {
    var tempName = p.pElem.popup + '_popup';
    popupParam = p.pElem.feedbackParam[p.pElem.popup + '_popup'];
    _elemFB = document.createElement('div');
    $(p.domObj[p.pElem.popup + '_fbBox']).css({
      'background-color': p.pElem.feedbackParam[tempName].backColor
    });
    $(_elemFB).css({
      position: 'absolute',
      left: popupParam.x + 'px',
      top: popupParam.y + 'px',
      width: popupParam.width + 'px',
      height: popupParam.height + 'px',
      'border-radius': '20px',
      border: '1px solid gray'
    });
    var _elemFBTop = document.createElement('div');
    $(_elemFBTop).css({
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: popupParam.width + 'px',
      height: '50px',
      'border-top-left-radius': '20px',
      'border-top-right-radius': '20px'
    });
    if (p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleType == 1) {
      $(_elemFBTop).css({
        background: ' rgba(147,193,36,1)',
        background:
          '-moz-linear-gradient(left, rgba(147,193,36,1) 0%, rgba(99,165,31,1) 100%)',
        background:
          '-webkit-gradient(left top, right top, color-stop(0%, rgba(147,193,36,1)), color-stop(100%, rgba(99,165,31,1)))',
        background:
          '-webkit-linear-gradient(left, rgba(147,193,36,1) 0%, rgba(99,165,31,1) 100%)',
        background:
          '-o-linear-gradient(left, rgba(147,193,36,1) 0%, rgba(99,165,31,1) 100%)',
        background:
          '-ms-linear-gradient(left, rgba(147,193,36,1) 0%, rgba(99,165,31,1) 100%)',
        background:
          'linear-gradient(to right, rgba(147,193,36,1) 0%, rgba(99,165,31,1) 100%)'
      });
    } else if (
      p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleType == 2
    ) {
      $(_elemFBTop).css({
        background: 'rgba(232,158,21,1)',
        background:
          '-moz-linear-gradient(left, rgba(232,158,21,1) 0%, rgba(218,83,24,1) 100%)',
        background:
          '-webkit-gradient(left top, right top, color-stop(0%, rgba(232,158,21,1)), color-stop(100%, rgba(218,83,24,1)))',
        background:
          '-webkit-linear-gradient(left, rgba(232,158,21,1) 0%, rgba(218,83,24,1) 100%)',
        background:
          '-o-linear-gradient(left, rgba(232,158,21,1) 0%, rgba(218,83,24,1) 100%)',
        background:
          '-ms-linear-gradient(left, rgba(232,158,21,1) 0%, rgba(218,83,24,1) 100%)',
        background:
          'linear-gradient(to right, rgba(232,158,21,1) 0%, rgba(218,83,24,1) 100%)'
      });
    }
    var _elemFBBottom = document.createElement('div');
    $(_elemFBBottom).css({
      position: 'absolute',
      left: '0px',
      top: '50px',
      width: popupParam.width + 'px',
      height: popupParam.height - 50 + 'px',
      'border-bottom-left-radius': '20px',
      'border-bottom-right-radius': '20px',
      'background-color': '#FFFFFF'
    });
    $(p.domObj[p.pElem.popup + '_fbBox']).append(_elemFB);
    $(_elemFB).append(_elemFBTop);
    $(_elemFB).append(_elemFBBottom);
    var _closeBtnDiv = document.createElement('div');
    $(_elemFB).append(_closeBtnDiv);
    $(_closeBtnDiv).attr('id', p.pElem.popup + '_Close');
    p.domObj[p.pElem.popup + '_Close'] = _closeBtnDiv;
    $(_closeBtnDiv)
      .css({
        position: 'absolute',
        left: popupParam.width / 2 - 98 / 2 + 'px',
        top: popupParam.height - 50 + 'px',
        width: 98 + 'px',
        height: 32 + 'px',
        border: '1px solid green',
        'border-radius': '10px',
        display: 'table',
        'z-index': 1
      })
      .addClass('btn_Type2_normal');
    p.pElem.feedbackParam.closeBtnCss = {};
    p.pElem.feedbackParam.closeBtnCss['_normal'] = 'btn_Type2_normal';
    p.pElem.feedbackParam.closeBtnCss['_over'] = 'btn_Type2_over';
    p.pElem.feedbackParam.btnFontCss = {};
    p.pElem.feedbackParam.btnFontCss['_normal'] = 'btnFont_Type2_normal';
    p.pElem.feedbackParam.btnFontCss['_over'] = 'btnFont_Type2_over';
    for (i in p.pElem.feedbackParam[tempName].txtArr) {
      var elemID = p.pElem.feedbackParam[tempName].txtArr[i];
      if (i == 'title') {
        createTextElem(elemID, _elemFB);
        //////console.log(popupParam.x-(50+42+20))
        $(p.domObj[elemID]).css({
          position: 'absolute',
          left: 10,
          top: 10,
          width: popupParam.width - (50 + 42 + 20)
        });
      } else if (i == 'content') {
        createTextElem(elemID, _elemFB);
        $(p.domObj[elemID]).css({
          position: 'absolute',
          left: 10,
          top: 60,
          width: popupParam.width - 50
        });
      } else if (i == 'closeBtn') {
        createTextElem(elemID, _closeBtnDiv);
        $(p.domObj[elemID])
          .css({
            'pointer-events': 'none',
            width: '100%',
            height: '100%',
            display: 'table-cell',
            'vertical-align': 'middle'
          })
          .addClass('btnFont_Type2_normal');
      }
    }
  }

  function fbType1() {
    /*main popup*/
    var tempName = p.pElem.popup + '_popup';
    popupParam = p.pElem.feedbackParam[p.pElem.popup + '_popup'];
    _elemFB = document.createElement('div');
    $(p.domObj[p.pElem.popup + '_fbBox']).css({
      'background-color': p.pElem.feedbackParam[tempName].backColor
    });
    $(_elemFB).css({
      position: 'absolute',
      left: popupParam.x + 'px',
      top: popupParam.y + 'px',
      width: popupParam.width + 'px',
      height: popupParam.height + 'px'
    });
    $(p.domObj[p.pElem.popup + '_fbBox']).append(_elemFB);
    _elemFBCanvas = document.createElement('canvas');
    _elemFBCtx = _elemFBCanvas.getContext('2d');
    $(_elemFBCanvas).css({
      position: 'absolute',
      left: '0px',
      top: '0px'
    });
    _elemFBCanvas.width = popupParam.width;
    _elemFBCanvas.height = popupParam.height;
    $(_elemFB).append(_elemFBCanvas);
    var piceFirstW = 235;
    var piceFirstH = 114;
    var piceLastW = 26;
    var piceBottomH = 40;
    var centerW = popupParam.width - piceFirstW - piceLastW;
    var centerH = popupParam.height - piceFirstH - piceBottomH;
    _elemFBCtx.drawImage(activityImageObj[0], 0, 0, piceFirstW, piceFirstH);
    _elemFBCtx.drawImage(
      activityImageObj[1],
      piceFirstW,
      0,
      centerW,
      piceFirstH
    );
    _elemFBCtx.drawImage(
      activityImageObj[2],
      piceFirstW + centerW,
      0,
      piceLastW,
      piceFirstH
    );
    _elemFBCtx.drawImage(
      activityImageObj[3],
      0,
      piceFirstH,
      piceFirstW,
      centerH
    );
    _elemFBCtx.drawImage(
      activityImageObj[4],
      piceFirstW,
      piceFirstH,
      centerW,
      centerH
    );
    _elemFBCtx.drawImage(
      activityImageObj[5],
      piceFirstW + centerW,
      piceFirstH,
      piceLastW,
      centerH
    );
    _elemFBCtx.drawImage(
      activityImageObj[6],
      0,
      piceFirstH + centerH,
      piceFirstW,
      piceBottomH
    );
    _elemFBCtx.drawImage(
      activityImageObj[7],
      piceFirstW,
      piceFirstH + centerH,
      centerW,
      piceBottomH
    );
    _elemFBCtx.drawImage(
      activityImageObj[8],
      piceFirstW + centerW,
      piceFirstH + centerH,
      piceLastW,
      piceBottomH
    );
    /* Close Button*/
    var _closeBtnDiv = document.createElement('canvas');
    var _closeBtnDivContext = _closeBtnDiv.getContext('2d');
    $(_elemFB).append(_closeBtnDiv);
    $(_closeBtnDiv).attr('id', p.pElem.popup + '_Close');
    p.domObj[p.pElem.popup + '_Close'] = _closeBtnDiv;
    /* p.pElem.feedbackParam.closeBtnImg={}
        p.pElem.feedbackParam.closeBtnImg.normal="commonAssets/images/fb/type1/closeMc.png";
        p.pElem.feedbackParam.closeBtnImg.over="commonAssets/images/fb/type1/closeMc_H.png"; */
    _closeBtnDiv.width = 96;
    _closeBtnDiv.height = 56;
    $(_closeBtnDiv).css({
      position: 'absolute',
      left: popupParam.width - 90 + 'px',
      top: popupParam.height - 47 + 'px',
      width: 96 + 'px',
      height: 56 + 'px',
      //"background": "url(" + activityImageObj.closeImg_normal.src + ") no-repeat",
      //"background": "url(" + p.pElem.feedbackParam.closeBtnImg.normal + ") no-repeat",
      'background-size': '100% 100%',
      'z-index': 1
    });
    _closeBtnDivContext.drawImage(
      activityImageObj.closeImg_normal,
      0,
      0,
      activityImageObj.closeImg_normal.width,
      activityImageObj.closeImg_normal.height
    );
    /*circle */
    if (
      p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleXY &&
      p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleXY.x
    ) {
      var cleft = p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleXY.x;
      var cTop = p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleXY.y;
    } else {
      cleft = 50;
      cTop = 50;
    }
    _circleDiv = document.createElement('div');
    $(_elemFB).append(_circleDiv);
    if (p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleType)
      $(_circleDiv).css({
        position: 'absolute',
        left: cleft + 'px',
        top: cTop + 'px',
        width: 42 + 'px',
        height: 42 + 'px',
        background:
          'url(' +
          activityImageObj[
            'circle' +
              p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleType
          ].src +
          ') no-repeat',
        //"background": "url(commonAssets/images/fb/type1/circle" + p.pElem.feedbackParam[p.pElem.popup+"_popup"].circleType + ".png) no-repeat",
        'background-size': '100% 100%'
      });
    for (i in p.pElem.feedbackParam[tempName].txtArr) {
      var elemID = p.pElem.feedbackParam[tempName].txtArr[i];
      createTextElem(elemID, _elemFB);
      if (i == 'title') {
        var tLeft = 50 + 42 + 10;
        var tTop = 60;
        if (
          p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleXY &&
          p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleXY.x
        ) {
          tLeft =
            p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleXY.x +
            42 +
            10;
          tTop =
            p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleXY.y + 10;
        }
        if (p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleType == '') {
          tLeft = 50;
        }
        $(p.domObj[elemID]).css({
          position: 'absolute',
          left: tLeft,
          top: tTop,
          width: popupParam.width - (50 + 42 + 20)
        });
      } else if (i == 'content') {
        var tempLeft = 50;
        var tempTop = 105;
        if (
          p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleXY &&
          p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleXY.x
        ) {
          tempLeft = p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleXY.x;
          tempTop =
            p.pElem.feedbackParam[p.pElem.popup + '_popup'].circleXY.y + 55;
        }
        $(p.domObj[elemID]).css({
          position: 'absolute',
          left: tempLeft,
          top: tempTop,
          width: popupParam.width - 50
        });
      }
    }
    ////console.log("close",p.pElem.feedbackParam.closeBtnImg)
  }

  function createTextElem(elemId, parent) {
    if (p._shellModel.getTextValue(elemId)) {
      var _elemChild = document.createElement('div');
      $(parent).append(_elemChild);
      $(_elemChild).html(p._shellModel.getTextValue(elemId));
      $(_elemChild).attr('id', elemId);
      $(_elemChild).css({
        'pointer-events': 'none'
      });
      p.domObj[elemId] = $(_elemChild);
      //////console.log(p.domObj[elemId],parent)
    }
  }
};
