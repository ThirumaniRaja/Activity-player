var brain = function() {
  var p = new Object();
  var interactiveAnimation = [];
  var fb1;
  var domObj, _param;
  var _elemCanvas = [];
  var _elemCtx = [];
  var _elemTracePad;
  var _holder;
  var _act = new CreateActivityPage();
  var shellModel, navController;
  var IDArr = [],
    count = 0;
  this.init = function(_wrapper, _shellModel, _navController) {
    // page creation///////////////////
    shellModel = _shellModel;
    navController = _navController;
    var configData = shellModel.getActivityConfig();
    _act.init({
      target: _wrapper,
      url: _shellModel.getMediaPath() + configData.template_config.launchFile,
      shellModel: _shellModel
    });
    _param = configData.param;
    _holder = configData.brainData;
    ///////////////////////////////////////

    ///// initialize obj///////////////
    EventBus.addEventListener('activityPageReady', OnPageReady, this);
  };
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  function OnPageReady(e, _domObj, _parentRef) {
    if (_parentRef === _act) {
      domObj = _domObj;
      if (_holder && _holder.holderParam) {
        createHolder();
      }

      createTracePad();
      var fbparam = {};
      fbparam.domObj = domObj;
      fbparam['_shellModel'] = shellModel;
      fbparam['_navController'] = navController;
      if (_param.feedbackParam) {
        fbparam['feedbackParam'] = _param.feedbackParam;
      }
      fb1 = new feedBackClass();
      fb1.init(fbparam);
      fb1.addEventListener('feedBackComplete', goBackMain);
      var tempI;
      for (var i in _param) {
        interactiveAnimation[i] = new InteractiveAnimation();
        _param[i].domObj = domObj;
        _param[i]['_shellModel'] = shellModel;
        _param[i]['_navController'] = navController;
        interactiveAnimation[i].addEventListener(
          'dispatchEventUpdateState',
          updateOthersState
        );
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
        interactiveAnimation[tempI].init(_param[tempI]);
      }
    }
    try {
      if (_icData && _icData.updateJsonStart) {
        navController.updateButtons(_icData.updateJsonStart);
      }
    } catch (e) {}
  }

  function createTracePad() {
    for (var i in _param) {
      var traceLeft = parseFloat($(domObj[_param[i]._id]).css('left'));
      var traceTop = parseFloat($(domObj[_param[i]._id]).css('top'));
      var traceWidth = parseFloat($(domObj[_param[i]._id]).css('width'));
      var traceHeight = parseFloat($(domObj[_param[i]._id]).css('height'));
      var _target = _param[i]._target;
    }
    //console.log(_target,"_target")
    _elemTracePad = document.createElement('div');
    var str = _target;
    var res = str.replace('#', '');
    $(domObj[res]).append(_elemTracePad);
    $(_elemTracePad).attr('id', 'tracePad');

    $(_elemTracePad)
      .css({
        position: 'absolute',
        left: traceLeft,
        top: traceTop,
        width: traceWidth,
        height: traceHeight
      })
      .addClass('ttt');
    domObj['tracePad'] = _elemTracePad;
    bindTraceEvents();
  }

  function bindTraceEvents() {
    $(domObj['tracePad'])
      .off('mouseup', traceEventFired)
      .on('mouseup', traceEventFired);
    $(domObj['tracePad'])
      .off('mousemove', traceEventFired)
      .on('mousemove', traceEventFired);
    $(domObj['tracePad'])
      .off('mouseout', traceEventFired)
      .on('mouseout', traceEventFired);
    $(domObj['tracePad'])
      .off('click', traceEventFired)
      .on('click', traceEventFired);
  }

  function traceEventFired(e) {
    var _selectedBtn, _id;
    for (var i in _param) {
      _id = interactiveAnimation[i].detectTransparancy(e);
      _selectedBtn = i;
      if (_id) {
        $(domObj['tracePad']).addClass('addPointer');
        break;
      } else {
        $(domObj['tracePad']).removeClass('addPointer');
      }
    }
    for (var i in _param) {
      if (_selectedBtn != i && _id) interactiveAnimation[i].clearState();
    }
  }

  function showFeedbback(e) {
    if (p['onFeedBack'])
      p['onFeedBack']({
        e: e,
        domObj: domObj
      });
    fb1.clearPrevFeedback();
    currID = e.elemId;
    e.playBack = onPlayBack;
    fb1.handleFeedBack(e);
  }
  function onPlayBack(e) {
    if (p['onPlayBack'])
      p['onPlayBack']({
        e: e
      });
  }
  function goBackMain(e) {
    if (p['onPlayBack'])
      p['onPlayBack']({
        e: e,
        stop: 'stop'
      });
    interactiveAnimation[currID].completedFeedback();
  }
  function actOver(e) {
    if (IDArr.length != 0) IDArr.splice(IDArr.indexOf(e.e.target.id), 1);
    if (IDArr.length == 0) {
      if (p['onActComplete'])
        p['onActComplete']({
          e: e
        });
    }
  }
  function updateOthersState(e) {
    interactiveAnimation[e.elemId].attendEvent(e);
  }

  var currID;
  function updateEvent(e) {
    if (e.state == true) {
      interactiveAnimation[e.elemId].enableFn(e);
    } else {
      interactiveAnimation[e.elemId].disableFn(e);
    }
  }

  function createHolder() {
    /* "brainData":{
		"holderParam":
			{
			"x":50,
			"y":100,
			"bigHolderWidth":900,
			"bigHolderHeight":400,
			"smallHolderWidth":500,
			"color":"#FFFF00",
			"visible":true,
			"visibleSmall":true,
			"index":""
			}
	}, */

    if (domObj['btn_bg']) {
      var mcW = parseFloat($(domObj['btn_bg']).css('width'));
      var mcH = parseFloat($(domObj['btn_bg']).css('height'));
      //////////////
      var _uppperDiv = document.createElement('div');
      $(domObj['btn_bg']).append(_uppperDiv);
      $(_uppperDiv).attr('id', 'upperDiv');
      domObj['upperDiv'] = _uppperDiv;

      $(_uppperDiv).css({
        position: 'absolute',
        left: '0' + 'px',
        top: '0' + 'px',
        width: mcW + 'px',
        height: mcH - 40 + 'px',
        'border-top-left-radius': 7 + 'px',
        'border-top-right-radius': 7 + 'px',
        'border-bottom-left-radius': 7 + 'px',
        'box-shadow': '0px 0px 8px',
        display: 'inline-block',
        background: _holder.holderParam.color
      });

      //////////////
      var _lowerDiv = document.createElement('div');
      $(domObj['btn_bg']).append(_lowerDiv);
      $(_lowerDiv).attr('id', 'lowerDiv');
      domObj['lowerDiv'] = _lowerDiv;

      $(_lowerDiv).css({
        display: 'inline-block',
        right: 0 + 'px',
        bottom: 0 + 'px',
        width: _holder.holderParam.smallHolderWidth + 'px',
        position: 'absolute',
        height: 40 + 'px',
        'border-bottom-left-radius': 7 + 'px',
        'border-bottom-right-radius': 7 + 'px',
        'box-shadow': '0px 0px 8px',
        background: _holder.holderParam.color
      });

      ///////////////////
      var _lowerPatchDiv = document.createElement('div');
      $(_lowerDiv).append(_lowerPatchDiv);
      $(_lowerPatchDiv).attr('id', 'lowerPatchDiv');
      domObj['lowerPatchDiv'] = _lowerPatchDiv;
      $(_lowerPatchDiv).css({
        position: 'absolute',
        width: '100%',
        height: '100%',
        'margin-top': -15 + 'px',
        background: _holder.holderParam.color
      });

      if (!_holder.holderParam.visible) {
        $(domObj['btn_bg']).hide();
      }
      if (!_holder.holderParam.visibleSmall) {
        $(_lowerDiv).hide();
        $(_uppperDiv).css({
          height: mcH + 40 + 'px',
          'border-bottom-right-radius': 7 + 'px'
        });
      }
    }
    for (var i in _param) {
      if ($(domObj[_param[i]._controlMc01]).attr('tabBg')) {
        var mcW = parseFloat(
          $(domObj[_param[i]._controlMc01 + '_holder']).css('width')
        );
        var mcH = parseFloat(
          $(domObj[_param[i]._controlMc01 + '_holder']).css('height')
        );
        //////////////
        var _uppperDiv = document.createElement('div');
        $(domObj[_param[i]._controlMc01 + '_holder']).append(_uppperDiv);
        $(_uppperDiv).attr('id', _param[i]._controlMc01 + 'upperDiv');
        domObj[_param[i]._controlMc01 + 'upperDiv'] = _uppperDiv;

        $(_uppperDiv).css({
          position: 'absolute',
          left: '0' + 'px',
          top: '0' + 'px',
          width: mcW + 'px',
          height: mcH - 40 + 'px',
          'border-top-left-radius': 7 + 'px',
          'border-top-right-radius': 7 + 'px',
          'border-bottom-left-radius': 7 + 'px',
          'box-shadow': '0px 0px 8px',
          display: 'inline-block',
          background: _holder.holderParam.color
        });

        //////////////
        var _lowerDiv = document.createElement('div');
        $(domObj[_param[i]._controlMc01 + '_holder']).append(_lowerDiv);
        $(_lowerDiv).attr('id', _param[i]._controlMc01 + 'lowerDiv');
        domObj[_param[i]._controlMc01 + 'lowerDiv'] = _lowerDiv;

        $(_lowerDiv).css({
          display: 'inline-block',
          right: 0 + 'px',
          bottom: 0 + 'px',
          width: _holder.holderParam.smallHolderWidth + 'px',
          position: 'absolute',
          height: 40 + 'px',
          'border-bottom-left-radius': 7 + 'px',
          'border-bottom-right-radius': 7 + 'px',
          'box-shadow': '0px 0px 8px',
          background: _holder.holderParam.color
        });
        ///////////////////
        var _lowerPatchDiv = document.createElement('div');
        $(_lowerDiv).append(_lowerPatchDiv);
        $(_lowerPatchDiv).attr('id', _param[i]._controlMc01 + 'lowerPatchDiv');
        domObj[_param[i]._controlMc01 + 'lowerPatchDiv'] = _lowerPatchDiv;
        $(_lowerPatchDiv).css({
          position: 'absolute',
          width: '100%',
          height: '100%',
          'margin-top': -15 + 'px',
          background: _holder.holderParam.color
        });

        if (
          _param[i].showControlHolder &&
          _param[i].showControlHolder.visible
        ) {
          console.log(_param[i].showControlHolder.smallwidth);
          $(_lowerDiv).css({
            width: _param[i].showControlHolder.smallwidth + 'px'
          });
        }
        if (!_holder.holderParam.visibleSmall) {
          $(_lowerDiv).hide();
          $(_uppperDiv).css({
            'border-bottom-right-radius': 7 + 'px',
            height: mcH + 40 + 'px'
          });
        }
        if (
          _param[i].showControlHolder &&
          !_param[i].showControlHolder.visible
        ) {
          $(_lowerDiv).hide();
          $(_uppperDiv).css({
            'border-bottom-right-radius': 7 + 'px',
            height: mcH + 40 + 'px'
          });
        } else {
          $(_lowerDiv).show();
          if (
            _param[i].showControlHolder &&
            _param[i].showControlHolder.smallwidth
          ) {
            $(_lowerDiv).css({ width: _param[i].showControlHolder.smallwidth });
            console.log(_param[i].showControlHolder.smallwidth);
          }
          $(_uppperDiv).css({
            'border-bottom-right-radius': 0 + 'px',
            height: mcH - 40 + 'px'
          });
        }
      }
    }
  }
};
