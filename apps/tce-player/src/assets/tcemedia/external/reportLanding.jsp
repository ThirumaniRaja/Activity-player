<%@ include file="/WEB-INF/jsp/common/init.jsp"%>
<portlet:renderURL windowState='exclusive' var="baseUrl">
	<portlet:param name='Operation' value='DUMMY' />
</portlet:renderURL>
<script language="javascript">
	var baseUrl = '${baseUrl}';
	var popupConsoleWin;

	jQuery(document).ready(function() { 		
		callAjax('#dataToDisplay','${htmlPage}',{});		
	});
	
	function openWindow() {
		
		if ( typeof popupConsoleWin === 'undefined' || popupConsoleWin == null){
			popupConsoleWin = window.open(
				'${htmlPage}',
				'child2',
				'location=no, menubar=no, scrollbars=yes, status=no, toolbar=no,width='
						+ (screen.width - 20) + ',height='
						+ (screen.height - 100));
		} else {
			popupConsoleWin.close();
			popupConsoleWin = null;
		}		
	}

</script>
<style type="text/css">
<!--
body{overflow: auto !important;}
-->
</style>
 <global:portletTitle name="${pageTitle}" portletname="ReportManagement_WAR_ceportallx" />
<input type="hidden" name="baseUrl" id="baseUrl" value="${baseUrl}">

<span style="float:right;" onClick="javascript:openWindow();"> <img src="/ce-static/images/common/open_in_new_window.png"
					style="margin-bottom: 2px;margin-right: 5px; cursor: pointer;"
					alt="Open this report in new window"></img></span>

<div id="dataToDisplay"></div>
