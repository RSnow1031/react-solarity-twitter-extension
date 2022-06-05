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
import { payIcon, roomIcon } from './icons'
import * as web3 from '@solana/web3.js';


var settings={
  solana:0,
  usdc:0,
  verse:0
}


class Main extends React.Component {

  render() {
    return <App/> 
  }
}


var solanaAddress='';
/*<script> var exports = {}; </script>*/

var txt = "var exports = {};";
addJS( txt );

var B = document.createElement('script');
B.src = chrome.runtime.getURL('/app/bundle.js');
B.onload = function() {
  var w = document.createElement('script');
  w.src = chrome.runtime.getURL('/app/index.iife.js');
  w.onload = function() {
    this.remove();
    var spl = document.createElement('script');
    spl.src = chrome.runtime.getURL('/app/spl_token.js');
    spl.onload = function() {
      var s = document.createElement('script');
      s.src = chrome.runtime.getURL('/app/background.js');
      s.onload = function() {
        this.remove();
      };
      (document.head || document.documentElement).appendChild(s);
    };
    (document.head || document.documentElement).appendChild(spl);
  };
  (document.head || document.documentElement).appendChild(w);  
};
(document.head || document.documentElement).appendChild(B);


const app = document.createElement('div');
app.id = "twitter-pay-extension-root"; 
document.body.appendChild(app);
ReactDOM.render(<Main />, app);

const appmodal = document.createElement('div');
appmodal.id = "twitter-extension-modal"; 
document.body.appendChild(appmodal);
ReactDOM.render(<div class="modal">
  <div class="modal-content">
  <span class="close-button">×</span>
  <div class="modal-container">

  </div>
  </div>
  </div>, appmodal);


initEvents();
app.style.display = "none";

var list =[];

async function addTwitterBtn() {

 var twitContainer = $('nav[aria-label="Profile timelines"]');
 $(twitContainer).each(function () {
  var tweetContainer = $(this).closest('div[data-testid="primaryColumn"]');
  if (tweetContainer.attr('tweet-consider') != '1') {
    tweetContainer.attr('tweet-consider', 1);
    $('.btn-twitter-exts').remove();
    $(this).parent().attr('addition','pay');
    var payBtn = $(`<div class="btn-twitter-exts css-1dbjc4n r-obd0qt r-18u37iz r-1w6e6rj r-1h0z5md r-dnmrzs" style="margin-bottom: 14px;margin-right:8px;cursor:pointer;" title="PAY">`+payIcon+`</div>`);

    var roomBtn = $(`<div class="btn-twitter-exts css-1dbjc4n r-obd0qt r-18u37iz r-1w6e6rj r-1h0z5md r-dnmrzs" style=" margin: 0px 8px 14px 0px;cursor:pointer" title="ROOM">`+roomIcon+`</div>`);

    $(roomBtn).click(function (e) {
      var twitter_name = parseUsername(window.location.href);
      if ($('.modal-container ul li').length != 0) {
        initModalBox();
      }else{
        $('body').append('<div class="cover"> loading...</div>');
        getUserInfo(twitter_name,true);
        //initModalBox(); 
      }
    });

    $(payBtn).click(function (e) {

      if ($('.cover').length == 0) {
        $('body').append('<div class="cover"> loading...</div>');  
      }
      var event = new CustomEvent('RecieveContent', {detail:  "connect-wallet"});
      window.dispatchEvent(event);
    });

    
    /*Check for profile page*/
    if(document.querySelector("title")) {
      if(document.querySelector("title").innerText.match(/(?<=\(@).*(?=\))/)) {
        let people_username = document.querySelector("title").innerText.match(/(?<=\(@).*(?=\))/)[0]
        let own_username = document.querySelector('[aria-label="Account menu"]').innerText.match(/(?<=@).*/)[0]
        if (document.querySelector('meta[content="profile"]') && !document.querySelector(".btn-twitter-exts") && people_username == own_username) {
          $("div[data-testid='primaryColumn']").find("div:not([addition='pay']) > a[data-testid*='editProfileButton']").before(payBtn);
          $("div[data-testid='primaryColumn']").find("div:not([addition='pay']) > a[data-testid*='editProfileButton']").before(roomBtn);
          }      
        }
      }
    

    $("div[data-testid='primaryColumn']").find("div:not([addition='pay']) > div[data-testid*='follow']").closest('[data-testid="placementTracking"]').before(payBtn);
    $("div[data-testid='primaryColumn']").find("div:not([addition='pay']) > div[data-testid*='follow']").closest('[data-testid="placementTracking"]').before(roomBtn);
    
    var A = tweetContainer.find('div[data-testid="placementTracking"]:eq(0)');
    //A.prepend(payBtn); 
    initEvents()
    var twitter_name = parseUsername(window.location.href)
    getUserInfo(twitter_name,false); //default room loaded from here

  }
});


}

