var combocards = [];
var comboPowers = [];
var playerbonus = [];
const allCards = [];
const playerdeck = [];
const powerdeck = [];
const stathelp = new Array();
const pStats = [];
let numberOfPLayers = 4;
let numberOfCards = 13;
const cardKinds = ["s", "d", "c", "h"]; 
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
cardMap = { '1': 20, '13': 16, '12': 14, '11': 12, '10': 10, '9': 8, '8': 7, '7': 6, '6': 5, '5': 4, '4': 3, '3': 2, '2': 1 };

function main(){
    initializeCards();
    var button = document.getElementById("singleDeal");
    button.addEventListener("click", singleDeal, false );
    var button2 = document.getElementById("multideal");
    button2.addEventListener("click", multideal, false );
    var button3 = document.getElementById("setvalue");
    button3.addEventListener("click", changePower, false );
    var button4 = document.getElementById("setCombos");
    button4.addEventListener("click", addCombos, false );
    var button5 = document.getElementById("numOfPlayers");
    button5.addEventListener("click", setPlayersNumber, false );
    initializePlayerAttributes();
}
function singleDeal(){
    shuffleCards();
    distributeCards(numberOfPLayers, numberOfCards);
    display();
}
function initializePlayerAttributes(){
    for(var i =0; i<numberOfPLayers;i++){
        powerdeck[i] = 0;
        pStats[i] = 0;
        stathelp[i] = [];
        playerbonus[i] = 0;
    }
}
function initializeCards(){
    for(var i in cardKinds){
        for(var j in cards){
            allCards.push(cards[j]+cardKinds[i]);
        }
    }
}

function shuffleCards(){
    for(var i = allCards.length-1;i > 0; i--){
        var j = Math.floor(Math.random()*(i+1));
        var temp = allCards[i];
        allCards[i] = allCards[j];
        allCards[j] = temp;
    }
}

function distributeCards(numPlayers, numCards){
    for(var i = 0; i < numPlayers; i++){
        playerdeck[i] = [];
        for(var j =0; j < numCards; j++){
            playerdeck[i].push(allCards[j + i * numCards]);
        }
    }
}

function display(){
    document.getElementById("cardDisplay").innerHTML = "";
    for(var i =0; i <numberOfPLayers; i++){
        var pow = findPower(playerdeck[i]);
        let tim = comboChecker(playerdeck[i]);
        comboCalculator(tim, i);
        powerdeck[i] += pow;
        document.getElementById("cardDisplay").innerHTML += "<h1>Cards for player "+(i+1)+"</h1>";
        findCardImage(playerdeck[i]);
        document.getElementById("cardDisplay").innerHTML += "<br><strong>Power of the deck: "+pow+"</strong>"+"<br>Bonus power from power group: "+ playerbonus[i]+"</strong>"
        playerbonus[i] =0;
        stathelp[i].push(pow);
        document.getElementById("cardDisplay").innerHTML += "<br><strong>Total power of all player"+(i+1)+" deals: "+powerdeck[i]+"</strong>"

    }displayStats();
}
function findCardImage(array){
    for(var i =0; i < array.length; i++){
        let element = array[i];
        document.getElementById("cardDisplay").innerHTML += "<img src=\"blkjck_images/" + element + ".png\" height = \"100px\" width = \"70px\" >";
                    
    }
}

function findPower(array){
    let power = 0;
    for (let i = 0; i < array.length; i++) {
        let cardNumber = array[i].slice(0, -1);
        power += cardMap[cardNumber];
    }
    return power;
}

function powerOfArray(array){
    let power = 0;
    for (let i = 0; i < array.length; i++) {
        var t = cardConverter(array[i]);
        power += cardMap[t];
    }
    return power;
}
function multideal() {
    let numberOfDeals = window.prompt("Enter the number of deals: ");
    for (let i = 0; i < numberOfDeals; i++) {
        singleDeal();
    }
}
function setPlayersNumber(){
    numberOfPLayers = window.prompt("Enter the number of players: ");
    setPlayerCardNumber();
    initializePlayerAttributes();
    singleDeal();
}
function setPlayerCardNumber(){
    numberOfCards = window.prompt("Enter the number of cards: ");
    window.alert("Hit Deal to see changes!!");

}
function cardConverter(inStr){
    switch(inStr){
        case "A":
            return 1;
        case "K":
            return 13;
        case "Q":
            return 12;
        case "J":
            return 11;
        default:
            var output = parseInt(inStr);
            return output;
}
}


