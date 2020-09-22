/* ====== This Module is the shell view of the Player, used to generate DOM elements, takes help from the other view to display the media	*/

var ShellView = function() {
  var shellControllerObj = new ShellController(this);
  var createHTMLElementObj;
  var mainContainer;
  var totalElementsCount = 0;
  var currentElementCount = 0;
  var domRefArray;
  var serviceObj;

  /* ----- Public Methods ----- */
  this.init = function(
    _serviceObj,
    _container,
    _pageJsonName,
    _pageVideoName,
    _thumbImageName,
    _iframe,
    _jsPath
  ) {
    serviceObj = _serviceObj;
    domRefArray = new Array();
    mainContainer = _container;
    shellControllerObj.init(
      serviceObj,
      mainContainer,
      _pageJsonName,
      _pageVideoName,
      _thumbImageName,
      _iframe,
      _jsPath
    );
  };
  this.generateDomElement = function(jsonData, mediaId) {
    createHTMLElementObj = new CreateHTMLElement(this);
    var currentDomElements = new Array();
    for (var i = 0; i < jsonData.mediaType.length; i++) {
      if (jsonData.mediaType[i].media == mediaId) {
        currentDomElements = jsonData.mediaType[i].domElements;
      }
    }
    for (var c = 0; c < currentDomElements.length; c++) {
      var tempJson = jsonData[currentDomElements[c]];
      countTotalElements(tempJson);
    }
    var totalMainElements = currentDomElements.length;
    for (var j = 0; j < totalMainElements; j++) {
      var firstLevelJson = jsonData[currentDomElements[j]];
      var currentNodeOne = createHTMLElementObj.createNewElement(
        mainContainer,
        firstLevelJson
      );
      if (firstLevelJson.subelements) {
        for (var k in firstLevelJson.subelements) {
          var currentNodeTwo = createHTMLElementObj.createNewElement(
            currentNodeOne,
            firstLevelJson.subelements[k]
          );
          var secondLevelJson = firstLevelJson.subelements[k];
          if (secondLevelJson.subelements) {
            for (var l in secondLevelJson.subelements) {
              var currentNodeThree = createHTMLElementObj.createNewElement(
                currentNodeTwo,
                secondLevelJson.subelements[l]
              );
            }
          }
        }
      }
    }
  };
  this.updateLoadingStatus = function(aBool, refDom) {
    if (aBool) {
      currentElementCount++;
      domRefArray.push(refDom);
    }
    if (currentElementCount == totalElementsCount) {
      shellControllerObj.loadStatus('PlayerElementCreated', domRefArray);
    }
  };
  this.getShellController = function() {
    return shellControllerObj;
  };
  this.destroyPlayer = function() {
    createHTMLElementObj = null;
    mainContainer = null;
    totalElementsCount = null;
    currentElementCount = null;
    domRefArray = null;
    serviceObj = null;
    shellControllerObj.destroy();
    shellControllerObj = null;
  };
  this.getNavController = function() {
    return shellControllerObj.getNavController();
  };
  this.getCreationStatus = function() {
    return shellControllerObj.getPlayerCreationStatus();
  };
  /* ----- End of Public Methods ----- */

  /* ----- Private Methods ----- */

  function countTotalElements(_element) {
    totalElementsCount++;
    if (_element.subelements) {
      for (var j in _element.subelements) {
        totalElementsCount++;
        if (_element.subelements[j].subelements) {
          for (var k in _element.subelements[j].subelements) {
            totalElementsCount++;
          }
        }
      }
    }
  }
  /* ----- End of Private Methods ----- */
};
