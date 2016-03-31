// From Stack Overflow
// http://stackoverflow.com/questions/1582534/calculating-text-width-with-jquery
;$.fn.textWidth = function(){
  var html_org = $(this).html();
  var html_calc = '<span>' + html_org + '</span>';
  $(this).html(html_calc);
  var width = $(this).find('span:first').width();
  $(this).html(html_org);
  return width;
};

if (window.$ && window.jQuery) {
  window.origJQuery = window.jQuery;
  jQuery.noConflict();
  window.BcseJQuery = window.jQuery;
  window.jQuery = window.$ = window.origJQuery;
  delete window.origJQuery;
}

window.Samaritan = function(el,options){
    if(! (window.$ || window.jQuery)){
      if(console)console.log('jQuery Required');
      return false;
    }
    this.options = this.extend( {}, this.options );
    this.getDataOptions(el);
    this.extend( this.options, options );
    this.SamaritanBox = $(el);
    this.triangle = $(el).find('#samaritan-triangle');
    this.text  = $(el).find('#samaritan-main p');
    this.line = $(el).find('#samaritan-main hr');
    this.init();
};
window.Samaritan.prototype.getDataOptions = function(el){
  var dOptions = el.getAttribute('data-options');
  if(dOptions != null && dOptions != ""){
    var tmp = el.getAttribute('data-options').replace(/[{}]/g, "").split(',');
    if(tmp.length > 0){
      for(x in tmp){
        var s = tmp[x].split(':');
        if(typeof(this.options[s[0].trim()]) !== "undefined")
          this.options[s[0].trim()] = s[1].trim();
      }
    }
  }
};
window.Samaritan.prototype.extend = function( a, b ) {
  for( var key in b ) {
    if( b.hasOwnProperty( key ) ) {
      a[key] = b[key];
		}
	}
	return a;
};
window.Samaritan.prototype.options = {
  isText: false,
  wordTime: 750, // Time to display a word
  wordAnim: 150, // Time to animate a word
  characterAnim: 50, // Time to display a letter
  randomInterval: 18000,
  lastRandomIndex: -1,
  randomTimer: null,
  lastMouseUp: -1,
  phraseArray: []
};
window.Samaritan.prototype.init = function(){
  //if(console)console.log('Samaritan has started');

  // Start the triangle blinking
  this.blinkTriangle(this);

  // URL parameter message
  this.getMessage();

  // Pull in Preloaded Phrases
  this.getPhrases();

  var self = this;
  // Show a new message whenever the URL fragment changes
  $(window).on('hashchange', function(){ self.processMessageFromHash(); });

  $(document).on('click','#samaritan',function(ev){
    var randMsg = self.getRandomMessage();
    self.displayMessage(randMsg);
  });
};
window.Samaritan.prototype.getUrlParameter = function(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam){
            return sParameterName[1];
        }
    }
};
window.Samaritan.prototype.getMessage = function(){
  var urlMsg = this.getUrlParameter('msg');
  if (urlMsg !== undefined){
      urlMsg = urlMsg.split('%20').join(' ').split('%22').join('').split('%27').join("'");
      this.options.phraseArray.push(urlMsg);
  }else{
    this.processMessageFromHash();
  }
};
window.Samaritan.prototype.processMessageFromHash = function(){
    var message = decodeURIComponent(window.location.hash.slice(1));
    if (message){
        this.options.phraseArray.push(message);
    }
};
window.Samaritan.prototype.blinkTriangle = function(it){
    // Stop blinking if samaritan is in action
    if (it.options.isText)
        return;
    it.triangle.fadeTo(500, 0).fadeTo(500, 1, function(){ it.blinkTriangle(it); } );
};
window.Samaritan.prototype.getRandomMessage = function(){
    var randomIndex = Math.floor(Math.random() * (this.options.phraseArray.length - 0));
    while (randomIndex == this.options.lastRandomIndex)
      randomIndex = Math.floor(Math.random() * (this.options.phraseArray.length - 0));
    this.options.lastRandomIndex = randomIndex;
    return this.options.phraseArray[randomIndex];
};

window.Samaritan.prototype.runRandomPhrase = function(){
  var self = this;
  var randMsg = self.getRandomMessage();
  self.displayMessage(randMsg);
};
window.Samaritan.prototype.getPhrases = function(){
  var newURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;
  var self = this;
  $.ajax({
    dataType: "json",
    url: newURL + "phraselist.json"
  }).done(function(phraselist){
    if(phraselist.length > 0){
      for(i = 0; i < phraselist.length; i++){
        self.options.phraseArray.push(phraselist[i]);
      }
    }
  });
};
window.Samaritan.prototype.displayMessage = function(msg){
  var self = this;
  if (self.options.isText)
      return;

  self.options.isText = true
  var phraseArray = msg.split(" ");
  // First, finish() the blink animation and
  // scale down the marker triangle
  self.triangle.finish().animate({
      'font-size': '0em',
      'opacity': '1'
  }, {
      'duration': self.options.wordAnim,
      // Once animation triangle scale down is complete...
      'done': function() {
          var timeStart = 0;
          var i = 0;
          var goTime = 0;
          // Create timers for each word
          phraseArray.forEach(function (word, i) {
              var wordTime = parseInt(self.options.wordTime,10);
              //if (word.length > 8)
              //    wordTime *= (word.length / 8);
              goTime = parseInt(self.options.wordAnim,10) * i + wordTime;
              setTimeout(function(){
                  // Set the text to black, and put in the word
                  // so that the length can be measured
                  self.text.addClass('hidden').empty().html(word);
                  // Then animate the line with extra padding
                  self.line.animate({
                      'width' : (self.text.textWidth() + 18) + "px"
                  }, {
                      'duration': self.options.wordAnim,
                      // When line starts anmating, set text to white again
                      'start': self.text.removeClass('hidden')
                  })
              }, goTime );
              i++;
              timeStart += wordTime;
          });

          // Set a final timer to hide text and show triangle
          setTimeout(function(){
              // Animate trinagle back in
              self.triangle.finish().animate({
                  'font-size': '2em',
                  'opacity': '1'
              }, {
                  'duration': self.options.wordAnim,
                  // Once complete, blink the triangle again and animate the line to original size
                  'done': function(){
                      // Clear the text
                      self.text.empty().html("&nbsp;");
                      self.options.isText = false;

                      self.blinkTriangle(self);
                      self.line.animate({
                          'width' : "30px"
                      }, {
                          'duration': self.options.wordAnim,
                          'start': self.text.removeClass('hidden')
                      })
                  }
              });
          }, (goTime + parseInt(self.options.wordTime,10)) );
      }
  });
};
window.Samaritan.prototype.textWidth = function(){
  var html_org = $(this).html();
  var html_calc = '<span>' + html_org + '</span>';
  $(this).html(html_calc);
  var width = $(this).find('span:first').width();
  $(this).html(html_org);
  return width;
};
