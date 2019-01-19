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


