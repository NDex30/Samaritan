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
    testSam.displayMessage('Hoodie chia franzen, ethical gochujang art party narwhal distillery kitsch chartreuse fixie crucifix 3 wolf moon +1 twee. Lomo gentrify slow-carb actually, ethical meggings kale chips pork belly ugh. Viral authentic lo-fi direct trade plaid, distillery locavore neutra four dollar toast godard quinoa normcore post-ironic. Bespoke tousled heirloom salvia, affogato authentic chicharrones PBR&B. Offal aesthetic 8-bit, distillery chartreuse disrupt bespoke put a bird on it. XOXO franzen pickled kale chips, fashion axe plaid yr irony ugh cold-pressed sustainable kinfolk meh slow-carb beard. Man bun beard waistcoat cred williamsburg, crucifix quinoa chicharrones.');
	});
	$('#samaritan').on('click', '#samaritan-close',function(){
		$('#samaritan').hide();
	});
});
