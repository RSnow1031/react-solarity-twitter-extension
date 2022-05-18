/*global chrome*/
/* src/content.js */

import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import { useEffect, useState } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import $ from 'jquery'; 
import App from "./App";
import AppW from "./App.test";
import * as web3 from '@solana/web3.js';


class Main extends React.Component {
  render() {
    return <App/> 
  }
}

var solanaAddress='';
var B = document.createElement('script');
B.src = chrome.runtime.getURL('/app/bundle.js');
B.onload = function() {
var w = document.createElement('script');
w.src = chrome.runtime.getURL('/app/index.iife.js');
w.onload = function() {
  this.remove();
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('/app/background.js');
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);

};
(document.head || document.documentElement).appendChild(w);  
};
(document.head || document.documentElement).appendChild(B);


const app = document.createElement('div');
app.id = "twitter-pay-extension-root"; 

document.body.appendChild(app);
ReactDOM.render(<Main />, app);
initEvents();
app.style.display = "none";


async function addTwitterBtn() {
 var twitContainer = $('nav[aria-label="Profile timelines"]');
 $(twitContainer).each(function () {
  var tweetContainer = $(this).closest('div[data-testid="primaryColumn"]');
  if (tweetContainer.attr('tweet-consider') != '1') {
    tweetContainer.attr('tweet-consider', 1);
    $('.btn-twitter-ext').remove();

    var payBtn= $('<div class="btn-twitter-ext" style="text-align: right; position: absolute;right: 240px;"><a  href="javascript:;" class="buttonPAYTwitter">PAY</a></div>');

    $(payBtn).click(function (e) {
      if ($('.cover').length == 0) {
        $('body').append('<div class="cover"> <span class="glyphicon glyphicon-refresh w3-spin preloader-Icon"></span> loading...</div>');  
      }
      var event = new CustomEvent('RecieveContent', {detail:  "connect-wallet"});
      window.dispatchEvent(event);
    });

    var A = tweetContainer.find('div[data-testid="placementTracking"]:eq(0)');
    A.prepend(payBtn); 
    initEvents()



  }
});


}

function initEvents(){
 $('a[href$="/header_photo"]').on('click', function(e) {
   e.preventDefault(); 
 });

 $('.a-c-sign').keyup(function() {
  $(this).css('width', ($(this).val().length*30)+'px')
});

 $('.btn-c-select').off().on('click', function(e) {
  const svg = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-check">
  <path d="M10 3L4.5 8.5L2 6" stroke="#1149FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;
  $('.btn-c-select').find('.svg-check').remove();
  $(this).append(svg);
});


}

function startchekingTwitter(){
  const isPageFocused = document.visibilityState == "visible" ? true : false;
  if ( isPageFocused == true ) {
    addTwitterBtn();
  }    
  setTimeout(function(){
    startchekingTwitter();
  }, 1500);  
}

function parseUsername(url)
{
  let output = url;
  let matches;

    // Parse username
    matches = url.match(/(?:https?:\/\/)?(?:www.)?(?:twitter|medium|facebook|vimeo|instagram)(?:.com\/)?([@a-zA-Z0-9-_]+)/im);

    // Set output
    output = matches.length ? matches[1] : output;

    return output;
  }
  startchekingTwitter();


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action") {
        initModalBoxPay();
      }
    }
    );
  function initModalBoxPay(isPay){
    app.style.display = "block";
    $('.xl.block').removeClass('disaled-pay')
    if (isPay == '') {
    $('.send-username').html('Send to '+parseUsername(window.location.href))
    $('#solarity-extension-payment').show();
    }else{
    $('.xl.block').addClass('disaled-pay');
    $('.send-username').html(`<div style="color:red;">`+isPay+' '+parseUsername(window.location.href)+`</div>`)
    $('#solarity-extension-payment').show();
    }
  }

  function getUserInfoForPay(){
    sendMessage({"command": "getInfoByWalletAddress","data":parseUsername(window.location.href)},function(result){
      $('body').find('.cover').hide();
      if (result.success) {
        solanaAddress=result.solanaAddress;
        initModalBoxPay('');
      }else{
        initModalBoxPay('You Can\'t pay to');
      }
    
    initEvents();    
  })

  }

  window.addEventListener('RecieveContentApp', function(evt) {
   if (evt.detail.msg == "pay-wallet") {

    var event = new CustomEvent('RecieveContent', {detail: { 'msg': "made-transaction", amoutn:evt.detail.amount,currency:evt.detail.currency,solanaAddress:solanaAddress }});
    window.dispatchEvent(event);
  }
  
})

  window.addEventListener('RecieveWallate', function(evt) {
    if (evt.detail.msg == "recieve-wallet") {
      const publicKey = evt.detail.publicKey;
      getUserInfoForPay();
      //initModalBoxPay()
    }


  })

  window.addEventListener('sendTransactionEvent', function(evt) {
    sendMessage({"command": "getTransaction","data":{input:evt.detail.input, init:evt.detail.init}},function(response){
      var _response = btoa(JSON.stringify(response));

      var event = new CustomEvent('RecieveTransaction', {detail:  _response,res:_response});
      window.dispatchEvent(event);
    });
    
  })




  

  var callback=[];

  function sendMessage(msg, callbackfn) {
    if(callbackfn!=null) {
      callback.push(callbackfn);
      msg.callback = "yes";
    }
    chrome.runtime.sendMessage(msg,callbackfn);
  }