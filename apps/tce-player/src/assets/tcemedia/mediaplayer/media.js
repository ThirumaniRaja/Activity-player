var isMediaEneded = false;
var isAllMediaPaused = false;
var Media = function() {
  var self = this;
  //tce player
  self.mediaTop = 20;
  self.mediaLeft = 20;
  self.mediaTopZ = 0;
  self.shapeCount = 0;
  self.init = function() {
    //self.createMediaList();
    //self.zoomer(380);
  };


  self.pauseAllMedia = function (){

    for(var i = 0; i < tcePlayerInstanceArr.length; i++){
      //tcePlayerInstanceArr[i].externalPause();
      if(!tcePlayerInstanceArr[i].playerIsPaused()){
        tcePlayerInstanceArr[i].externalPause();

      }

      //tcePlayerInstanceArr[i].externalStop();
    }

  }
  self.setPlayerSizeData = function() {
    if (tcePlayerInstanceArr.length > 0  && tcePlayerInstanceArr[tcePlayerInstanceArr.length - 1].resizeWindowObj) {
      console.log("RESIZE - WINDOW - MEDIA")
      //tcePlayerInstanceArr[tcePlayerInstanceArr.length-1].resizeWindowObj.externalData = externalData;
      tcePlayerInstanceArr[tcePlayerInstanceArr.length - 1].resizeWindowObj.onResize();
    }
  };
};

function tcePlayerReSize() {
  console.log("IN---tcePlayerReSize")
  media = new Media();
  const a = setInterval(function(){
    if(media !== null){
      media.setPlayerSizeData();
    }

    clearInterval(a);
  }, 200);

}

function stopAllTCEMedia(){
  media = new Media();
  if(media !== null){
    media.pauseAllMedia();
  }
}

function tcePlayerOnMediaEnded(){
  isMediaEneded = true;
  tceVideoPlayerRef.tcePlayerOnMediaEnded("end");
}

function tcePlayerReplay(providedIframe){
  var iframeRef = null;
  if (providedIframe) {
    iframeRef = providedIframe;
  } else {
    var foundIframe = document.getElementsByTagName('iframe');
    iframeRef = document.getElementById(foundIframe[0].id);
  }
  var elmnt = iframeRef.contentWindow.document.getElementById('nav-playAgainButton');
  elmnt.click();

}

var tceVideoPlayerRef;
