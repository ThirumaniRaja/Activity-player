var brain = function() {
  var _interactiveAnimationObj;

  var _tabArr = [];

  this.init = function(_wrapper) {
    _tabArr = [];
    var _act = new CreateActivityPage();
    var configData = Model.getActivityConfig();
    _act.init({
      target: '#' + _wrapper,
      url: configData.template_config.launchFile
    });

    var _param = configData.param;

    document.addEventListener('activityPageReady', function(e) {
      for (var i in _param) {
        _tabArr[i] = new InteractiveAnimation();
        _param[i].data = e.data;
        _tabArr[i].init(_param[i]);
        _tabArr[i].addEventListener('onClick', onClick);
      }
    });
  };

  function onClick(e) {
    for (var i in _tabArr) {
      if (i != e.target) {
        _tabArr[i].enableMe();
      }
    }
  }
};
