var animatron = (function(){
	
	var animateIn = function (idToShow, showAnimation){
	  
	  var el = document.querySelector(idToShow);
    var startEvent = 'bc.animation.in.started';
    var endEvent = 'bc.animation.in.ended';
	  
	  //Start Event
    if (window.CustomEvent) {
      event = new CustomEvent(startEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(startEvent, true, true, {some: 'data'});
    }    
    el.dispatchEvent(event);       	
	  
	  //Quitamos display none
	  el.classList.remove('is-hidden');
	  el.classList.add('anim-is-showing');
	
	  //Lo mantemos oculto con height 0 y animamos la aparición del elemento
	  setTimeout(function(){ 
	      el.classList.remove('anim-is-showing');
	      el.classList.add('anim-is-waiting');      
	  },250);
	  
	  setTimeout(function(){ 
	      el.classList.add('animated');
	      el.classList.add(showAnimation);
	  }, 500);
	  
	  //Limpiamos las clases de animaciones una vez termine
	  
	  
	  var cssClean = function(){
  	  
  	  el.classList.remove('animated');
  	  el.classList.remove('anim-is-waiting');    
  	  el.classList.remove(showAnimation);    
  	  
	  };
	  
	  el.addEventListener('webkitAnimationEnd', cssClean);
	  el.addEventListener('oanimationend', cssClean);
	  el.addEventListener('msAnimationEnd', cssClean);
	  el.addEventListener('animationend', cssClean);	  
	  

	  //End Event
    if (window.CustomEvent) {
      event = new CustomEvent(endEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(endEvent, true, true, {some: 'data'});
    }
    el.dispatchEvent(event);
	    
	};
	
	var animateOut = function animateOut (idToHide, hideAnimation){
  	
    //Animación por defecto
    if (hideAnimation === null){
      hideAnimation = 'fadeOut';
    }
    
    //Convertimos a objeto
  	if ( typeof(idToHide) === 'object' ){
    	el = idToHide;
  	}else{
    	el = document.querySelector(idToHide);
  	}  	
  	
  	console.log(typeof(el));
	  
    var startEvent = 'bc.animation.out.started';
    var endEvent = 'bc.animation.out.ended';
	  
	  //Start Event
    if (window.CustomEvent) {
      event = new CustomEvent(startEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(startEvent, true, true, {some: 'data'});
    }    
    el.dispatchEvent(event);       
	  
	  // Se anima a opacity 0 animated fadeOut
	  el.classList.add('animated');
	  el.classList.add(hideAnimation);
	  
	  
	  var animationEnd = function(){
  	  
	      el.classList.add('anim-is-hiding');      
	  
	      // Se le pone display none is-hidden, timeOut  
	      // Se eliminan clases de animación animated fadeOut
	      setTimeout(function(){ 
	          el.classList.add('is-hidden');
	          el.classList.remove('animated');
	          el.classList.remove('anim-is-hiding');
	          el.classList.remove(hideAnimation);
	      }, 1000);  	  
  	  
	  };
	  
	  el.addEventListener('webkitAnimationEnd', animationEnd);
	  el.addEventListener('oanimationend', animationEnd);
	  el.addEventListener('msAnimationEnd', animationEnd);
	  el.addEventListener('animationend', animationEnd);	  
	  
	  
	  //End Event
    if (window.CustomEvent) {
      event = new CustomEvent(endEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(endEvent, true, true, {some: 'data'});
    }
    el.dispatchEvent(event);
	  
	};
	
	

	
  var animateChain = function(animArray){
    
    i=0;
    var delayAnimate = 0;
  
    animArray.forEach(function(element) {
    
        idAnimate= document.querySelector(animArray[i][0]);
        delayAnimate += animArray[i][1];  
        CSSAnimate = animArray[i][2];
                
      setTimeout(function(){ 
        console.log(CSSAnimate);
        idAnimate.classList.add(CSSAnimate);
        
      }, delayAnimate);
  
        i++;
    });
    
  };
	
	
	return {
		animateIn: animateIn,
		animateOut: animateOut,
	};
	
	
})();

//Only for bit
/*  --------------------------------------------------
  DOM Ready
-------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function() {
   
  var dataDismissElements = document.querySelectorAll('[data-id-dismiss]');
  
  if ( dataDismissElements.length > 0 ) {
    Array.prototype.forEach.call(dataDismissElements, function(el, i){

    el.addEventListener('click', function(){
      
      var idToClose = this.getAttribute('data-id-dismiss');
      
      if (idToClose) {
      
        // Si el attr es this, es que quiere que se cierre a si mismo.
        if ( idToClose === 'this' ){        
          idToClose = this.parentNode;       
        }
      
        //Que Animación?
        var exitAnimation = this.getAttribute('data-animation');
              
        //Animación por defecto
        if( exitAnimation === undefined ){
          
          exitAnimation = 'fadeOut';
        }          
        
       animatron.animateOut (idToClose, exitAnimation);
      }  
      
    });


    });          
  }

});
// Cierre DOM Ready abierto al inicio de la página



//Only for bit
document.addEventListener('DOMContentLoaded', function() {


  dataChangeElements = document.querySelectorAll('[data-original-text]');
    
  if ( dataChangeElements.length > 0 ) {
    Array.prototype.forEach.call(dataChangeElements, function(el, i){

    el.addEventListener('click', function(){
      
      var originalText = this.getAttribute('data-original-text');
      var newText = this.getAttribute('data-new-text');
      
      //Cambiamos los textos para el próximo click
      this.setAttribute('data-original-text',newText);
      this.setAttribute('data-new-text',originalText);
      
      this.innerHTML = newText;      
      
    });    

    });          
  }
  
  
}); // Cierre DOM Ready abierto al inicio de la página
//Only for bit
 var collapse = (function(){
    
    var click = function(e){
      
      e.preventDefault();  
              
      //els
      var elbutton = this;
      var accordion = elbutton.getAttribute('data-parent');
      var collapseTarget = elbutton.getAttribute('data-target');    
      
      el = document.querySelector(collapseTarget);
          
      if (accordion){
        //Accordion special behavior, closing siblings collapses          
        var accordionCollapses = document.querySelector(accordion).querySelectorAll('.is-visible:not('+collapseTarget+')');
        
        Array.prototype.forEach.call(accordionCollapses, function(el, i){
          collapse.hide(el,el);
        });
      }
      
      
      //We toggle the collapse
      if (elbutton.getAttribute('aria-expanded') == 'true' ){
        collapse.hide(el);
      }else{
        collapse.show(el);
      }
      
      //Prevent body anchor if used in <a href></a>
      return false;        
      
    };
    

    var collapseCheckAutoHide = function(){
      // We set the collapse open if data-responsive-auto-open is present
      
      elements = document.querySelectorAll('[data-responsive-auto-open]');
      
      var windowWidth = window.innerWidth;
      var xsBreak = 767;
      var smBreak = 991;
      var mdBreak = 1439;

      
      Array.prototype.forEach.call(elements, function(el, i){
      
        //console.log(el);
      
        autoHide = el.getAttribute('data-responsive-auto-open');
      
        if ( autoHide === 'xs' && windowWidth <= xsBreak ){
          collapse.show(el);
        }else
        if ( autoHide === 'sm' && windowWidth <= smBreak ){
          collapse.show(el);
        }else
        if ( autoHide === 'md' && windowWidth <= mdBreak ){
          collapse.show(el);
        }else{
          collapse.hide(el);
        }
      
      
      });
      
    };   
    

    var show = function(el){
    
      //convertimos string a object si llamamos mediante método
      if(typeof(el) === 'string'){
        el = document.querySelector(el);
      }
      
      var elbutton = document.querySelector('[data-target="#'+el.getAttribute('id')+'"]');
            
      var startEvent = 'bc.is.showing';
      var endEvent = 'bc.is.visible';
      
      //Start Event
      if (window.CustomEvent) {
        event = new CustomEvent(startEvent, {detail: {some: 'data'}});
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(startEvent, true, true, {some: 'data'});
      }    
      el.dispatchEvent(event);       
        
      el.classList.add('is-visible');  
            
      el.setAttribute('aria-expanded','true');  
      elbutton.setAttribute('aria-expanded','true');  
    
    
      //End Event
      if (window.CustomEvent) {
        event = new CustomEvent(endEvent, {detail: {some: 'data'}});
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(endEvent, true, true, {some: 'data'});
      }
      el.dispatchEvent(event);
          
    };
    
    var hide = function(el){

      //convertimos string a object si llamamos mediante método
      if(typeof(el) === 'string'){
        el = document.querySelector(el);
      }

      var elbutton = document.querySelector('[data-target="#'+el.getAttribute('id')+'"]');
      
      var startEvent = 'bc.is.hiding';
      var endEvent = 'bc.is.hidden';
      
      //Start Event
      if (window.CustomEvent) {
        event = new CustomEvent(startEvent, {detail: {some: 'data'}});
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(startEvent, true, true, {some: 'data'});
      }    
      el.dispatchEvent(event);       
    
      el.classList.remove('is-visible');
      
      //animateOut(el, 'is-hidden');
      
      el.setAttribute('aria-expanded','false');
      elbutton.setAttribute('aria-expanded','false');
    
      //End Event
      if (window.CustomEvent) {
        event = new CustomEvent(endEvent, {detail: {some: 'data'}});
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(endEvent, true, true, {some: 'data'});
      }
      el.dispatchEvent(event);
      
    };
    
    var toggle = function(el){
      
      //convertimos string a object si llamamos mediante método
      if(typeof(el) === 'string'){
        el = document.querySelector(el);
      }
      
      if (el.getAttribute('aria-expanded') == 'true'){        
        collapse.hide(el);
      }else{
        collapse.show(el);
      }   
      
    };    
    
    var bindFunctions = function() {
      
      var elements = document.querySelectorAll('[data-toggle="collapse"]');
       
      Array.prototype.forEach.call(elements, function(el, i){
	    
        el.addEventListener('click', click);
        
      });
      
    };
      
    
    var init = function() {
	   
      bindFunctions();

	  return 'Collapse init';

      
    };
  
    return {

      init: init,
      show : show,
      hide : hide,
      toggle : toggle,
      collapseCheckAutoHide: collapseCheckAutoHide,

    };
  
      
    
  })();
  



//Accordions controlados mediante <select>
selectCollapses = document.querySelectorAll('select[data-accordion-select]');

Array.prototype.forEach.call(selectCollapses, function(el, i){
  el.addEventListener('change', function(e){
    var optionSelected = el.options[el.selectedIndex].getAttribute('data-target');
        //Trigger click
        var event = document.createEvent('HTMLEvents');
        event.initEvent('click', true, false);
        document.querySelector(optionSelected).dispatchEvent(event);    

  });
});




// Init auto Hide
collapse.collapseCheckAutoHide();

//Resize event
window.addEventListener("resize", collapse.collapseCheckAutoHide);


document.addEventListener("DOMContentLoaded",function(t){
	
	collapse.init(event);		
	
});
//Only for bit
document.addEventListener('DOMContentLoaded', function() { // DOM Ready

    var inputNumberButtons = document.querySelectorAll('input[type=number][data-controls]');
    
    if(inputNumberButtons > 0){
     
      Array.prototype.forEach.call(inputNumberButtons, function(el, i){
      
        console.log(el);
      
        if( el.getAttribute('data-controls') !== undefined ){
            el.insertAdjacentHTML('afterend','<button type="button" class="input-more addon" title="Aumentar">+</button>');
            el.insertAdjacentHTML('beforebegin','<button type="button" class="input-less addon" title="Reducir">-</button>');
        }    
      
      });
      
      var inputNumberButtonMore = document.querySelector('.input-more');
      
      inputNumberButtonMore.addEventListener('click', function(event){
          //Evitamos que se cierre el dropdown
          event.stopPropagation();
          event.preventDefault();
   
           //Tenemos en cuenta el limite
           var curLimit = this.previousElementSibling.getAttribute('max');
           var curVal = this.previousElementSibling.value;
  
           if (curLimit == curVal){ return false; }                    
   
           curVal = parseFloat(curVal);
           this.previousElementSibling.value = curVal+1;
        
      });    
      
      var inputNumberButtonLess = document.querySelector('.input-less');
      inputNumberButtonLess.addEventListener('click', function(event){
          //Evitamos que se cierre el dropdown
          event.stopPropagation();
          event.preventDefault();
   
           //Tenemos en cuenta el limite
           var curLimit = this.nextElementSibling.getAttribute('min');
           var curVal = this.nextElementSibling.value;
  
           if (curLimit == curVal){ return false; }                    
   
           curVal = parseFloat(curVal);
           this.nextElementSibling.value = curVal-1;
        
      });    
     
      
    }    
 
 }); // Cierre DOM Ready abierto al inicio de la página
//Only for bit
function isInViewport(el){

  var position = el.getBoundingClientRect();
  
  currentScrollPosition = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight ;
  elementScrollPosition = position.top;

  if ( elementScrollPosition <= currentScrollPosition ){
    return true;  
  }else{
    return false;
  }
  
}


function showLazyLoad(el){
  
	var startEvent = 'bc.animation.started';
	var endEvent = 'bc.animation.ended';
	
	//Start Event
	//if (window.CustomEvent) {
	//  event = new CustomEvent(startEvent, {detail: {some: 'data'}});
	//} else {
	//  event = document.createEvent('CustomEvent');
	//  event.initCustomEvent(startEvent, true, true, {some: 'data'});
	//}    
	//el.dispatchEvent(event);       
  
  
  // We show the real img
  el.setAttribute('src', el.getAttribute('data-src'));  
  
  // We show the real img
  if (el.getAttribute('data-srcset') !== null){
	  el.setAttribute('srcset', el.getAttribute('data-srcset'));  
  }

  //We delete the old attr
  el.removeAttribute('data-src');
  el.removeAttribute('data-srcset');
  el.removeAttribute('data-lazyload');
    
  //We change the CSS clases
  el.classList.add('is-lazyloaded');
  
  //Ending Event
 // if (window.CustomEvent) {
 //   event = new CustomEvent(endEvent, {detail: {some: 'data'}});
 // } else {
 //   event = document.createEvent('CustomEvent');
 //   event.initCustomEvent(endEvent, true, true, {some: 'data'});
 // }
 // el.dispatchEvent(event); 
  
}

document.addEventListener('DOMContentLoaded', function() {
  
  //We load the elements as soon as the document is ready
  
  
  var lazyloadElements = document.querySelectorAll('[data-src], [data-srcset], [data-lazyload]');
  
  if ( lazyloadElements.length > 0 ) {
    Array.prototype.forEach.call(lazyloadElements, function(el, i){

      if (isInViewport(el) === true ){
        showLazyLoad(el);
      }

    });          
  }
    
});

//We load the elements as we scroll through the document
window.addEventListener('scroll', function() {
  
  var lazyloadElements = document.querySelectorAll('[data-src], [data-srcset], [data-lazyload]');

  if ( lazyloadElements.length > 0 ) {
    Array.prototype.forEach.call(lazyloadElements, function(el, i){

      if (isInViewport(el) === true ){
        showLazyLoad(el);
      }

    });          
  }
  
  
});

//Only for bit
document.addEventListener('DOMContentLoaded', function() { // DOM Ready


  var inputNumberElements = document.querySelectorAll('[type="number"]');
      
  if ( inputNumberElements.length > 0 ) {
    Array.prototype.forEach.call(inputNumberElements, function(el, i){

      el.addEventListener('keydown', function(){
        
        if ( event.keyCode > 90 && event.keyCode < 106 ){
          return;  
        }
        
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 ) {
    
        } else {
          if (event.keyCode < 48 || event.keyCode > 57 ) {
            event.preventDefault();  
          }  
        }
                
      });      

    });          
  }

}); // Cierre DOM Ready abierto al inicio de la página



//Only for bit
var offcanvas = (function(){ 
  
  var click = function(e){
    
    e.preventDefault();
    
    var offCanvasTarget = this.getAttribute('data-target');
    			    
    			    
    offcanvas.toggle(this);
    
  };
			  
   
   var toggle = function(el){
	   
	   
	    //convertimos string a object si llamamos mediante método
	    if(typeof(el) === 'string'){
	      el = document.querySelector(el);
	    }
	   				 
	   //console.log('toggle: '+el);
	   
	   htmlTag = document.querySelector('html');			   
	   offCanvasType = el.getAttribute('data-side');
	   				   				   
	   if (htmlTag.classList.contains('off-canvas-on')){
		   
		   previousOffcanvas = htmlTag.getAttribute('data-off-canvas');
		   
		   offcanvas.hide();
		   
		   //Si había otro tipo de offcanvas abierto, abrimos el nuevo despues de cerrar el anterior
		   if( offCanvasType !== previousOffcanvas ){
			offcanvas.show(el);   
		   }
		   
		   
	   }else{
		   offcanvas.hide(el);
		   offcanvas.show(el);
	   }
	   
   };
   
   //Mostramos offcanvas
   var show = function(el){
	   

	    //convertimos string a object si llamamos mediante método
	    if(typeof(el) === 'string'){
	      el = document.querySelector(el);
	    }
	   //console.log('show: '+el);
	   
	   offCanvasTarget = el.getAttribute('data-target');
	   offCanvasType = el.getAttribute('data-side');
	   offCanvasPush = el.getAttribute('data-push');
	   
	    offCanvasOverlay = document.querySelector('.off-canvas-overlay');
	    
	    offCanvasOverlay.classList.add('is-visible');
	    offCanvasOverlay.classList.remove('is-hidden');
	   	   
	   
	   //Comporbamos si el canvas empujara el contenido
	   if ( offCanvasPush == 'true' ){
		   offCanvasCSS = 'off-canvas-on--push';
	   }else{
		   offCanvasCSS = 'off-canvas-on--overlay';
	   }
	   
	   //Seteamos el tipo de canvas que es, de esta manera los canvas pueden cambiar su origen de forma dinámica

	   document.querySelector(offCanvasTarget).classList.add('off-canvas--'+offCanvasType);
	   
	   //Abrimos el canvas
	   setTimeout(function(){
		document.querySelector('html').setAttribute('data-off-canvas', offCanvasType);
		document.querySelector('html').classList.add('off-canvas-on', 'off-canvas-on--'+offCanvasType, offCanvasCSS);   
		
		var startEvent = 'bc.is.showing';
		var endEvent = 'bc.is.visible';
		
		
		//Start Event
		//if (window.CustomEvent) {
		//  event = new CustomEvent(startEvent, {detail: {some: 'data'}});
		//} else {
		//  event = document.createEvent('CustomEvent');
		//  event.initCustomEvent(startEvent, true, true, {some: 'data'});
		//}    
		//el.dispatchEvent(event);       
		
		el.classList.add('is-active');
		
		//End Event
		//if (window.CustomEvent) {
		//  event = new CustomEvent(endEvent, {detail: {some: 'data'}});
		//} else {
		//  event = document.createEvent('CustomEvent');
		//  event.initCustomEvent(endEvent, true, true, {some: 'data'});
		//}
		//el.dispatchEvent(event);
		

	   }, 500);
	   
   };
   
   //Ocultamos offcanvas
   var hide = function(el){
	   
	   //console.log('hide: '+el);
	   
	    var offCanvasOverlay = document.querySelector('.off-canvas-overlay');
	    
	    offCanvasOverlay.classList.add('is-hidden');
	    offCanvasOverlay.classList.remove('is-visible');
	   
	   
	   document.querySelector('html').classList.remove('off-canvas-on','off-canvas-on--left','off-canvas-on--right','off-canvas-on--top','off-canvas-on--bottom', 'off-canvas-on--push');
	   
	   //document.querySelector('.off-canvas').classList.remove('off-canvas--left','off-canvas--right','off-canvas--top','off-canvas--bottom');

	    var startEvent = 'bc.is.hiding';
	    var endEvent = 'bc.is.hidden';
	    
	    //Start Event
	   //// if (window.CustomEvent) {
	   ////   event = new CustomEvent(startEvent, {detail: {some: 'data'}});
	   //// } else {
	   ////   event = document.createEvent('CustomEvent');
	   ////   event.initCustomEvent(startEvent, true, true, {some: 'data'});
	   //// }    
	   //// el.dispatchEvent(event);       
	      
	    //We hide the siblings
	    el.classList.remove('is-active');
	    
	    //End Event
	   // if (window.CustomEvent) {
	   //   event = new CustomEvent(endEvent, {detail: {some: 'data'}});
	   // } else {
	   //   event = document.createEvent('CustomEvent');
	   //   event.initCustomEvent(endEvent, true, true, {some: 'data'});
	   // }    
	   // el.dispatchEvent(event);       
	


   };

  
  var bindFunctions = function() {
    
    //Overlay
    
    if (!document.querySelector('.off-canvas-overlay')){
		var child = document.createElement('div');
		child.innerHTML = '<div class="off-canvas-overlay is-hidden"></div>';
		child = child.firstChild;
		document.querySelector('body').appendChild(child);    
	    
	    document.querySelector('.off-canvas-overlay').addEventListener('click', hide);
	    
    }
    
  	//Botón para mostrar off-canvas		   
  	var jsOffCanvas = document.querySelectorAll('.js-off-canvas');
  	
  	Array.prototype.forEach.call(jsOffCanvas, function(el, i){
  	  el.addEventListener('click', click);
  	});
   
   
   //Boton de ocultar off-canvas
    var jsCloseOffCanvas = document.querySelectorAll('.js-close-off-canvas');
    
    Array.prototype.forEach.call(jsCloseOffCanvas, function(el, i){
      el.addEventListener('click', hide);
    });
    
  };

  var init = function() {
    bindFunctions();
  };

  return {
    init: init,
    show: show,
    hide: hide,
    toggle: toggle
    
  };
  
  
})();		   
		
		


document.addEventListener('DOMContentLoaded', function(){
	offcanvas.init();
}, false);

//Only for bit
inputPasswords = document.querySelectorAll('.form__control[type="password"] ~ .js-reveal-pass');
Array.prototype.forEach.call(inputPasswords, function(el, i){

  el.addEventListener('click', function(){
    
    input = el.parentNode.querySelector('.form__control');
    inputType = input.getAttribute('type');
    
    if (inputType === 'password' ){
      input.setAttribute('type','text');
    } else if (inputType === 'text' ){
      input.setAttribute('type','password');
    }
    
  });

});
document.addEventListener('DOMContentLoaded', function() { // DOM Ready


//toggle
  
  var dataScrollTo = document.querySelectorAll('[data-id-scroll]');  
  
  if ( dataScrollTo.length > 0 ) {
    Array.prototype.forEach.call(dataScrollTo, function(el, i){

      el.addEventListener('click',function(event){
        
        var srollToID = this.getAttribute('data-id-scroll');
        var scrollToX = document.querySelector(srollToID).offsetTop;
		var scrollToSpeed = this.getAttribute('data-speed');
		
		// https://codepen.io/Novicell/pen/QpyZer
		function scrollTo(element, to, duration) {
		  if (duration <= 0) return;
		  var difference = to - element.scrollTop;
		  var perTick = difference / duration * 10;
		
		  setTimeout(function() {
		    element.scrollTop = element.scrollTop + perTick;
		    if (element.scrollTop == to) return;
		    scrollTo(element, to, duration - 10);
		  }, 10);
		}        
        
        scrollTo(document.body, scrollToX, scrollToSpeed);
                
      });
  

    });          
  }

  
}); // Cierre DOM Ready abierto al inicio de la página



//Only for bit

//
//Siema Extend
//

//Next + Prev buttons
function siemaCreateArrows(object, sliderSelector){
		
	document.querySelector('.js-siema-prev').addEventListener('click', function(){
	
		object.prev();
		
	});
	document.querySelector('.js-siema-next').addEventListener('click', function(){
		document.querySelector('.js-siema-prev').removeAttribute('disabled')
		object.next();
		
	});

}


//Nav Dots
function siemaCreateGroupDots(loop, object, sliderSelector){
				
	var slides = document.querySelectorAll('.js-siema-slides > div > div');					
	var resolution = window.outerWidth;
	
	//Definimos el número de Slides que mostramos segun la resolución para proximos cálculos
	if ( resolution <= 767) {
		slidesNum = slidesXS;
	}else if (resolution >= 768 && resolution <= 991){
		slidesNum = slidesSM;
	}else if (resolution >= 992 && resolution <= 1200){
		slidesNum = slidesMD;
	}else if (resolution >= 1199 && resolution <= 1440){
		slidesNum = slidesLG;
	}else if (resolution >= 1440){
		slidesNum = slidesXL;
	}	
	
	//Número de Dots que vamos a mostrar
	dots = parseInt(slides.length) / parseInt(slidesNum);

	//Dividimos entre 2 al estar el loop activo
	if ( loop == true ){
		dots = dots/2;	
	}
	
	// Colocamos los dots en su DOM
	dotsHoler = document.querySelector('.js-siema-dots');
	
	dotsHoler.innerHTML = '';
	// Solo creamos los dots cuando hay más de uno
	if (dots>1){
		for (i = 0; i < dots; i++) { 
			child = document.createElement('div');
			child.innerHTML = '<button type="button" data-slide="'+(parseInt(i+1)*parseInt(slidesNum)-slidesNum)+'" class="js-siema-dot">Slide '+i+'</button>';
			child = child.firstChild;
			dotsHoler.appendChild(child);
		}	
	}
	
	//Marcamos los dots con sus estados 
	var dots = document.querySelectorAll('.js-siema-dot');
	
	if ( dots.length > 0 ) {      
	  Array.prototype.forEach.call(dots, function(el, i){
	    
	    //Marcamos como activo el primero
	    if (el.getAttribute('data-slide') == '0'){
		    el.classList.add('is-active');
	    }


	    el.addEventListener("click", function(){
		    //Movemos la slide a..
		    object.goTo(el.getAttribute('data-slide'));
		    
		    //Marcamos como activo y desactivamos el resto
		    Array.prototype.forEach.call(el.parentNode.children, function(el2, i){
			    el2.classList.remove('is-active');
		    });
		    
		    el.classList.add('is-active');
		    
		});
	  });    
	}    
	

}



//Nav Dots
function siemaCreateDots(loop, object, sliderSelector){
				
	var slides = document.querySelectorAll('.js-siema-slides > div > div');					
	
	//Número de Dots que vamos a mostrar
	dots = slides.length;

	//Dividimos entre 2 al estar el loop activo
	if ( loop == true ){
		dots = dots/2;	
	}
	

	// Colocamos los dots en su DOM
	dotsHoler = document.querySelector('.js-siema-dots');
	
	dotsHoler.innerHTML = '';
	// Solo creamos los dots cuando hay más de uno
	if (dots>1){
		for (i = 0; i < dots; i++) { 
			child = document.createElement('div');
			child.innerHTML = '<button type="button" data-slide="'+i+'" class="js-siema-dot">Slide '+i+'</button>';
			child = child.firstChild;
			dotsHoler.appendChild(child);
		}	
	}
	
	//Marcamos los dots con sus estados 
	var dots = document.querySelectorAll('.js-siema-dot');
	
	if ( dots.length > 0 ) {      
	  Array.prototype.forEach.call(dots, function(el, i){
	    
	    //Marcamos como activo el primero
	    if (el.getAttribute('data-slide') == '0'){
		    el.classList.add('is-active');
	    }


	    el.addEventListener("click", function(){
		    //Movemos la slide a..
		    object.goTo(el.getAttribute('data-slide'));
		    
		    //Marcamos como activo y desactivamos el resto
		    Array.prototype.forEach.call(el.parentNode.children, function(el2, i){
			    el2.classList.remove('is-active');
		    });
		    
		    el.classList.add('is-active');
		    
		});
	  });    
	}    
	

}
document.addEventListener('DOMContentLoaded', function() { // DOM Ready

  var textareaAutoSize = document.querySelectorAll('textarea[data-autosize]');
  
  if ( textareaAutoSize.length > 0 ) {
    Array.prototype.forEach.call(textareaAutoSize, function(el, i){

      el.addEventListener('keyup', function(){
                
        //añadimos timeout para evitar lag.
        setTimeout(function(){ 
    
          //Reseteamos la altura
         // textareaAutoSize.removeAttribute('style');
          
          //cogemos altura del scroll
          textareaHeight= el.scrollHeight; 
    
          //console.log(textareaHeight);
    
          //Se la aplicamos
          el.style.height = textareaHeight+'px';
          
          
        }, 200);
        
        
      });

    });          
  }


}); // Cierre DOM Ready abierto al inicio de la página
//Only for bit
document.addEventListener('DOMContentLoaded', function() { // DOM Ready


//toggle
  
  var dataToggle = document.querySelectorAll('[data-toggle="toggle"]');  
  
  if ( dataToggle.length > 0 ) {
    Array.prototype.forEach.call(dataToggle, function(el, i){

      el.addEventListener('click',function(event){
        //event.preventDefault();
        
        var idToHide = this.getAttribute('data-id-hide');
        var idToShow = this.getAttribute('data-id-show');
    
        var dataTimes = this.getAttribute('data-times');
        
        var showAnimation = this.getAttribute('data-animation-show');
        var hideAnimation = this.getAttribute('data-animation-hide');
        
        
        //Si hay datatimes = 0, no hay límite, si hay 1..se limita cambiando el contador a 0
            
        if(dataTimes == 1){
          this.setAttribute('data-times','0');
          animatron.animateOut(this,hideAnimation);
        }else if (dataTimes === 0){
          return false;
        }  
        
        animatron.animateOut(idToHide,hideAnimation);
        
        
        var el = document.querySelector(idToHide);
        
        
        var animateOut = function (){
          animatron.animateIn(idToShow,showAnimation);      
        };
        
        el.addEventListener('webkitAnimationEnd',animateOut);
        el.addEventListener('oanimationend',animateOut);
        el.addEventListener('msAnimationEnd',animateOut);
        el.addEventListener('animationend',animateOut);
            
        //cambiamos el orden de los atributos
        this.setAttribute('data-id-show',idToHide);
        this.setAttribute('data-id-hide',idToShow);
        
      });
  

    });          
  }

  
}); // Cierre DOM Ready abierto al inicio de la página



//Only for bit
//Only for bit
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Siema",[],t):"object"==typeof exports?exports.Siema=t():e.Siema=t()}("undefined"!=typeof self?self:this,function(){return function(e){function t(r){if(i[r])return i[r].exports;var n=i[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var i={};return t.m=e,t.c=i,t.d=function(e,i,r){t.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(i,"a",i),i},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,i){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),l=function(){function e(t){var i=this;if(r(this,e),this.config=e.mergeSettings(t),this.selector="string"==typeof this.config.selector?document.querySelector(this.config.selector):this.config.selector,null===this.selector)throw new Error("Something wrong with your selector 😭");this.resolveSlidesNumber(),this.selectorWidth=this.selector.offsetWidth,this.innerElements=[].slice.call(this.selector.children),this.currentSlide=this.config.loop?this.config.startIndex%this.innerElements.length:Math.max(0,Math.min(this.config.startIndex,this.innerElements.length-this.perPage)),this.transformProperty=e.webkitOrNot(),["resizeHandler","touchstartHandler","touchendHandler","touchmoveHandler","mousedownHandler","mouseupHandler","mouseleaveHandler","mousemoveHandler","clickHandler"].forEach(function(e){i[e]=i[e].bind(i)}),this.init()}return s(e,[{key:"attachEvents",value:function(){window.addEventListener("resize",this.resizeHandler),this.config.draggable&&(this.pointerDown=!1,this.drag={startX:0,endX:0,startY:0,letItGo:null,preventClick:!1},this.selector.addEventListener("touchstart",this.touchstartHandler),this.selector.addEventListener("touchend",this.touchendHandler),this.selector.addEventListener("touchmove",this.touchmoveHandler),this.selector.addEventListener("mousedown",this.mousedownHandler),this.selector.addEventListener("mouseup",this.mouseupHandler),this.selector.addEventListener("mouseleave",this.mouseleaveHandler),this.selector.addEventListener("mousemove",this.mousemoveHandler),this.selector.addEventListener("click",this.clickHandler))}},{key:"detachEvents",value:function(){window.removeEventListener("resize",this.resizeHandler),this.selector.removeEventListener("touchstart",this.touchstartHandler),this.selector.removeEventListener("touchend",this.touchendHandler),this.selector.removeEventListener("touchmove",this.touchmoveHandler),this.selector.removeEventListener("mousedown",this.mousedownHandler),this.selector.removeEventListener("mouseup",this.mouseupHandler),this.selector.removeEventListener("mouseleave",this.mouseleaveHandler),this.selector.removeEventListener("mousemove",this.mousemoveHandler),this.selector.removeEventListener("click",this.clickHandler)}},{key:"init",value:function(){this.attachEvents(),this.selector.style.overflow="hidden",this.selector.style.direction=this.config.rtl?"rtl":"ltr",this.buildSliderFrame(),this.config.onInit.call(this)}},{key:"buildSliderFrame",value:function(){var e=this.selectorWidth/this.perPage,t=this.config.loop?this.innerElements.length+2*this.perPage:this.innerElements.length;this.sliderFrame=document.createElement("div"),this.sliderFrame.style.width=e*t+"px",this.enableTransition(),this.config.draggable&&(this.selector.style.cursor="-webkit-grab");var i=document.createDocumentFragment();if(this.config.loop)for(var r=this.innerElements.length-this.perPage;r<this.innerElements.length;r++){var n=this.buildSliderFrameItem(this.innerElements[r].cloneNode(!0));i.appendChild(n)}for(var s=0;s<this.innerElements.length;s++){var l=this.buildSliderFrameItem(this.innerElements[s]);i.appendChild(l)}if(this.config.loop)for(var o=0;o<this.perPage;o++){var a=this.buildSliderFrameItem(this.innerElements[o].cloneNode(!0));i.appendChild(a)}this.sliderFrame.appendChild(i),this.selector.innerHTML="",this.selector.appendChild(this.sliderFrame),this.slideToCurrent()}},{key:"buildSliderFrameItem",value:function(e){var t=document.createElement("div");return t.style.cssFloat=this.config.rtl?"right":"left",t.style.float=this.config.rtl?"right":"left",t.style.width=(this.config.loop?100/(this.innerElements.length+2*this.perPage):100/this.innerElements.length)+"%",t.appendChild(e),t}},{key:"resolveSlidesNumber",value:function(){if("number"==typeof this.config.perPage)this.perPage=this.config.perPage;else if("object"===n(this.config.perPage)){this.perPage=1;for(var e in this.config.perPage)window.innerWidth>=e&&(this.perPage=this.config.perPage[e])}}},{key:"prev",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments[1];if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;if(this.config.loop){if(this.currentSlide-e<0){this.disableTransition();var r=this.currentSlide+this.innerElements.length,n=this.perPage,s=r+n,l=(this.config.rtl?1:-1)*s*(this.selectorWidth/this.perPage),o=this.config.draggable?this.drag.endX-this.drag.startX:0;this.sliderFrame.style[this.transformProperty]="translate3d("+(l+o)+"px, 0, 0)",this.currentSlide=r-e}else this.currentSlide=this.currentSlide-e}else this.currentSlide=Math.max(this.currentSlide-e,0);i!==this.currentSlide&&(this.slideToCurrent(this.config.loop),this.config.onChange.call(this),t&&t.call(this))}}},{key:"next",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments[1];if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;if(this.config.loop){if(this.currentSlide+e>this.innerElements.length-this.perPage){this.disableTransition();var r=this.currentSlide-this.innerElements.length,n=this.perPage,s=r+n,l=(this.config.rtl?1:-1)*s*(this.selectorWidth/this.perPage),o=this.config.draggable?this.drag.endX-this.drag.startX:0;this.sliderFrame.style[this.transformProperty]="translate3d("+(l+o)+"px, 0, 0)",this.currentSlide=r+e}else this.currentSlide=this.currentSlide+e}else this.currentSlide=Math.min(this.currentSlide+e,this.innerElements.length-this.perPage);i!==this.currentSlide&&(this.slideToCurrent(this.config.loop),this.config.onChange.call(this),t&&t.call(this))}}},{key:"disableTransition",value:function(){this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing}},{key:"enableTransition",value:function(){this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing}},{key:"goTo",value:function(e,t){if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;this.currentSlide=this.config.loop?e%this.innerElements.length:Math.min(Math.max(e,0),this.innerElements.length-this.perPage),i!==this.currentSlide&&(this.slideToCurrent(),this.config.onChange.call(this),t&&t.call(this))}}},{key:"slideToCurrent",value:function(e){var t=this,i=this.config.loop?this.currentSlide+this.perPage:this.currentSlide,r=(this.config.rtl?1:-1)*i*(this.selectorWidth/this.perPage);e?requestAnimationFrame(function(){requestAnimationFrame(function(){t.enableTransition(),t.sliderFrame.style[t.transformProperty]="translate3d("+r+"px, 0, 0)"})}):this.sliderFrame.style[this.transformProperty]="translate3d("+r+"px, 0, 0)"}},{key:"updateAfterDrag",value:function(){var e=(this.config.rtl?-1:1)*(this.drag.endX-this.drag.startX),t=Math.abs(e),i=this.config.multipleDrag?Math.ceil(t/(this.selectorWidth/this.perPage)):1,r=e>0&&this.currentSlide-i<0,n=e<0&&this.currentSlide+i>this.innerElements.length-this.perPage;e>0&&t>this.config.threshold&&this.innerElements.length>this.perPage?this.prev(i):e<0&&t>this.config.threshold&&this.innerElements.length>this.perPage&&this.next(i),this.slideToCurrent(r||n)}},{key:"resizeHandler",value:function(){this.resolveSlidesNumber(),this.currentSlide+this.perPage>this.innerElements.length&&(this.currentSlide=this.innerElements.length<=this.perPage?0:this.innerElements.length-this.perPage),this.selectorWidth=this.selector.offsetWidth,this.buildSliderFrame()}},{key:"clearDrag",value:function(){this.drag={startX:0,endX:0,startY:0,letItGo:null,preventClick:this.drag.preventClick}}},{key:"touchstartHandler",value:function(e){-1!==["TEXTAREA","OPTION","INPUT","SELECT"].indexOf(e.target.nodeName)||(e.stopPropagation(),this.pointerDown=!0,this.drag.startX=e.touches[0].pageX,this.drag.startY=e.touches[0].pageY)}},{key:"touchendHandler",value:function(e){e.stopPropagation(),this.pointerDown=!1,this.enableTransition(),this.drag.endX&&this.updateAfterDrag(),this.clearDrag()}},{key:"touchmoveHandler",value:function(e){if(e.stopPropagation(),null===this.drag.letItGo&&(this.drag.letItGo=Math.abs(this.drag.startY-e.touches[0].pageY)<Math.abs(this.drag.startX-e.touches[0].pageX)),this.pointerDown&&this.drag.letItGo){e.preventDefault(),this.drag.endX=e.touches[0].pageX,this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing;var t=this.config.loop?this.currentSlide+this.perPage:this.currentSlide,i=t*(this.selectorWidth/this.perPage),r=this.drag.endX-this.drag.startX,n=this.config.rtl?i+r:i-r;this.sliderFrame.style[this.transformProperty]="translate3d("+(this.config.rtl?1:-1)*n+"px, 0, 0)"}}},{key:"mousedownHandler",value:function(e){-1!==["TEXTAREA","OPTION","INPUT","SELECT"].indexOf(e.target.nodeName)||(e.preventDefault(),e.stopPropagation(),this.pointerDown=!0,this.drag.startX=e.pageX)}},{key:"mouseupHandler",value:function(e){e.stopPropagation(),this.pointerDown=!1,this.selector.style.cursor="-webkit-grab",this.enableTransition(),this.drag.endX&&this.updateAfterDrag(),this.clearDrag()}},{key:"mousemoveHandler",value:function(e){if(e.preventDefault(),this.pointerDown){"A"===e.target.nodeName&&(this.drag.preventClick=!0),this.drag.endX=e.pageX,this.selector.style.cursor="-webkit-grabbing",this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing;var t=this.config.loop?this.currentSlide+this.perPage:this.currentSlide,i=t*(this.selectorWidth/this.perPage),r=this.drag.endX-this.drag.startX,n=this.config.rtl?i+r:i-r;this.sliderFrame.style[this.transformProperty]="translate3d("+(this.config.rtl?1:-1)*n+"px, 0, 0)"}}},{key:"mouseleaveHandler",value:function(e){this.pointerDown&&(this.pointerDown=!1,this.selector.style.cursor="-webkit-grab",this.drag.endX=e.pageX,this.drag.preventClick=!1,this.enableTransition(),this.updateAfterDrag(),this.clearDrag())}},{key:"clickHandler",value:function(e){this.drag.preventClick&&e.preventDefault(),this.drag.preventClick=!1}},{key:"remove",value:function(e,t){if(e<0||e>=this.innerElements.length)throw new Error("Item to remove doesn't exist 😭");var i=e<this.currentSlide,r=this.currentSlide+this.perPage-1===e;(i||r)&&this.currentSlide--,this.innerElements.splice(e,1),this.buildSliderFrame(),t&&t.call(this)}},{key:"insert",value:function(e,t,i){if(t<0||t>this.innerElements.length+1)throw new Error("Unable to inset it at this index 😭");if(-1!==this.innerElements.indexOf(e))throw new Error("The same item in a carousel? Really? Nope 😭");var r=t<=this.currentSlide>0&&this.innerElements.length;this.currentSlide=r?this.currentSlide+1:this.currentSlide,this.innerElements.splice(t,0,e),this.buildSliderFrame(),i&&i.call(this)}},{key:"prepend",value:function(e,t){this.insert(e,0),t&&t.call(this)}},{key:"append",value:function(e,t){this.insert(e,this.innerElements.length+1),t&&t.call(this)}},{key:"destroy",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments[1];if(this.detachEvents(),this.selector.style.cursor="auto",e){for(var i=document.createDocumentFragment(),r=0;r<this.innerElements.length;r++)i.appendChild(this.innerElements[r]);this.selector.innerHTML="",this.selector.appendChild(i),this.selector.removeAttribute("style")}t&&t.call(this)}}],[{key:"mergeSettings",value:function(e){var t={selector:".siema",duration:200,easing:"ease-out",perPage:1,startIndex:0,draggable:!0,multipleDrag:!0,threshold:20,loop:!1,rtl:!1,onInit:function(){},onChange:function(){}},i=e;for(var r in i)t[r]=i[r];return t}},{key:"webkitOrNot",value:function(){return"string"==typeof document.documentElement.style.transform?"transform":"WebkitTransform"}}]),e}();t.default=l,e.exports=t.default}])});
/**
  stickybits - Stickybits is a lightweight alternative to `position: sticky` polyfills
  @version v3.5.4
  @link https://github.com/dollarshaveclub/stickybits#readme
  @author Jeff Wainwright <yowainwright@gmail.com> (https://jeffry.in)
  @license MIT
**/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.stickybits = factory());
}(this, (function () { 'use strict';

  /*
    STICKYBITS 💉
    --------
    > a lightweight alternative to `position: sticky` polyfills 🍬
    --------
    - each method is documented above it our view the readme
    - Stickybits does not manage polymorphic functionality (position like properties)
    * polymorphic functionality: (in the context of describing Stickybits)
      means making things like `position: sticky` be loosely supported with position fixed.
      It also means that features like `useStickyClasses` takes on styles like `position: fixed`.
    --------
    defaults 🔌
    --------
    - version = `package.json` version
    - userAgent = viewer browser agent
    - target = DOM element selector
    - noStyles = boolean
    - offset = number
    - parentClass = 'string'
    - scrollEl = window || DOM element selector || DOM element
    - stickyClass = 'string'
    - stuckClass = 'string'
    - useStickyClasses = boolean
    - useFixed = boolean
    - useGetBoundingClientRect = boolean
    - verticalPosition = 'string'
    --------
    props🔌
    --------
    - p = props {object}
    --------
    instance note
    --------
    - stickybits parent methods return this
    - stickybits instance methods return an instance item
    --------
    nomenclature
    --------
    - target => el => e
    - props => o || p
    - instance => item => it
    --------
    methods
    --------
    - .definePosition = defines sticky or fixed
    - .addInstance = an array of objects for each Stickybits Target
    - .getClosestParent = gets the parent for non-window scroll
    - .getTopPosition = gets the element top pixel position from the viewport
    - .computeScrollOffsets = computes scroll position
    - .toggleClasses = older browser toggler
    - .manageState = manages sticky state
    - .removeClass = older browser support class remover
    - .removeInstance = removes an instance
    - .cleanup = removes all Stickybits instances and cleans up dom from stickybits
  */
  var Stickybits =
  /*#__PURE__*/
  function () {
    function Stickybits(target, obj) {
      var o = typeof obj !== 'undefined' ? obj : {};
      this.version = '3.5.4';
      this.userAgent = window.navigator.userAgent || 'no `userAgent` provided by the browser';
      this.props = {
        customStickyChangeNumber: o.customStickyChangeNumber || null,
        noStyles: o.noStyles || false,
        stickyBitStickyOffset: o.stickyBitStickyOffset || 0,
        parentClass: o.parentClass || 'js-stickybit-parent',
        scrollEl: typeof o.scrollEl === 'string' ? document.querySelector(o.scrollEl) : o.scrollEl || window,
        stickyClass: o.stickyClass || 'js-is-sticky',
        stuckClass: o.stuckClass || 'js-is-stuck',
        stickyChangeClass: o.stickyChangeClass || 'js-is-sticky--change',
        useStickyClasses: o.useStickyClasses || false,
        useFixed: o.useFixed || false,
        useGetBoundingClientRect: o.useGetBoundingClientRect || false,
        verticalPosition: o.verticalPosition || 'top'
      };
      var p = this.props;
      /*
        define positionVal
        ----
        -  uses a computed (`.definePosition()`)
        -  defined the position
      */

      p.positionVal = this.definePosition() || 'fixed';
      var vp = p.verticalPosition;
      var ns = p.noStyles;
      var pv = p.positionVal;
      this.els = typeof target === 'string' ? document.querySelectorAll(target) : target;
      if (!('length' in this.els)) this.els = [this.els];
      this.instances = [];

      for (var i = 0; i < this.els.length; i += 1) {
        var el = this.els[i];
        var styles = el.style; // set vertical position

        styles[vp] = vp === 'top' && !ns ? p.stickyBitStickyOffset + "px" : '';
        styles.position = pv !== 'fixed' ? pv : '';

        if (pv === 'fixed' || p.useStickyClasses) {
          var instance = this.addInstance(el, p); // instances are an array of objects

          this.instances.push(instance);
        }
      }

      return this;
    }
    /*
      setStickyPosition ✔️
      --------
      —  most basic thing stickybits does
      => checks to see if position sticky is supported
      => defined the position to be used
      => stickybits works accordingly
    */


    var _proto = Stickybits.prototype;

    _proto.definePosition = function definePosition() {
      var stickyProp;

      if (this.props.useFixed) {
        stickyProp = 'fixed';
      } else {
        var prefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];
        var test = document.head.style;

        for (var i = 0; i < prefix.length; i += 1) {
          test.position = prefix[i] + "sticky";
        }

        stickyProp = test.position ? test.position : 'fixed';
        test.position = '';
      }

      return stickyProp;
    };
    /*
      addInstance ✔️
      --------
      — manages instances of items
      - takes in an el and props
      - returns an item object
      ---
      - target = el
      - o = {object} = props
        - scrollEl = 'string' | object
        - verticalPosition = number
        - off = boolean
        - parentClass = 'string'
        - stickyClass = 'string'
        - stuckClass = 'string'
      ---
      - defined later
        - parent = dom element
        - state = 'string'
        - offset = number
        - stickyStart = number
        - stickyStop = number
      - returns an instance object
    */


    _proto.addInstance = function addInstance(el, props) {
      var _this = this;

      var item = {
        el: el,
        parent: el.parentNode,
        props: props
      };
      this.isWin = this.props.scrollEl === window;
      var se = this.isWin ? window : this.getClosestParent(item.el, item.props.scrollEl);
      this.computeScrollOffsets(item);
      item.parent.className += " " + props.parentClass;
      item.state = 'default';

      item.stateContainer = function () {
        return _this.manageState(item);
      };

      se.addEventListener('scroll', item.stateContainer);
      return item;
    };
    /*
      --------
      getParent 👨‍
      --------
      - a helper function that gets the target element's parent selected el
      - only used for non `window` scroll elements
      - supports older browsers
    */


    _proto.getClosestParent = function getClosestParent(el, match) {
      // p = parent element
      var p = match;
      var e = el;
      if (e.parentElement === p) return p; // traverse up the dom tree until we get to the parent

      while (e.parentElement !== p) {
        e = e.parentElement;
      } // return parent element


      return p;
    };
    /*
      --------
      getTopPosition
      --------
      - a helper function that gets the topPosition of a Stickybit element
      - from the top level of the DOM
    */


    _proto.getTopPosition = function getTopPosition(el) {
      if (this.props.useGetBoundingClientRect) {
        return el.getBoundingClientRect().top + (this.props.scrollEl.pageYOffset || document.documentElement.scrollTop);
      }

      var topPosition = 0;

      do {
        topPosition = el.offsetTop + topPosition;
      } while (el = el.offsetParent);

      return topPosition;
    };
    /*
      computeScrollOffsets 📊
      ---
      computeScrollOffsets for Stickybits
      - defines
        - offset
        - start
        - stop
    */


    _proto.computeScrollOffsets = function computeScrollOffsets(item) {
      var it = item;
      var p = it.props;
      var el = it.el;
      var parent = it.parent;
      var isCustom = !this.isWin && p.positionVal === 'fixed';
      var isBottom = p.verticalPosition !== 'bottom';
      var scrollElOffset = isCustom ? this.getTopPosition(p.scrollEl) : 0;
      var stickyStart = isCustom ? this.getTopPosition(parent) - scrollElOffset : this.getTopPosition(parent);
      var stickyChangeOffset = p.customStickyChangeNumber !== null ? p.customStickyChangeNumber : el.offsetHeight;
      it.offset = scrollElOffset + p.stickyBitStickyOffset;
      it.stickyStart = isBottom ? stickyStart - it.offset : 0;
      it.stickyChange = it.stickyStart + stickyChangeOffset;
      it.stickyStop = isBottom ? stickyStart + parent.offsetHeight - (it.el.offsetHeight + it.offset) : stickyStart + parent.offsetHeight;
      return it;
    };
    /*
      toggleClasses ⚖️
      ---
      toggles classes (for older browser support)
      r = removed class
      a = added class
    */


    _proto.toggleClasses = function toggleClasses(el, r, a) {
      var e = el;
      var cArray = e.className.split(' ');
      if (a && cArray.indexOf(a) === -1) cArray.push(a);
      var rItem = cArray.indexOf(r);
      if (rItem !== -1) cArray.splice(rItem, 1);
      e.className = cArray.join(' ');
    };
    /*
      manageState 📝
      ---
      - defines the state
        - normal
        - sticky
        - stuck
    */


    _proto.manageState = function manageState(item) {
      // cache object
      var it = item;
      var e = it.el;
      var p = it.props;
      var state = it.state;
      var start = it.stickyStart;
      var change = it.stickyChange;
      var stop = it.stickyStop;
      var stl = e.style; // cache props

      var ns = p.noStyles;
      var pv = p.positionVal;
      var se = p.scrollEl;
      var sticky = p.stickyClass;
      var stickyChange = p.stickyChangeClass;
      var stuck = p.stuckClass;
      var vp = p.verticalPosition;
      /*
        requestAnimationFrame
        ---
        - use rAF
        - or stub rAF
      */

      var rAFStub = function rAFDummy(f) {
        f();
      };

      var rAF = !this.isWin ? rAFStub : window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || rAFStub;
      /*
        define scroll vars
        ---
        - scroll
        - notSticky
        - isSticky
        - isStuck
      */

      var tC = this.toggleClasses;
      var scroll = this.isWin ? window.scrollY || window.pageYOffset : se.scrollTop;
      var notSticky = scroll > start && scroll < stop && (state === 'default' || state === 'stuck');
      var isSticky = scroll <= start && state === 'sticky';
      var isStuck = scroll >= stop && state === 'sticky';
      /*
        Unnamed arrow functions within this block
        ---
        - help wanted or discussion
        - view test.stickybits.js
          - `stickybits .manageState  `position: fixed` interface` for more awareness 👀
      */

      if (notSticky) {
        it.state = 'sticky';
        rAF(function () {
          tC(e, stuck, sticky);
          stl.position = pv;
          if (ns) return;
          stl.bottom = '';
          stl[vp] = p.stickyBitStickyOffset + "px";
        });
      } else if (isSticky) {
        it.state = 'default';
        rAF(function () {
          tC(e, sticky);
          if (pv === 'fixed') stl.position = '';
        });
      } else if (isStuck) {
        it.state = 'stuck';
        rAF(function () {
          tC(e, sticky, stuck);
          if (pv !== 'fixed' || ns) return;
          stl.top = '';
          stl.bottom = '0';
          stl.position = 'absolute';
        });
      }

      var isStickyChange = scroll >= change && scroll <= stop;
      var isNotStickyChange = scroll < change || scroll > stop;
      var stub = 'stub'; // a stub css class to remove

      if (isNotStickyChange) {
        rAF(function () {
          tC(e, stickyChange);
        });
      } else if (isStickyChange) {
        rAF(function () {
          tC(e, stub, stickyChange);
        });
      }

      return it;
    };

    _proto.update = function update() {
      for (var i = 0; i < this.instances.length; i += 1) {
        var instance = this.instances[i];
        this.computeScrollOffsets(instance);
      }

      return this;
    };
    /*
      removes an instance 👋
      --------
      - cleanup instance
    */


    _proto.removeInstance = function removeInstance(instance) {
      var e = instance.el;
      var p = instance.props;
      var tC = this.toggleClasses;
      e.style.position = '';
      e.style[p.verticalPosition] = '';
      tC(e, p.stickyClass);
      tC(e, p.stuckClass);
      tC(e.parentNode, p.parentClass);
    };
    /*
      cleanup 🛁
      --------
      - cleans up each instance
      - clears instance
    */


    _proto.cleanup = function cleanup() {
      for (var i = 0; i < this.instances.length; i += 1) {
        var instance = this.instances[i];
        instance.props.scrollEl.removeEventListener('scroll', instance.stateContainer);
        this.removeInstance(instance);
      }

      this.manageState = false;
      this.instances = [];
    };

    return Stickybits;
  }();
  /*
    export
    --------
    exports StickBits to be used 🏁
  */


  function stickybits(target, o) {
    return new Stickybits(target, o);
  }

  return stickybits;

})));
//Only for bit
/*!
 * @copyright Copyright (c) 2017 IcoMoon.io
 * @license   Licensed under MIT license
 *            See https://github.com/Keyamoon/svgxuse
 * @version   1.2.6
 */
