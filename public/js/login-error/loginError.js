const email = document.getElementById('email')
const password = document.getElementById('password')

const btn = document.getElementById('submit-login')

btn.addEventListener('click',function(event){
    event.preventDefault()
    if(email.value === password.value && password.value !== '' && email.value !== ''){
        console.log('oi')
        console.log(password.value)
        console.log(email.value)
        window.location.href = "./user"
    }
    else{
        console.log('error')
        email.classList.add('error')
        password.classList.add('error')
        email.style.border='2px solid red'
        password.style.border='2px solid red'
    }
})

email.addEventListener('click',function(){
    email.classList.remove('error')
    password.classList.remove('error')
    email.style.border='none'
    password.style.border='none'
    
})

password.addEventListener('click',function(){
    email.classList.remove('error')
    password.classList.remove('error')
    email.style.border='none'
    password.style.border='none'
})
