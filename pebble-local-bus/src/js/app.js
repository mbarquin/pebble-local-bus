/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Wakeup = require('wakeup');

Wakeup.launch(function(e) {
  if (e.wakeup) {
    console.log('Launch wakeup: ' + JSON.stringify(e));
  }
  // Do not pass the event to additional handlers
  //return false;
});

var main = new UI.Window({
  //style: 'small',
  fullscreen: true,
  backgroundColor: "#ffffff",
  action: {
  //  backgroundColor: "#7fcc01",
    backgroundColor: "#00AA55",
    up: 'images/star15bw.png',
    select: 'images/bus15grey.png',
    down: 'images/wrench15bw.png'
  },
});

var image = new UI.Image({
  position: new Vector2(20, 80),
  size: new Vector2(64, 64),
  image: 'images/busfrente64.png'
});
var textfield = new UI.Text({
  position: new Vector2(0, 10),
  size: new Vector2(114, 50),
  font: 'gothic-24-bold',
  color: "#000000",
  text: 'PARADAS VITRASA',
  textAlign: 'center'
});
main.add(textfield);
main.add(image);
main.show();

main.on('click', 'up', function(e) {
  var favoritesPage = require('stopsPage');
  console.log(favoritesPage);
  favoritesPage.showFavorites();
});

main.on('click', 'select', function(e) {
      var stopsPage = require('stopsPage');
      console.log(stopsPage);
      stopsPage.showAllStops();
});

main.on('click', 'down', function(e) {
  var setupPage = require('setupPage');
  console.log(setupPage);
  var setupMenu = setupPage.getSetupMenu();
  setupMenu.show();
});