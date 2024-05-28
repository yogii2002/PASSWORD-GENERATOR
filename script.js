const inputSlider = document.querySelector("[data-lengthSlider]"); 
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector(".display")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = '~`!@#$%^&*()_+-=[]{};\:"|,./<>?';


let password = "";
let passwordLength=10;
let checkCount=0;
handleSlider();
// set strength circle color=grey
setIndicator("#ccc");
//handle slider - It sets the password's length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize= ( (passwordLength-min)*100/(max-min)) + "% 100%";


}

//setIndicator- color set and shadow strength
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`;
}

//get Random integer
function getRandInteger(min, max){
    return Math.floor(Math.random() * (max-min))+min;
}


function generateRandNumber(){
    return getRandInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRandInteger(97,123));
    //ASCI of 'a'=97 & 'z'=123     
}
function generateUppercase(){
    return String.fromCharCode(getRandInteger(65,91));
    //ASCI of 'A'=65 & 'Z'=91     
}

function generateSymbol(){
    const randNum = getRandInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper =true;
    if(lowercaseCheck.checked) hasLower =true;
    if(numbersCheck.checked) hasNum =true;
    if(symbolsCheck.checked) hasSym =true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) && 
        (hasNum || hasSym) &&
        passwordLength>=6
    ){
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    
    try{

         
        await navigator.clipboard.writeText(passwordDisplay.value);
        
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}
    

    
    


function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkBox)=>{
        if(checkBox.checked)
            checkCount++;
    })
    //special condition
    if(passwordLength < checkCount){
        passwordLength=checkcount;
        handleSlider();
    }
}
allCheckBox.forEach( (checkBox)=>{
    checkBox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        
        copyContent();
    }
})


function shufflePassword(array){
    //Fisher Yates Method

    for( let i=array.length-1; i>0; i--){
        const j= Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected
    if(checkCount ==0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //Generating new password

    //step 1:- Remove old password
    password="";

    // checking which checkboxes are checked
    // if(uppercaseCheck.checked){
    //     password += generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }


     
    let funcArr=[];
    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);
    
    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);
    
    if(numbersCheck.checked)
        funcArr.push(generateRandNumber);
    
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    for(let i=0;i<funcArr.length; i++){
        password += funcArr[i]();
    }

    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRandInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value  = password;

    //calculate strength
    calcStrength();
    

});