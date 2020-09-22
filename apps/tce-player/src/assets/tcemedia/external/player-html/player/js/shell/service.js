/* Service Class will work as a bridge between Player and the server. Player will call service layer for the  the data or file url to the service layer and service layer will return the same.
 */
var Service = function(_mediaUrl, _jsPath, _mode) {
  var mediaPath = _mediaUrl;
  var jsonDataLoadStatus, imgDataLoadStatus;
  var pageData, imgData;
  var jsPath = _jsPath;
  var mode = _mode;

  //================================================================================
  this.readPageData = function(jsonName, parentClassRef) {
    jsonDataLoadStatus = '';
    _thisObj = this;
    var path = mediaPath + jsonName;
    var jqxhr = $.getJSON(path, function(jsonData) {
      jsonDataLoadStatus = 'done';
      pageData = jsonData;
      EventBus.dispatch('pageJsonLoaded', this, parentClassRef, pageData);
    })
      .done(function(jsonData) {})
      .fail(function() {
        jsonDataLoadStatus = 'done';
        pageData = null;
        EventBus.dispatch('pageJsonLoaded', this, parentClassRef, pageData);
        console.log('An error occurred while loading JSON file. ' + path);
      });
  };
  //================================================================================
  //================================================================================
  function urlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
  }
  //================================================================================
  //================================================================================
  this.getImageTextFile = function(txtName, parentClassRef) {
    if (urlExists(mediaPath + txtName) == false) {
      imgDataLoadStatus = 'done';
      EventBus.dispatch('imgageTextLoaded', this, parentClassRef, imgData);
      return false;
    }

    $.ajax({
      url: mediaPath + txtName,
      dataType: 'text',
      success: function(data) {
        imgData = data;
        imgDataLoadStatus = 'done';
        EventBus.dispatch('imgageTextLoaded', this, parentClassRef, imgData);
      },
      error: function(_arg) {
        imgDataLoadStatus = 'done';
        EventBus.dispatch('imgageTextLoaded', this, parentClassRef);
      }
    });
  };
  //================================================================================
  this.getImgDataLoadStatus = function() {
    return imgDataLoadStatus;
  };
  //================================================================================
  this.getImgData = function() {
    return imgData;
  };
  //================================================================================
  this.getPageVideoUrl = function(videoName) {
    // Arijit: 16 Oct '17 : filerangeservice/mfs yet to implmented to TCE portal
    //var updatedMediaPath = mediaPath.replace("fileservice","filerangeservice/mfs");
    //var updatedMediaPath = mediaPath;
    // satyajit june 2020 "mode: mdl" removed temporarily as it is a bad request along with fileservice
    //var videoEnc = 'fileservice/' + mode;
    var videoEnc = 'fileservice/';
    var updatedMediaPath = mediaPath.replace('fileservice', videoEnc);
    return updatedMediaPath + videoName;
  };
  //================================================================================
  this.getPageDataLoadStatus = function(status) {
    return jsonDataLoadStatus;
  };
  //================================================================================
  this.getPageData = function(status) {
    return pageData;
  };
  //================================================================================
  this.getPageImageUrl = function(fileName) {
    return mediaPath + fileName;
    alert('getPageImageUrl == ' + mediaPath + fileName);
  };
  //================================================================================
  this.getDependentFileUrl = function(filePath) {
    return mediaPath + filePath;
  };
  //================================================================================
  this.getMediaUrl = function() {
    var _path = mediaPath;
    if (jsPath != '') {
      _path = mediaPath.replace(/ /g, '%20');
    }
    return _path;
  };
  //================================================================================
  this.getJsPath = function() {
    return jsPath;
  };
  //================================================================================
  this.getCommonAssetPath = function() {
    var location = window.location.href;
    if (jsPath != '') {
      location = jsPath;
    }
    return location;
  };
};
