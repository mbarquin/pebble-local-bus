var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Wakeup = require('wakeup');

var stopsPage = {

  selectedStopLoading: null,
  windTimes: null,
  timerSetted: null,
  
  mountSelectionScreen: function(stops) {
    var test = [];
    for(var i =0; i< stops.length; i++) {
      test[i] = {title: stops[i].index, id: i};
      if(i<10) {
        console.log(stops[i]);
      }
    }
    console.log(test.length);
    
    var orderedMenu = new UI.Menu({
      backgroundColor: "#ffffff",
      textColor: "black",
      highlightBackgroundColor: "#00AA55",
      highlightTextColor: "black",
      sections: [{
        title: 'Paradas',
        items: test
      }]
    });
    orderedMenu.on('select', function(e) {
      console.log('Index selected '+e.item.title);
      stopsPage.mountStopsScreen(e);
    });
    orderedMenu.show();
  },
  
  mountStopsScreen: function(e) {
    var test = [];
    var ordStops = JSON.parse(localStorage.getItem("orderedStops"));
    var ordLetter = ordStops[e.item.id];
    //ordStops = null;
    
    var stops = JSON.parse(localStorage.getItem("stops"));
    
    for(var i =0; i< ordLetter.elements.length; i++) {
      test[i] = {title: stops[ordLetter.elements[i]].label, id: stops[ordLetter.elements[i]].id};
      if(i<10) {
        console.log(stops[ordLetter.elements[i]].label);
      }
    }
    console.log(test.length);
    
    var stopsMenu = new UI.Menu({
      backgroundColor: "#ffffff",
      textColor: "black",
      highlightBackgroundColor: "#00AA55",
      highlightTextColor: "black",
      sections: [{
        title: 'Paradas',
        items: test
      }]
    });
    stopsMenu.on('select', function(e) {
      console.log('Index selected '+e.item.title);
      stopsPage.selectedStop = e;
      stopsPage.renderStop(e);
    });
    stopsMenu.show();
  },
  
  
  showAllStops: function() {
    var stops = JSON.parse(localStorage.getItem("orderedStops"));
    stopsPage.mountSelectionScreen(stops);
  },
  
  showFavorites: function () {
    var myMenu = new UI.Menu({
      backgroundColor: "#ffffff",
      textColor: "black",
      highlightBackgroundColor: "#00AA55",
      highlightTextColor: "black",
      sections: [{
        title: 'Paradas favoritas',
        items: [{
          title: 'P. Colmeiro 23',
          id: '14255'
        }, {
          title: 'Gran via 120',
          id: '14398'
        }, {
          title: 'Barcelona (Povisa)',
          id: '2430'
        }, {
          title: 'Alvaro Cunqueiro 30',
          id: '14331'
        }, {
          title: 'Estadio Balaidos',
          id: '5060'
        }, {
          title: 'Fragoso 99',
          id: '5400'
        }]
      }]
    });
    
    myMenu.on('select', function(e) {
      console.log('Favorito '+e.item.id);
      stopsPage.selectedStop = e;
      stopsPage.renderStop(e);
    });
    myMenu.show();
  },
  renderStop: function (e) {
      var wind = new UI.Window({
      fullscreen: true,
    });
    var textfield = new UI.Text({
      position: new Vector2(0, 65),
      size: new Vector2(144, 60),
      font: 'gothic-24-bold',
      text: e.item.title+"\n ...loading...",
      textAlign: 'center'
    });
    wind.add(textfield);
    wind.show();
    stopsPage.selectedStopLoading = wind;
    // this becomes an already-running wakeup handler
    Wakeup.on('wakeup', function(e) {
      if (!e.launch) {
        console.log('Woke up to ' + e.id + '! data: ' + JSON.stringify(e.data));
        var params = {item : e.data};
        console.log(JSON.stringify(params));
        Wakeup.cancel(e.id);
        stopsPage.getTimes(params);
      }
      else {
        console.log('false wake');
      }

    });
    stopsPage.getTimes(e);
  },
  
  getTimes: function(e) {
    var URL = 'http://aaaaa.bbb/v1/times/'+e.item.id;
    ajax({url: URL, type: 'json'},
      function(json) {
        // Data is supplied here
        if(json.length > 0) {
          console.log("Received : "+json.length+" times");
          stopsPage.renderTimes(json, e);
          //localStorage.setItem("stops", JSON.stringify(json));
        }
      },
      function(error) {
        console.log('Ajax failed: ' + error);
      }
    );
  },
  renderTimes: function(json, e) {
    if(stopsPage.windTimes !== null) {
      stopsPage.windTimes.hide();
      stopsPage.windTimes = null;
    }
    var windTimes = new UI.Window({
      fullscreen: true,
      backgroundColor: "#ffffff",
    });
    var textfield = new UI.Text({
      position: new Vector2(0, 0),
      size: new Vector2(144, 35),
      font: 'gothic-18-bold',
      text: stopsPage.selectedStop.item.title,
      color: "#000000",
      backgroundColor: "#00AA55",
      textAlign: 'center'
    });
    windTimes.add(textfield);
    var useColor   = '';
    var launchVibe = false;
    for (var i = 0; i < json.length; i++) {
        /*while(json[i][2].length < 3) {
          json[i][2] = '_'+json[i][2];
        }*/
        if (parseInt(json[i][2]) <= 2) {
          useColor = "#990000";
          launchVibe = true;
        } else {
          useColor = "#000000";
        }

        var textTime = new UI.Text({
          position: new Vector2(0, ((i+2)*16)),
          size: new Vector2(35, 15),
          color: useColor,
          font: 'gothic-24-bold',
          text: json[i][2],
          textAlign: 'right'
        });
      console.log(parseInt(json[i][0]));
        var textInfo = new UI.Text({
          position: new Vector2(55, ((i+2)*16)),
          size: new Vector2(109, 15),
          font: 'gothic-24-bold',
          color: useColor,
          text: json[i][0]+' '+json[i][1],
          textAlign: 'left'
        });
      windTimes.add(textTime);
      windTimes.add(textInfo);
    }
    if (launchVibe === true) {
      var Vibe = require('ui/vibe');
      Vibe.vibrate('short');
    }
    windTimes.on('hide', function () {
      Wakeup.cancel('all');
      stopsPage.timerSetted = false;
    });
    stopsPage.windTimes = windTimes;
    windTimes.show();
    console.log(stopsPage.timerSetted);
    if(stopsPage.timerSetted === false || stopsPage.timerSetted === null) {
      Wakeup.schedule(
        {
          // Set the wakeup event for one minute from now
          time: Date.now() / 1000 + 30,
          data: e.item
        },
        function(e) {
          if (e.failed) {
            // Log the error reason
            console.log('Wakeup set failed: ' + JSON.stringify(e) + e.error);
          } else {
            console.log('Wakeup set'+ JSON.stringify(e));
          }
        }
      );
      console.log('timmer setted');
      stopsPage.timerSetted = true;
    }
    if(stopsPage.selectedStopLoading !== null) {
      stopsPage.selectedStopLoading.hide();  
      stopsPage.selectedStopLoading = null;
    }
    
  }
  
};

this.exports = stopsPage;