/*jslint browser: true */
/*global XDomainRequest, MutationObserver, window */
(function () {
    "use strict";
    if (typeof window !== "undefined" && window.addEventListener) {
        var cache = Object.create(null); // holds xhr objects to prevent multiple requests
        var checkUseElems;
        var tid; // timeout id
        var debouncedCheck = function () {
            clearTimeout(tid);
            tid = setTimeout(checkUseElems, 100);
        };
        var unobserveChanges = function () {
            return;
        };
        var observeChanges = function () {
            var observer;
            window.addEventListener("resize", debouncedCheck, false);
            window.addEventListener("orientationchange", debouncedCheck, false);
            if (window.MutationObserver) {
                observer = new MutationObserver(debouncedCheck);
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
                unobserveChanges = function () {
                    try {
                        observer.disconnect();
                        window.removeEventListener("resize", debouncedCheck, false);
                        window.removeEventListener("orientationchange", debouncedCheck, false);
                    } catch (ignore) {}
                };
            } else {
                document.documentElement.addEventListener("DOMSubtreeModified", debouncedCheck, false);
                unobserveChanges = function () {
                    document.documentElement.removeEventListener("DOMSubtreeModified", debouncedCheck, false);
                    window.removeEventListener("resize", debouncedCheck, false);
                    window.removeEventListener("orientationchange", debouncedCheck, false);
                };
            }
        };
        var createRequest = function (url) {
            // In IE 9, cross origin requests can only be sent using XDomainRequest.
            // XDomainRequest would fail if CORS headers are not set.
            // Therefore, XDomainRequest should only be used with cross origin requests.
            function getOrigin(loc) {
                var a;
                if (loc.protocol !== undefined) {
                    a = loc;
                } else {
                    a = document.createElement("a");
                    a.href = loc;
                }
                return a.protocol.replace(/:/g, "") + a.host;
            }
            var Request;
            var origin;
            var origin2;
            if (window.XMLHttpRequest) {
                Request = new XMLHttpRequest();
                origin = getOrigin(location);
                origin2 = getOrigin(url);
                if (Request.withCredentials === undefined && origin2 !== "" && origin2 !== origin) {
                    Request = XDomainRequest || undefined;
                } else {
                    Request = XMLHttpRequest;
                }
            }
            return Request;
        };
        var xlinkNS = "http://www.w3.org/1999/xlink";
        checkUseElems = function () {
            var base;
            var bcr;
            var fallback = ""; // optional fallback URL in case no base path to SVG file was given and no symbol definition was found.
            var hash;
            var href;
            var i;
            var inProgressCount = 0;
            var isHidden;
            var Request;
            var url;
            var uses;
            var xhr;
            function observeIfDone() {
                // If done with making changes, start watching for chagnes in DOM again
                inProgressCount -= 1;
                if (inProgressCount === 0) { // if all xhrs were resolved
                    unobserveChanges(); // make sure to remove old handlers
                    observeChanges(); // watch for changes to DOM
                }
            }
            function attrUpdateFunc(spec) {
                return function () {
                    if (cache[spec.base] !== true) {
                        spec.useEl.setAttributeNS(xlinkNS, "xlink:href", "#" + spec.hash);
                        if (spec.useEl.hasAttribute("href")) {
                            spec.useEl.setAttribute("href", "#" + spec.hash);
                        }
                    }
                };
            }
            function onloadFunc(xhr) {
                return function () {
                    var body = document.body;
                    var x = document.createElement("x");
                    var svg;
                    xhr.onload = null;
                    x.innerHTML = xhr.responseText;
                    svg = x.getElementsByTagName("svg")[0];
                    if (svg) {
                        svg.setAttribute("aria-hidden", "true");
                        svg.style.position = "absolute";
                        svg.style.width = 0;
                        svg.style.height = 0;
                        svg.style.overflow = "hidden";
                        body.insertBefore(svg, body.firstChild);
                    }
                    observeIfDone();
                };
            }
            function onErrorTimeout(xhr) {
                return function () {
                    xhr.onerror = null;
                    xhr.ontimeout = null;
                    observeIfDone();
                };
            }
            unobserveChanges(); // stop watching for changes to DOM
            // find all use elements
            uses = document.getElementsByTagName("use");
            for (i = 0; i < uses.length; i += 1) {
                try {
                    bcr = uses[i].getBoundingClientRect();
                } catch (ignore) {
                    // failed to get bounding rectangle of the use element
                    bcr = false;
                }
                href = uses[i].getAttribute("href")
                        || uses[i].getAttributeNS(xlinkNS, "href")
                        || uses[i].getAttribute("xlink:href");
                if (href && href.split) {
                    url = href.split("#");
                } else {
                    url = ["", ""];
                }
                base = url[0];
                hash = url[1];
                isHidden = bcr && bcr.left === 0 && bcr.right === 0 && bcr.top === 0 && bcr.bottom === 0;
                if (bcr && bcr.width === 0 && bcr.height === 0 && !isHidden) {
                    // the use element is empty
                    // if there is a reference to an external SVG, try to fetch it
                    // use the optional fallback URL if there is no reference to an external SVG
                    if (fallback && !base.length && hash && !document.getElementById(hash)) {
                        base = fallback;
                    }
                    if (uses[i].hasAttribute("href")) {
                        uses[i].setAttributeNS(xlinkNS, "xlink:href", href);
                    }
                    if (base.length) {
                        // schedule updating xlink:href
                        xhr = cache[base];
                        if (xhr !== true) {
                            // true signifies that prepending the SVG was not required
                            setTimeout(attrUpdateFunc({
                                useEl: uses[i],
                                base: base,
                                hash: hash
                            }), 0);
                        }
                        if (xhr === undefined) {
                            Request = createRequest(base);
                            if (Request !== undefined) {
                                xhr = new Request();
                                cache[base] = xhr;
                                xhr.onload = onloadFunc(xhr);
                                xhr.onerror = onErrorTimeout(xhr);
                                xhr.ontimeout = onErrorTimeout(xhr);
                                xhr.open("GET", base);
                                xhr.send();
                                inProgressCount += 1;
                            }
                        }
                    }
                } else {
                    if (!isHidden) {
                        if (cache[base] === undefined) {
                            // remember this URL if the use element was not empty and no request was sent
                            cache[base] = true;
                        } else if (cache[base].onload) {
                            // if it turns out that prepending the SVG is not necessary,
                            // abort the in-progress xhr.
                            cache[base].abort();
                            delete cache[base].onload;
                            cache[base] = true;
                        }
                    } else if (base.length && cache[base]) {
                        setTimeout(attrUpdateFunc({
                            useEl: uses[i],
                            base: base,
                            hash: hash
                        }), 0);
                    }
                }
            }
            uses = "";
            inProgressCount += 1;
            observeIfDone();
        };
        var winLoad;
        winLoad = function () {
            window.removeEventListener("load", winLoad, false); // to prevent memory leaks
            tid = setTimeout(checkUseElems, 0);
        };
        if (document.readyState !== "complete") {
            // The load event fires when all resources have finished loading, which allows detecting whether SVG use elements are empty.
            window.addEventListener("load", winLoad, false);
        } else {
            // No need to add a listener if the document is already loaded, initialize immediately.
            winLoad();
        }
    }
}());
//Only for bit
//Only for bit
//Only for bit
//Only for bit
var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