function changePower() {
    let cardInput = window.prompt("Enter the card to be modified.\neg: A, K, Q");
    let card = cardConverter(cardInput);
    let power = window.prompt("Enter the value for" + card +".\neg: 12, 13, 14");
    cardMap[card] = parseInt(power);
    window.alert("The new value of "+cardInput+" is "+ power);
    console.log(cardInput+"/"+card+ " was modified, and the new value is "+ power);
}

function calculateStats(powers) {
    let sum = powers.reduce((a, b) => a + b, 0);
    let mean = sum / powers.length;
    let min = Math.min(...powers);
    let max = Math.max(...powers);
    let squaredDiffs = powers.map(x => Math.pow(x - mean, 2));
    let avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    let stdDev = Math.sqrt(avgSquaredDiff);
    return {mean, min, max, stdDev};
}
function displayStats(){
    let table = '<table border="4">';
    table += '<tr><th>Player</th><th>Mean</th><th>Min</th><th>Max</th><th>Std Dev</th></tr>';
    for(var i = 0; i < numberOfPLayers; i++){
        pStats[i] = calculateStats(stathelp[i]);
        table += `<tr><td>Player${i+1}</td><td>${pStats[i].mean}</td><td>${pStats[i].min}</td><td>${pStats[i].max}</td><td>${pStats[i].stdDev}</td></tr>`;
    }
    table += '</table>';
    document.getElementById("statTable").innerHTML = table;
}
function cardConverter4Array(inputArray){
    for(var i = 0; i<inputArray.length; i++ ){
        let tempp = cardConverter(inputArray[i]);
        inputArray[i] =tempp;
    }return inputArray;
}
function arraySlicer(array){
    for (let i = 0; i < array.length; i++) {
        let blah = array[i].slice(0, -1);
        array[i] = blah;
    }
}
function stringSplitter(string){
    let tempstr = string.split(",");
    return tempstr
}
function makeStr(array){
    let Str = array.toString();
    return Str;
}
function addCombos(){
    let combo = window.prompt("Enter the group: \neg: A,K,Q or A,K");
    let finalpush = combo.split(",");
    let hrs = cardConverter4Array(finalpush);
    combocards.push(makeStr(hrs));
    let comboPowerInput = window.prompt("Enter the power for the group: \neg: 50 or 40");
    comboPowers.push(parseInt(comboPowerInput));
}


function comboChecker(array){
    let timesArray = [];
    let counter =0;
    let playerArray = [...array];
    arraySlicer(playerArray);
    let len1 = array.length;
    let len2 = combocards.length;
    for(var i = 0;i < len2; i++){
        let times = 0;
        let temp = combocards[i];
        let individualGroup = combocards[i].split(",");
        let len3 = individualGroup.length;
        for(var j =0; j <= len1 - len3; j++){
            counter = 0;
            for(var k = 0; k < len3; k++){
                if(playerArray.includes(individualGroup[k])){
                    let index = playerArray.indexOf(individualGroup[k]);
                    playerArray.splice(index, 1);
                    counter++;
                }if(counter === len3){
                    times++;
                    
                }
            }
        }timesArray[i]= times;
    }return timesArray;
}
function comboCalculator(array, player){
    let len4 = array.length;
    console.log("the combo powers;"+comboPowers);
    console.log("the times each player gets " + array);
    for(var i = 0; i < len4; i++)
    {
        playerbonus[player] += comboPowers[i]*array[i];
        console.log(playerbonus);
    }
    console.log("the players extra bonysu; "+playerbonus);
    return playerbonus;
}



window.addEventListener("load",main, false);
