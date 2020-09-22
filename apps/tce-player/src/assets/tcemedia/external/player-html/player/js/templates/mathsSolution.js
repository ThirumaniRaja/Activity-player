var currentCount = 0;
var myXml;
var video;
var currentTime;
var totalLength = 0;
var firstNextClick = true;
var marksArr = [];
var clickBtnID = '';
var buttonArrowArr = [0, 43, 138, 230, 327];
var oldCount = -1;
var myToolTip;
var customToolTipDiv;
var customToolTipArrowDiv;

$(document).ready(function() {
  customToolTipDiv = document.getElementById('customToolTip');
  customToolTipArrowDiv = document.getElementById('toolTipArrow');

  myToolTip = new ToolTip(customToolTipDiv, customToolTipArrowDiv);

  $('#VID').hide();
  $('.button').addClass('normalClass');
  //$('#btn_1').removeClass("normalClass");
  //$("#btn_1").addClass("clickClass");
  currentCount = 0;
  $('.bcNavButton').hide();
  $('.breadC').hide();
  var bcCounter = 1;
  $.get(dataXML, function(d) {
    myXml = d;
    $('#ctitle').html($(d).find('sectionTitle')[0].textContent);
    $(d)
      .find('VIDEO')
      .each(function() {
        totalLength++;
        var $page = $(this);
        var title = $page.attr('id');

        /*var Videourl = $page.attr('VIDEOSRC');
		   // console.log("Total videos" + title);
			video = '<video oncontextmenu="return false;" width="100%" height="100%" class="VideoDisplay" id='   + title +' controlsList="nodownload nofullscreen noremoteplayback" src="' + Videourl+ '" onended="videoEnded()"></video>';
			$('.videoPlay').append(video);*/
        var markVal = $page.attr('mark');
        var firstButton = $($(d).find('VIDEO')[0]).attr('mark');
        marksArr.push(markVal);
        if (markVal == firstButton) {
          if (bcCounter <= 10) {
            $('#bc' + bcCounter).show();
          } else {
            $('.aCls2').show();
          }
          $('#bc' + bcCounter).attr('data-myVid', title);
          //alert($("#bc"+bcCounter).attr("data-myVid"));
          bcCounter++;
          //break;
        }
      });
    checkCurrentQMarks('QUE1');
    disableEmptyButtons();
  });
  $('.back').hide();

  $('.button').bind('click', function() {
    $('.button').addClass('normalClass');
    $(this).removeClass('normalClass');
    $(this).addClass('clickClass');
    $('.VideoDisplay').hide();
    clickBtnID = $(this)
      .attr('id')
      .split('_')[1];
    $('.pArrows').hide();
    $('.pArrow_' + clickBtnID).show();
    //$(".breadC").hide();
    //$(".bcNavButton").hide();
    var matched = false;
    $(myXml)
      .find('VIDEO')
      .each(function() {
        var $page = $(this);
        var markVal = $page.attr('mark');
        if (markVal == clickBtnID) {
          if (!matched) {
            VideoID = $page.attr('id');
            currentCount = VideoID.substr(3);
            matched = true;
          }
        }
      });
    loadQuestion();
  });

  $('.breadC').bind('click', function() {
    //$(this).attr("id");
    //$(this).hide();
    $('.breadC').removeClass('bcSelected');
    var myVid = $(this).attr('data-myVid');
    currentCount = myVid.substr(3);
    //alert(myVid);
    loadQuestion();
    $(this).addClass('bcSelected');
  });

  $('#nav-backButton').bind('click', function() {
    if (!$(this).hasClass('disableButton')) {
      currentCount--;
      loadQuestion();
    }
  });

  //$('.next').show();
  $('#nav-nextButton').bind('click', function() {
    if (!$(this).hasClass('disableButton')) {
      //alert("next");
      currentCount++;
      loadQuestion();
    }
  });
  /*$('#nav-nextButton').bind('mouseenter', function(){
		 console.log($(this))
	 });*/
  $('#nav-nextButtonHighlight').bind('click', function() {
    $('#nav-nextButtonHighlight').css({ display: 'none' });
    //alert("next");
    currentCount++;
    loadQuestion();
  });

  $('#nav-replayButton').bind('click', function() {
    $('#nav-nextButtonHighlight').css({ display: 'none' });
    if (!$('#nav-playButton').hasClass('disableButton')) {
      $('#QUE' + oldCount)[0].play();
      $('#nav-pauseButton').css({ display: 'block' });
      $('#nav-playButton').css({ display: 'none' });
    }
    enableButton($('#nav-pauseButton'), true);
    $('#QUE' + oldCount)[0].currentTime = 0;
    $('#QUE' + oldCount)[0].play();
  });
  /*$('#nav-pauseButton').bind('click', function(){
		if(!$(this).hasClass("disableButton")) {
			if($('#ppIcon').hasClass('nav-pauseIcon'))
			{
				$('#QUE'+oldCount)[0].pause();
				$('#ppIcon').removeClass('nav-pauseIcon');
				$('#ppIcon').addClass('nav-playIcon');
			}
			else
			{
				$('#QUE'+oldCount)[0].play();
				$('#ppIcon').addClass('nav-pauseIcon');
				$('#ppIcon').removeClass('nav-playIcon');			
			}
		}
	});*/

  $('#nav-pauseButton').bind('click', function() {
    if (!$(this).hasClass('disableButton')) {
      $('#QUE' + oldCount)[0].pause();
      $('#nav-pauseButton').css({ display: 'none' });
      $('#nav-playButton').css({ display: 'block' });
    }
  });

  $('#nav-playButton').bind('click', function() {
    if (!$(this).hasClass('disableButton')) {
      $('#QUE' + oldCount)[0].play();
      $('#nav-pauseButton').css({ display: 'block' });
      $('#nav-playButton').css({ display: 'none' });
    }
  });

  addToolTipEvent($('#nav-backButton'));
  addToolTipEvent($('#nav-pauseButton'));
  addToolTipEvent($('#nav-playButton'));
  addToolTipEvent($('#nav-nextButton'));
  addToolTipEvent($('#nav-nextButtonHighlight'));
  addToolTipEvent($('#nav-replayButton'));

  //$('#nav-backButton').hide();
  enableButton($('#nav-backButton'), false);
  enableButton($('#nav-replayButton'), false);
  enableButton($('#nav-pauseButton'), false);

  addCollapse();
});

