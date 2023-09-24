// Değişken Tanımlamaları

const numbers = document.querySelectorAll('.number')
const guessNumbers = document.querySelectorAll('.guessNumber')
const guessForm = document.querySelector('.guessForm')
const realNumber = document.querySelector('.realNumber')
const currentScore = document.querySelector('.currentScore')
const highScore = document.querySelector('.highScore')
const scoreAlert = document.querySelector('.scoreAlert')
const newGame = document.querySelector('.newGame')
let scoreNow = 0

// Eventler

runEvents()
function runEvents(){
    guessForm.addEventListener('submit',numberPredicted)
    document.addEventListener('DOMContentLoaded',writeScore)
    guessNumbers.forEach(num=>num.addEventListener('keyup',nextInput))
    newGame.addEventListener('submit',startNewGame)
}

// Sayı Tahmin Edildi

function numberPredicted(e){
    e.preventDefault()

    numbers.forEach(num=>{
        num.removeAttribute('id')
    })

    // Sayıları Sürekli Değiştirme
     changeNumbers()
        
    // Sayıları Yerleştirme 
    setTimeout(() => {
        placeInDiv()
        guessNumbers.forEach((guessnum,index)=>{
           
            // Sayılar Birbirini Tutuyor mu?
            isCorrect(guessnum.value,index)
        })
        // Inputu Temizleme
        guessNumbers.forEach(nums=>{
        nums.value = ''
        
    })
        writeScore()
        showAlert()
    }, 2000);

    placeGuessNumber()
    
}

// Sayılar Doğru mu?

function isCorrect(number,idx) {
    if (numbers[idx].textContent==number) {
        numbers[idx].setAttribute('id','correct')
    }else {
        numbers[idx].setAttribute('id','incorrect')
    }
}

// Rastgele Sayı Üretme

function randomNumberProducter(){
    return Math.floor(Math.random()*10)
}

// Sayıları Divlere Yerleştirme

function placeInDiv() {
    numbers.forEach(num=>{
        num.innerHTML = randomNumberProducter()
    })
}

// Sürekli Sayı Değiştirme

function changeNumbers() {
    
    const changeInterval =  setInterval(() => {
        numbers.forEach(num=>{
            num.innerHTML = randomNumberProducter()
        })
    }, 20);

    setTimeout(() => {
        clearInterval(changeInterval)
    }, 2000);
}

// Tahmin Edilen Sayıyı Yerleştirme

function placeGuessNumber() {
    realNumber.style.opacity = '1'
    let numberGuessed = ''
    guessNumbers.forEach(guess=>{
        numberGuessed += guess.value
    })
    realNumber.innerHTML = `Tahmin Edilen Sayı : ${numberGuessed}`
}

// Puanları Ayarlama

function getScore() {
    let scores = []
    for (let i = 0; i < numbers.length; i++) {
        if(numbers[i].getAttribute('id')=='correct'){
            scores.push(numbers[i].getAttribute('id'))
        }
    }
    return scores.length
}

// Puanları Yazdırma

function writeScore(){
    // Session Storage'a Kaydetme
    saveToSessionStorage()
    // Anlık Puan Arayüzene Yazdırma
    writeToUI()

    // Local Storage'a Kaydetme
    saveToLocalStorage()
    // En YÜksek Puan Arayüzene Yazdırma
    writeToHigh()
}

// Session Storage'a Kaydetme

function saveToSessionStorage() {
    if (sessionStorage.getItem('current')== null || sessionStorage.getItem('current')== 0) {
        scoreNow += getScore()*10
        sessionStorage.setItem('current',scoreNow)
    }else {
        scoreNow = Number(sessionStorage.getItem('current')) + (getScore()*10)
        sessionStorage.setItem('current',scoreNow)
    }
}

// Arayüze Yazdırma

function writeToUI() {
    currentScore.innerHTML = `Anlık Puan : ${sessionStorage.getItem('current')}`
}


// Local Storage'a Kaydetme

function saveToLocalStorage() {
    if (Number(sessionStorage.getItem('current'))>=Number(localStorage.getItem('high')) || localStorage.getItem('high')==undefined) {
        localStorage.setItem('high',sessionStorage.getItem('current'))
    }

}

// En YÜksek Puan Arayüzene Yazdırma

function writeToHigh() {
    highScore.innerHTML = `En yüksek Puan : ${localStorage.getItem('high')}`
}

// Yeni İnputa Geçme

function nextInput() {
    guessNumbers.forEach(num=>{
        if (num.value!=='') {
            num.nextElementSibling.focus()
        }
    })
}

// Puan Alert'i

function showAlert() {

    scoreAlert.style.opacity = '1'
    scoreAlert.style.visibility = 'visible'

    if (getScore()*10 == 0) {
        scoreAlert.innerHTML = `Doğru sayı tahmin edemediniz. Puan Kazanamadınız!`
    }else {
        scoreAlert.innerHTML = `${getScore()} tane doğru sayı tahmin ettiniz. ${getScore()*10} Puan Kazandınız!`
    }

    setTimeout(() => {
        scoreAlert.style.opacity = '0'
        scoreAlert.style.visibility = 'hidden'
    }, 2500);
}

// Yeni Oyuna Başla

function startNewGame(e) {
    e.preventDefault()
    sessionStorage.setItem('current',0)
    writeToUI()
}