var UI = require('ui');
var ajax = require('ajax');
var setupPage = {
    updateScreen: null,
    getSetupMenu: function () {
        console.log('ebnto');
        var myMenu = new UI.Menu({
            backgroundColor: "#ffffff",
            textColor: "black",
            highlightBackgroundColor: "#00AA55",
            highlightTextColor: "black",
            sections: [{
                    title: "Setup",
                    items: [{
                            title: 'Escoger favoritos',
                        }, {
                            title: 'Actualizar paradas'
                        }]
                }]
        });
        myMenu.on('select', function (e) {
            if (e.itemIndex === 0) {
                setupPage.favoritesSelection();
            }
            if (e.itemIndex === 1) {
                setupPage.updateStops();
            }
        });
        return myMenu;
    },

    favoritesSelection: function () {

    },

    getStops: function () {
        var URL = 'http://aaaaaa.bbb/v1/stops';
        ajax({url: URL, type: 'json'},
                function (json) {
                    // Data is supplied here
                    if (json.length > 0) {
                        console.log("Received : " + json.length + " Stops");
                        localStorage.setItem("stops", JSON.stringify(json));
                        console.log("OrderedStops");
                        setupPage.getOrderedStops();
                    }
                },
                function (error) {
                    console.log('Ajax failed: ' + error);
                    setupPage.updateScreen.hide();
                }
        );
    },

    getOrderedStops: function () {
        var URL = 'http://aaaaa.bbb/v1/orderedstops';
        ajax({url: URL, type: 'json'},
                function (json) {
                    // Data is supplied here

                    if (json.length > 0) {
                        console.log("Received : " + json.length + " orderedStops");
                        localStorage.setItem("orderedStops", JSON.stringify(json));
                    }
                    setupPage.updateScreen.hide();
                },
                function (error) {
                    console.log('Ajax failed: ' + error);
                    setupPage.updateScreen.hide();
                }
        );
    },

    updateStops: function () {
        var updateScreen = new UI.Card({
            title: 'Updating',
            icon: 'images/menu_icon.png',
            subtitle: ' ',
            body: 'please wait..',
            subtitleColor: 'indigo', // Named colors
            //style: 'small',
            bodyColor: '#9a0036' // Hex colors
        });
        updateScreen.show();
        setupPage.updateScreen = updateScreen;
        setupPage.getStops();
    }

};

this.exports = setupPage;