if ( isIE11 ){
	
	formgroups = document.querySelectorAll('.form--material .form__group input');
	
	Array.prototype.forEach.call(formgroups, function(el, i){
		
		if(el.value){
			el.nextElementSibling.classList.add('ie-up');
		}
		
		el.addEventListener("focus", function(){
			
			el.nextElementSibling.classList.add('ie-up');
			
		});
		
		el.addEventListener("blur", function(){
			
			if(!el.value){
				el.nextElementSibling.classList.remove('ie-up');	
			}
			
		});
		
	});
	
	
}




//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
var dropdown = (function(){ 
    
  var click = function(){
    
    parent = this.parentNode;
    
    if (!parent.classList.contains('dropdown--open')){
      dropdown.show(parent);
    }else{
      dropdown.hide(parent);
    }    
    
  };
  
  var show = function(el){

    //convertimos string a object si llamamos mediante método
    if(typeof(el) === 'string'){
      el = document.querySelector(el);
    }
    
    var startEvent = 'bc.is.showing';
    var endEvent = 'bc.is.visible';    
    
    //Start Event
    if (window.CustomEvent) {
      event = new CustomEvent(startEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(startEvent, true, true, {some: 'data'});
    }    
    el.dispatchEvent(event);       
        
    el.classList.add('dropdown--open');  
    el.querySelector('.dropdown__menu').setAttribute('aria-expanded','true');      
    el.querySelector('[data-toggle="dropdown"]').setAttribute('aria-expanded','true');
    
    //End Event
    if (window.CustomEvent) {
      event = new CustomEvent(endEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(endEvent, true, true, {some: 'data'});
    }
    el.dispatchEvent(event);
    
  };

  var hide = function(el){
    
    //convertimos string a object si llamamos mediante método
    if(typeof(el) === 'string'){
      el = document.querySelector(el);
    }
    
    var startEvent = 'bc.is.hiding';
    var endEvent = 'bc.is.hidden';
    
    //Start Event
    if (window.CustomEvent) {
      event = new CustomEvent(startEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(startEvent, true, true, {some: 'data'});
    }    
    el.dispatchEvent(event);       
    
    
    el.classList.remove('dropdown--open');
    el.querySelector('.dropdown__menu').setAttribute('aria-expanded','false');      
    el.querySelector('[data-toggle="dropdown"]').setAttribute('aria-expanded','false');  
    
    //End Event
    if (window.CustomEvent) {
      event = new CustomEvent(endEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(endEvent, true, true, {some: 'data'});
    }
    el.dispatchEvent(event);
    
  };

  var toggle = function(el){
    
    //convertimos string a object si llamamos mediante método
    if(typeof(el) === 'string'){
      el = document.querySelector(el);
    }
    
    var button = el.querySelector('[aria-expanded]');
    
    if (button.getAttribute('aria-expanded') == 'true'){        
      dropdown.hide(el);
    }else{
      dropdown.show(el);
    }   
    
  };

  var bindFunctions = function() {
    
    var elements = document.querySelectorAll('[data-toggle="dropdown"]');
    
    Array.prototype.forEach.call(elements, function(el, i){
      el.addEventListener('click', click);
    });
    
  };

  var init = function() {
    bindFunctions();
  };

  return {
    init: init,
    show: show,
    hide: hide,
    toggle: toggle,
  };
  
  
})();

document.addEventListener('DOMContentLoaded', function(){
	dropdown.init();
}, false);

//Only for bit
//Only for bit
var modal = (function(){
   
  var click = function(){
    
    var modalTarget = this.getAttribute('data-target');    
    modal.show(modalTarget);   
     
    return false;    
    
  };
  
  var show = function(el){
    
    //convertimos string a object si llamamos mediante método
    if(typeof(el) === 'string'){
      el = document.querySelector(el);
    }
    
    console.log(el);

    var startEvent = 'bc.is.showing';
    var endEvent = 'bc.is.visible';
    var body = document.querySelector('body');

    //Start Event
    if (window.CustomEvent) {
      event = new CustomEvent(startEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(startEvent, true, true, {some: 'data'});
    }    
    el.dispatchEvent(event);       
    
       
    var modalOverlay = document.querySelector('.modal-overlay');
    
    modalOverlay.classList.add('is-visible');
    modalOverlay.classList.remove('is-hidden');
    body.classList.remove('modal-is-visible');
        
    el.classList.add('is-showing');
    el.setAttribute('aria-hidden','false');
    
    //Ending Event
    if (window.CustomEvent) {
      event = new CustomEvent(endEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(endEvent, true, true, {some: 'data'});
    }
    el.dispatchEvent(event);
    
  }; 
  
  
  var hide = function(el){
    
    //convertimos string a object si llamamos mediante método
    if(typeof(el) === 'string'){
      el = document.querySelector(el);
    }
      var startEvent = 'bc.is.hiding';
      var endEvent = 'bc.is.hidden';
    
    //Start Event
    if (window.CustomEvent) {
      event = new CustomEvent(startEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(startEvent, true, true, {some: 'data'});
    }    
    el.dispatchEvent(event);       
      
    
    el.classList.remove('is-showing');
    el.classList.add('is-hiding');
    el.setAttribute('aria-hidden','true');
    
    
    var animateOut = function(){
      
      var body = document.querySelector('body');
        
      body.classList.remove('modal-is-visible');
      document.querySelector('.modal').classList.remove('is-hidden');                    
              
      var modalOverlay = document.querySelector('.modal-overlay');
      
      modalOverlay.classList.remove('is-visible');
      modalOverlay.classList.add('is-hidden');               
      el.classList.remove('is-showing');
      el.classList.remove('is-hiding');
      el.classList.remove('now');        
      
      
    };

    animateOut();
    
    
    //Ending Event
    if (window.CustomEvent) {
      event = new CustomEvent(endEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(endEvent, true, true, {some: 'data'});
    }
    el.dispatchEvent(event);
  
  };    
  
  var dismiss = function(){
    
    var modalTarget = '#'+this.closest('.modal').getAttribute('id');
    modal.hide(modalTarget);    
    
  };                 
  
  var bindFunctions = function() {
    
	var child = document.createElement('div');
	child.innerHTML = '<div class="modal-overlay is-hidden"></div>';
	child = child.firstChild;
	document.querySelector('body').appendChild(child);    
   
        
    var modals = document.querySelectorAll('[data-toggle="modal"]');
    
    if ( modals.length > 0 ) {
      Array.prototype.forEach.call(modals, function(el, i){
        el.addEventListener('click', click);
      });          
    }
    
    var dismisses = document.querySelectorAll('[data-dismiss="modal"]');
    
    if ( dismisses.length > 0 ) {      
      Array.prototype.forEach.call(dismisses, function(el, i){
        el.addEventListener('click', dismiss);
      });    
    }    
  };

  var init = function() {
    bindFunctions();
  };

  return {
    init: init,
    click: click,
    dismiss: dismiss,
    hide: hide,
    show: show,

  };
  
  
})();


document.addEventListener('DOMContentLoaded', function(){
	modal.init();
}, false);

//Only for bit
//Only for bit
var tabs = (function(){ 
  
  var click = function(e){
    
    e.preventDefault();
    
    //Marcamos el estado en botones
    tabParent = this.parentNode;
    
    tabParent.classList.add('is-active');
    tabParent.querySelector('[role="tab"]').setAttribute('aria-selected', 'true');
    
    Array.prototype.filter.call(tabParent.parentNode.children, function(child){
       if (child !== tabParent){
          child.classList.remove('is-active');
          child.querySelector('[role="tab"]').setAttribute('aria-selected', 'false');
       }
    });    
        
    //Activamos paneles
    
    var tabContentID = this.getAttribute('aria-controls');    
    el = document.getElementById(tabContentID);
    
    tabs.show(el);
    
  };


  var show = function(el){

    //convertimos string a object si llamamos mediante método
    if(typeof(el) === 'string'){
      el = document.querySelector(el);
    }
    
    var startEvent = 'bc.is.showing';
    var endEvent = 'bc.is.visible';
    
    
    //Start Event
    if (window.CustomEvent) {
      event = new CustomEvent(startEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(startEvent, true, true, {some: 'data'});
    }    
    el.dispatchEvent(event);       
    
    el.classList.add('is-active');

    
    //End Event
    if (window.CustomEvent) {
      event = new CustomEvent(endEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(endEvent, true, true, {some: 'data'});
    }
    el.dispatchEvent(event);
    
    //We hide the siblings
    Array.prototype.filter.call(el.parentNode.children, function(child){
       if (child !== el){         
          hide(child);
       }
    });    
        
    
  };
  
  var hide = function(el){
    
    //convertimos string a object si llamamos mediante método
    if(typeof(el) === 'string'){
      el = document.querySelector(el);
    }
    
    var startEvent = 'bc.is.hiding';
    var endEvent = 'bc.is.hidden';
    
    //Start Event
    if (window.CustomEvent) {
      event = new CustomEvent(startEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(startEvent, true, true, {some: 'data'});
    }    
    el.dispatchEvent(event);       
      
    //We hide the siblings
    el.classList.remove('is-active');
    
    //End Event
    if (window.CustomEvent) {
      event = new CustomEvent(endEvent, {detail: {some: 'data'}});
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(endEvent, true, true, {some: 'data'});
    }    
    el.dispatchEvent(event);       
    
  };
  
  
  var bindFunctions = function() {
    
    var elements = document.querySelectorAll('.nav--tabs [aria-controls]');
    
    Array.prototype.forEach.call(elements, function(el, i){
      el.addEventListener('click', click);
    });
    
  };

  var init = function() {
    bindFunctions();
  };

  return {
    init: init,
    show: show,
  };
  
  
})();

document.addEventListener('DOMContentLoaded', function(){
	tabs.init();
}, false);

//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//Only for bit
//# sourceMappingURL=maps/async.js.map
