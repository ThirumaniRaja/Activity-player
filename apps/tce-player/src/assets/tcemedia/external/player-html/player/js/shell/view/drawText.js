/* This module is used to draw Text continuously on the screen with the animation.

DOM elements are created on the Fly as per the input JSON and styles are applied.
To use this component please instantiate "DrawText" Class and called the init methods with the below param
	1. contentJson
	2. container
	3. totalframe
	4. iText

1. contentJson = json object which should contain three child object 

(a) dataObj, (b) txtObjContent and (c) txtObj
sample structure are given below :  
{
	"dataObj": {
		"totalFrames": 100
	},
	"txtObjContent" : {
		"txt_12": "<div style='text-align:LEFT; font-family:TISClassEdge; color:#000000; font-size:22px; letter-spacing:0px;'>Sulphonamide group of medicines are effective against many bacterial diseases.</div>",
		"txt_25": "<div style='text-align:CENTER; font-family:TISClassEdge; color:#000000; font-size:24px; letter-spacing:0px;'><span style='font-weight: bold;'>Sulphonamide Group of Medicines</span></div>"
	},
	"txtObj" : {
		"f_1060": {
		  "o": {
			"__id10_0": {
			  "scaleX": 1,
			  "n": "txt_23",
			  "y": 3.65,
			  "scaleY": 1,
			  "o": 0.4453125,
			  "h": 33.75,
			  "l": 0,
			  "w": 346.5,
			  "r": 0,
			  "x": 323.15
			}
		  }
		}
	}
}
2. container : This is the container div id where the text elements would be created.
3. totalframe : Total number of frames available in the animation.
4. iText : This is the Array of text ID reference for instruction text. Use blank array if no iText is there.

Then call Object.drawTextFrame(frameNumber) repetatively through requestAnim frame to draw the text frame wise with the animation.

*/
var DrawText = function(_parentRef) {
  var parentRef = _parentRef;
  var totalFrame = 0;
  var iTextArray = new Array();
  var styleAppliedObj = new Object();
  var iFrameRef, iTextDiv, _ratio, imageDataObj;
  var jsonObj, txtObjUpdated, mainDivElement, context;
  var sourceType;
  var flyingTextObj = {};
  var debugFrameNoEnabled;

  /* ====== Public functions ======== */
  this.init = function(
    contentJson,
    container,
    totFrames,
    iTextObj,
    globalTextAlign,
    _iframe,
    _imageData,
    _srcType,
    _debugFrameNoEnabled
  ) {
    sourceType = _srcType;
    iFrameRef = _iframe;
    imageDataObj = _imageData;
    jsonObj = contentJson;
    mainDivElement = container[0];
    mainDivElement.width = mainDivElement.width * 2;
    mainDivElement.height = mainDivElement.height * 2;
    context = mainDivElement.getContext('2d');
    debugFrameNoEnabled = _debugFrameNoEnabled;

    var devicePixelRatio = window.devicePixelRatio || 1,
      backingStoreRatio =
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;

    _ratio = devicePixelRatio / backingStoreRatio;

    var oldWidth = mainDivElement.width;
    var oldHeight = mainDivElement.height;

    if (!BrowserDetectAdv.any()) {
      mainDivElement.width = oldWidth * _ratio;
      mainDivElement.height = oldHeight * _ratio;
    }
    mainDivElement.style.width = oldWidth / 2 + 'px';
    mainDivElement.style.height = oldHeight / 2 + 'px';

    $(mainDivElement).css({
      position: 'absolute',
      left: '0px !important',
      top: '0px !important'
    });
    EventBus.addEventListener('txtImagesCreated', imageCreated, this);
    totalFrame = totFrames;
    iTextArray = iTextObj.iTextArray;
    iTextDiv = iTextObj.iTxtDivRef;

    manipulateJsonObj();
  };
  //=====================================================================================================
  this.drawTextFrame = function(curIndex, time) {
    if (curIndex <= totalFrame && context) {
      context.clearRect(0, 0, mainDivElement.width, mainDivElement.height);
      if (
        txtObjUpdated['f_' + curIndex] &&
        Object.keys(txtObjUpdated['f_' + curIndex]) &&
        Object.keys(txtObjUpdated['f_' + curIndex].o).length != 0
      ) {
        var _obj = txtObjUpdated['f_' + curIndex].o;
        //
        var _drawSeqArr = new Array();
        var _tempSeqArr = new Array();
        for (var i = Object.keys(_obj).length - 1; i >= 0; i--) {
          var _o = _obj[Object.keys(_obj)[i]];
          if (_o && _o.n != 'null') {
            if (typeof _o.d == 'undefined') {
              _o.d = 0;
            }
            //
            if (!_tempSeqArr[_o.d]) {
              _tempSeqArr[_o.d] = new Array();
            }
            //
            _tempSeqArr[_o.d].push(Object.keys(_obj)[i]);
          }
        }
        //console.log(_tempSeqArr);
        for (var i = 0; i < _tempSeqArr.length; i++) {
          if (_tempSeqArr[i]) {
            for (var j = 0; j < _tempSeqArr[i].length; j++) {
              _drawSeqArr.push(_tempSeqArr[i][j]);
            }
          }
        }
        for (var i = 0; i < _drawSeqArr.length; i++) {
          if (_drawSeqArr[i]) {
            //var currentKey = Object.keys(_obj)[i];
            var currentKey = _drawSeqArr[i];

            var _o = _obj[currentKey];
            if (_o) {
              if (
                sourceType == 'mp4' &&
                txtObjUpdated['f_' + (curIndex + 1)] &&
                txtObjUpdated['f_' + (curIndex + 1)].o[currentKey]
              ) {
                var _prevX =
                  txtObjUpdated['f_' + (curIndex + 1)].o[currentKey].x;
                var _prevY =
                  txtObjUpdated['f_' + (curIndex + 1)].o[currentKey].y;
                // console.log("currentKey " , currentKey , _prevX , txtObjUpdated["f_" + (curIndex)].o[currentKey].x)
                if (
                  Math.abs(
                    parseFloat(_prevX) -
                      parseFloat(txtObjUpdated['f_' + curIndex].o[currentKey].x)
                  ) > 1 ||
                  Math.abs(
                    parseFloat(_prevY) -
                      parseFloat(txtObjUpdated['f_' + curIndex].o[currentKey].y)
                  ) > 1
                ) {
                  // TO FIX TEXT FLYING ISSUE
                  if (
                    flyingTextObj[
                      txtObjUpdated['f_' + curIndex].o[currentKey].ref
                    ] == undefined
                  ) {
                    updateFlyingText(
                      curIndex,
                      currentKey,
                      txtObjUpdated['f_' + curIndex].o[currentKey].ref
                    );
                  }
                }

                if (
                  txtObjUpdated['f_' + (curIndex - 1)] &&
                  txtObjUpdated['f_' + (curIndex - 1)].o[currentKey]
                ) {
                  var _prevO =
                    txtObjUpdated['f_' + (curIndex - 1)].o[currentKey].o;
                  var _curO = txtObjUpdated['f_' + curIndex].o[currentKey].o;
                  var _nextO =
                    txtObjUpdated['f_' + (curIndex + 1)].o[currentKey].o;
                  if (_prevO < _curO && !_nextO) {
                    // TO FIX TEXT BLINK ISSUE
                    continue;
                  }
                }
              }

              if (_o.n != 'null') {
                var CSSObj = applyCss(_o);
                var _img = imageDataObj[_o.ref + '.png']
                  ? imageDataObj[_o.ref + '.png']
                  : imageDataObj[_o.n + '.png'];
                if (_img) {
                  var _scaleX = 1,
                    _scaleY = 1;
                  var boolForScale = false;
                  if (Number(_o.scaleX) != 1) {
                    _scaleX = Number(_o.scaleX);
                    boolForScale = true;
                  }
                  if (Number(_o.scaleY) != 1) {
                    _scaleY = Number(_o.scaleY);
                    boolForScale = true;
                  }
                  context.save();
                  context.globalAlpha = _o.o;
                  if (boolForScale) {
                    var _pos = {
                      x: Number(CSSObj.left) * 2 + Number(CSSObj.width),
                      y: Number(CSSObj.top) * 2 + Number(CSSObj.height)
                    };
                    context.translate(_pos.x, _pos.y); // Move the context to the midpoint of the text
                    context.scale(_scaleX, _scaleY);
                    context.translate(-_pos.x, -_pos.y); // Move the context to the original position
                  }
                  if (Number(_o.r)) {
                    var _pos = {
                      x: Number(CSSObj.left) * 2,
                      y: Number(CSSObj.top) * 2
                    };
                    context.translate(_pos.x, _pos.y); // Move the context to the midpoint of the text
                    context.rotate(_o.r * (Math.PI / 180));
                    context.translate(-_pos.x, -_pos.y); // Move the context to the original position
                  }
                  var _x = CSSObj.left;
                  //context.fillStyle = "rgba(255,0,0,0.5)";
                  //context.fillRect(_x*2,CSSObj.top*2,_img.width, _img.height);
                  //console.log(_o.n, 0, 0, _img.width, _img.height, _x * 2, CSSObj.top * 2, _img.width, _img.height);
                  context.drawImage(
                    _img,
                    0,
                    0,
                    _img.width,
                    _img.height,
                    _x * 2,
                    CSSObj.top * 2,
                    _img.width,
                    _img.height
                  );
                  context.restore();
                }
              }
            }
          }
        }
        //console.log("Govi: ", _temArrGovi);
      }
      if (debugFrameNoEnabled) {
        context.fillStyle = 'rgba(255,0,0,0.5)';
        context.fillRect(50, 30, 150, 45);
        context.fillStyle = 'black';
        context.align = 'right';
        context.font = '35px TISClassEdgeBold';
        context.fillText(curIndex, 65, 65);
      }
    }
  };
  //=====================================================================================================
  function updateFlyingText(_index, _id, _ref) {
    var cn,
      midVal,
      startInd,
      endInd,
      _X,
      _Y,
      _curX,
      _curY,
      _prevX,
      _prevY,
      flyingDuration;
    flyingTextObj[_ref] = new Object();
    flyingTextObj[_ref].startIndex = _index;
    _prevX = txtObjUpdated['f_' + _index].o[_id].x;
    _prevY = txtObjUpdated['f_' + _index].o[_id].y;
    cn = _index + 1;
    flyingDuration = 0;

    while (cn <= totalFrame) {
      if (
        txtObjUpdated['f_' + cn] == undefined ||
        txtObjUpdated['f_' + cn].o == undefined ||
        txtObjUpdated['f_' + cn].o[_id] == undefined
      ) {
        break;
      }
      _curX = txtObjUpdated['f_' + cn].o[_id].x;
      _curY = txtObjUpdated['f_' + cn].o[_id].y;
      txtObjUpdated['f_' + cn].o[_id].o = 0;
      if (_curX == _prevX && _curY == _prevY) {
        break;
      }
      _prevX = _curX;
      _prevY = _curY;
      flyingDuration++;
      cn++;
    }

    midVal = Math.floor(flyingDuration / 2);
    cn = midVal;
    startInd = _index + 1;
    endInd = _index + flyingDuration;
    // console.log(_id, flyingDuration , startInd , endInd)
    while (cn >= 0) {
      txtObjUpdated['f_' + startInd].o[_id].o = cn / midVal;
      txtObjUpdated['f_' + endInd].o[_id].o = cn / midVal;

      // console.log(sourceType , startInd , " : " , (cn/midVal) , "  ::: " , endInd , " : " , (cn/midVal))
      startInd++;
      endInd--;
      cn--;
    }

    startInd = _index + flyingDuration + 1;
    endInd = startInd + 5;
    while (startInd <= endInd) {
      if (
        txtObjUpdated['f_' + startInd] &&
        txtObjUpdated['f_' + startInd].o &&
        txtObjUpdated['f_' + startInd].o[_id]
      )
        txtObjUpdated['f_' + startInd].o[_id].o = 1;
      else break;
      startInd++;
    }
  }
  //=====================================================================================================
  this.clearCanvas = function() {
    context.clearRect(0, 0, mainDivElement.width, mainDivElement.height);
  };
  //=====================================================================================================
  this.destroy = function() {
    flyingTextObj = null;
    jsonObj = null;
    mainDivElement = null;
    txtObjUpdated = null;
    mainDivElement = null;
    totalFrame = null;
    iTextArray = null;
    styleAppliedObj = null;
  };
  /* ====== End Public functions ========*/

  /* ====== Private functions ======== */
  function manipulateJsonObj() {
    //---- dummy iText Object -----//
    var iTextContainer = document.createElement('div');
    console.log("HELLO---iFrameRef--> ",iFrameRef)
    console.log("HELLO---iFrameRef.contentWindow--> ",iFrameRef.contentWindow)
    var iFrameDoc;
    if(iFrameRef.contentWindow !== null)
    {
      iFrameDoc = iFrameRef.contentWindow.document;
      if (iTextArray) {
        for (var iT = 0; iT < iTextArray.length; iT++) {
          var iText = iFrameDoc.createElement('div');
          $(iText).attr('id', iTextArray[iT]);
          $(iText).data('uniqueId', iTextArray[iT]);
          $(iText).css({
            position: 'absolute',
            left: '3px',
            top: '584px',
            width: '990px',
            height: '33.75px'
          });
          $(iText).append(jsonObj.txtObjContent[iTextArray[iT]]);
          $(iTextDiv).append(iText);
        }
      }
    }
    
    
    
    txtObjUpdated = new Object();
    //=== creating blank object with structure //
    for (var i = 1; i <= totalFrame; i++) {
      var obj = new Object();
      obj['o'] = new Object();
      txtObjUpdated['f_' + i] = obj;
    }
    //=== populating values to the modified object ===//
    for (var j = 1; j <= totalFrame; j++) {
      if (txtObjUpdated['f_' + (j - 1)]) {
        var previousoObj = txtObjUpdated['f_' + (j - 1)].o;
        var previousoObjKeys = Object.keys(previousoObj);
        for (var k = 0; k < previousoObjKeys.length; k++) {
          if (!previousoObj[previousoObjKeys[k]].nextItem) {
            txtObjUpdated['f_' + j].o[previousoObjKeys[k]] =
              previousoObj[previousoObjKeys[k]];
          }
        }
      }
      if (jsonObj.txtObj['f_' + j]) {
        var currentObj = jsonObj.txtObj['f_' + j].o;
        var currentoObjKeys = Object.keys(currentObj);
        for (var l = 0; l < currentoObjKeys.length; l++) {
          if (currentObj[currentoObjKeys[l]].n == 'null') {
            for (var k = 0; k < previousoObjKeys.length; k++) {
              if (previousoObjKeys[k] == currentoObjKeys[l]) {
                txtObjUpdated['f_' + j].o[previousoObjKeys[k]].nextItem = true;
              }
            }
          } else {
            txtObjUpdated['f_' + j].o[currentoObjKeys[l]] =
              currentObj[currentoObjKeys[l]];
          }
        }
      }
    }
  }
  //=====================================================================================================
  function applyCss(valueObject) {
    var _o = valueObject;
    // ==== increasing Text width to 10% for Mac === //
    var CSSObj = {
      position: 'absolute',
      top: _o.y - (_o.h * (1 - _o.scaleY)) / 2,
      left: _o.x - (_o.w * (1 - _o.scaleX)) / 2,
      width: _o.w,
      height: _o.h,
      opacity: _o.o,
      transform:
        'rotate(' + _o.r + 'deg) scale(' + _o.scaleX + ',' + _o.scaleY + ')'
    };
    if (jsonObj.dataObj.offsetLeft)
      CSSObj.left = Number(CSSObj.left) + Number(jsonObj.dataObj.offsetLeft);
    if (jsonObj.dataObj.offsetTop)
      CSSObj.top = Number(CSSObj.top) + Number(jsonObj.dataObj.offsetTop);

    return CSSObj;
  }
  //=====================================================================================================
  function imageCreated(e) {
    // console.log(e, "  inside imageCreated in drawText");
    EventBus.dispatch('drawTextReady', this, parentRef);
  }
  /* ======= End Private function ========  */
};
