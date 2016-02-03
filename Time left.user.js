// ==UserScript==
// @name         Time left
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows you the time it takes for the power bar to fill up.
// @author       Crownie88
// @match        http://reactoridle.com/
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(document).ready(function() {
    //Set the level of your chronometer
    var ChronometerLevel = 4;

    setTimeout(DoAddDiv, 1000);
    function MakeNum(num){
        var suff = ['Thousand','million','billion','trillion','quadrillion','quintillion','sextillion','septillion','octillion','nonillion','decillion'];
        while (num.charAt(0) === '+')
            num = num.substr(1);
        var myArr = num.split(" ");
        return parseFloat(myArr[0]) * parseInt(MakeMultiplier((suff.indexOf(myArr[1])+1)*3));
    }

    function TimeLeft(){
        if (document.getElementById("myOwn")){
            console.log("yup");
            var Sold = MakeNum($('#income').text());
            var incPerTick = MakeNum($('#powerProduction').text()) - Sold;
            if (incPerTick === 0){
                $('#timeLeft').text("Never");
            }else{
                var incPerSec = incPerTick * ChronometerLevel + 1;
                var Space = MakeNum($('#maxPower').text()) - MakeNum($('#power').text());
                $('#timeLeft').text(CalcTime(Math.ceil(Space / incPerSec)));
            }
            setTimeout(TimeLeft, 10);
        }
    }

    function CalcTime(seconds){
        var S = 0;
        var M = 0;
        var H = 0;
        var D = 0;
        S = seconds % 60;
        M = (seconds-S) / 60;
        if (M > 60){
            H = (M - (M % 60)) / 60;
            M = M % 60;
        }
        if (H > 24){
            D = (H - (H % 24)) / 24;
            H = H % 24;
        }
        return D.toString()+" days, "+H.toString()+" hours, "+M.toString()+" mins, "+S.toString() + " seconds";
    }

    function MakeMultiplier(zeroes){
        return "1".concat("0".repeat(zeroes));
    }
    
    function DoAddDiv(){
        if (document.body.innerHTML.indexOf("<tbody>") > -1) {
            if (!document.getElementById("myOwn")){
                var myDiv = document.createElement("div");
                myDiv.setAttribute('class', 'textLine');
                myDiv.setAttribute('id', 'myOwn');
                myDiv.innerHTML = "<span class='productionTitle'>Full in: </span><span class='power' id='timeLeft'></span>";
                var pbar = document.getElementsByClassName("powerBarArea");
                var ovb = document.getElementsByClassName("overviewBox");
                ovb[0].insertBefore(myDiv, pbar[0]);
                setTimeout(TimeLeft, 10);
            }
        }
        setTimeout(DoAddDiv, 500);
    };
});