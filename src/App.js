/*global chrome*/
import { useState } from "react";
import React, { Component } from 'react';
import $ from 'jquery'; 
import logo from './logo.svg';
import SOL from './SOL.svg';
import USDC from './USDC.svg';
import VERCE from './VERCE.svg';


const sol = chrome.runtime.getURL('static/media/SOL.svg')
const usdc = chrome.runtime.getURL('static/media/USDC.svg')
const verce = chrome.runtime.getURL('static/media/VERCE.svg')


 function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 } 
class App extends Component {

constructor() {
    super();
    this.state = {
    input_amount:1,
    amout:0,
    };
    this.onInputchange = this.onInputchange.bind(this);
    
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
    
    var currency = $('.currency-selcted-ext .sm').text();
    var type='usdc';
    if (currency == 'SOL') {
     var type='solana';
    }
    if (currency == 'VERSE') {
     var type='solana';
    }
    
    let inputVal = event.target.value != ""?event.target.value:0;
    let settingsS = $('[name="input_amount"]').data('settings');
    let settings = JSON.parse(settingsS);
    let finalP = (parseFloat(inputVal) * settings[type]).toFixed(2);
    var priceData= '$ '+numberWithCommas(finalP);
    $('.xs-price').html(priceData);
  }
 

btnTipContinue(event) {
 var event = new CustomEvent('RecieveContentApp', {detail: { 'msg': "pay-wallet", amount:$('.a-c-sign').val(),currency:$('.currency-selcted-ext img').attr('alt') }});
  window.dispatchEvent(event); 
  $('body').find('.cover').show();
}

continueToPay(amount){
this.state.amout=amount;
$('.amount').removeClass('active');
$('button[ value="'+amount+'"]').addClass('active');

}

btnTipCancel(event) {
$("#second-screen").hide();
$('#first-screen').show();
} 
onCancelClick(event) {
$("#second-screen").hide();
$('#first-screen').show();
}

onContinueClick(event) {
const targetC = $(".btn-c-select").find('.svg-check').parent();
const src = $(targetC).find('img').attr('src');
const alt = $(targetC).find('img').attr('alt');
$('.currency-selcted-ext').find('img').attr('src',src);
$('.currency-selcted-ext').find('img').attr('alt',alt);
$('.currency-selcted-ext').find('span.sm').text(alt);
$("#second-screen").hide();
$('#first-screen').show();
let settingsS = $('[name="input_amount"]').data('settings');
let settings = JSON.parse(settingsS);
let input_val = $('[name="input_amount"]').val() != ""?$('[name="input_amount"]').val():0;

$('.xs-price').show();
if(alt == "SOL"){
  $("#CURRENCY-SIGN").text('SOL');
 let finalP = (parseFloat(input_val) * settings.solana).toFixed(2);
 var priceData= '$ '+numberWithCommas(finalP);
 $('.xs-price').html(priceData);
}else if(alt == "USDC"){
  $("#CURRENCY-SIGN").text('USDC');
  let finalP = (parseFloat(input_val) * settings.usdc).toFixed(2);
  var priceData= '$ '+numberWithCommas(finalP);
  $('.xs-price').html(priceData);
}else{
  $("#CURRENCY-SIGN").text('VERSE');
  $('.xs-price').hide();
}

}

currencySelcte(event) {
$("#first-screen").hide();
$('#second-screen').show();
}

closePayModal(event) {
$('#twitter-pay-extension-root').hide();
$('#solarity-extension-payment').hide();
$("#second-screen").hide();
$('#first-screen').show();
}


render() {
const { items } = this.state;
return (
<div id="solarity-extension-payment" className="open" >
  <div className="main-wrapper-pay">
    <div className="header-wrapper">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="close-btn-svg" onClick={this.closePayModal}>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.52295 3.52197C3.7749 3.27002 4.18339 3.27002 4.43534 3.52197L10.0007 9.08728L15.566 3.52197C15.8179 3.27002 16.2264 3.27002 16.4784 3.52197C16.7303 3.77392 16.7303 4.18242 16.4784 4.43437L10.913 9.99967L16.4784 15.565C16.7303 15.8169 16.7303 16.2254 16.4784 16.4774C16.2264 16.7293 15.8179 16.7293 15.566 16.4774L10.0007 10.9121L4.43534 16.4774C4.18339 16.7293 3.7749 16.7293 3.52295 16.4774C3.271 16.2254 3.271 15.8169 3.52295 15.565L9.08825 9.99967L3.52295 4.43437C3.271 4.18242 3.271 3.77392 3.52295 3.52197Z" fill="#fff"></path>
      </svg>
      <div className="currency-selcted-ext" onClick={this.currencySelcte}>
        <img src={sol} alt="SOL"/>
        <span className="sm">SOL</span></div>
      </div>
       <div id="first-screen" >
        <div className="wrapper-amout-enter">
          <span className="amount-txt-tip">0</span>
          <div className="inner-div-wrapper-a">
            <p className="p-txt md bold send-username"></p>
            <div className="a-c-1">
              <div className="a-c-2">
              <input className="a-c-sign"
              name="input_amount"
              type="text"
              autocomplete="off"
              value={this.state.input_amount}
              onChange={this.onInputchange}
              />
              <strong className="a-c-dollar" id="CURRENCY-SIGN">SOL</strong>
              </div>
              <p class="xs-price"></p>
              </div>
              <div className="c-footer-btns">
                <button className="xl block" ext-type="solarity" id="tip-continue" onClick={this.btnTipContinue} >Continue</button>

              </div>
            </div>
          </div>
        </div>
      <div className="choose-currency-option" id="second-screen">
        <div className="select-currency-wrapper">
          <p className="p-tag md bold">Select Currency</p>
          <div className="inner-wrapper-c">
            <button className="btn-c-select btn-c-bg amount md">
              <img src={sol} alt="SOL" />
              <span className="sm bold">SOL</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-check">
                <path d="M10 3L4.5 8.5L2 6" stroke="#1149FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <button className="btn-c-select btn-c-bg amount md">
              <img src={verce} alt="VERSE" />
              <span className="sm bold">VERSE</span>
            </button>
            <button className="btn-c-select btn-c-bg amount md">
              <img src={usdc} alt="USDC" />
              <span className="sm bold">USDC</span>
            </button>
          </div>
          <div className="c-footer-btns">
            <button className="outline sm" id="cancel-select-currency" onClick={this.onCancelClick}>Cancel</button>
            <button className="sm" ext-type="solarity" id="continue-select-currency" onClick={this.onContinueClick}>Continue</button>

          </div>
        </div>

      </div>
     
      </div>
    </div>
    );
  }
}

export default App;
