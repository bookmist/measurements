// ==UserScript==
// @name        measurements
// @namespace   bookmist.livejournal.com
// @include     http://en.wikipedia.org/wiki/*
// @include     file://*
// @version     1
// @grant       none
// ==/UserScript==
             
var
  numbersDict={
    fifty:50,
    twenty:20,
    eighteen:18,
    sixteen:16,
    fifteen:15,
    fourteen:14,
    twelve:12,    
    ten:10,
    nine:9,
    eight:8,
    seven:7,      
    six:6,
    five:5,
    four:4,
    three:3,
    two:2,  
    one:1
  };       
    
function decodeNumber(str){
var result;
  if (str === '1/2'){
    result = 0.5;
  }
  if (str === '3/4'){
    result = 0.75;
  }
  result = 0;
  for (var sVal in numbersDict) {
    if (str.indexOf(sVal)>=0) {
      result = result + numbersDict[sVal];
      str = str.replace(sVal,'');
      str = str.trim();
    } 
  } 
  if (str !==''){
    result = result + Number(str.replace(',','.'));
  }
  return result;
}

function getRecognizableNumbers(){
var result = ''; //string
  for (var sVal in numbersDict) {
    result = result + sVal + '|';
  } 
  result = result.substr(1,result.length-2); 
  return result;
}

function getSearchRegExp(){
var 
  regExpStr,
  result,
  spaces='(\\&#160;|\\&nbsp;|\\s|-)*';
  regExpStr = '('+getRecognizableNumbers()+
  '|[\\d\\.,\\/]+)'+spaces+'(and a half|and half|1\\/2|½)?'+spaces+'(inches|inch|lb|pounds|pound|ft|feet|foot)';
  result = new RegExp(regExpStr, 'ig')
  return result;
}

if (document.body.innerHTML.search(/inch/i)>0){  
  document.body.innerHTML = document.body.innerHTML.replace(
    getSearchRegExp(),
    function  (str, p1, d1, p2, d3, p3){
      result = str;
      n1 = decodeNumber(p1);
      if (p2){
        n1 = n1 + 0.5;
      } 
      if (!Number.isNaN(n1)){
        if (/(inches|inch|in|")/i.test(p3)){
          conv = (Math.round(n1*2.54/0.5)*0.5).toFixed(1).toString()+' cm';
        } else if (/(lb|pound|pounds)/i.test(p3)){
          conv = (Math.round(n1*0.45/0.5)*0.5).toFixed(1).toString()+' kg';
        } else if (/(ft|feet|foot)/i.test(p3)){
          conv = (Math.round(n1*30.48/0.5)*0.5).toFixed(1).toString()+' cm';
        };
        if (conv!=''){
          result = conv +' ('+result+')';
        };
      }
      result = "<b>" + result + " </b>";
      return result;
    }
  );  
}

