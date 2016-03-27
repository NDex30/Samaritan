
// From Stack Overflow
// http://stackoverflow.com/questions/1582534/calculating-text-width-with-jquery
$.fn.textWidth = function(){
  var html_org = $(this).html();
  var html_calc = '<span>' + html_org + '</span>';
  $(this).html(html_calc);
  var width = $(this).find('span:first').width();
  $(this).html(html_org);
  return width;
};

/*

// http://stackoverflow.com/questions/19491336/get-url-parameter-jquery
function getUrlParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

function processMessageFromHash(){
    var message = decodeURIComponent(window.location.hash.slice(1));
    if (message)
    {
        setTimeout(function(){executeSamaritan(message);}, $State.wordTime);
    }
}

$State = {
    isText: false,
    wordTime: 750, // Time to display a word
    wordAnim: 150, // Time to animate a word
    randomInterval: 18000,
    lastRandomIndex: -1,
    randomTimer: null,
    lastMouseUp: -1
};

$(document).ready(function(){
    // Cache the jquery things
    $State.triangle = $('#samaritan-triangle');
    $State.text  = $('#samaritan-main p');
    $State.line = $('#samaritan-main hr');

    // Start the triangle blinking
    blinkTriangle();

    // URL parameter message
    var urlMsg = getUrlParameter('msg');
    if (urlMsg !== undefined)
    {
        urlMsg = urlMsg.split('%20').join(' ').split('%22').join('').split('%27').join("'");
        $State.phraselist = [urlMsg];
        setTimeout(function(){executeSamaritan(urlMsg);}, $State.wordTime);
    }
    else
    {
      // Message from URL fragment
      processMessageFromHash();
    }

    // Show a new message whenever the URL fragment changes
    $(window).on('hashchange', processMessageFromHash);

    // Pull up the phrase list file
    $.ajax({
      dataType: "json",
      url: "phraselist.json"
    }).done(function(phraselist){
        // Store the phrase list in the state
        if ($State.phraselist !== undefined)
            phraselist = phraselist.concat($State.phraselist);
        $State.phraselist = phraselist;

        $(document).bind("mouseup", function(){
            if ((Date.now() - $State.lastMouseUp) <= 500)
            {
                console.log("DblClick");
                if (screenfull.enabled) {
                    screenfull.toggle();
                }
            }
            $State.lastMouseUp = Date.now();
        }).bind("click", runRandomPhrase);

        // And do a timed random phrase
        randomTimePhrase();
    });
})

var blinkTriangle = function()
{
    // Stop blinking if samaritan is in action
    if ($State.isText)
        return;
    $State.triangle.fadeTo(500, 0).fadeTo(500, 1, blinkTriangle);
}

var runRandomPhrase = function()
{
    // Get a random phrase and execute samaritan
    var randomIndex = Math.floor(Math.random() * ($State.phraselist.length - 0));
    while (randomIndex == $State.lastRandomIndex)
        randomIndex = Math.floor(Math.random() * ($State.phraselist.length - 0));
    $State.lastRandomIndex = randomIndex;
    executeSamaritan($State.phraselist[randomIndex]);
}

var randomTimePhrase = function()
{
    if ($State.randomTimer !== null)
        clearTimeout($State.randomTimer);
    var randomTime = Math.floor(Math.random() * (3000 - 0));
    randomTime += $State.randomInterval;
    $State.randomTimer = setTimeout( runRandomPhrase, randomTime);
}

var executeSamaritan = function(phrase)
{
    if ($State.isText)
        return;

    $State.isText = true
    var phraseArray = phrase.split(" ");
    // First, finish() the blink animation and
    // scale down the marker triangle
    $State.triangle.finish().animate({
        'font-size': '0em',
        'opacity': '1'
    }, {
        'duration': $State.wordAnim,
        // Once animation triangle scale down is complete...
        'done': function() {
            var timeStart = 0;
            // Create timers for each word
            phraseArray.forEach(function (word, i) {
                var wordTime = $State.wordTime;
                if (word.length > 8)
                    wordTime *= (word.length / 8);
                setTimeout(function(){
                    // Set the text to black, and put in the word
                    // so that the length can be measured
                    $State.text.addClass('hidden').html(word);
                    // Then animate the line with extra padding
                    $State.line.animate({
                        'width' : ($State.text.textWidth() + 18) + "px"
                    }, {
                        'duration': $State.wordAnim,
                        // When line starts anmating, set text to white again
                        'start': $State.text.removeClass('hidden')
                    })
                }, (timeStart + $State.wordAnim));
                timeStart += wordTime;
            });

            // Set a final timer to hide text and show triangle
            setTimeout(function(){
                // Clear the text
                $State.text.html("");
                // Animate trinagle back in
                $State.triangle.finish().animate({
                    'font-size': '2em',
                    'opacity': '1'
                }, {
                    'duration': $State.wordAnim,
                    // Once complete, blink the triangle again and animate the line to original size
                    'done': function(){
                        $State.isText = false;
                        randomTimePhrase();

                        blinkTriangle();
                        $State.line.animate({
                            'width' : "30px"
                        }, {
                            'duration': $State.wordAnim,
                            'start': $State.text.removeClass('hidden')
                        })
                    }
                });
            },
            timeStart + $State.wordTime);
        }
    });
}
s*/

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
/*
window.Samaritan.prototype.runRandomPhrase = function(){
    // Get a random phrase and execute samaritan
    var randomIndex = Math.floor(Math.random() * ($State.phraselist.length - 0));
    while (randomIndex == $State.lastRandomIndex)
        randomIndex = Math.floor(Math.random() * ($State.phraselist.length - 0));
    $State.lastRandomIndex = randomIndex;
    executeSamaritan($State.phraselist[randomIndex]);
};
window.Samaritan.prototype.randomTimePhrase = function(){
    if ($State.randomTimer !== null)
        clearTimeout($State.randomTimer);
    var randomTime = Math.floor(Math.random() * (3000 - 0));
    randomTime += $State.randomInterval;
    $State.randomTimer = setTimeout( runRandomPhrase, randomTime);
};
*/
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
          // Create timers for each word
          phraseArray.forEach(function (word, i) {
              var wordTime = self.options.wordTime;
              if (word.length > 8)
                  wordTime *= (word.length / 8);
              if(console)console.log(word,wordTime,self.options.wordTime);
              setTimeout(function(){
                  // Set the text to black, and put in the word
                  // so that the length can be measured
                  self.text.addClass('hidden').html(word);
                  // Then animate the line with extra padding
                  self.line.animate({
                      'width' : (self.text.textWidth() + 18) + "px"
                  }, {
                      'duration': self.options.wordAnim,
                      // When line starts anmating, set text to white again
                      'start': self.text.removeClass('hidden')
                  })
              }, (timeStart + self.options.wordAnim));
              timeStart += wordTime;
          });

          // Set a final timer to hide text and show triangle
          setTimeout(function(){
              // Clear the text
              self.text.html("");
              // Animate trinagle back in
              self.triangle.finish().animate({
                  'font-size': '2em',
                  'opacity': '1'
              }, {
                  'duration': self.options.wordAnim,
                  // Once complete, blink the triangle again and animate the line to original size
                  'done': function(){
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
          },
          timeStart + self.options.wordTime);
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
