import { 
    generateID 
} from "../../core";

const __Toast = function(){
	var self = this;
	self._container = null;
	
	const _defaults = {
		message: 'Aw snap! Your request was not successfull',
		timeLeft: 4
	}

	const _Toast = (options) => {

		const {html, labelOK, type, time} = options;
		var tout = null,
		ID = 'toast-' + generateID(5, 4),
		toast = document.createElement('div'),
		toastBG = document.createElement('div'),
		btn = document.createElement('button');

		toast.id = ID;
		toast.classList = 'toast fixed toast-' + (type || 'error');
		toastBG.id = "bg-" + ID;
		toastBG.classList = "rel flex bg font s14";
		toastBG.innerHTML = html == null ? _defaults.message : html;
		toast.appendChild(toastBG);

		btn.className = 'font b s14';
		btn.textContent = labelOK || "OK";
		btn.addEventListener("click", ()=>{ _dismiss(); });

		toastBG.appendChild(btn);
		self._container.appendChild(toast);
		
		self.arrangeToasts()
		.then(()=>{
			setTimeout(()=>{
				let tost = document.querySelector("#"+ID);
				tost.classList.add("visible");
				tout = setTimeout(()=>{ _dismiss(); }, (time || _defaults.timeLeft) * 1000);
				setTimeout(()=>{
					let tost = document.querySelector("#bg-"+ID);
					tost.classList.add("bgv");					
				}, 200);
			}, 10);
		});

		const _dismiss = () => {
			tout && clearTimeout(tout);

			let tostbg = document.querySelector("#bg-"+ID);
			tostbg && tostbg.classList.remove("bgv");
			setTimeout(()=>{
				let tost = document.querySelector("#"+ID);
				tost && tost.classList.add("hidden");			
				setTimeout(()=>{
					try{
						document.getElementById(ID).parentNode.removeChild(document.getElementById(ID));
					}catch(e){}
					self.arrangeToasts();
				}, 200);
			}, 200);
		}
	}

	self.arrangeToasts = () => {
		return new Promise((resolve, reject) => {
			var toasts = document.querySelectorAll(".toast"),
			top = 100, i = toasts.length;
			while(i--){
				toasts[i].style.top = top + "px";
				top += parseInt(getComputedStyle(toasts[i]).height.replace('px', '')) + 6;
			}
			resolve();
		});
	}

	self.createContainer = () => {
		var container = document.createElement('div');
		container.id = 'toast-container';
		document.body.appendChild(container);
        self._container = container;
	}

	self.show = (options) => {
		self._container === null && self.createContainer();
		_Toast(options);
	};

	self.dismisAll = () => {
		var toasts = document.getElementsByClassName('toast'),
		i = toasts.length;
		while(i--){
			toasts[i].parentNode.removeChild(toasts[i]);
			self.arrangeToasts();
		}	
	}
}

const Toast = new __Toast();
export default Toast;