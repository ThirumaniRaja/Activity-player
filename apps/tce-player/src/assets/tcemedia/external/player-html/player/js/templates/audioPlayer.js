var AudioPlayerNormalClass = function() {
  // Default starts ...
  var obj = {};
  // Default ends ...
  var _thisObj = this;
  var interval_obj = new GlobalAnimClass();
  var audioObj;
  var callBack;
  var errorCallback;
  var playcallback;
  var isAudioPlaying = false;
  var sliderRef = null;
  var isiPad = BrowserDetectAdv.anyDevice();

  //audioObj.addEventListener("timeupdate", timeUpdate);
  EventBus.addEventListener('activityAudioStop', stopAudio);

  function audioLoad(e) {
    if (obj.audioLoaded) {
      obj.audioLoaded(e);
    }
  }
  this.addEventListener = function(_evt, _fun) {
    obj[_evt] = _fun;
  };
  this.removeEventListener = function(_evt, _fun) {
    obj[_evt] = '';
  };

  function stopAudio(e) {
    if (audioObj) {
      audioObj.pause();
      audioObj.src = '';
    }
  }

  //================================================================================
  // PUBLIC FUNCTIONS
  //================================================================================
  this.stop = function() {
    isAudioPlaying = false;
    if (audioObj) {
      audioObj.pause();
      interval_obj.stop('audioCheck');
    }
  };

  this.pauseAudio = function() {
    interval_obj.stop('audioCheck');
    if (audioObj) {
      audioObj.pause();
      isAudioPlaying = false;
    }
  };

  this.loadaudio = function(_path) {
    audioObj.src = '';
    audioObj.load();
    audioObj.src = _path;
  };

  this.play = function() {
    audioObj.play();
    startPlayBack();
    isAudioPlaying = true;
  };

  this.setAudioCurrentTime = function(num) {
    if (audioObj.currentTime) {
      audioObj.currentTime = num;
      audioObj.play();
      isAudioPlaying = true;
      startPlayBack();
    }
  };
  //================================================================================

  function startPlayBack() {
    interval_obj.start({
      id: 'audioCheck',
      fps: 24,
      frame: function() {
        if (audioObj) {
          if (audioObj.currentTime > 0.1) {
            if (playcallback != null) {
              playcallback(audioObj.currentTime);
              if (sliderRef) {
                sliderRef.updateSlider(audioObj.currentTime);
              }
            }
          }
        }
        //timeUpdate();
      }
    });
  }

  this.playAudio = function(_path, _cb, _loop, _volume, _errCb, _playcb) {
    if (audioObj) {
      audioObj = null;
    }
    audioObj = new Audio();
    //===========================
    audioObj.type = 'audio/mpeg';
    //===========================
    audioObj.addEventListener('error', onError);
    audioObj.addEventListener('ended', onEnded);
    isAudioPlaying = true;
    callBack = null;
    errorCallback = null;
    playcallback = null;
    audioObj.pause();
    audioObj.src = '';
    audioObj.load();
    if (typeof _playcb != 'undefined') {
      playcallback = _playcb;
    }
    interval_obj.stop('audioCheck');
    if (typeof _errCb != 'undefined') {
      errorCallback = _errCb;
    }

    callBack = _cb;
    //-------
    if (_loop && _loop != null) {
      audioObj.loop = true;
    } else {
      audioObj.loop = false;
    }

    //-------
    if (typeof _volume != 'undefined' && _volume != null) {
      audioObj.volume = _volume;
    } else {
      audioObj.volume = 1;
    }
    //-------
    audioObj.src = _path;

    audioObj.play();
    startPlayBack();

    audioObj.onloadeddata = function() {
      audioLoad(_path);
    };
  };
  //================================================================================
  this.isPlaying = function() {
    return isAudioPlaying;
  };
  //================================================================================
  this.getTime = function() {
    return audioObj.currentTime;
  };
  this.setSliderObj = function(_obj) {
    sliderRef = _obj;
  };
  //================================================================================
  // PRIVATE FUNCTIONS
  //================================================================================
  function onEnded() {
    isAudioPlaying = false;
    interval_obj.stop('audioCheck');

    if (callBack) {
      callBack();
    }
  }
  //================================================================================
  function timeUpdate(e) {
    if (audioObj.currentTime >= audioObj.duration) {
      isAudioPlaying = false;
      interval_obj.stop('audioCheck');
      if (callBack) {
        callBack();
      }
    }
  }
  //================================================================================
  function onError() {
    isAudioPlaying = false;
    //console.log("audioObj.onError");
    if (errorCallback) {
      errorCallback();
    }
  }
  //================================================================================
};
