//************************************************//
//        Drag and Drop Type1                     //
//************************************************//

var dnd1 = function() {
  var _dnd;
  var feedBackObj;
  var domObj, _param;
  var shellModel, navController;
  var _act;
  this.init = function(_wrapper, _shellModel, _navController) {
    shellModel = _shellModel;
    navController = _navController;
    _act = new CreateActivityPage();
    var configData = shellModel.getActivityConfig();
    _act.init({
      target: _wrapper,
      url: _shellModel.getMediaPath() + configData.template_config.launchFile,
      shellModel: _shellModel
    });
    _dnd = new dragAndDrop();
    _param = configData.param;
    _param['_shellModel'] = _shellModel;
    _param['_navController'] = _navController;
    _param['_wrapper'] = _wrapper;
    EventBus.addEventListener('activityPageReady', onPageReady, this);
    EventBus.addEventListener('activityAudioStop', removeDomObj, this);
  };
  function onPageReady(_event, _domObj, _parentRef) {
    if (_parentRef === _act) {
      domObj = _domObj;
      _param.domObj = domObj;
      _dnd.init(_param);
      var fbparam = {};
      fbparam.domObj = domObj;
      _dnd.addEventListener('feedBack', showFeedbback);
      feedBackObj = new feedBackClass();
      feedBackObj.init(fbparam);
      feedBackObj.addEventListener('feedBackComplete', goBackMain);
    }
  }
  function removeDomObj() {
    feedBackObj.stopAll(); // stop all current audio's
    _dnd.removeAll();
    document.removeEventListener('activityPageReady', onPageReady);
    delete _dnd;
    delete feedBackObj;
    delete domObj;
  }
  function showFeedbback(e) {
    e.playBack = onPlayBack;
    feedBackObj.handleFeedBack(e);
    if (_param._customFb) {
      onFeedbackActFn({
        e: e,
        domObj: domObj
      });
    }
  }
  function onPlayBack(e) {
    if (_param._customFb && onPlayBackActFn) {
      onPlayBackActFn(e);
    }
  }
  function goBackMain(e) {
    if (_param._customFb && onPlayBackActFn) {
      onPlayBackActFn({ e: e, stop: 'stop' });
    }
    _dnd.onFeedBackCompleted(e);
  }
};
/*
var dnd1 = function()
{
	var _dnd;
	var feedBackObj;
	var domObj , _param;
	this.init = function (_wrapper)
	{
		var _act = new CreateActivityPage();
		var configData = Model.getActivityConfig();
		_act.init({target:_wrapper , url: _shellModel.getMediaPath() + configData.template_config.launchFile , shellModel:_shellModel});
		_dnd = new dragAndDrop();	
		_param=configData.param;
		_param['_wrapper'] = _wrapper;
		document.addEventListener('activityPageReady', onPageReady);
		document.addEventListener('activityAudioStop', function(e){
				// audioObj.stop();
				removeDomObj();
		});	
	}
	function onPageReady(e)
	{
		_param.domObj = e.domObj;
		domObj = e.domObj;
		_dnd.init(_param);
		var fbparam={};
		fbparam.domObj = e.domObj;
		_dnd.addEventListener("feedBack",showFeedbback);
		feedBackObj = new feedBackClass();
		feedBackObj.init(fbparam);
		feedBackObj.addEventListener("feedBackComplete",goBackMain)
	}
	
		
}*/
