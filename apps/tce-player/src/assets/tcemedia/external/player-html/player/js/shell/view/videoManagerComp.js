/* This Module is used for attach video and add listeners to different 
	video related events which is used to control the video. This module has been created in such a way that it could be instantiated by any template of any activity page along with the shell controller.
	initialization would take the below param,
	videoElemId - div element video tag, 
	posterId - div element for poster Image.
	"loadVideo" would be called while video attachment is required. below param should be passed.
	videoSrc - video source path, 
	autoplay - bool, 
	isPosterImage - bool, 
	controls - HTML control display(bool), 
	xPos, yPos, width, height, 
	sliderObj - reference of slider Obj, 
	sliderJsonData - Slider properties if any else blank Object({})
 */
var VideoManagerClass = function(_parentRef) {
  var videoElement;
  var videoEndedStatus = false;
  var videoLoadedStatus = false;
  var videoCanPlayStatus = false;
  var videoPlayStatus = false;
  var videoSeekStatus = false;
  var sliderObjRef;
  var prevSliderObjRef;
  var sliderJson;
  var myInterval;
  var posterElem;
  var posterCanvasContext;
  var img = new Image();
  var parentRef = _parentRef;
  var playBack;
  var endedFn,
    loadedDataFn,
    canPlayFn,
    timeupdateFn,
    pauseFn,
    errorFn,
    playingFn,
    seekedFn;
  var videoPath;

  /* ====== Public functions ========*/
  this.init = function(videoElem, posterElement, _playBack) {
    var _thisRef = this;
    // this.callBackFn = null;
    this.curVideoTime = 0;
    playBack = _playBack;
    this.videoDuration = 0;
    posterElem = posterElement;
    //posterCanvasContext = posterCanvas.getContext('2d');
    videoElement = videoElem[0]; //document.getElementById(videoElem.attr("id"));
    ////console.log("videoElement == "+videoElement.attr("type"));
    addListenerToVideoElement();
  };
  this.loadVideo = function(
    videoSrc,
    autoplay,
    isPosterImage,
    controls,
    xPos,
    yPos,
    width,
    height,
    sliderObj,
    sliderJsonData,
    thumbPath,
    _callBak
  ) {
    videoPath = videoSrc;
    sliderObjRef = sliderObj;
    prevSliderObjRef = sliderObjRef;
    sliderJson = sliderJsonData;
    if (isPosterImage) {
      img.onload = function() {
        posterElem[0].style.backgroundImage = 'url(' + this.src + ')';
        EventBus.dispatch('hideVideoLoader', this, parentRef);
      };
      img.onerror = function() {};
      img.src = thumbPath;
    }
    $(videoElement).css('display', 'block');

    if (xPos && yPos && width && height) {
      setVideoElemPosition(xPos, yPos, width, height);
    }

    ////console.log("video Manager videoPath == "+videoPath);
    var _fExtn = videoSrc.split('.').reverse()[0];
    if (_fExtn.toLowerCase() == 'mp4') {
      if (
        videoElement.canPlayType('video/mp4') == 'maybe' ||
        videoElement.canPlayType('video/mp4') != ''
      ) {
        videoElement.src = videoPath;
        videoElement.type = 'video/mp4';
      } else {
        videoElement.src = videoPath.split('.')[0] + '.webm';
      }
    } else if (_fExtn.toLowerCase() == 'mp3') {
      videoElement.src = videoPath;
      videoElement.type = 'audio/mp3';
    }
    videoElement.preload = 'auto';
    videoElement.loop = false;
    videoElement.addEventListener('loadedmetadata', function() {
      //console.log(videoElement.duration);
    });

    if (controls) {
      videoElement.setAttribute('controls', 'controls');
    } else {
      videoElement.removeAttribute('controls');
    }
    if (autoplay) {
      videoElement.play();
    }
    if (sliderObjRef) {
      sliderObjRef.displaySlider(
        sliderJson.x,
        sliderJson.y,
        sliderJson.width,
        sliderJson.height,
        sliderJson.color
      );
      sliderObjRef.disableSlider();
    }
  };
  this.updateSliderSource = function(_obj) {
    if (_obj) {
      sliderObjRef = _obj;
    } else {
      sliderObjRef = prevSliderObjRef;
    }
  };
  this.updateSrc = function(path) {
    videoElement.src = path;
  };

  this.playVideo = function() {
    if (videoElement) {



    var playPromise = videoElement.play();
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        // Automatic playback started!
        // Show playing UI.
      })
      .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
      });
    }

      //videoElement.play();
      videoPlayStatus = true;
    }
  };

  this.pauseVideo = function() {
    if (videoElement) {
      videoElement.pause();
      videoPlayStatus = false;
    }
  };

  this.stopVideo = function() {
    if (videoElement) {
      videoElement.currentTime = videoElement.duration;
      videoPlayStatus = false;
    }
  };
  this.getVideoPauseStatus = function(fn) {
    return videoElement.paused;
  };
  /*        
		this.setCallBack = function (fn) {
            this.callBackFn = fn;
       }; 
	   */
  this.setVideoCurrentTime = function(num) {
    if (videoElement.currentTime) {
      ////console.log("in setVideoCurrentTime " , num)
      videoElement.currentTime = num;
    }
  };
  this.getVideoCurrentTime = function() {
    if (videoElement.currentTime) {
      return videoElement.currentTime;
    } else {
      return null;
    }
  };
  this.getVideoDuration = function() {
    return videoElement.duration;
  };
  this.getVideoElement = function() {
    return videoElement;
  };
  this.getVideoPlayStatus = function() {
    return videoPlayStatus;
  };
  this.getVideoEndedStatus = function() {
    return videoEndedStatus;
  };
  this.getVideoLoadedStatus = function() {
    return videoLoadedStatus;
  };
  this.getVideoCanPlayStatus = function() {
    return videoCanPlayStatus;
  };
  this.hideVideo = function() {
    videoElement.style.display = 'none';
  };
  this.showVideo = function() {
    videoElement.style.display = 'block';
  };
  this.getVideoSource = function() {
    return videoPath;
  };
  this.destroy = function() {
    videoPath = '';
    removeListenerFromVideoElement();
    videoElement = null;
    videoEndedStatus = null;
    videoLoadedStatus = null;
    videoCanPlayStatus = null;
    videoPlayStatus = null;
    videoSeekStatus = null;
    sliderObjRef = null;
    sliderJson = null;
    myInterval = null;
    posterElem = null;
    posterCanvasContext = null;
    img.src = '';
    img = null;
    parentRef = null;
    playBack = null;
  };
  /* ====== End of Public functions ========*/

  /* ==== Private function ====== */
  function setVideoElemPosition(xPos, yPos, width, height) {
    //var playerVideoTag = videoElement.getAttribute("id");
    $(videoElement).css({
      position: 'absolute',
      display: 'block',
      left: xPos,
      top: yPos,
      width: width + 'px',
      height: height + 'px'
    });
  }
  function checkReadyState() {
    if (videoElement.readyState == 3 || videoElement.readyState == 4) {
      if (BrowserDetectAdv.Android()) {
        setTimeout(function() {
          destroyPoster();
        }, 1400);
      } else if (BrowserDetectAdv.iOS()) {
        setTimeout(function() {
          destroyPoster();
        }, 600);
      } else {
        setTimeout(function() {
          destroyPoster();
        }, 300);
      }
      clearInterval(myInterval);
    }
  }
  function destroyPoster() {
    if (img) {
      img.src = '';
      img = null;
      $(posterElem).remove();
    }
  }
  //===================

  function addListenerToVideoElement() {
    if (videoElement) {
      endedFn = function() {
        //console.log('video ended..')
        //===================Added by sagar FOR IE ,Videopause event not fired
        videoPlayStatus = false;
        //=======================
        videoEndedStatus = true;
        var _time = videoElement.currentTime;
        //console.log(_time, videoElement.duration);
        //currentFrame = Math.ceil((_time * 1000)/((1 / 24) * 1000));
        EventBus.dispatch('videoEnd', this, parentRef);
      };
      videoElement.addEventListener('ended', endedFn, false);
      loadedDataFn = function() {
        //if(BrowserDetectAdv.Android())  {
        if (!videoLoadedStatus) {
          EventBus.dispatch('videoDataLoaded', this, parentRef);
        }
        //}else {

        //}
        videoLoadedStatus = true;
        //EventBus.dispatch("videoDataLoaded", this, parentRef);
      };
      videoElement.addEventListener('loadeddata', loadedDataFn, false);
      canPlayFn = function() {
        /* 				
				// in IE this will call once initially when video loads and can play state but not when slider is drag and streaming is done a	
				//alert("can play");				
				setTimeout(function(){ 
					 $(".textWrapperDivCls").show();
					 preloaderObj.hideLoader(); 
				 }, 250); */
        videoCanPlayStatus = true;
      };
      videoElement.addEventListener('canplay', canPlayFn, false);

      timeupdateFn = function() {
        if (sliderObjRef && videoPlayStatus) {
          sliderObjRef.updateSlider(videoElement.currentTime);
        }
        if (playBack) {
          playBack(videoElement.currentTime);
        }
      };
      videoElement.addEventListener('timeupdate', timeupdateFn, false);

      pauseFn = function() {
        videoPlayStatus = false;
        EventBus.dispatch('videoPaused', this, parentRef);
      };
      videoElement.addEventListener('pause', pauseFn, false);

      errorFn = function(e) {
        errorType = '';
        switch (e.target.error.code) {
          case 1:
            errorType = 'MEDIA_ERR_ABORTED';
            break;
          case 2:
            errorType = 'MEDIA_ERR_NETWORK';
            break;
          case 3:
            errorType = 'MEDIA_ERR_DECODE';
            break;
          case 4:
            errorType = 'MEDIA_ERR_SRC_NOT_SUPPORTED';
            break;
        }
        //alert("Error loading Video. Error code ="+errorType);
        videoElement.play();
        //console.log("Error loading vodeo file error code =="+errorType);
      };
      videoElement.addEventListener('error', errorFn, false);

      playingFn = function() {
        videoPlayStatus = true;
        videoSeekStatus = false;
        videoEndedStatus = false;
        if (sliderObjRef) {
          sliderObjRef.enableSlider();
        }
        myInterval = setInterval(function() {
          checkReadyState();
        }, 100);
        //alert(videoElement.readyState);
        //setTimeout(function(){ $("#"+posterElemId).hide(); }, 300);
        EventBus.dispatch('videoPlaying', this, parentRef);
        /* 
				// ==== Listener implementation to be added in navController Class === //
				function videoPlayingStarted() {
					Model.setIsPauseAtStepPoint(false);
					//$('#activityPage').empty();
					this.updatePlayPauseState(true, false);
					// for Step Animation Reset button is enabled.
					if(Model.getPageDataObject().dataObj.stepPoint.length>0){
						enableReplay(true);
					} 
				}; 
					EventBus.addEventListener("videoPlaying", videoPlayingStarted, this);
				*/
      };
      videoElement.addEventListener('playing', playingFn, false);

      seekedFn = function() {
        videoSeekStatus = true;
        EventBus.dispatch('videoSeeked', this, parentRef);
        /*
				// ==== Listener implementation to be added in class which instantiate the slider === //
				function videoSeekSuccess() {
				if(BrowserDetectAdv.iOS()) {
					setTimeout(function(){ 
					preloaderObj.hideLoader();
					textDivRef.show();
					}, 800); 
				}else{
					 preloaderObj.hideLoader();
					 textDivRef.show();
				}
				}
				EventBus.addEventListener("videoSeeked", videoSeekSuccess, this);
				*/
      };
      videoElement.addEventListener('seeked', seekedFn, false);
    }
  }
  //==============

  function removeListenerFromVideoElement() {
    if (videoElement) {
      videoElement.removeEventListener('ended', endedFn, false);
      videoElement.removeEventListener('loadeddata', loadedDataFn, false);
      videoElement.removeEventListener('canplay', canPlayFn, false);
      videoElement.removeEventListener('timeupdate', timeupdateFn, false);
      videoElement.removeEventListener('pause', pauseFn, false);
      videoElement.removeEventListener('error', errorFn, false);
      videoElement.removeEventListener('playing', playingFn, false);
      videoElement.removeEventListener('seeked', seekedFn, false);
    }
  }
  /* ==== End of Private function ====== */
};