function videoEnded() {
  enableButton($('#nav-pauseButton'), false);
  if (!$('#nav-nextButton').hasClass('disableButton')) {
    //console.log('VIDEO ENDED');
    $('#nav-nextButtonHighlight').css({ display: 'block' });
  }
}

function loadQuestion() {
  enableButton($('#nav-pauseButton'), true);
  enableButton($('#nav-replayButton'), true);
  if (firstNextClick) {
    firstNextClick = false;
    $('#startPanel').hide();
    $('#VID').show();
  }
  if (oldCount >= 0) {
    $('#QUE' + oldCount)[0].currentTime = 0;
    $('#QUE' + oldCount)[0].pause();
  }

  if ($('#QUE' + currentCount).length == 0) {
    displayLoader(true);
    var Videourl = $(myXml)
      .find('#QUE' + currentCount)
      .attr('VIDEOSRC');
    video =
      '<video oncontextmenu="return false;" width="100%" height="100%" class="VideoDisplay" id=QUE' +
      currentCount +
      ' controlsList="nodownload nofullscreen noremoteplayback" src="' +
      Videourl +
      '" onended="videoEnded()"></video>';
    $('.videoPlay').append(video);
    $('#QUE' + currentCount).bind('loadeddata', function() {
      displayLoader(false);
    });
  }

  $('.VideoDisplay').hide();
  //$('#QUE'+currentCount).load();
  $('#QUE' + currentCount).show();
  $('#QUE' + currentCount)[0].play();

  if (currentCount == 1) {
    //$('.back').hide();
    //$('.next').show();
    enableButton($('#nav-backButton'), false);
    enableButton($('#nav-nextButton'), true);
  } else if (currentCount == totalLength) {
    //$('.next').hide();
    //$('.back').show();
    enableButton($('#nav-backButton'), true);
    enableButton($('#nav-nextButton'), false);
  } else {
    //$('.back').show();
    //$('.next').show();
    enableButton($('#nav-backButton'), true);
    enableButton($('#nav-nextButton'), true);
  }

  checkCurrentQMarks('QUE' + currentCount);

  //Once the button is selected, the bottom navigation panel will collapse.
  if ($('#btn_4').is(':visible')) {
    $('#grayBackButton').trigger('click');
  }
  showBCSelected();
  oldCount = currentCount;
}
function addCollapse() {
  //alert("collapse")
  $('#grayBackButton').unbind();
  $('#grayBackButton').bind('click', function() {
    //$('.btnWrapper').toggle(function(){
    $('#grayForwardButton').animate(
      { 'margin-left': '0px', 'margin-top': '-70px' },
      100
    );
    $('#grayBackButton').animate(
      { 'margin-left': '0px', 'margin-top': '-70px' },
      100
    );
    $('.btnWrapper').animate({ width: '0px' }, 100, function() {
      $('.button,.pagination').hide();
    });
    $('#grayBackButton').hide();
    $('#grayForwardButton').show();
    addExpand();
  });
}
function disableEmptyButtons() {
  marksArr = $.unique(marksArr);
  marksArr.sort();
  //alert(marksArr);
  var marksArrString = marksArr.join('');
  for (var i = 1; i <= 4; i++) {
    if (marksArrString.indexOf(i) == -1) {
      $('#btn_' + i).css('pointer-events', 'none');
      $('#btn_' + i).css('opacity', '0.3');
    }
  }
}
function addExpand() {
  //alert("expand")
  $('#grayForwardButton').unbind();
  $('#grayForwardButton').bind('click', function() {
    $('#buttonPanel').show();
    $('#grayForwardButton').animate(
      { 'margin-left': '386px', 'margin-top': '-70px' },
      100
    );
    $('#grayBackButton').animate(
      { 'margin-left': '386px', 'margin-top': '-70px' },
      100
    );
    $('.btnWrapper').animate({ width: '385px' }, 100, function() {
      $('.button,.pagination').show();
    });
    $('#grayForwardButton').hide();
    $('#grayBackButton').show();
    addCollapse();
  });
}

