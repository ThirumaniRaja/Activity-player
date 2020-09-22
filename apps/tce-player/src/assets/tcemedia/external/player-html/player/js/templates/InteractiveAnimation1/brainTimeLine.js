var brain = function() {
  var p = new Object();
  var interactiveAnimation = [];
  var fb1;
  var _param;
  var _holder;
  var _commonData;
  var domObj;
  var _act = new CreateActivityPage();
  var shellModel, navController;
  var IDArr = [],
    count = 0;
  var _icData;
  var btnClicked = false;
  this.init = function(_wrapper, _shellModel, _navController) {
    // page creation///////////////////
    shellModel = _shellModel;
    navController = _navController;
    _act = new CreateActivityPage();
    var configData = _shellModel.getActivityConfig();
    _act.init({
      target: _wrapper,
      url: _shellModel.getMediaPath() + configData.template_config.launchFile,
      shellModel: _shellModel
    });
    _param = configData.param;
    _holder = configData.brainData;
    _icData = configData.controlAndiTextData;
    _commonData = configData.commonParams;
    ///////////////////////////////////////

    ///// initialize obj///////////////
    EventBus.addEventListener('activityPageReady', OnPageReady, this);
    EventBus.addEventListener('activityAudioStop', removeDomObj, this);
  };

  function OnPageReady(e, _domObj, _parentRef) {
    if (_parentRef === _act) {
      domObj = _domObj;

      var fbparam = {};
      fbparam.domObj = domObj;
      fbparam['_shellModel'] = shellModel;
      fbparam['_navController'] = navController;
      if (p['pageReady']) {
        p['pageReady']({
          domObj: domObj
        });
      }
      if (_param.feedbackParam) {
        fbparam['feedbackParam'] = _param.feedbackParam;
      }
      fb1 = new feedBackClass();
      fb1.init(fbparam);
      fb1.addEventListener('feedBackComplete', goBackMain);
      fb1.addEventListener('videoDone', setControls);

      //domObj from Feedback
      fb1.addEventListener('fbDomObj', fbDomObj);

      fb1.addEventListener('seekDone', setButtons);
      var tempI;
      for (var i in _param) {
        interactiveAnimation[i] = new InteractiveAnimation();
        _param[i].commonParams = _commonData;
        _param[i].domObj = domObj;
        _param[i]['_shellModel'] = shellModel;
        _param[i]['_navController'] = navController;
        interactiveAnimation[i].addEventListener(
          'dispatchEventUpdateState',
          updateOthersState
        );
        interactiveAnimation[i].addEventListener('hideBtns', hideBtnsParam);
        interactiveAnimation[i].addEventListener('updateEvent', updateEvent);
        interactiveAnimation[i].addEventListener('feedBack', showFeedbback);
        interactiveAnimation[i].addEventListener('tabclick', actOver);

        if (!_param[i].onloadClicked) {
          interactiveAnimation[i].init(_param[i]);
        } else {
          tempI = i;
        }
        IDArr[count] = i;
        count++;
      }
      if (tempI) {
        //////////console.log(_param[tempI])
        interactiveAnimation[tempI].init(_param[tempI]);
      }
    }

    if (_icData && _icData.updateJsonStart) {
      navController.updateButtons(_icData.updateJsonStart);
    }
  }
  function fbDomObj(e) {
    if (p.domObjFb) {
      p.domObjFb(e);
    }
  }
  function setButtons(e) {
    hideBtns(e);
  }
  function hideBtnsParam(e) {
    btnClicked = true;
  }

  /* function hideBtns(e)
	{
	if(_commonData._hideAllBtn)
		{
			for (var i in _param) 
			{
			interactiveAnimation[i].showHideBtnOnClick(false)
			}	
		}
	if(_commonData._hideSelectedBtn)
		{
		for (var i in _param) 
		{
		if(i==e.id)
		{
		interactiveAnimation[i].showHideBtnOnClick(false)
		}else
		{
		interactiveAnimation[i].showHideBtnOnClick(true)
		}
		}
		
		}
	} */
  function hideBtns(e) {
    if (btnClicked) {
      if (_commonData._hideAllBtn) {
        for (var i in _param) {
          interactiveAnimation[i].showHideBtnOnClick(false);
        }
      }
      if (_commonData._hideSelectedBtn) {
        for (var i in _param) {
          if (i == e.elemId) {
            interactiveAnimation[i].showHideBtnOnClick(false);
          } else {
            interactiveAnimation[i].showHideBtnOnClick(true);
          }
        }
      }
      btnClicked = false;
    }
  }

  function showBtns() {
    //console.log("show btn")
    if (_commonData._hideAllBtn) {
      for (var i in _param) {
        interactiveAnimation[i].showHideBtnOnClick(true);
      }
    }
    if (_commonData._hideSelectedBtn) {
      interactiveAnimation[currID].showHideBtnOnClick(true);
    }
  }

  function showFeedbback(e) {
    if (p['onFeedBack'])
      p['onFeedBack']({
        e: e,
        domObj: domObj
      });
    currID = e.elemId;
    fb1.clearPrevFeedback();
    e.playBack = onPlayBack;
    e._commonData = _commonData;

    if (_icData) {
      var tempMc = _param[currID].feedbackParam;
      if (tempMc.closeBtnParam && _icData.updateJsonClose) {
        navController.updateButtons(_icData.updateJsonClose);
      } else if (IDArr.length == 0 && _icData.updateJsonEnd) {
        navController.updateButtons(_icData.updateJsonEnd);
      } else if (_icData.updateJsonStart) {
        navController.updateButtons(_icData.updateJsonStart);
      }
    }

    fb1.handleFeedBack(e);
  }
  function onPlayBack(e) {
    if (p['onPlayBack'])
      p['onPlayBack']({
        e: e
      });
  }

  function setControls(e) {
    ////console.log("doneeeee")
    interactiveAnimation[e.elemId].keepVisitedStateOnVideoEnd();
    if (IDArr.length != 0 && _icData && _icData.endActOnAllVideoEnd) {
      //////////console.log("gayaaaa",IDArr,IDArr.length,e )
      if (IDArr.indexOf(e.elemId) != -1)
        IDArr.splice(IDArr.indexOf(e.elemId), 1);
    }

    if (IDArr.length == 0) {
      if (_icData && _icData.endActOnAllVideoEnd) {
        var tempMc = _param[e.elemId].feedbackParam;
        if (!tempMc.closeBtnParam) {
          if (_icData.updateJsonEnd) {
            navController.updateButtons(_icData.updateJsonEnd);
          }

          if (p['onActComplete']) p['onActComplete']({});
        }
      }
    } else {
      if (_icData && _icData.endActOnAllVideoEnd) {
        var tempMc = _param[e.elemId].feedbackParam; //[_param[e.elemId]["_controlMc01"]]

        if (!tempMc.closeBtnParam && _icData.updateJsonStart) {
          navController.updateButtons(_icData.updateJsonStart);
        }
      }
    }
  }
  function goBackMain(e) {
    interactiveAnimation[currID].completedFeedback();
    showBtns();
    if (_icData) {
      if (IDArr.length == 0) {
        if (_icData.updateJsonEnd) {
          navController.updateButtons(_icData.updateJsonEnd);
        }
        if (p['onActComplete']) {
          p['onActComplete']({
            e: e
          });
        }
      } else {
        if (_icData.updateJsonStart) {
          navController.updateButtons(_icData.updateJsonStart);
        }
      }
    }
    if (p['onPlayBack']) {
      p['onPlayBack']({
        e: e,
        stop: 'stop'
      });
    }
  }
  function actOver(e) {
    ////console.log("i called")
    if (IDArr.length != 0 && _icData && !_icData.endActOnAllVideoEnd) {
      //if(IDArr.indexOf(e.e.target.id)!=-1)   // removed by Ajay
      if (IDArr.indexOf(e.e.currentTarget.id) != -1)
        // added by Ajay
        //IDArr.splice(IDArr.indexOf(e.e.target.id),1); // removed by Ajay
        IDArr.splice(IDArr.indexOf(e.e.currentTarget.id), 1); // added by Ajay
    }
    if (IDArr.length == 0) {
      if (_icData && !_icData.endActOnAllVideoEnd) {
        if (_icData.updateJsonEnd) {
          navController.updateButtons(_icData.updateJsonEnd);
        }
        /* 	if(p["onActComplete"])
				p["onActComplete"](
				{
					e:e
				}) */
      }
    } else {
      //var tempMc=_param[e.e.target.id].feedbackParam[_param[e.e.target.id]["_controlMc01"]];  // removed by Ajay
      var tempMc = _param[e.e.currentTarget.id].feedbackParam; //[_param[e.e.currentTarget.id]["_controlMc01"]];   // added By Ajay
      //if(_icData  && (tempMc.closeBtnType||tempMc.closeBtnID || _param[e.e.target.id]["_controlMc01"]+"_popup"))  // removed by Ajay
      //if(_icData  && (tempMc.closeBtnType||tempMc.closeBtnID || _param[e.e.currentTarget.id]["_controlMc01"]+"_popup")) // added By Ajay

      if (_icData && tempMc.closeBtnParam) {
        // added By Ajay
        ////console.log("yo i m in")
        if (_icData.updateJsonClose) {
          navController.updateButtons(_icData.updateJsonClose);
        }
      } else {
        if (_icData && _icData.updateJsonStart) {
          navController.updateButtons(_icData.updateJsonStart);
        }
      }
    }
  }
  function updateOthersState(e) {
    interactiveAnimation[e.elemId].attendEvent(e);
  }

  var currID;

  function updateEvent(e) {
    if (e.state == true) {
      interactiveAnimation[e.elemId].enableFn(e);
      interactiveAnimation[e.elemId].clearState();
    } else {
      interactiveAnimation[e.elemId].disableFn(e);
    }
  }

  function removeDomObj(event, _parentRef, _btnRef) {
    if (_parentRef === navController) {
      if (p['removeDom']) {
        p['removeDom']({
          event: event,
          ref: _parentRef,
          btnRef: _btnRef
        });
      }
      fb1.stopAll();
      for (var i in interactiveAnimation) {
        interactiveAnimation[i].removeAll();
      }

      EventBus.removeEventListener('activityPageReady', OnPageReady, this);
      EventBus.removeEventListener('activityAudioStop', removeDomObj, this);
      delete interactiveAnimation;
      delete fb1;
      delete domObj;
    }
  }

  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
};
