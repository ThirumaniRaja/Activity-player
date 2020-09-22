// JavaScript Document
var PLAY = 'Play';
var PAUSE = 'Pause';

var ispringPresentationConnector = {};
var playbackController;
var presentation;

var replayBtn;
var prevBtn;
var playBtn;
var pauseBtn;
var nextBtn;
var nextBtnHL;
var playAgainBtn;

var myToolTip;
var customToolTipDiv;
var customToolTipArrowDiv;

var slidesCount;
var isPlayedPresentation;

ispringPresentationConnector.register = function(player) {
  replayBtn = document.getElementById('nav-replayButton');
  prevBtn = document.getElementById('nav-backButton');
  playBtn = document.getElementById('nav-playButton');
  pauseBtn = document.getElementById('nav-pauseButton');
  nextBtn = document.getElementById('nav-nextButton');
  nextBtnHL = document.getElementById('nav-nextButtonHighlight');
  playAgainBtn = document.getElementById('nav-playAgainButton');
  customToolTipDiv = document.getElementById('customToolTip');
  customToolTipArrowDiv = document.getElementById('toolTipArrow');

  myToolTip = new ToolTip(customToolTipDiv, customToolTipArrowDiv);
  console.log(myToolTip);

  //timeLabel = document.getElementById("time");
  //slideIndexLabel = document.getElementById("slideIndex");

  presentation = player.presentation();
  slidesCount = presentation.slides().count();
  playbackController = player.view().playbackController();

  changePlayPauseBtnState(
    presentation
      .settings()
      .playback()
      .autoStart()
  );
  initPlaybackControllerEventsHandlers();
  initButtonsEventsHandlers();
};

function changePlayPauseBtnState(isPlayed) {
  if (isPlayedPresentation == isPlayed) {
    return;
  }

  isPlayedPresentation = isPlayed;
  //playPauseBtn.innerHTML = (isPlayedPresentation) ? PAUSE : PLAY;
}

function initPlaybackControllerEventsHandlers() {
  playbackController.slideChangeEvent().addHandler(function(slideIndex) {
    pauseBtn.style.opacity = 1;
    pauseBtn.style.cursor = 'pointer';
    playAgainBtn.style.display = 'none';

    switch (slideIndex) {
      case 1:
        prevBtn.style.opacity = 1;
        prevBtn.style.cursor = 'pointer';
        break;
      case 0:
        prevBtn.style.opacity = 0.5;
        prevBtn.style.cursor = 'default';
        myToolTip.hideToolTip();
        break;
      case slidesCount - 1:
        nextBtn.style.opacity = 0.5;
        nextBtn.style.cursor = 'default';
        myToolTip.hideToolTip();
        break;
      case slidesCount - 2:
        nextBtn.style.opacity = 1;
        nextBtn.style.cursor = 'pointer';
        break;
    }
    //slideIndexLabel.innerHTML = "Slide: " + (slideIndex + 1) + " of " + slidesCount;
  });

  /*playbackController.clock().tickEvent().addHandler(function(clock) {
	var prevTimeLabel = timeLabel.innerHTML;
		var timeOffset = clock.timestamp().timeOffset();
		var minutes = Math.floor(timeOffset / 60);
		var seconds = Math.round(timeOffset % 60);

		timeLabel.innerHTML = (minutes < 10) ? "0" + minutes : minutes;
		timeLabel.innerHTML += ":";
		timeLabel.innerHTML += (seconds < 10) ? "0" + seconds : seconds;
	});*/

  playbackController
    .clock()
    .stateChangeEvent()
    .addHandler(function(theClock) {
      if (theClock.state() == 'suspended') {
        //playPauseBtn.innerHTML = PLAY;
        pauseBtn.style.opacity = 0.5;
        pauseBtn.style.cursor = 'default';
        myToolTip.hideToolTip();
        isPlayedPresentation = !isPlayedPresentation;

        if (playbackController.currentSlideIndex() == slidesCount - 1) {
          this.top.tcePlayerOnMediaEnded();
          playAgainBtn.style.display = 'block';
        } else {
          nextBtnHL.style.display = 'block';
        }
      }
    });
}

function initButtonsEventsHandlers() {
  prevBtn.onclick = function() {
    if (prevBtn.style.opacity == 1) {
      playbackController.gotoPreviousSlide();
      changePlayPauseBtnState(true);
    }
  };

  pauseBtn.onclick = function() {
    if (pauseBtn.style.opacity == 1) {
      playbackController.pause();
      pauseBtn.style.display = 'none';
      playBtn.style.display = 'block';
      isPlayedPresentation = !isPlayedPresentation;
    }
  };

  playBtn.onclick = function() {
    playbackController.play();
    pauseBtn.style.display = 'block';
    playBtn.style.display = 'none';
    isPlayedPresentation = !isPlayedPresentation;
  };

  nextBtn.onclick = function() {
    if (nextBtn.style.opacity == 1) {
      playbackController.gotoNextSlide();
      changePlayPauseBtnState(true);
    }
  };

  nextBtnHL.onclick = function() {
    nextBtnHL.style.display = 'none';
    playbackController.gotoNextSlide();
    changePlayPauseBtnState(true);
  };

  replayBtn.onclick = function() {
    playbackController.gotoSlide(playbackController.currentSlideIndex());
    pauseBtn.style.opacity = 1;
    pauseBtn.style.cursor = 'pointer';
    nextBtnHL.style.display = 'none';
    changePlayPauseBtnState(true);
  };

  playAgainBtn.onclick = function() {
    playbackController.gotoSlide(0);
    nextBtn.style.opacity = 1;
    nextBtn.style.cursor = 'pointer';
    changePlayPauseBtnState(true);
  };

  addToolTipEvent(prevBtn);
  addToolTipEvent(pauseBtn);
  addToolTipEvent(playBtn);
  addToolTipEvent(nextBtn);
  addToolTipEvent(nextBtnHL);
  addToolTipEvent(replayBtn);
}

function addToolTipEvent(btn) {
  $(btn)
    .mouseover(function() {
      if (btn.style.cursor == 'pointer') {
        myToolTip.showToolTip(
          $(this).position().top,
          $(this).position().left - 2,
          $(this).width(),
          $(this).attr('tooltip')
        );
      }
    })
    .mouseout(function() {
      myToolTip.hideToolTip();
    });
}

this.externalPause = function() {
  this.getNavigationController().pause();
};
