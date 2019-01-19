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