function showBCSelected() {
  $('.breadC').removeClass('bcSelected');
  $('.breadC').each(function() {
    var myVid = $(this).attr('data-myVid');
    var myCount = myVid.substr(3);
    if (myCount == currentCount) {
      $(this).addClass('bcSelected');
    }
  });
}
function checkCurrentQMarks(val) {
  //console.log($(myXml).find('VIDEO'));
  $('#bcContainer').css('margin-left', '10px');
  $(myXml)
    .find('VIDEO')
    .each(function() {
      var $page = $(this);
      var pId = $page.attr('id');
      //console.log('aaa '+pId+" "+val);
      if (pId == val) {
        var markVal = $page.attr('mark');
        //console.log('bbb '+markVal);
        setBCButtons(markVal);
        $('.button').addClass('normalClass');
        $('#btn_' + markVal).removeClass('normalClass');
        $('#btn_' + markVal).addClass('clickClass');
        $('.pArrows').hide();
        $('.pArrow_' + markVal).show();
        //alert($("#bcContainer").css("width"));
        adjustBCPosition(markVal);
      }
    });
}
function setBCButtons(clickBtnID) {
  $('.breadC').hide();
  $('.bcNavButton').hide();
  var bcCounter = 1;
  $(myXml)
    .find('VIDEO')
    .each(function() {
      var $page = $(this);
      var markVal = $page.attr('mark');
      if (markVal == clickBtnID) {
        if (bcCounter <= 10) {
          $('#bc' + bcCounter).show();
        } else {
          $('.aCls2').show();
        }
        $('#bc' + bcCounter).attr('data-myVid', $page.attr('id'));
        bcCounter++;
        //break;
      }
    });
}
function adjustBCPosition(markVal) {
  var bcContainerWidth = Number(
    $('#bcContainer')
      .css('width')
      .split('px')[0]
  );
  var bcContainerML = 10;
  var arrowLeft = buttonArrowArr[markVal]; //Number($(".pArrow_"+markVal).css("left").split("px")[0]);
  var newML = bcContainerML + arrowLeft - bcContainerWidth / 2;
  //alert(arrowLeft +" "+ bcContainerWidth);
  if (newML < 10) {
    newML = 10;
  } else if (newML + bcContainerWidth > 373) {
    newML = 373 - bcContainerWidth;
  }
  $('#bcContainer').css('margin-left', newML + 'px');
}

function enableButton(btn, status) {
  if (status) {
    btn.removeClass('disableButton');
    btn.addClass('enableButton');
  } else {
    btn.removeClass('enableButton');
    btn.addClass('disableButton');
  }
}

function addToolTipEvent(btn) {
  $(btn).bind('mouseenter', function() {
    if ($(this).css('cursor') == 'pointer') {
      myToolTip.showToolTip(
        $(this).position().top,
        $(this).position().left - 2,
        $(this).width(),
        $(this).attr('tooltip')
      );
    }
  });
  $(btn).bind('mouseleave', function() {
    myToolTip.hideToolTip();
  });
}

this.externalPause = function() {
  this.getNavigationController().pause();
};

function displayLoader(val) {
  if (val) {
    $('#preloader').css('display', 'block');
  } else {
    $('#preloader').css('display', 'none');
  }
}
