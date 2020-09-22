/*
 * DND Component - III (horizontal-vertical)
 * Developed by: Sagar More
 * Start date: 07-10-2010
 */

var DragAndDropHorVer = function() {
  /*Inspectable Variables
   */
  'use strict';
  var p = {
    _dragItemsArr: [],
    _dropItemsArr: [],
    _correctAnswers: [],
    _noOfAttempts: 0, //0:infinite
    _allDropped: false,
    _customFnCall: 'showAnime',
    _validationMethod: 'Individual', //Individual or group
    _visualFBMc: 'tick_Mc',
    _feedbackMc: 'feedbackMc',
    _solutionBtn: 'sort',
    _validateBtn: 'done',
    _boundRect: [],
    _maxDropCount: 3, //1
    _dropPosition: 'Vertical',
    _positionOffset: 25, //3
    _resetBtn: '',
    _imgObj: {},

    //object from CreateActivityPage
    domObj: new Object()
  };
  /*
	Class variables
	*/
  var dragObj = {};
  var dropObj = {};
  var attemptCnt = 0;
  var visFeedbackMC = '';
  var fbMC = null;
  var submitMC = null;
  var solutionMC = null;
  var resetMC = null;
  var boundingRect = [];
  var rootRef = null;
  var allCorrect = false;
  var allCorrect = false;
  var audioObj = new AudioPlayerNormalClass();

  /*
   * init() method
   * initialize variables and set properties.
   */
  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    attemptCnt = 1;
    //boundingRect = new Rectangle(Number(p._boundRect[0]), Number(p._boundRect[1]), Number(p._boundRect[2]), Number(p._boundRect[3]));
    if (p._feedbackMc != '') {
      fbMC = p._feedbackMc;
    }
    if (p._visualFBMc != '') {
      visFeedbackMC = p._visualFBMc;
    }
    if (p._validateBtn != '') {
      submitMC = p.domObj[p._validateBtn];
      //submitMC.mouseChildren = false;
      enableDisableSubmit(false);
    }
    if (p._solutionBtn != '') {
      solutionMC = p.domObj[p._solutionBtn];
      //solutionMC.mouseChildren = false;
      enableDisableSolution(false);
    }
    if (p._resetBtn != '') {
      resetMC = p.domObj[p._resetBtn];
      //resetMC.mouseChildren = false;
      enableDisableReset(false);
    }
    for (var i = 0; i < p._dropItemsArr.length; i++) {
      dropObj[p._dropItemsArr[i]] = {};
      dropObj[p._dropItemsArr[i]].dropId = p._dropItemsArr[i];
      dropObj[p._dropItemsArr[i]].id = i + 1;
      dropObj[p._dropItemsArr[i]].occupied = false;
      dropObj[p._dropItemsArr[i]].itemsDropped = [];
      dropObj[p._dropItemsArr[i]].occupiedBy = null;
    }
    configureListeners();
  };
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  this.onFeedBackCompleted = function(e) {
    if (e.status == 'incorrect') {
      enableDisableSolution(true);
      //showCorrectAnswer();
      //resetIncorrectItems();
      //$(p.domObj[_audio]).hide();
    }
    if (e.status == 'correct') {
      enableDisableSolution(false);
      enableDisableSubmit(false);
    }
  };
  /*
   * Configure listeners for drag items and set its properties
   */
  function configureListeners() {
    for (var i = 0; i < p._dragItemsArr.length; i++) {
      dragObj[p._dragItemsArr[i]] = {};
      dragObj[p._dragItemsArr[i]].dragId = p._dragItemsArr[i];
      dragObj[p._dragItemsArr[i]].id = i + 1;
      dragObj[p._dragItemsArr[i]].droppedOn = '';
      dragObj[p._dragItemsArr[i]].buttonMode = true;
      dragObj[p._dragItemsArr[i]].mouseChildren = false;
      dragObj[p._dragItemsArr[i]].origX = parseFloat(
        $('#' + p._dragItemsArr[i]).css('left')
      );
      dragObj[p._dragItemsArr[i]].origY = parseFloat(
        $('#' + p._dragItemsArr[i]).css('top')
      );
      $(p.domObj[p._dragItemsArr[i]])
        .unbind('mousedown mouseup mousemove mouseout', dragListener)
        .bind('mousedown mouseup mousemove mouseout', dragListener);
    }
  }

  /*
   * method for start/stop drag
   * @param	e
   */
  var currentID, offsetX, offsetY, initalX, initalY;
  var eventBool = true;
  function dragListener(e) {
    switch (e.type) {
      case 'mousedown':
      case 'touchstart':
        currentID = e.target.id;
        $(document)
          .unbind('mousemove touchmove mouseup', dragListener)
          .bind('mousemove touchmove mouseup', dragListener);
        $(p.domObj[currentID])
          .unbind('mousemove touchmove mouseup', dragListener)
          .bind('mousemove touchmove mouseup', dragListener);
        //initalX = parseFloat($("#"+currentID).css("left"))
        //initalY = parseFloat($("#"+currentID).css("top"))
        if (e.type == 'touchstart') {
          e.pageX = e.originalEvent.changedTouches[0].pageX;
          e.pageY = e.originalEvent.changedTouches[0].pageY;
          e.preventDefault();
        }
        offsetX = e.pageX - $(p.domObj[currentID]).offset().left;
        offsetY = e.pageY - $(p.domObj[currentID]).offset().top;
        gotoAndStopDrag(currentID, '_down');
        if (dragObj[currentID].droppedOn) {
          for (
            var i = 0;
            i < dropObj[dragObj[currentID].droppedOn].itemsDropped.length;
            i++
          ) {
            if (
              dropObj[dragObj[currentID].droppedOn].itemsDropped[i] == currentID
            ) {
              dropObj[dragObj[currentID].droppedOn].itemsDropped.splice(i, 1);
              break;
            }
          }
          dropObj[dragObj[currentID].droppedOn].occupied = false;
          dropObj[dragObj[currentID].droppedOn].occupiedBy = null;
          rearrangeDroppedItems(dragObj[currentID].droppedOn);
          dragObj[currentID].droppedOn = null;
        }
        break;

      case 'mouseup':
      case 'touchend':
        $(document).unbind('mousemove touchmove mouseup', dragListener);
        if (currentID) {
          var tempID = currentID;
          gotoAndStopDrag(tempID, '_up');
          $(p.domObj[tempID]).unbind(
            'mousemove touchmove mouseup',
            dragListener
          );
          checkHit(tempID);
          $(p.domObj[tempID]).css({ 'z-index': '1' });
        }
        currentID = '';
        break;
      case 'mousemove':
      case 'touchmove':
        if (currentID) {
          if (e.type == 'touchmove') {
            e.pageX = e.originalEvent.changedTouches[0].pageX;
            e.pageY = e.originalEvent.changedTouches[0].pageY;
          }
          var mouseX = e.pageX - offsetX;
          var mouseY = e.pageY - offsetY;

          //var win = windowLimit(mouseX, mouseY)
          $(p.domObj[currentID]).css({
            //"left":win.x+"px",
            left: mouseX + 'px',
            //"top":win.y+"px",
            top: mouseY + 'px',
            'z-index': '2',
            cursor: 'default'
          });
          gotoAndStopDrag(currentID, 1);
        } else {
          gotoAndStopDrag(e.target.id, '_over');
        }
        break;
      case 'mouseout':
        gotoAndStopDrag(e.target.id, '_up');
        break;
    }
    e.preventDefault();
  }
  /*function windowLimit(_mouseX,_mouseY)
	{
		MY FUNCTION
		if(p.limitX !=0 || p.limitY!=0)
		{
		 if(_mouseX >= p.limitX)
			_mouseX = p.limitX
		else if(_mouseX <= 0)
			_mouseX = 0
		if(_mouseY >= p.limitY)
			_mouseY = p.limitY
		else if(_mouseY <= 0)
			_mouseY = 0 			
		}
		return {x:_mouseX, y:_mouseY}
	}*/
  function rearrangeDroppedItems(_mc) {
    for (var i = 0; i < dropObj[_mc].itemsDropped.length; i++) {
      var baseChild = $(p.domObj[_mc])
        .children()
        .eq(i);
      var childLeft = parseFloat($(baseChild[0]).css('left'));
      var childTop = parseFloat($(baseChild[0]).css('top'));
      var parentLeft = parseFloat($(p.domObj[_mc]).css('left'));
      var parentTop = parseFloat($(p.domObj[_mc]).css('top'));
      $(p.domObj[dropObj[_mc].itemsDropped[i]]).css({
        left: childLeft + parentLeft + 'px',
        top: childTop + parentTop + 'px'
      });

      /* if (i == 0) 
			{
				_mc.itemsDropped[i].x = _mc.x;
				_mc.itemsDropped[i].y = _mc.y
			}
			else
			{
				if(p._dropPosition == "Vertical")
				{
					_mc.itemsDropped[i].x = _mc.itemsDropped[i-1].x;
					_mc.itemsDropped[i].y = _mc.itemsDropped[i - 1].y + _mc.itemsDropped[i - 1].height + p._positionOffset;
				}
				else
				{
					_mc.itemsDropped[i].x = _mc.itemsDropped[i - 1].x + _mc.itemsDropped[i - 1].width + p._positionOffset;
					_mc.itemsDropped[i].y = _mc.itemsDropped[i - 1].y;
				}
			} */
    }
  }

  /*
   * method to enable/disable the submit/validate button
   * @param	_val - accepts true/false
   */
  function enableDisableSubmit(_val) {
    if (submitMC != null) {
      //submitMC.buttonMode = _val;
      if (_val) {
        gotoAndStopSubmit(submitMC, '_up');
        $(submitMC).on('click', validateDND);
      } else {
        gotoAndStopSubmit(submitMC, '_disable');
        $(submitMC).off('click', validateDND);
      }
    }
  }

  /*
   * method to enable/disable the solution button if available
   * @param	_val - accepts true/false
   */
  function enableDisableSolution(_val) {
    if (solutionMC != null) {
      //solutionMC.buttonMode = _val;
      if (_val) {
        $(solutionMC).addClass('addPointer');
        gotoAndStopSoln(solutionMC, '_up');
        $(solutionMC)
          .unbind('click', showCorrectAnswer)
          .bind('click', showCorrectAnswer);

        //$(solutionMC).unbind("mousemove mouseout", solutionEvents).bind("mousemove mouseout", solutionEvents);
      } else {
        $(solutionMC).removeClass('addPointer');
        gotoAndStopSoln(solutionMC, '_disable');
        $(solutionMC).unbind('click', showCorrectAnswer);
        //$(solutionMC).unbind("mousemove mouseout", solutionEvents)
      }
    }
  }

  /*
   * method to enable/disable the reset button if available
   * @param	_val - accepts true/false
   */
  function enableDisableReset(_val) {
    if (resetMC != null) {
      //resetMC.buttonMode = _val;
      if (_val) {
        $(resetMC).gotoAndStop('_up');
        $(resetMC).bind('click', resetDND);
      } else {
        $(resetMC).gotoAndStop('_disable');
        $(resetMC).unbind('click', resetDND);
      }
    }
  }
  function gotoAndStopSoln(elem, state) {
    if (
      p._imgObj &&
      p._imgObj[p._solutionBtn] &&
      p._imgObj[p._solutionBtn][state]
    )
      setBackground(p.domObj[p._solutionBtn], p._imgObj[p._solutionBtn][state]);
    /* switch(state)
		{
			case 1:
				setBackground(elem,"solutionMc_up")
			break;
			case "_up":
				setBackground(elem,"solutionMc_up")
			break;
			case "_disable":
				setBackground(elem,"solutionMc_disable") //"solutionMc_disable"image name
			break;
			case "_over":
				setBackground(elem,"solutionMc_over")
			break;
			case "_down":
				setBackground(elem,"solutionMc_down")
			break;
		} */
  }
  function gotoAndStopSubmit(elem, state) {
    if (
      p._imgObj &&
      p._imgObj[p._validateBtn] &&
      p._imgObj[p._validateBtn][state]
    )
      setBackground(p.domObj[p._validateBtn], p._imgObj[p._validateBtn][state]);
    /* switch(state)
		{
			case 1:
				setBackground(elem,"submitMc")
			break;
			case "_up":
				setBackground(elem,"submitMc")
			break;
			case "_disable":
				setBackground(elem,"submitMc_D")
			break;
			case "_over":
				setBackground(elem,"submitMc_H")
			break;
			case "_down":
				setBackground(elem,"submitMc_H")
			break;
		} */
  }
  function gotoAndStopDrag(elem, state) {
    if (p._imgObj && p._imgObj[elem] && p._imgObj[elem][state])
      setBackground(p.domObj[elem], p._imgObj[elem][state]);
    /* switch(state)
		{
			case 1:
			case "_down":
			case "_up":
				setBackground("#"+elem,elem)
			break;
			case "_disable":
				setBackground("#"+elem,elem+"_disable")
			break;
			case "_over":
				setBackground("#"+elem,elem+"_h")
			break;
			case "_selected":
				setBackground("#"+elem,elem+"_selected")
			break;
		} */
  }
  function setBackground(elem, img) {
    /* var newimg = new Image();
		$.get("images/"+img+".png").done(function ()
		{
			newimg.src="images/"+img+".png";
			$(newimg).load(function()
			{
				$(elem).css({
				"background": "url("+newimg.src+") no-repeat",
				"background-size": "100% 100%",
				});
			})
		}) */
    if (img) {
      $(elem).css({
        background: 'url(' + img + ') no-repeat',
        'background-size': '100% 100%'
      });
    }
  }
  function solutionEvents() {}
  /*
   * Method to check the hit test for dropped item
   * @param	_mc - the movieclip that is dropped on the stage
   */
  function checkHit(_mc) {
    // _mc.stopDrag();
    //reset the mc's depth to its original depth as soon as they are dropped
    //this solves the problem of left over drag items on screen
    //rootRef.setChildIndex(_mc, _mc.origDepth);
    var isDropped = false;
    var dragTop =
      $(p.domObj[_mc]).offset().top +
      parseFloat($(p.domObj[_mc]).css('height')) / 2;
    var dragLeft =
      $(p.domObj[_mc]).offset().left +
      parseFloat($(p.domObj[_mc]).css('width')) / 2;
    for (var i = 0; i < p._dropItemsArr.length; i++) {
      var mc = dropObj[p._dropItemsArr[i]];
      var dropLeft = $('#' + mc.dropId).offset().left;
      var dropTop = $('#' + mc.dropId).offset().top;
      var dropWidth = parseFloat($('#' + mc.dropId).css('width'));
      var dropHeight = parseFloat($('#' + mc.dropId).css('height'));

      if (
        dragLeft >= dropLeft &&
        dragLeft <= dropLeft + dropWidth &&
        (dragTop >= dropTop && dragTop <= dropTop + dropHeight)
      ) {
        $('#' + _mc).css({
          position: 'absolute',
          left: parseFloat($('#' + mc.dropId).css('left')),
          top: parseFloat($('#' + mc.dropId).css('top'))
        });
        dropObj[p._dropItemsArr[i]].occupiedBy = _mc;
        dropObj[p._dropItemsArr[i]].occupied = true;
        dragObj[_mc].droppedOn = mc.dropId;
        if (resetMC) {
          enableDisableReset(true);
        }
        if (mc.itemsDropped.length > 0) {
          if (mc.itemsDropped.length < p._maxDropCount) {
            var baseChild = $(p.domObj[mc.dropId])
              .children()
              .eq(dropObj[mc.dropId].itemsDropped.length);
            var childLeft = parseFloat($(baseChild[0]).css('left'));
            var childTop = parseFloat($(baseChild[0]).css('top'));
            var parentLeft = parseFloat($(p.domObj[mc.dropId]).css('left'));
            var parentTop = parseFloat($(p.domObj[mc.dropId]).css('top'));

            $(p.domObj[_mc]).css({
              left: childLeft + parentLeft + 'px',
              top: childTop + parentTop + 'px'
            });
            /* if(p._dropPosition == "Vertical")
						{
							dragObj[_mc].x = mc.itemsDropped[mc.itemsDropped.length-1].x;
							dragObj[_mc].y = mc.itemsDropped[mc.itemsDropped.length - 1].y + mc.itemsDropped[mc.itemsDropped.length - 1].height + p._positionOffset;
						}
						else
						{
							dragObj[_mc].x = mc.itemsDropped[mc.itemsDropped.length-1].x + mc.itemsDropped[mc.itemsDropped.length - 1].width + p._positionOffset;
							dragObj[_mc].y = mc.itemsDropped[mc.itemsDropped.length - 1].y;
						} */
            isDropped = true;
            dropObj[p._dropItemsArr[i]].itemsDropped.push(_mc);
            break;
          } else {
            //original position
            //dragObj[_mc].x = _mc.origX;
            //dragObj[_mc].y = _mc.origY;
            $(p.domObj[_mc]).css({
              left: dragObj[_mc].origX + 'px',
              top: dragObj[_mc].origY + 'px'
            });
          }
        } else {
          //1st element dragObj[_mc]
          //_mc.x = mc.x;
          //_mc.y = mc.y;
          var baseChild = $(p.domObj[mc.dropId])
            .children()
            .eq(0);
          var childLeft = parseFloat($(baseChild[0]).css('left'));
          var childTop = parseFloat($(baseChild[0]).css('top'));
          var parentLeft = parseFloat($(p.domObj[_mc]).css('left'));
          var parentTop = parseFloat($(p.domObj[_mc]).css('top'));
          /* $(p.domObj[dropObj[mc.dropId].itemsDropped[i]]).css(
					{
						"left": childLeft+parentLeft+"px",
						"top": childTop+parentTop+"px"
					}) */

          $(p.domObj[_mc]).css({
            position: 'absolute',
            left: childLeft + parentLeft + 'px',
            top: childTop + parentTop + 'px'
          });
          isDropped = true;
          dropObj[p._dropItemsArr[i]].itemsDropped.push(_mc);
          break;
        }
      }
    }
    var isAllDropped = true;
    var isAnyDropped = false;
    for (i = 0; i < p._dropItemsArr.length; i++) {
      mc = dropObj[p._dropItemsArr[i]];

      if (mc.itemsDropped.length > 0) {
        isAnyDropped = true;
        if (mc.itemsDropped.length < p._maxDropCount) {
          isAllDropped = false;
        }
      } else {
        isAllDropped = false;
      }
    }
    if (p._allDropped) {
      if (isAllDropped) {
        //enable submit button
        enableDisableSubmit(true);
      } else {
        enableDisableSubmit(false);
      }
    } else {
      enableDisableSubmit(true);
      //enable submit button
    }
    if (!isDropped) {
      //reset the mc position
      $(p.domObj[_mc]).css({
        left: dragObj[_mc].origX + 'px',
        top: dragObj[_mc].origY + 'px'
      });
      //_mc.x = _mc.origX;
      //_mc.y = _mc.origY;
      if (p._allDropped && !isAllDropped) {
        enableDisableSubmit(false);
      } else {
        if (isAnyDropped) {
          enableDisableSubmit(true);
        } else {
          enableDisableSubmit(false);
        }
      }
    }
  }

  /*
   * Method to validate the dropped items with the correct answers
   * sets visual feedback as per option selected (group/individual)
   * @param	e
   */
  function validateDND(e) {
    enableDisableSubmit(false);
    enableDisableReset(false);
    allCorrect = true;
    for (var i = 0; i < p._dragItemsArr.length; i++) {
      var mc = dragObj[p._dragItemsArr[i]];
      //var tickMc = new tickcross();
      //tickMc.x = mc.width;
      //tickMc.name = "tick_mc";
      //var tickCross_mc = mc.addChild(tickMc);
      if (p._correctAnswers[mc.id - 1] == dropObj[mc.droppedOn].id) {
        dragObj[p._dragItemsArr[i]].isCorrect = true;
        //tickCross_mc.gotoAndStop("correct");
      } else {
        dragObj[p._dragItemsArr[i]].isCorrect = false;
        allCorrect = false;
        //tickCross_mc.gotoAndStop("incorrect");
      }
    }
    if (attemptCnt <= p._noOfAttempts) {
      if (fbMC) {
        //rootRef.setChildIndex(fbMC, rootRef.numChildren-1);
        if (allCorrect) {
          //fbMC.gotoAndPlay("correct");
          p.feedBack({
            status: 'correct',
            popup: 'correct',
            feedbackParam: p.feedbackParam
          });
        } else {
          //fbMC.gotoAndPlay("incorrect" + attemptCnt);
          p.feedBack({
            status: 'incorrect',
            popup: 'incorrect',
            audioPath: 'audio_video/incorrect1.mp3',
            feedbackParam: p.feedbackParam
          });
          //gotoAndPlayFb("incorrect","incorrect" + attemptCnt)
        }
      } else {
        //just for testing, comment
        resetIncorrectItems();
        disableAll();
      }
      attemptCnt++;
    } else {
      if (allCorrect) {
        disableAll();
      }
    }
  }

  function disableAll() {
    for (var i = 0; i < p._dragItemsArr.length; i++) {
      var mc = dragObj[p._dragItemsArr[i]];
      $(p.domObj[mc]).off('mousedown mouseup', dragListener);
      //mc.buttonMode = false;
    }

    if (solutionMC) {
      if (!allCorrect) {
        enableDisableSolution(true);
      } else {
        enableDisableSolution(false);
      }
    }
    /* if (p._customFnCall != "") 
		{
			if (attemptCnt > p._noOfAttempts || allCorrect) 
			{
				var custFunction:Function = rootRef[p._customFnCall];
				custFunction();
			}
		} */
  }

  /*
   * Method called on the close of feedback popup
   * need to call this method from the activity in the close button listener of feedback popup
   * This method resets the incorrectly placed items and enables solution button (if any) depending on the no. of try's
   */
  function resetIncorrectItems() {
    if (!allCorrect) {
      var i;
      var mc;
      if (attemptCnt < p._noOfAttempts) {
        for (i = 0; i < p._dragItemsArr.length; i++) {
          mc = p._dragItemsArr[i];
          // if(mc.getChildByName("tick_mc"))
          {
            //mc.removeChild(mc.getChildByName("tick_mc"));
          }
          if (!mc.isCorrect) {
            for (var j = 0; j < mc.droppedOn.itemsDropped.length; j++) {
              if (mc.droppedOn.itemsDropped[j] == mc.dragId) {
                dropObj[
                  dragObj[p._dragItemsArr[i]].droppedOn
                ].itemsDropped.splice(j, 1);
                //mc.droppedOn.itemsDropped.splice(j, 1);
                //break;
              }
            }
            //resetdiv
            $(p.domObj[mc]).css({
              left: dragObj[mc].origX + 'px',
              top: dragObj[mc].origY + 'px'
            });
            //mc.x = mc.origX;
            //mc.y = mc.origY;
            dragObj[mc].droppedOn = null;
          } else {
            $(p.domObj[mc]).unbind('mousedown mouseup', dragListener);
            mc.buttonMode = false;
          }
        }
      } else {
        if (!solutionMC) {
          showCorrectAnswer();
        } else {
          for (i = 0; i < p._dragItemsArr.length; i++) {
            mc = p._dragItemsArr[i];

            //if (!mc.isCorrect)
            {
              $(p.domObj[mc]).unbind('mousedown', dragListener);
              $(p.domObj[mc]).unbind('mouseup', dragListener);
              mc.buttonMode = false;
              //
            }
          }
          //enableDisableSolution(true);
        }
      }
    }
    for (i = 0; i < p._dropItemsArr.length; i++) {
      mc = p._dropItemsArr[i];
      rearrangeDroppedItems(mc);
    }
    if (solutionMC) {
      if (!allCorrect) {
        enableDisableSolution(true);
      } else {
        enableDisableSolution(false);
      }
    }
    /* if (p._validationMethod == "Group") 
		{
			rootRef[visFeedbackMC].gotoAndStop(1);
		} */
    /* if (p._customFnCall != "") 
		{
			if (attemptCnt > p._noOfAttempts || allCorrect) 
			{
				//var custFunction:Function = rootRef[p._customFnCall];
				custFunction();
			}
		} */
  }
  function resetDND(e) {
    enableDisableSubmit(false);
    if (resetMC) {
      enableDisableReset(false);
    }
    if (attemptCnt == 1) {
      enableDisableSolution(false);
    }
    attemptCnt = 1;
    var i, mc;
    for (i = 0; i < p._dragItemsArr.length; i++) {
      mc = dragObj[p._dragItemsArr[i]];
      $(p.domObj[mc]).bind('mousedown mouseup', dragListener);
      mc.gotoAndStop('_up');
      //mc.x = mc.origX;
      //mc.y = mc.origY;
      $(p.domObj[mc]).css({
        left: dragObj[mc].origX + 'px',
        top: dragObj[mc].origY + 'px'
      });
      /* var tick = mc.getChildByName("tick_mc");
			if (tick) 
			{			
				mc.removeChild(tick);
			} */
      dragObj[p._dragItemsArr[i]].droppedOn = null;
      //mc.buttonMode = true;
      dragObj[p._dragItemsArr[i]].isCorrect = false;
    }
    for (i = 0; i < p._dropItemsArr.length; i++) {
      mc = dropObj[p._dropItemsArr[i]];
      dropObj[p._dropItemsArr[i]].itemsDropped = [];
      dropObj[p._dropItemsArr[i]].occupied = false;
      dropObj[p._dropItemsArr[i]].occupiedBy = null;
    }
  }

  /*
   * Method called by solution button or resetIncorrect method (if solution button is not available)
   * to display the correct answer and disable the activity.
   * @param	e
   */
  function showCorrectAnswer(e) {
    if (solutionMC) {
      enableDisableSolution(false);
    }
    if (submitMC) {
      enableDisableSubmit(false);
    }
    for (var i = 0; i < p._dropItemsArr.length; i++) {
      var mc = p._dropItemsArr[i];
      dropObj[p._dropItemsArr[i]].itemsDropped = [];
    }

    for (i = 0; i < p._dragItemsArr.length; i++) {
      mc = p._dragItemsArr[i];
      /* if (mc.getChildByName("tick_mc")) 
			{
				mc.removeChild(mc.getChildByName("tick_mc"));
			} */
      $(p.domObj[mc]).unbind('mousedown mouseup', dragListener);
      //rootRef.setChildIndex(dragMC, dragMC.origDepth);
      mc.buttonMode = false;
      mc.isCorrect = true;
      var id = p._correctAnswers[i];
      var dropMc = p._dropItemsArr[id - 1];
      dropObj[dropMc].itemsDropped.push(mc);
    }

    for (i = 0; i < p._dropItemsArr.length; i++) {
      mc = p._dropItemsArr[i];
      rearrangeDroppedItems(mc);
    }

    /* if (p._customFnCall != "") 
		{
			var custFunction:Function = rootRef[p._customFnCall];
			custFunction();
		} */
    p.feedBack({
      status: 'answer',
      audioPath: 'audio_video/answer.mp3',
      feedbackParam: p.feedbackParam
    });
  }
  //------------------------------------------------------
  function gotoAndPlayFb(type, _audio) {
    switch (type) {
      case 'correct':
        checkForPopUP(_audio);
        playSound('audio_video/' + _audio + '.mp3');
        break;
      case 'incorrect':
        $('#' + _audio).show();
        playSound('audio_video/' + _audio + '.mp3', function() {
          resetIncorrectItems();
          $('#' + _audio).hide();
        }); // how to chk audio present or not
        checkForPopUP(_audio);
        break;
      case 'answer':
        checkForPopUP(_audio);
        playSound('audio_video/' + _audio + '.mp3');
        break;
    }
  }

  function checkForPopUP(_audio) {
    if ($(p.target).children('#' + _audio)[0]) {
      var corFb = $(p.target).children('#' + _audio)[0];
      var closeBtn = $(p.target).children('#' + _audio + '_Close')[0];
      $(corFb).show();
      $(closeBtn).show();
      $(closeBtn).addClass('addPointer');
      $(closeBtn)
        .unbind('mousemove', overCloseBtn)
        .bind('mousemove', overCloseBtn);
      $(closeBtn)
        .unbind('mouseout', overCloseBtn)
        .bind('mouseout', overCloseBtn);
      $(closeBtn)
        .unbind('click', clickedCloseBtn)
        .bind('click', { popElem: corFb }, clickedCloseBtn);
    }
  }
  function playSound(_audio, _fun) {
    // audioObj.stop();
    if (_audio) {
      audioObj.playAudio(_audio, function() {
        // fire event after audio ends
        if (_fun) _fun();
      });
    }
  }
};
