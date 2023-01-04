import {render, ReactDOM } from "react-dom";
import {
	DialogBox,
	Toast
} from "../ui";
import {Provider} from 'react-redux'
import store from '../store'
 
const keyCodes = {
	ENTER: 13
}

const keyupListener = (e, keyCode, callback) => {
	var key = e.which || e.keyCode;
	key === keyCode && callback();
}

const isValidEmail = (e) => {
	let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
	return reg.test(e);
}

const focus = (id) => {
	try{
		document.querySelector(id).focus();
	}catch(e){}
}

const generateID = (len, k) => {	
	function s(k){
		var text = ""; var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";	
		for (var i = 0; i < k; i++){ text += possible.charAt(Math.floor(Math.random() * possible.length)); }
		return text;
	}
    var id = s(k); if(len > 1){ for(var n = 1; n < len; n++){ id += '-' + s(k); } } 
    return id;
}

const Dialog = (title, content,footer, close, action, extra) => {
	var ID = generateID(4, 6);
	var div = document.createElement('div');
	div.id = ID;
	document.body.appendChild(div);
	try{
	  var els = document.getElementsByClassName("dialogbox");
	  if(els.length > 0){
		for(var i = 0; i < els.length; i++){
		  els[i].classList.add('dialogbox-blur');
		}
	  }
	}catch(e){}
	if(!window.__modals){ window.__modals = [];}
	render(
		<Provider store={store}>
			<DialogBox ref={(ref)=>(window.__modals[ID] = ref)} ID={ID} title={title} content={content} footer={footer} action={action} close={close} extra={extra} />
		</Provider>, document.getElementById(ID)
		);
	return ID; 
}
  
const  addCommas = (nStr) => {
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
	 x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

const formatTime = (millisSinceEpoch) => {
	var secondsSinceEpoch = (millisSinceEpoch / 1000) | 0;
	var secondsInDay = ((secondsSinceEpoch % 86400) + 86400) % 86400;
	var seconds = secondsInDay % 60;
	var minutes = ((secondsInDay / 60) | 0) % 60;
	var hours = (secondsInDay / 3600) | 0;
	if(hours<10){ hours = '0'+hours; }
	return hours + (minutes < 10 ? ":0" : ":")
		+ minutes + (seconds < 10 ? ":0" : ":")
		+ seconds;
}

const moment = (date) => {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
  }


export {
	focus,
	generateID,
	isValidEmail,
    keyCodes, 
	keyupListener,
	Dialog,
	addCommas,
	formatTime,
	moment
}