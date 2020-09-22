//Z:\Tata ClassEdge\LCMS_Final\File0\File1\LCMS_Files\Biology\Level_6\9BECDC4D-6E15-4DCD-93D4-C0B06D7800E5\11_bien_t20_tp139_01.swf
var InteractiveAnimation = function() {
  var p = {
    _id: '',
    _disabled: false,
    _handCursor: false,
    _controlMc01: '',
    _actionMc01: [],
    _controlMc02: '',
    _actionMc02: [],
    _controlMc03: '',
    _actionMc03: [],
    _controlMc04: '',
    _actionMc04: [],

    _hideMCsOnClick: [],
    _showMCsOnClick: [],
    _hideMCs: [],
    _resetMCs: [],
    _groupMcs: [],
    arrowData: {
      visible: false
    },

    _enableOnce: false,
    _enableOnDone: false,
    _keepSelected: false,
    _visitedState: false,
    _imgObj: {},
    clicked: false,
    actionCnt: 0,
    visited: false,
    domObj: {},
    tabObj: {},
    _btnCssObj: {
      _normal: '',
      _disable: '',
      _over: '',
      _down: '',
      _visited: ''
    },
    _transparancy: false
  };
  var visitedAtEnd = false;
  var activityImageObj = new Object();
  var loadedImgCnt, loadImgCnt;
  var _thisObj = this;
  var iFrameDoc;
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    iFrameDoc = p._shellModel.getiFrameRef().contentWindow.document;
    if (p.arrowData.visible || Object.keys(p._imgObj).length)
      preloadImages(p._imgObj);
    else startActivity();
  };
  function preloadImages(_obj) {
    loadedImgCnt = 0;
    loadImgCnt = 0;
    if (p.arrowData.visible) {
      var img = new Image();
      img.src = 'commonAssets/images/interactiveAnim/arrow/arrow.png';
      img.onload = imgloaded;
      activityImageObj['arrow'] = img;
      loadImgCnt++;
    }
    for (var i in _obj) {
      if (i == p._id) {
        for (var j in _obj[i]) {
          var _tempImg = new Image();
          _tempImg.onload = imgloaded;
          _tempImg.error = loadFail;
          _tempImg.src = p._shellModel.getMediaPath() + _obj[i][j];
          activityImageObj[i + j] = _tempImg;
          loadImgCnt++;
        }
      } else {
        var _tempImg = new Image();
        _tempImg.onload = imgloaded;
        _tempImg.src = p._shellModel.getMediaPath() + _obj[i];
        activityImageObj[i] = _tempImg;
        loadImgCnt++;
      }
    }
  }
  function loadFail() {
    alert('Loading of image failed');
  }
  function imgloaded() {
    loadedImgCnt++;
    if (loadedImgCnt == loadImgCnt) {
      startActivity();
    }
  }
  function startActivity() {
    if (p.commonParams._transparancy) {
      transparantCanvas();
    } else {
      $(p.domObj[p._id]).css({
        'background-color': 'rgba(0,0,0,0)'
      });
      if (p._imgObj && p._imgObj[p._id]) {
        var img = activityImageObj[p._id + Object.keys(p._imgObj[p._id])[0]];
        ////////////console.log(img.width , img.height);
        var _left = 0;
        var _top = 0;
        if (p.btnLeftPadding) {
          _left = Number(p.btnLeftPadding);
        }
        if (p.btnTopPadding) {
          _top = Number(p.btnTopPadding);
        }
        var _imgDiv = iFrameDoc.createElement('div');
        $(p.domObj[p._id]).prepend(_imgDiv);
        $(_imgDiv)
          .css({
            position: 'absolute',
            'pointer-events': 'none',
            //"z-index":0,
            width: img.width + 'px',
            height: img.height + 'px',
            left: _left + 'px',
            top: _top + 'px'
          })
          .attr('id', p._id + '_img');
        p.domObj[p._id + '_img'] = _imgDiv;
      }
    }
    setText();
    var a = $(p.domObj[p._id]).attr('merge');
    if (typeof a != 'undefined' && a == 'true') {
      var w = $(p.domObj[p._id]).width(),
        h = $(p.domObj[p._id]).height(),
        t = $(p.domObj[p._id]).position().top,
        l = $(p.domObj[p._id]).position().left,
        sh = $(p.domObj[p._id]).css('box-shadow');
      var dummy_shadow = document.createElement('div');
      $(dummy_shadow)
        .css({
          position: 'absolute',
          'pointer-events': 'none',
          //"z-index":0,
          width: w + 'px',
          height: h + 'px',
          left: l + 'px',
          top: t + 'px',
          'box-shadow': sh
        })
        .attr('id', p._id + '_shadowDiv');

      p.domObj[p._id + '_shadowDiv'] = dummy_shadow;
      $(p.domObj[p._id]).before(dummy_shadow);
      // $(p.domObj[p._id]).before('<div class="dummy_shadow" style="position:absolute;z-index:0;width:'+w+'px;height:'+h+'px;left:'+l+'px;top:'+t+'px;box-shadow:'+sh+';"></div>');
      //	$(p.domObj[p._id]).css('box-shadow','none');
      //////////////console.log("upppp")
    }

    p.tabObj[p._id] = {};
    p.clicked = false;
    p.visited = false;
    if (p._hideMCs) {
      hideMovieClips();
    }
    if (p._disabled) {
      updateState('_disable');
    } else {
      updateState('_normal');
    }

    addEventHandler();
    if (p.onloadClicked) {
      $(p.domObj[p._id]).trigger('click');
    }
  }

  function setText() {
    var txtData = $(p.domObj[p._id]).attr('data');
    if (txtData) {
      // //////////////////////////console.log(($(p.domObj[p._id]).attr('data')),"d")
      $(p.domObj[txtData]).css({
        position: 'relative',
        'padding-left': 0,
        'padding-top': 0,
        'pointer-events': 'none',
        width: '100%',
        height: '100%',
        display: 'table-cell',
        'vertical-align': 'middle'
      });
    }

    if (p.arrowData.visible) {
      var _elemArrow = document.createElement('div');
      $(p.domObj['activityWrapper']).append(_elemArrow);
      var pLeft = parseFloat($(p.domObj[p._id]).css('left'));
      var pTop = parseFloat($(p.domObj[p._id]).css('top'));
      var pWidth = parseFloat($(p.domObj[p._id]).css('width'));
      var pHeight = parseFloat($(p.domObj[p._id]).css('height'));
      var imgWidth = activityImageObj['arrow'].width;
      var imgHeight = activityImageObj['arrow'].height;
      $(_elemArrow)
        .css({
          position: 'absolute',
          'pointer-events': 'none',
          left: pLeft + pWidth + p.arrowData.leftPadding + 'px',
          top: pTop + pHeight / 2 - imgHeight / 2 + 'px',
          width: imgWidth + 'px',
          height: imgHeight + 'px',
          background: 'url(' + activityImageObj['arrow'].src + ') no-repeat',
          'background-size': '100% 100%',
          display: 'none'
        })
        .addClass('bg_' + p._id);

      $(_elemArrow).attr('id', p._id + '_bg_arrow');
      p.domObj[p._id + '_bg_arrow'] = _elemArrow;
    }

    if (p.header) {
      /*    var _elemHeaderTxt = document.createElement("div");
            $(p.domObj["bg_header"]).append(_elemHeaderTxt);
			$(_elemHeaderTxt).css({
				"position": "absolute",
				"pointer-events": "none",
				"left": 0+ "px",
				"top":  0+ "px",
				"width": 993 + "px",
				"display": "none"
			})
        
		var _elemHeaderTxt = document.createElement("div");
		$(p.domObj["bg_header"]).append(_elemHeaderTxt);
		//////////////console.log(p.header.txtId) */
      //$(p.domObj["bg_header"]).html(p._shellModel.getTextValue(p.header.txtId));
      /* $(_elemHeaderTxt).attr('id',p.header.txtId);
		p.domObj[p.header.txtId] = _elemHeaderTxt;  */
    }
  }

  function gotoAndStopTab(elem, state) {
    ////////////////////////////console.log("=============")
    ////////////////////////////console.log(p._id,"p._id")
    ////////////////////////////console.log(elem,"elem")

    if (state == '_visited' && p._visitedState && p._visitedOnVideoEnd) {
      if (!visitedAtEnd) {
        state = '_normal';
      } else {
        state = '_visited';
      }
    }

    if (p._imgObj[elem] && p._imgObj[elem][state]) {
      if (p._imgObj[elem][state] && !p.commonParams._transparancy) {
        // setBackground(p.domObj[elem], p._shellModel.getMediaPath() + p._imgObj[elem][state])
        ////////////console.log(elem , " :: _imgDiv")
        setBackground(
          p.domObj[elem + '_img'],
          activityImageObj[elem + state].src
        );
      }
    } else {
      $(p.domObj[elem + '_img']).css({
        background: ''
      });
    }
    //else
    //{
    switch (state) {
      case '_normal':
        $(p.domObj[elem]).removeClass(p._btnCssObj['_down']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_disable']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_selected']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_over']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_visited']);
        $(p.domObj[elem]).addClass(p._btnCssObj['_normal']);

        break;

      case '_over':
        $(p.domObj[elem]).removeClass(p._btnCssObj['_disable']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_selected']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_normal']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_down']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_visited']);
        $(p.domObj[elem]).addClass(p._btnCssObj['_over']);

        break;
      case '_down':
        $(p.domObj[elem]).removeClass(p._btnCssObj['_disable']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_over']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_normal']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_selected']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_visited']);
        $(p.domObj[elem]).addClass(p._btnCssObj['_down']);

        break;
      case '_selected':
        $(p.domObj[elem]).removeClass(p._btnCssObj['_disable']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_over']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_normal']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_down']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_visited']);
        $(p.domObj[elem]).addClass(p._btnCssObj['_selected']);

        break;
      case '_disable':
        $(p.domObj[elem]).removeClass(p._btnCssObj['_selected']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_over']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_normal']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_down']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_visited']);
        $(p.domObj[elem]).addClass(p._btnCssObj['_disable']);

        break;
      case '_visited':
        $(p.domObj[elem]).removeClass(p._btnCssObj['_selected']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_over']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_normal']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_down']);
        $(p.domObj[elem]).removeClass(p._btnCssObj['_disable']);
        $(p.domObj[elem]).addClass(p._btnCssObj['_visited']);

        break;
    }
    if (state) {
      var a = $(p.domObj[p._id]).attr('merge');
      if (typeof a != 'undefined' && a == 'true') {
        $(p.domObj[p._id]).css('box-shadow', '');
        sh = $(p.domObj[p._id]).css('box-shadow');
        $(p.domObj[p._id]).css('box-shadow', 'none');
        $(p.domObj[p._id + '_shadowDiv']).css({
          'box-shadow': sh
        });
      }
    }
    //}
  }

  function setBackground(elem, img) {
    //////////////console.log(img,elem)
    if (img) {
      $(elem).css({
        background: 'url(' + img + ') no-repeat',
        'background-size': '100% 100%'
      });
    }
  }

  /**
   * Add event handler to the button
   */
  function addEventHandler() {
    //this.buttonMode = true;
    //this.mouseChildren = false;
    p.tabObj[p._id].buttonMode = true;
    /* this.addEventListener(MouseEvent.MOUSE_UP, eventHandler, false, 0, true)
            this.addEventListener(MouseEvent.MOUSE_OVER, eventHandler, false, 0, true)
            this.addEventListener(MouseEvent.MOUSE_OUT, eventHandler, false, 0, true)
            this.addEventListener(MouseEvent.CLICK, eventHandler, false, 0, true) */
    bindEvents(p._id);

    if (!p._disabled && p._handCursor) {
      //this.useHandCursor = true;
      p.tabObj[p._id].useHandCursor = true;
    } else {
      //this.useHandCursor = false;
      p.tabObj[p._id].useHandCursor = false;
      updateState('_disable');
    }
  }

  /**
   * Event handler method
   * @param	e
   */
  function eventHandler(e) {
    if (p._disabled) {
      return;
    }
    ////////////////console.log("disssssable in")
    var strFrame = '';
    //trace("E.type : " + e.type)
    switch (e.type) {
      case 'mouseup':
        strFrame += '_over';
        break;
      case 'mouseover':
        strFrame += '_over';
        break;
      case 'mousedown':
        strFrame += '_down';
        break;
      case 'mouseout':
        if (p.visited) {
          strFrame += '_visited';
        } else {
          strFrame += '_normal';
        }
        break;
      case 'click':
        strFrame += '_down';

        if (p._visitedState) {
          p.visited = true;
        }

        if (p['tabclick'])
          p['tabclick']({
            e: e
          });
        //showBg(e.target.id)  // removed by ajay
        showBg(e.currentTarget.id); // added by ajay
        showHeader();
        //unbindEvents(e.target.id)   // removed by ajay
        unbindEvents(e.currentTarget.id); // added by ajay

        break;
      default:
        strFrame += '_over';
        break;
    }
    //var id = e.target.id.split('_')[0]   // removed by ajay
    var id = e.currentTarget.id.split('_')[0]; // added by ajay
    if (p._keepSelected && p.clicked) {
      gotoAndStopTab(id, '_down');
      //this.useHandCursor = true;
      p.tabObj[p._id].useHandCursor = true;
    } else {
      gotoAndStopTab(id, strFrame);
    }

    if (!p._disabled) {
      if (e.type == 'click') {
        p.clicked = true;
        performActions();
        if (!p._keepSelected) {
          p._disabled = true;
          updateState('_disable');
          //this.useHandCursor = false;
        }
      }
    }
  }
  this.keepVisitedStateOnVideoEnd = function() {
    if (p._visitedState && p._visitedOnVideoEnd) {
      visitedAtEnd = true;
    }
  };

  this.attendEvent = function(e) {
    ////////console.log("wwwww i m visited",e)

    if (p.visited) {
      updateState('_visited');
    } else {
      updateState(e.state);
    }
  };

  function updateState(p_state) {
    //public
    //console.log(p_state,"p_state",p._id)
    if (p_state == '_disable') {
      p._disabled = true;
      //this.enabled = false;
      p.tabObj[p._id].enabled = false;
      //this.useHandCursor = false;
      p.tabObj[p._id].useHandCursor = false;
    } else if (p_state == '_normal') {
      if (!p._enableOnce) {
        //////////////not in flash
        p._disabled = false;
      }
      //this.enabled = true;
      p.tabObj[p._id].enabled = true;
      //this.useHandCursor = true;
      p.tabObj[p._id].useHandCursor = true;
    } else if (p_state == '_down') {
    } else if (p_state == '_visited') {
      //p.visited = true;
      //this.useHandCursor = true;
      p.tabObj[p._id].useHandCursor = true;
    }
    if (p.commonParams._transparancy) {
      gotoAndStopTabTrans(p._id, p_state);
    } else {
      gotoAndStopTab(p._id, p_state);
    }
  }
  /**
   * Method to call actions attached to the button
   */
  /* 	function performActions()
    	{

    		
    		for (var i = 1; i <= 4; i++) {
    			var val = this["controlMc0" + i];
    			var mc
    			if(val == "this"){
    				mc = this.parent;
    			} else {
    				mc = this.parent.getChildByName(val);
    			}
    			if(mc){
    				var action = this["actionMc0" + i];
    				for (var j:int = 0; j < action.length; j++) {
    					var str = action[j];
    					if (str.substring(str.indexOf("(")+1, (str.lastIndexOf(")"))) != "") {
    						var act = str.substring(0, str.indexOf("("))
    						var value = str.substring(str.indexOf("(") + 1, (str.lastIndexOf(")")));
    						switch (act) {
    							case "stop":
    								mc.gotoAndStop(value);
    								if(p._enableOnDone || p._visitedState){
    									mc.addEventListener(Event.ENTER_FRAME, checkAnimation)
    								}
    							break;
    							case "play":
    								mc.gotoAndPlay(value);
    								if(p._enableOnDone || p._visitedState){
    									p.actionCnt=1;
    									trace("CNT ++ " + p.actionCnt)
    									mc.addEventListener(Event.ENTER_FRAME, checkAnimation)									
    								}									
    							break;
    							case "playFromCurrentFrame":
    								if (value == "true") {
    									mc.play();
    									if(p._enableOnDone || p._visitedState){
    										p.actionCnt = 1;
    										//trace("CNT ++ " + p.actionCnt)
    										mc.addEventListener(Event.ENTER_FRAME, checkAnimation)
    									}
    								}
    							break;
    						}
    						
    					}
    				}
    			}
    		}
    		
	
    		if (p._enableOnce) {
    			//trace("Enable once only");
    			p._disabled = true;
    			updateState("disable");
    		}
    	
    		if (p._hideMCsOnClick) {
    			hideOnClickMovieClips(p._hideMCsOnClick,false);
    		}
    		
    		if (p._showMCsOnClick){
    			hideOnClickMovieClips(p._showMCsOnClick,true);
    		}
    	
    		if (p._resetMCs) {
    			resetMovieClips();
    		}			
    		
    	
    		if (p._groupMcs) {
    			updateGroupMcs()
    		}
    	}
    	 */

  function performActions() {
    /* perform actions */

    for (var i = 1; i <= 4; i++) {
      var val = p['_controlMc0' + i];
      var mc;
      if (val == 'this') {
        mc = this.parent;
      } else {
        //mc = this.parent.getChildByName(val);
        mc = val;
      }

      if (mc) {
        var action = p['_actionMc0' + i];
        for (var j = 0; j < action.length; j++) {
          var str = action[j];
          if (str.substring(str.indexOf('(') + 1, str.lastIndexOf(')')) != '') {
            var act = str.substring(0, str.indexOf('('));
            var value = str.substring(
              str.indexOf('(') + 1,
              str.lastIndexOf(')')
            );

            switch (act) {
              case 'stop':
                //mc.gotoAndStop(value);
                if (p._enableOnDone || p._visitedState) {
                  //	//////////////////////////console.log(p.actionCnt,"dddd 1",p._visitedState)
                  //checkAnimation()
                  //mc.addEventListener(Event.ENTER_FRAME, checkAnimation)
                }
                break;
              case 'play':
                //mc.gotoAndPlay(value);
                if (p._enableOnDone || p._visitedState) {
                  p.actionCnt = 1;
                  //	//////////////////////////console.log(p.actionCnt,"dddd 2",p._visitedState)
                  //	checkAnimation()
                  //mc.addEventListener(Event.ENTER_FRAME, checkAnimation)
                }
                break;
              case 'playFromCurrentFrame':
                if (value == 'true') {
                  //mc.play();
                  if (p._enableOnDone || p._visitedState) {
                    p.actionCnt = 1;
                    //	//////////////////////////console.log(p.actionCnt,"dddd 3",p._visitedState)
                    //	checkAnimation()
                    //mc.addEventListener(Event.ENTER_FRAME, checkAnimation)
                  }
                }
                break;
            }
          }
        }
      }
    }

    /* enable once */
    if (p._enableOnce) {
      p._disabled = true;
      updateState('_disable');
    }
    /* hide mc's */

    /* hide mc's on click */
    if (p._hideMCsOnClick) {
      hideOnClickMovieClips(p._hideMCsOnClick, false);
    }
    /* show mc's on click */
    if (p._showMCsOnClick) {
      hideOnClickMovieClips(p._showMCsOnClick, true);
    }
    /* reset mc's */
    if (p._resetMCs) {
      //  resetMovieClips();
    }

    /* check group mcs */
    if (p._groupMcs) {
      updateGroupMcs();
    }
  }

  /**
   * Check if the animations are done, then rest the button back to normal state
   * @param	e
   */
  function checkAnimation(e) {
    /* if(e.currentTarget.currentFrame != 1){
        	if (e.currentTarget.currentFrame == e.currentTarget.pFrame) {
        		trace(" : " + p.actionCnt);
        		if(p.actionCnt > 0){
        			p.actionCnt--;
        		}
        		e.currentTarget.removeEventListener(Event.ENTER_FRAME, checkAnimation);	
        	}
        	e.currentTarget.pFrame = e.currentTarget.currentFrame; */
    //	//////////////////////////console.log(p.actionCnt,"dddd",p._visitedState)
    //if (p.actionCnt == 0) {
    //e.currentTarget.removeEventListener(Event.ENTER_FRAME, checkAnimation);
    updateState('_normal');
    if (p.visited) {
      bindEvents(p._id);
      updateState('_visited');
    }
    //}
    //}
  }

  /**
   * Hide specified movie clips
   */
  function hideMovieClips() {
    for (var i = 0; i < p._hideMCs.length; i++) {
      if (this.parent[p._hideMCs[i]]) {
        var mc = this.parent[p._hideMCs[i]];
        mc.visible = false;
      }
    }
  }

  /**
   * Hide specified movie clips
   */
  function hideOnClickMovieClips(_arr, _val) {
    for (var i = 0; i < _arr.length; i++) {
      if (_arr[i] != 'defaultValue') {
        if (this.parent[_arr[i]]) {
          var mc = this.parent[_arr[i]];
          mc.visible = _val;
        }
      }
    }
  }

  /**
   * Reset specified movie clips
   */
  function resetMovieClips() {
    for (var i = 0; i < p._resetMCs.length; i++) {
      var mc = this.parent[p._resetMCs[i]];
      mc.removeEventListener(Event.ENTER_FRAME, checkAnimation);
      mc.gotoAndStop(1);
    }
  }

  /**
   * Method to update the group mc's (radio group fn)
   */
  function updateGroupMcs() {
    if (!p._keepSelected) {
      p._disabled = true;
    }
    updateState('_down');
    var i;
    if (p._keepSelected) {
      for (i = 0; i < p._groupMcs.length; i++) {
        //this.parent[p._groupMcs[i]].disabled = false;
        p.updateEvent({
          elemId: p._groupMcs[i],
          state: true
        });
        // bindEvents(p._groupMcs[i])
      }
    } else if (p._visitedState) {
      for (i = 0; i < p._groupMcs.length; i++) {
        //if (this.parent[p._groupMcs[i]].visited) {
        if (p.visited) {
          //this.parent[p._groupMcs[i]].updateState("_visited");
          p.dispatchEventUpdateState({
            state: '_visited',
            elemId: p._groupMcs[i]
          });
        } else {
          //this.parent[p._groupMcs[i]].updateState("_normal");
          p.dispatchEventUpdateState({
            state: '_normal',
            elemId: p._groupMcs[i]
          });
        }
        //this.parent[p._groupMcs[i]].disabled = false;

        // bindEvents(p._groupMcs[i])
        p.updateEvent({
          elemId: p._groupMcs[i],
          state: true
        });
      }
    } else {
      for (i = 0; i < p._groupMcs.length; i++) {
        //this.parent[p._groupMcs[i]].disabled = false;
        //this.parent[p._groupMcs[i]].updateState("_normal");

        p.dispatchEventUpdateState({
          state: '_normal',
          elemId: p._groupMcs[i]
        });
        //bindEvents(p._groupMcs[i])
        p.updateEvent({
          elemId: p._groupMcs[i],
          state: true
        });
      }
    }
  }
  this.enableFn = function() {
    if (!p._enableOnce) {
      p._disabled = false;
    }
    //bindEvents(p._id);
  };
  this.disableFn = function() {
    unbindEvents(p._id);
  };

  function bindEvents(elemId) {
    ////console.log(p._id,"aaa")

    if (!p._disabled) {
      $(p.domObj[p._id]).addClass('addPointer');
    }

    $(p.domObj[elemId])
      .off('mouseup', eventHandler)
      .on('mouseup', eventHandler);
    $(p.domObj[elemId])
      .off('mouseover', eventHandler)
      .on('mouseover', eventHandler);
    $(p.domObj[elemId])
      .off('mouseout', eventHandler)
      .on('mouseout', eventHandler);
    $(p.domObj[elemId])
      .off('click', eventHandler)
      .on('click', eventHandler);
  }

  function unbindEvents(elemId) {
    ////console.log(p._id,"sss")

    if (p.feedBack) {
      //////////console.log(p.feedbackParam,"d")
      p.feedBack({
        videoFb: p.feedbackParam,
        elemId: elemId
      });
    }

    $(p.domObj[p._id]).removeClass('addPointer');

    $(p.domObj[elemId]).off('mouseup', eventHandler);
    $(p.domObj[elemId]).off('mouseover', eventHandler);
    $(p.domObj[elemId]).off('mouseout', eventHandler);
    $(p.domObj[elemId]).off('click', eventHandler);

    p.hideBtns({ id: p._id });
  }
  var finalHeight = false;
  this.showHideBtnOnClick = function(flag) {
    if (p.afterHeight && !finalHeight) {
      $(p.domObj[p._id]).css({ height: p.afterHeight + 'px' });
    }
    finalHeight = true;
    ////console.log("aaaaaaa")
    if (flag) {
      if (p.commonParams._transparancy) {
        $(p.domObj[p.commonParams._btnTarget]).show();
      } else {
        $(p.domObj[p._id]).show();
      }
    } else {
      if (p.commonParams._transparancy) {
        $(p.domObj[p.commonParams._btnTarget]).hide();
      } else {
        $(p.domObj[p._id]).hide();
      }
    }
  };

  function showBg(eId) {
    for (i = 0; i < p._resetMCs.length; i++) {
      $(p.domObj[p._resetMCs[i]]).hide();
    }
    /*         for (i = 0; i < p._groupMcs.length; i++) 
		{
            $(".bg_" + p._groupMcs[i]).hide()
        }
        $(".bg_" + eId).show()
        $(p.domObj[p._controlMc01]).show()

        if (p._imgObj["bg"]) 
		{
            $(p.domObj["btn_bg"]).show()
           // setBackground(p.domObj["btn_bg"], p._shellModel.getMediaPath() + p._imgObj["bg"])
		   
		   //////////////console.log( activityImageObj["bg"].src)
            setBackground(p.domObj["btn_bg"], activityImageObj["bg"].src)
        }
		
		if(p.showControlHolder && p.showControlHolder.visible)
		{
				$(p.domObj["btn_bg"]).show()
				var mcH=parseFloat($(p.domObj["btn_bg"]).css("height"))  
				 if(p.showControlHolder.visibleSmall)
				{
				
				$(p.domObj["lowerDiv"]).show()
			
				   $(p.domObj["upperDiv"]).css({
                  "border-bottom-right-radius": 0+"px",
	              "height": ((mcH)-40)+"px",
				 })
				 	if(p.showControlHolder.smallwidth)
					{
					$(p.domObj["lowerDiv"]).css({"width":p.showControlHolder.smallwidth})
					} 
				}else
                {
				
                 	 $(p.domObj["upperDiv"]).css({ 
                     "border-bottom-right-radius": 7+"px",
                      "height": ((mcH)-40)+"px",
	              })
                }   				
		} else if(!p._imgObj["bg"])
		{
			if(p.domObj["btn_bg"])
				{
				$(p.domObj["btn_bg"]).hide()
				}
		} */
  }

  function showHeader() {
    /*  if (p.header) 
		{  
		$(p.domObj["bg_header"]).show();  
		$(p.domObj["bg_header"]).html("");
	    $(p.domObj["bg_header"]).html(p._shellModel.getTextValue(p.header.txtId));
		var tempTxt= ($(p.domObj["bg_header"]).children().eq(0))[0];
		//////////////console.log(tempTxt, p.header.y)
		$(tempTxt).css({
		         "position":"absolute",
				 "width":"100%",
				 "height":"100%",
				 "top": p.header.y
         })
		} */
  }

  this.completedFeedback = function() {
    /* if(p.header)
	{
      $(p.domObj["bg_header"]).hide();  
	 } */

    checkAnimation();
  };

  function gotoAndStopTabTrans(elem, state) {
    if (p._imgObj) {
      if (p._imgObj[elem][state]) {
        _elemCanvas.width = _elemCanvas.width;
        // var img = new Image()
        // img.src = p._shellModel.getMediaPath() + p._imgObj[elem][state]

        _elemCtx.drawImage(
          activityImageObj[elem + state],
          0,
          0,
          activityImageObj[elem + state].width,
          activityImageObj[elem + state].height
        );
      }
    }
  }

  var _elemCanvas;
  var _elemCtx;

  function transparantCanvas() {
    var traceLeft = parseFloat($(p.domObj[p._id]).css('left'));
    var traceTop = parseFloat($(p.domObj[p._id]).css('top'));
    var traceWidth = parseFloat($(p.domObj[p._id]).css('width'));
    var traceHeight = parseFloat($(p.domObj[p._id]).css('height'));

    _elemCanvas = document.createElement('canvas');
    _elemCtx = _elemCanvas.getContext('2d');
    $(p.domObj[p._id]).append(_elemCanvas);
    $(_elemCanvas).attr('id', p._id + '_Canvas');

    p.domObj[p._id + '_Canvas'] = _elemCanvas;
    $(_elemCanvas).css({
      position: 'absolute',
      left: 0 + 'px',
      top: 0 + 'px',
      width: traceWidth + 'px',
      height: traceHeight + 'px'
    });
    _elemCanvas.width = traceWidth;
    _elemCanvas.height = traceHeight;
    //var img = new Image()

    // img.src = p._shellModel.getMediaPath() + p._imgObj[p._id]["_normal"]
    _elemCtx.drawImage(
      activityImageObj[p._id + '_normal'],
      0,
      0,
      traceWidth,
      traceHeight
    );
  }
  function CheckColor(cell) {
    var _hex = '#' + ('000000' + rgbToHex(cell[0], cell[1], cell[2])).slice(-6);
    if (_hex != '#000000') {
      return true;
    } else {
      //Added by Sagar - 1/24/2017 for black color
      if (_hex == '#000000' && cell[3] > 2) {
        return true;
      } else {
        return false;
      }
    }
  }
  function rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b).toString(16);
  }
  this.detectTransparancy = function(e) {
    //	console.log(p._disabled,p._id)
    if (p._disabled) {
      return;
    }

    var strFrame = '';
    var pt = _elemCtx.getImageData(
      Math.round(e.offsetX),
      Math.round(e.offsetY),
      1,
      1
    ).data;

    //var hex = pt[3]
    var hex = CheckColor(pt);
    if (hex) {
      strFrame += '_over';
      if (e.type == 'mousedown') {
        strFrame += '_down';
      }
      if (e.type == 'click') {
        strFrame += '_down';
        if (p._visitedState) {
          p.visited = true;
        }
        if (p['tabclick'])
          p['tabclick']({
            e: { currentTarget: { id: p._id } }
          });
        showBg(p._id);
        showHeader();
        unbindEvents(p._id);
      }
    } else {
      if (p.visited) {
        strFrame += '_visited';
      } else {
        strFrame += '_normal';
      }
    }

    if (p._keepSelected && p.clicked) {
      gotoAndStopTabTrans(p._id, '_down');
      p.tabObj[p._id].useHandCursor = true;
    } else {
      gotoAndStopTabTrans(p._id, strFrame);
    }

    if (!p._disabled) {
      if (e.type == 'click' && hex) {
        p.clicked = true;
        performActions();
        if (!p._keepSelected) {
          p._disabled = true;
          //console.log( p._disabled )
          updateState('_disable');
        }
      }
    }
    if (hex) return p._id;
  };

  this.clearState = function() {
    //console.log("gg",p._disabled)
    if (!p._disabled) {
      checkAnimation();
    }
    /*  if (p.visited) 
		{

            updateState("_visited");
        } 
		else 
		{
            updateState("_normal")
        }  */
  };

  this.removeAll = function() {
    $(p.domObj[p._id]).off('mouseup', eventHandler);
    $(p.domObj[p._id]).off('mouseover', eventHandler);
    $(p.domObj[p._id]).off('mouseout', eventHandler);
    $(p.domObj[p._id]).off('click', eventHandler);
    for (var i in p.domObj) {
      $(p.domObj[i]).remove();
    }
    delete p;
  };
};