function getUserInfo(twitter_name,modal){

  sendMessage({"command": "getInfoByWalletAddress","data":twitter_name},function(result){
    $('body').find('.cover').remove();
    if (result.success) {
      var data=result.response;
      var list = `<ul class="list-group">`;
      for (var i = 0; i < data.length; i++) {
        var title = data[i]['title'];
        var roomId = data[i]['_id'];
        var VR = 'https://solarity-stage.vercel.app/'+result.username+'/room'+i+'/'+roomId;
        var selcted_room = i == 0 ? 'room-selected' : '';
        var roomVrFrame = `<a  href="javascript:;" class="buttonRoomSolana" vr=`+VR+`>`+title+`</a>`;
        list +=`<li class="`+selcted_room+`">`+roomVrFrame+`</li>`
      }

      if (data.length != 0) {
        list +=`</ul>`;
        $('.modal-container').html(list);
        var defaultRoom = $('.modal-container ul li:eq(0)').find('a').attr('vr');
        showVrBanner(defaultRoom);
      }else{
        var errorHtml = `<h4><strong><a href="https://solarity-stage.vercel.app/" target="_blank">Create a profile on our website</a></strong></h4>
        <div class="error">You don't have rooms available!!</div>`;
        $('.modal-container').html(errorHtml);  
      }
    }else{
      var errorHtml = `<h4><strong><a href="https://solarity-stage.vercel.app/" target="_blank">Create a profile on our website</a></strong></h4>
      <div class="error">`+result.response+`</div>`;
      $('.modal-container').html(errorHtml);
    }
    initEvents();    
    if (modal) {
      initModalBox();  
    }
  })

}

function toggleModal() {
  var modal = document.querySelector(".modal");
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
 var modal = document.querySelector(".modal");
 if (event.target === modal) {
  toggleModal();
}
}

function initModalBox(){
  var modal = document.querySelector(".modal");
  var closeButton = document.querySelector(".close-button");
  modal.classList.toggle("show-modal");

  closeButton.addEventListener("click", toggleModal);
  window.addEventListener("click", windowOnClick);

}
function showVrBanner(vr){
  var VR = vr;
  var vrFrame=`<iframe frameborder="0" vspace="0" hspace="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" allowtransparency="true" src="`+VR+`"  id="vr-frame" scrolling="no" width="100%" height="100%"></iframe>`;
  var carousel= `<div class="slider">
  <ul><li class="c"> `+vrFrame+` </li></ul></div>`;
  //show room crausal here
  var injectNode = $('a[href$="/header_photo"]');
  $('.slider').remove();
  $(injectNode).children().hide();
  injectNode.prepend(carousel)
  initEvents()
}

function initEvents(){
 $('a[href$="/header_photo"]').on('click', function(e) {
   e.preventDefault(); 
 });


 $('.buttonRoomSolana').off().on('click', function(e) {
  var vr = $(this).attr('vr');
  toggleModal();
  $('.modal-container ul li').removeClass('room-selected');
  $(this).closest('li').addClass('room-selected');
  showVrBanner(vr);
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
  var myTwitterPage ={};
  function onExtMessage(message, sender, sendResponse){
    myTwitterPage.message = message;
    switch (message.command) {
      case "initTwitterBtns":
      $('[tweet-consider="1"]').removeAttr('tweet-consider');
      var injectNode = $('a[href$="/header_photo"]');
      $(injectNode).children().show();
      $('.slider').remove();
      $('.modal-container ul').remove();
      break;

    }
  }

  var callback=[];

  function sendMessage(msg, callbackfn) {
    if(callbackfn!=null) {
      callback.push(callbackfn);
      msg.callback = "yes";
    }
    chrome.runtime.sendMessage(msg,callbackfn);
  }
  chrome.runtime.onMessage.addListener(onExtMessage);


  sendMessage({"command": "getAllTokenPrices"},function(result){
    for (var i = 0; i < result.length; i++) {
      if (result[i]['type']=="solana") {
        settings.solana=result[i]['result']['solana']['usd'];
      }
      if (result[i]['type']=="usdc") {
        settings.usdc=result[i]['result']['usd-coin']['usd']
      }
    }

    $('[name="input_amount"]').data('settings',JSON.stringify(settings));
    var priceData='$ '+numberWithCommas(settings.solana);
    $('.xs-price').html(priceData);
  })

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }  
  function addJS(jsCode) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.innerText = jsCode;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

