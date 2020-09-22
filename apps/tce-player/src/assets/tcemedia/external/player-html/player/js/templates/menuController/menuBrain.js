var menuBrain = function() {
  var p = {
    domObj: new Object(),
    _shellModel: {},
    _navController: {},
    stageSize: { width: 300, height: 220 },
    // parameter for canvas
    left: -7,
    bottom: -9,
    target: '',
    // frames for jsfl
    openFrame: { start: 0, stop: 20 },
    closeFrame: { start: 21, stop: 40 },
    actConfig: {},
    // for back to tips
    // this parameters for backtoTips functionality
    //backtoTips:true,
    tipsControlObj: 2, // where to jump after click on back to tips
    backtoTipsPosition: { left: 760, top: 541, width: 170, height: 30 }, // if position is same on al screens
    showBacktoTipsAt: []
    //customBToTPosition:{"controlObjindex(e.g. 3)":{left:760,top:541,width:170,height:30}}
  };
  var docRef;
  var mBox;
  //=================================
  this.init = function(_wrapper, _shellModel, _navController) {
    p._shellModel = _shellModel;
    p._navController = _navController;
    p.actConfig = p._shellModel.getActivityConfig().param;
    for (var i in p.actConfig) {
      p[i] = p.actConfig[i];
    }
    EventBus.addEventListener('screenChange', screenChanged, this);
    mBox = new menuBox();
    mBox.init(p);
    mBox.addEventListener('click', menuEvent);
    mBox.addEventListener('backtoList', backtoListEvent);
    //console.log(p)
  };
  //=======  screenChanged event for remove menu and show/hide backtoTips(if present) =======
  function screenChanged(event, _parentRef, _btnRef) {
    if (_parentRef === p._navController) {
      //console.log(p._shellModel.getCurrentScreenId());
      var curScreen = p._shellModel.getCurrentScreenId();

      //======= checking for first screen =======
      if (curScreen == 0) {
        EventBus.removeEventListener('screenChange', screenChanged, this);
        mBox.removeEventListener('click', menuEvent);
        mBox.removeEventListener('backtoList', backtoListEvent);
        mBox.destroy_element();
      }
      //==== checking for backtoTips show/hide =====
      if (p.backtoTips) {
        if (p.showBacktoTipsAt && p.showBacktoTipsAt.length > 0) {
          var _curIndex = p.showBacktoTipsAt.indexOf(curScreen);
          if (_curIndex != -1) {
            mBox.resetCss();
            if (
              p.customBToTPosition &&
              p.customBToTPosition[p.showBacktoTipsAt[_curIndex]]
            ) {
              mBox.setCss(p.customBToTPosition[p.showBacktoTipsAt[_curIndex]]);
            }
            mBox.showBacktoTips();
          } else {
            mBox.hideBacktoTips();
          }
        } else {
          alert('check showBacktoTipsAt inside config');
        }
      }
    }
  }
  //====== back to list event ====
  function backtoListEvent(e) {
    mBox.hideBacktoTips();
    p._navController.restoreNext();
    p._shellModel.setScreenId(p.actConfig.tipsControlObj);
    var screenId = p._shellModel.getCurrentScreenId();
    var mediaType = p._shellModel.getScreenObj()[screenId].mediaType;
    p._navController.getShellController().sliderShow();
    p._navController.getShellController().loadScreen(screenId, mediaType);
  }
  //========== Event from menu clicked ============
  function menuEvent(e) {
    // check for controlObj Length
    var _length = 0;
    if (p._shellModel.getPageDataObject().controlObj) {
      p._navController.restoreNext();
      _length = p._shellModel.getPageDataObject().controlObj['o'].length;
    }
    //  if specified values inside controlObj menucontrolObj
    if (_length != 0 && p.actConfig.menucontrolObj[Number(e.menu)] < _length) {
      p._shellModel.setScreenId(p.actConfig.menucontrolObj[Number(e.menu)]);
      var screenId = p._shellModel.getCurrentScreenId();
      var mediaType = p._shellModel.getScreenObj()[screenId].mediaType;
      p._navController.getShellController().sliderShow();
      p._navController.getShellController().loadScreen(screenId, mediaType);
    } else {
      alert('check menucontrolObj, specified value outofIndex of ControlObj.');
    }
  }
  //========== Event from menu clicked ============
  this.destroy_element = function(e, _btnRef) {
    console.log('inside destroy element from menuBrain.js');
    /*  for (var i in p.domObj) {
            $(p.domObj[i]).remove();
        } */
  };
};
