/*

jQuery Tutorial Engine - 2014

The purpose of this small library is to allow the declerative creation of a quick-and-dirty tutorial that can be overlayed on an existing web page.
A dark semi-translarent layer (css class DarkLayer, opacity : 0.6) is overlayed on the page. Then one element at a time is highlighted
and at the same time a baloon with the "help tip" for this element or site section is displayed. The tutorial can be made up of many
tips that are displayed one at a time. The only  requirement for the existing UI is that the elements that are bound to the tutorial
have absolute CSS positioning so that the z-index CSS attribute works properly.

Online demo : http://mvctest.theokand.com/tipengine
JSFiddle: http://jsfiddle.net/TheoKand/SRuh7/13/
Copyright (c) 2014 Theo Kandiliotis tKandiliotis@gmail.com
Use like this :

//initialize one or more tips for various elements
TipEngine.tips = [{
    elem: "#content2",
    tipHtml: "<h3>Area 1</h3>This is the description of area1. Click anywhere outside of this baloon, to close the tutorial. Click inside here to go to the next 'slide' ",
    left: "50%",
    top: "5%",
    width: "45%",
    height: "30%"
}, {
    elem: "#content1",
    tipHtml: "<h2>Area 2</h3>Area2 is <B>also very important bla bla bla ",
    left: "50%",
    top: "25%",
    width: "45%",
    height: "50%"
}];

//start the tutorial when something like a "show help" button is clicked. Can also be displayed at
//the load event of the document

$("#helpLink").click(function () {
    TipEngine.current = 0;
    TipEngine.showTip();
    return false;
});

 */

var TipEngine = {


    showTip: function () {

        //initialize stuff when the first tip is displayed
        if (!TipEngine.darkLayer) {
            //your page should have a top level DIV that contains everything else
            TipEngine.container = $("#container");
            TipEngine.darkLayer = $("<div/>").attr("id", "DarkLayer");
        }

        //add the overlay layer that darkens the content
        TipEngine.container.append(TipEngine.darkLayer);

        //get the current tip
        var tip = TipEngine.tips[TipEngine.current];

        //add a glow effect around the element that the tip concerns
        TipEngine.tipElement = $(tip.elem);
        TipEngine.tipElement.css("z-index", "11").addClass("Glow");

        //create and display the "baloon" that contains the actual tip html
        TipEngine.tipLayer = $("<div/>").attr("id", "TipLayer");
        TipEngine.tipLayer
            .css("left", tip.left).css("top", tip.top)
            .css("width", tip.width).css("height", tip.height)
            .addClass("Glow")
            .html(tip.tipHtml);

        //clicking on a tip will go to the next one
        if (TipEngine.current < TipEngine.tips.length - 1) {
            TipEngine.tipLayer.append("<p><a href='#'>Next</a></p>").click(function () {
                TipEngine.nextTip();
                return false;
            });
        } else {
            //if it's the last one, then just close the tutorial
            TipEngine.tipLayer.click(function () {
                $(TipEngine.tipElement).css("z-index", "9").removeClass("Glow");
                TipEngine.tipLayer.remove();
                TipEngine.darkLayer.remove();

                return false;
            });
        }

        TipEngine.container.append(TipEngine.tipLayer);

        //also close the tutorial when the user clicks anywhere outside the tip
        $(document).click(function () {
            $(TipEngine.tipElement).css("z-index", "9").removeClass("Glow");
            TipEngine.tipLayer.remove();
            TipEngine.darkLayer.remove();

            $(document).unbind("click");
            return false;
        });
    },

    //go to the next step, as defined in the array that was passed in the tip engine initialization
    nextTip: function () {
        $(TipEngine.tipElement).css("z-index", "9").removeClass("Glow");
        TipEngine.tipLayer.remove();

        if (TipEngine.current < TipEngine.tips.length - 1) {
            TipEngine.current++;
            TipEngine.showTip();
        }
    },

};


//initialize the tip engine on the page load event
$(function () {

    TipEngine.tips = [{
        elem: "#gameOfLifePanel",
        tipHtml: " \
                    <h3>About Conway's Game Of Life</h3> \
                    <p>The <B>Game of Life</b>, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970. \
                    <p>The 'game' is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input.  \
                    One interacts with the Game of Life by creating an initial configuration and observing how it evolves or, for advanced players, \
                    by creating patterns with particular properties. </p> \
                    <h3>About this application</h3> \
                    This is a Single Page Applicaiton built with the amazing application framework that is <B>Angular.JS</b>. \
                    Click inside the blue area to create multiple single cells and form the initial configuration. Then click 'Start' \
                    to allow the colony to evolve based on the rules of the game of life. \
                    ",
        left: "400px",
        top: "60px",
        width: "600px",
        height: "400px"
    }, {
        elem: "#controlsPanel",
        tipHtml: " \
                    <p> \
                    This green area on the right can be used to control your colony.<BR> \
                    <p>At any time you can stop the evolution by clicking the button 'Stop'. You can then make adjustments to the configuration by clicking \
                    inside the blue area and restart it again.</p> \
                    <p>Click 'Clear' to erase the entire colony and start over with a blank canvas on which you can create a new configuration.</p> \
                    <p>There are a number of presets that you can choose from, to see some interesting life forms that have been discovered by others. To load one \
                    of these presets, click the item and then click 'Start'</p> \
                    <p>Your colony can have one of the following states : \
                    <LI>Alive. It's alive and evolving, the population is increasing.</LI>  \
                    <LI>Still Life. It has stopped evolving but it's still alive. The population is constant.</LI>  \
                    <LI>Stable. It's alive, but stable. The population goes through a finite number of steps and returns to the first step.</LI>  \
                    <LI>Dead. All the cells have died.</LI>  \
                    </p></p>",
        left: "50px",
        top: "50px",
        width: "500px",
        height: "500px"
    }];


    //install the click event of the "Help" button
    $("#helpLink").click(function () {
        TipEngine.current = 0;
        TipEngine.showTip();
        return false;
    });

    // attach the .equals method to Array's prototype to call it on any array. This
    //is used when comparing two colonies to see if the colony is a still life.
    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time
        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            }
            else {
                var value1 = (this[i] != 0) ? 1 : 0;
                var value2 = (array[i] != 0) ? 1 : 0;
                if (value1 != value2) {
                    // Warning - two different object instances will never be equal: {x:20} != {x:20}
                    return false;
                }
            }
        }
        return true;
    }


});