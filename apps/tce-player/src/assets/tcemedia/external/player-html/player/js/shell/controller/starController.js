var StarController = function(shellController, shellModel) {
  var thisRef = this;
  var createHTMLElement = new CreateHTMLElement(this);
  var Model = shellModel;
  var jsonData, docRef, starHolder;
  var starDivArr = [];

  this.init = function(_config, _docRef) {
    jsonData = _config;
    docRef = _docRef;
    starHolder = Model.getStarDivRef();
    createElement();
  };

  function createElement() {
    for (var i = 0; i < jsonData.starData.length; i++) {
      var _curStarData = jsonData.starData[i];
      var _tempSDiv = docRef.createElement('div');
      var image = new Image();
      image.src =
        Model.getMediaPath() +
        (_curStarData.bgImage ? _curStarData.bgImage : jsonData.bgImage);
      $(_tempSDiv).css({
        position: 'absolute',
        left: _curStarData.x,
        top: _curStarData.y,
        width: _curStarData.w ? _curStarData.w : jsonData.w,
        height: _curStarData.h ? _curStarData.h : jsonData.h,
        background: 'url(' + image.src + ')',
        display: 'none'
      });
      starDivArr.push(_tempSDiv);
      $(starHolder).append(_tempSDiv);
    }
  }

  this.hideStars = function() {
    $(starHolder).hide();
  };

  this.showStars = function() {
    $(starHolder).show();
  };

  this.updateStar = function() {
    var pageData = Model.getPageData();
    var _path = Model.getMediaPath();
    var currentScore = 0;

    for (var i = 0; i < starDivArr.length; i++) {
      $(starDivArr[i]).hide();
    }
    if (jsonData) {
      if (jsonData.sequence) {
        var correctPath = new Image();
        var incorrectPath = new Image();
        correctPath.src = _path + jsonData.correct;
        incorrectPath.src = _path + jsonData.incorrect;

        if (pageData.length == 0) {
          for (var i = 1; i <= starDivArr.length; i++) {
            $(starDivArr[i]).css('background', '');
          }
        }
        for (var i = 1, j = 0; i <= pageData.length; i++, j++) {
          if (jsonData.sequence && pageData[i]) {
            if (Number(pageData[i].value) == 1)
              $(starDivArr[j]).css(
                'background',
                'url(' + correctPath.src + ')'
              );
            else
              $(starDivArr[j]).css(
                'background',
                'url(' + incorrectPath.src + ')'
              );
          }
          $(starDivArr[j]).show();
        }
      } else {
        for (var i = 0; i <= pageData.length; i++) {
          if (pageData[i]) {
            if (Number(pageData[i].value) == 1) currentScore++;
          }
        }
        for (var i = 0; i < starDivArr.length; i++) {
          if (!jsonData.sequence && i < currentScore) $(starDivArr[i]).show();
        }
      }
    }
  };
  this.getCount = function() {
    var Score = 0;
    var pageData = Model.getPageData();
    for (var i = 1; i <= pageData.length; i++) {
      if (pageData[i]) {
        if (Number(pageData[i].value) == 1) Score++;
      }
    }
    return Score;
  };
  this.destroy = function() {};
};
