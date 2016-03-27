;window.onerror = function() {
  if (window.console) {
    window.console.log(arguments);
  }
  return true;
};

$(document).ready(function(){
  testSam = new Samaritan ( $('#samaritan').get(0), {} );
	$('#content').on('click', '.samaritan-trigger',function(){
		$('#samaritan').show();
	});
	$('#samaritan').on('click', '#samaritan-close',function(){
		$('#samaritan').hide();
	});
});
