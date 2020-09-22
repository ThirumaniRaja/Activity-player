/* ====== This Module is used to create Annotation functionality.
====== */
var Annotation = function() {
  var canvasRef, canvasCtx;
  var currentCursor = [0, 0];
  var previousCursor = [0, 0];
  var color = '#000000';
  var pencilThickness = 5;
  var operation = '';
  var state = false;
  var toolRef;
  var selectedTool = 'pencil';
  var targetRef, documentRef;
  var panelHolder, togglePanel;
  var isColorSelected = false;
  var content = ['Show', 'Hide'];
  var myToolTip;
  var navCtrlObj;
  var annotationTool;
  var _bool = false;
  var _timeOut;
  //================================================================================
  var p = {
    canvas: '',
    target: 'body'
  };
  //================================================================================
  function createUI() {
    $(canvasRef).css({ display: 'none', left: '0px' });
    panelHolder = documentRef.createElement('div');
    $(panelHolder).attr('id', 'annotation-panel');
    var tempParent = $(documentRef).find(targetRef);

    togglePanel = documentRef.createElement('div');
    $(togglePanel)
      .attr('id', 'annotation-toggle')
      .appendTo(panelHolder)
      .hide();

    if (tempParent.length != 0) {
      $(documentRef)
        .find(targetRef)
        .append(togglePanel);
      $(documentRef)
        .find(targetRef)
        .append(panelHolder);
    } else {
      $(documentRef)
        .find('body')
        .append(togglePanel);
      $(documentRef)
        .find('body')
        .append(panelHolder);
    }

    var toggleBtn = documentRef.createElement('div');
    $(toggleBtn)
      .attr('id', 'annotation-toggleBtn')
      .appendTo(togglePanel)
      .unbind('click')
      .bind('click', onClick);
    var bgDiv = documentRef.createElement('div');
    $(bgDiv)
      .attr('id', 'annotation-message')
      .appendTo(togglePanel)
      .html('Click to hide annotation');

    var bgDiv = documentRef.createElement('div');
    $(bgDiv)
      .attr('id', 'annotation-background')
      .appendTo(panelHolder);
    var bgDiv = documentRef.createElement('div');
    $(bgDiv)
      .attr('id', 'annotation-icon')
      .appendTo(panelHolder)
      .unbind('mouseover')
      .bind('mouseover', onMouseOver)
      .unbind('mouseout')
      .bind('mouseout', onMouseOut)
      .unbind('click')
      .bind('click', onClick);
    $(bgDiv)
      .attr('id', 'annotation-icon')
      .appendTo(panelHolder)
      .unbind('touchstart')
      .bind('touchstart', onTouchStart)
      .unbind('touchend')
      .bind('touchend', onTouchEnd);
    var bgDiv = documentRef.createElement('div');
    $(bgDiv)
      .attr('id', 'annotation-color1')
      .addClass('annotationColorSelectorClass')
      .appendTo(panelHolder)
      .unbind('click')
      .bind('click', onClick);
    var bgDiv = documentRef.createElement('div');
    $(bgDiv)
      .attr('id', 'annotation-color2')
      .addClass('annotationColorSelectorClass')
      .appendTo(panelHolder)
      .unbind('click')
      .bind('click', onClick);
    var bgDiv = documentRef.createElement('div');
    $(bgDiv)
      .attr('id', 'annotation-color3')
      .addClass('annotationColorSelectorClass')
      .appendTo(panelHolder)
      .unbind('click')
      .bind('click', onClick);
    var bgDiv = documentRef.createElement('div');
    $(bgDiv)
      .attr('id', 'annotation-color4')
      .addClass('annotationColorSelectorClass')
      .appendTo(panelHolder)
      .unbind('click')
      .bind('click', onClick);
    var bgDiv = documentRef.createElement('div');
    $(bgDiv)
      .attr('id', 'annotation-seperator1')
      .addClass('annotationSeperatorClass')
      .appendTo(panelHolder)
      .unbind('click')
      .bind('click', onClick);
    var bgDiv = documentRef.createElement('div');
    $(bgDiv)
      .attr('id', 'annotation-seperator2')
      .addClass('annotationSeperatorClass')
      .appendTo(panelHolder)
      .unbind('click')
      .bind('click', onClick);

    annotationTool = documentRef.createElement('div');
    $(annotationTool)
      .attr('id', 'annotation-tool')
      .addClass('eraserClass')
      .appendTo(panelHolder)
      .unbind('click')
      .bind('click', onClick);

    var bgDiv = documentRef.createElement('div');
    $(bgDiv)
      .attr('id', 'annotation-clearAll')
      .appendTo(panelHolder)
      .html('Clear All')
      .unbind('click')
      .bind('click', onClick);

    myToolTip = navCtrlObj.getToolTipRef();
  }
  //================================================================================
  function findxy(res, e) {
    if (res === 'down') {
      currentCursor[0] = e.clientX - canvasRef.offsetLeft;
      currentCursor[1] = e.clientY - canvasRef.offsetTop;
      state = true;
      if (selectedTool === 'pencil') {
        canvasCtx.beginPath();
        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(currentCursor[0], currentCursor[1], 2, 2);
        canvasCtx.closePath();
        dot_flag = false;
      }
      previousCursor[0] = currentCursor[0];
      previousCursor[1] = currentCursor[1];
    }
    if (res === 'up' || res === 'out') {
      state = false;
    }
    if (res === 'move') {
      if (state) {
        e.preventDefault();
        currentCursor[0] =
          (e.clientX !== undefined
            ? e.clientX
            : e.originalEvent.changedTouches[0].pageX) - canvasRef.offsetLeft;
        currentCursor[1] =
          (e.clientY !== undefined
            ? e.clientY
            : e.originalEvent.changedTouches[0].pageY) - canvasRef.offsetTop;
        if (selectedTool === 'eraser') {
          erase();
        } else if (selectedTool === 'pencil') {
          draw();
        }
        previousCursor[0] = currentCursor[0];
        previousCursor[1] = currentCursor[1];
      }
    }
  }
  //================================================================================
  function draw() {
    canvasCtx.beginPath();
    canvasCtx.globalCompositeOperation = 'source-over';
    canvasCtx.moveTo(previousCursor[0], previousCursor[1]);
    canvasCtx.lineTo(currentCursor[0], currentCursor[1]);
    canvasCtx.strokeStyle = color;
    canvasCtx.lineWidth = pencilThickness;
    canvasCtx.lineCap = 'round';
    canvasCtx.stroke();
    canvasCtx.closePath();
  }
  //================================================================================
  function erase() {
    var x = previousCursor[0];
    var y = previousCursor[1];
    canvasCtx.beginPath();
    canvasCtx.globalCompositeOperation = 'destination-out';
    canvasCtx.arc(x, y, 4, 0, Math.PI * 2, false);
    canvasCtx.fill();
    // canvasCtx.closePath();
  }
  //================================================================================
  function onMouseOver(evnt) {
    //alert($(evnt.currentTarget).position().top+$(evnt.currentTarget).parent().position().top)
    var target = evnt.currentTarget;
    var _txt = _bool ? content[1] : content[0];
    //alert(_txt)
    myToolTip.showToolTip(
      $(target)
        .parent()
        .position().top - 5,
      $(target)
        .parent()
        .position().left + 5,
      $(target).width(),
      _txt
    );
  }
  //================================================================================
  function onTouchStart(evnt) {
    //alert($(evnt.currentTarget).position().top+$(evnt.currentTarget).parent().position().top)
    var target = evnt.currentTarget;
    var _txt = _bool ? content[1] : content[0];
    //alert(_txt)
    _timeOut = setTimeout(function() {
      myToolTip.showToolTip(
        $(target)
          .parent()
          .position().top - 5,
        $(target)
          .parent()
          .position().left + 5,
        $(target).width(),
        _txt
      );
    }, 300);
  }
  //================================================================================
  function onMouseOut(evnt) {
    myToolTip.hideToolTip();
  }
  //================================================================================
  function onTouchEnd(evnt) {
    myToolTip.hideToolTip();
  }
  //================================================================================
  function onClick(evnt) {
    clearTimeout(_timeOut);
    myToolTip.hideToolTip();
    var elem = evnt.currentTarget;
    switch ($(elem).attr('id')) {
      case 'annotation-toggleBtn':
        manageAnnotationHolder();
        break;
      case 'annotation-panel':
      case 'annotation-icon':
        manageAnnotationPanel(true);
        break;
      case 'annotation-color1':
        manageAnnotationColor(elem, '#FFCC00');
        break;
      case 'annotation-color2':
        manageAnnotationColor(elem, '#999900');
        break;
      case 'annotation-color3':
        manageAnnotationColor(elem, '#FF6600');
        break;
      case 'annotation-color4':
        manageAnnotationColor(elem, '#CC3300');
        break;
      case 'annotation-tool':
        selectTool(elem);
        break;
      case 'annotation-clearAll':
        clearAll();
        break;
    }
    evnt.stopPropagation();
  }
  //================================================================================
  function displayTooltip(txt, elemRef) {
    if (!elemRef.attr('disabled')) {
      myToolTip.showToolTip(
        elemRef.position().top,
        elemRef.position().left - 2,
        elemRef.width(),
        txt
      );
    }
  }
  //================================================================================
  function manageAnnotationHolder() {
    $(canvasRef).hide();
    $(togglePanel).hide();
    $(panelHolder).hide();
    manageAnnotationPanel();
    //$(anotationPanelRef).hide();
  }
  //================================================================================
  function manageAnnotationPanel(flagFromPanel) {
    var anotationPanelRef = panelHolder;
    myToolTip.hideToolTip();
    if ($(anotationPanelRef).css('left') != '640px' && flagFromPanel) {
      $(anotationPanelRef).animate(
        {
          left: 640
        },
        200,
        'linear',
        function() {
          // annotationTool.activeCanvas();
          _bool = true;
          activeCanvas();
        }
      );
    } else {
      _bool = false;
      deactivateCanvas();
      $(anotationPanelRef).animate(
        {
          left: 928
        },
        200,
        'linear',
        function() {}
      );
    }
  }
  //================================================================================
  function manageAnnotationColor(btnRef, color) {
    if (selectedTool == 'eraser') {
      //selectedTool="pencil";
      $(annotationTool).trigger('click');
      if (BrowserDetectAdv.ie11()) {
        $(canvasRef).addClass('annotationPencilCursorIE');
        $(canvasRef).removeClass('annotationEraserCursorIE');
      } else {
        $(canvasRef).addClass('annotationPencilCursor');
        $(canvasRef).removeClass('annotationEraserCursor');
      }
    }
    $(panelHolder)
      .children()
      .each(function() {
        $(this).removeClass('borderOnColorSelector');
      });
    $(btnRef).addClass('borderOnColorSelector');
    selectColor(color);
    isColorSelected = true;
  }
  //================================================================================
  function selectColor(colorVal) {
    color = colorVal;
  }
  //================================================================================
  function clearAll() {
    canvasCtx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    if (selectedTool == 'eraser') {
      //selectedTool="pencil";
      $(annotationTool).trigger('click');
      if (BrowserDetectAdv.ie11()) {
        $(canvasRef).addClass('annotationPencilCursorIE');
        $(canvasRef).removeClass('annotationEraserCursorIE');
      } else {
        $(canvasRef).addClass('annotationPencilCursor');
        $(canvasRef).removeClass('annotationEraserCursor');
      }
    }
  }
  //================================================================================
  function selectTool(btnRef) {
    if (selectedTool === 'pencil') {
      selectedTool = 'eraser';
      $(btnRef).removeClass('eraserClass');
      $(btnRef).addClass('pencilClass');
      if (BrowserDetectAdv.ie11()) {
        $(canvasRef).removeClass('annotationPencilCursorIE');
        $(canvasRef).addClass('annotationEraserCursorIE');
      } else {
        $(canvasRef).removeClass('annotationPencilCursor');
        $(canvasRef).addClass('annotationEraserCursor');
      }
    } else if (selectedTool === 'eraser') {
      selectedTool = 'pencil';
      $(btnRef).removeClass('pencilClass');
      $(btnRef).addClass('eraserClass');
      if (BrowserDetectAdv.ie11()) {
        $(canvasRef).addClass('annotationPencilCursorIE');
        $(canvasRef).removeClass('annotationEraserCursorIE');
      } else {
        $(canvasRef).addClass('annotationPencilCursor');
        $(canvasRef).removeClass('annotationEraserCursor');
      }
    }
  }
  //================================================================================
  // ==================== ****************      Public function     *******************   =========================//
  this.init = function(_canvasRef, _targetRef, _docRef, _navCtrlRef) {
    targetRef = _targetRef;
    documentRef = _docRef;
    canvasRef = _canvasRef[0];
    navCtrlObj = _navCtrlRef;

    canvasCtx = canvasRef.getContext('2d');
    createUI();

    EventBus.addEventListener('showAnnotationButton', onShowAnnotationButton);
    EventBus.addEventListener('showAnnotationCanvas', onshowAnnotationCanvas);
  };
  //================================================================================
  function onShowAnnotationButton() {}
  //================================================================================
  function onshowAnnotationCanvas() {
    // clearAll();
    //$(canvasRef).show();
    $(panelHolder).show();
    $(togglePanel).hide();
  }
  //================================================================================
  function activeCanvas() {
    if (BrowserDetectAdv.ie11()) {
      $(canvasRef).addClass('annotationPencilCursorIE');
    } else {
      $(canvasRef).addClass('annotationPencilCursor');
    }
    $(canvasRef).css({ display: 'block' });
    $(canvasRef)
      .unbind('mousemove')
      .bind('mousemove', function(e) {
        findxy('move', e);
      });
    $(canvasRef)
      .unbind('mousedown')
      .bind('mousedown', function(e) {
        findxy('down', e);
      });
    $(canvasRef)
      .unbind('mouseup')
      .bind('mouseup', function(e) {
        findxy('up', e);
      });
    $(canvasRef)
      .unbind('mouseout')
      .bind('mouseout', function(e) {
        findxy('out', e);
      });
    $(canvasRef)
      .unbind('touchmove')
      .bind('touchmove', function(e) {
        findxy('move', e);
      });
    $(canvasRef)
      .unbind('touchstart')
      .bind('touchstart', function(e) {
        findxy('down', e);
      });
    $(canvasRef)
      .unbind('touchend')
      .bind('touchend', function(e) {
        findxy('up', e);
      });
  }
  //================================================================================
  function deactivateCanvas() {
    //$(canvasRef).removeClass("annotationPencilCursor");
    //$(canvasRef).removeClass("annotationEraserCursor");
    //$(canvasRef).addClass("annotationDefaultCursor");
    $(canvasRef).css({ display: 'none' });
    $(canvasRef).unbind('mousemove');
    $(canvasRef).unbind('mousedown');
    $(canvasRef).unbind('mouseup');
    $(canvasRef).unbind('mouseout');
    $(canvasRef).unbind('touchmove');
    $(canvasRef).unbind('touchstart');
    $(canvasRef).unbind('touchend');
    state = false;
  }
  //================================================================================
  this.destroy = function() {
    //alert('hi')
    this.deactivateCanvas();
    EventBus.removeEventListener(
      'showAnnotationButton',
      onShowAnnotationButton
    );
    EventBus.removeEventListener(
      'showAnnotationCanvas',
      onshowAnnotationCanvas
    );
    canvasRef = null;
    canvasCtx = null;
    currentCursor = null;
    previousCursor = null;
    color = null;
    pencilThickness = null;
    operation = null;
    state = null;
    toolRef = null;
    selectedTool = null;
    myToolTip = null;
    _timeOut = null;
  };
  // ==================== ************ End Public function ****************  =========================//
};
