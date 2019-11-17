var power = 10
var generatorsL1 = []
var lastUpdate = Date.now()
var lastPowerUpdate = power
var diff = 0
var L1TierCount = 4
var L1TierReset = 0
var tickSpeedCost = 1000000
var tickMult = 1
var tickIncrement = 1.05
var pageCount = 3
var L1empowerLevel = 0
var saveTimer = 0
var firstTime = 0

//Gen init
function GeneratorL1Init() {
  for (let i = 0; i < L1TierCount; i++) {
    let generator = {
      cost: Math.pow(10, (i * 2)) * 10,
      bought: 0,
      amount: 0,
      mult: 1,
      production: Math.pow(10, (i * 1.8)),
      autobuy: false,
      autoBuyToggle: true
    }
    document.getElementById("gen" + (i + 1)).classList.remove("TLocked")
    generatorsL1.push(generator)
  }
}
GeneratorL1Init()

//reset progress
function deleteGame() {
  power = 10
  GeneratorL1Init()
  GeneratorL1Reset()
  tickReset()
  L1TierCount = 4
  L1TierReset = 0
  L1empowerLevel = 0
}

function autoSave() {
  localStorage.setItem('power', JSON.stringify(power));
  localStorage.setItem('generatorsL1', JSON.stringify(generatorsL1));
  localStorage.setItem('lastUpdate', JSON.stringify(lastUpdate));
  localStorage.setItem('lastPowerUpdater', JSON.stringify(lastPowerUpdate));
  localStorage.setItem('diff', JSON.stringify(diff));
  localStorage.setItem('L1TierCount', JSON.stringify(L1TierCount));
  localStorage.setItem('L1TierReset', JSON.stringify(L1TierReset));
  localStorage.setItem('tickSpeedCost', JSON.stringify(tickSpeedCost));
  localStorage.setItem('tickMult', JSON.stringify(tickMult));
  localStorage.setItem('tickIncrement', JSON.stringify(tickIncrement));
  localStorage.setItem('L1empowerLevel', JSON.stringify(L1empowerLevel));
}

function load() {
  power = JSON.parse(localStorage.getItem('power'));
  lastUpdate = JSON.parse(localStorage.getItem('lastUpdate'));
  lastPowerUpdate = JSON.parse(localStorage.getItem('lastPowerUpdate'));
  diff = JSON.parse(localStorage.getItem('diff'));
  L1TierCount = JSON.parse(localStorage.getItem('L1TierCount'));
  GeneratorL1Init()
  generatorsL1 = JSON.parse(localStorage.getItem('generatorsL1'));
  L1TierReset = JSON.parse(localStorage.getItem('L1TierReset'));
  tickSpeedCost = JSON.parse(localStorage.getItem('tickSpeedCost'));
  tickMult = JSON.parse(localStorage.getItem('tickMult'));
  tickIncrement = JSON.parse(localStorage.getItem('tickIncrement'));
  L1empowerLevel = JSON.parse(localStorage.getItem('L1empowerLevel'));
}

if (!(localStorage.getItem("power") === null)) {
  load()
}

//Gen Level 1 Reset
function GeneratorL1Reset() {
  for (let i = 0; i < L1TierCount; i++ ){
    generatorsL1[i].amount = 0
    generatorsL1[i].cost = Math.pow(10, (i * 2)) * 10
    generatorsL1[i].bought = 0
    generatorsL1[i].mult = 1
    generatorsL1[i].production = Math.pow(10, (i * 1.9))
    document.getElementById("gen" + (i + 1)).classList.remove("TLocked")
  }
}

//Scientific notation formating
function format(amount) {
  let power = Math.floor(Math.log10(amount))
  let mantissa = amount / Math.pow(10, power)
  if (power < 3) return amount.toFixed(2)
  return mantissa.toFixed(2) + "e" + power
}

//DRY Pages
function gotoPage(i) {
  for (let a = 1; a <= pageCount; a++ ){
    document.getElementById("page" + a).classList.add("hidden")
  }
  document.getElementById("page" + i).classList.remove("hidden")
}

//Gen buying
function buyGenerator(i) {
  let g = generatorsL1[i - 1]
  if (g.cost > power) return
  power -= g.cost
  g.amount += 1
  g.mult *= 1.05
  g.cost *= 1.5
}

//Tick speed buying
function buyTickSpeed() {
  if (tickSpeedCost > power) return
  power -= tickSpeedCost
  tickMult *= tickIncrement
  tickSpeedCost *= 10
}

//Tick reset
function tickReset() {
  tickSpeedCost = 1000000
  tickIncrement = 1.10
  tickMult = 1
}

//L1 Reset
function L1Reset() {
  if (generatorsL1[L1TierCount - 1].amount < 20) return
  L1TierCount +=1
  power = 10
  GeneratorL1Init()
  GeneratorL1Reset()
  tickReset()
  L1TierReset += 1
  for (let i = 0; i < L1TierCount; i++) {
    generatorsL1[i].mult *= Math.pow(2, L1TierReset)
  }
}

//L1 Empower
function L1Empower() {
  if (generatorsL1[L1empowerLevel + 3].amount < 50) return
  L1empowerLevel +=1
  power = 10
  GeneratorL1Init()
  GeneratorL1Reset()
  tickReset()
  generatorsL1[L1empowerLevel].mult *= 3
  generatorsL1[L1empowerLevel].autobuy = true
  document.getElementById("genA" + L1empowerLevel).classList.remove("TLocked")
  document.getElementById("AutoButton").classList.remove("hidden")
}

//Autobuying
function AutoBuy() {
  for (let i = 0; i < L1TierCount; i++ ){
    if (generatorsL1[i].autobuy == true && generatorsL1[i].autoBuyToggle == true)
    buyGenerator(i)
  }
}

//AutoBuyer Toggle
function AutoBuyerToggle(i) {
  if (generatorsL1[i - 1].autoBuyToggle == true) {
    generatorsL1[i - 1].autoBuyToggle = false
  }
  else {
    generatorsL1[i - 1].autoBuyToggle = true
  }
}

//Updating GUI
function updateGUI() {
  // Updating Power
  document.getElementById("currency").textContent = "You have " + format(power) + " power"
  // Updation Power per second
  document.getElementById("currencyPS").textContent = "You gain " + format((power - lastPowerUpdate) * diff * 400) + " power per second"
  document.getElementById("tickSpeedButton").innerHTML = "Buy to speed up your game by " + tickIncrement + "x<br>Cost: " + format(tickSpeedCost) + "<br>Currently " + format(tickMult) + "x faster"
  if (power < tickSpeedCost) { document.getElementById("tickSpeedButton").classList.add("locked") }
  else { document.getElementById("tickSpeedButton").classList.remove("locked") }
  document.getElementById("L1ResetButton").innerHTML = "Reset Level 1 to gain:<br>New Tier and 2x mult<br>Requires:<br>20 Tier " + L1TierCount + "s"
  if (generatorsL1[L1TierCount - 1].amount < 20) { document.getElementById("L1ResetButton").classList.add("locked") }
  else { document.getElementById("L1ResetButton").classList.remove("locked") }
  if (L1TierReset > 0) document.getElementById("L1EmpowerButton").classList.remove("hidden")
  else document.getElementById("L1EmpowerButton").classList.add("hidden")
  document.getElementById("L1EmpowerButton").innerHTML = "Reset game to Empower Tier " + (L1empowerLevel + 1) + " and gain:<br>An autobuyer and 3x mult on Tier " + (L1empowerLevel + 1) + "<br>Requires:<br> 50 Tier " + (L1empowerLevel + 4) + "s"
  if (generatorsL1[L1empowerLevel + 3].amount < 50) { document.getElementById("L1EmpowerButton").classList.add("locked") }
  else { document.getElementById("L1EmpowerButton").classList.remove("locked") }
  for (let i = 0; i < L1TierCount; i++) {
    //Updating Generators
    let g = generatorsL1[i]
    document.getElementById("gen" + (i + 1)).innerHTML = "Generator Tier " + (i + 1) + "<br>Amount: " + format(g.amount) + "<br>Mult: " + format(g.mult) + "x<br>Cost: " + format(g.cost) + "<br>Production: " + format(g.production)
    if (g.cost > power) document.getElementById("gen" + (i + 1)).classList.add("locked")
    else document.getElementById("gen" + (i + 1)).classList.remove("locked")
    if (g.autoBuyToggle == true) {
      document.getElementById("genA" + (i + 1)).innerHTML = "Autobuyer Tier " + (i + 1) + "<br>Status: on"
    } else if (g.autoBuyToggle == false) {
      document.getElementById("genA" + (i + 1)).innerHTML = "Autobuyer Tier " + (i + 1) + "<br>Status: off"
    } else {
      document.getElementById("genA" + (i + 1)).innerHTML = "Autobuyer Tier " + (i + 1) + "<br>Status: unfunctional"
    }
  }
}


function productionLoop(diff) {
  for (let i = 0; i < L1TierCount; i++) {
    power += generatorsL1[i].amount * generatorsL1[i].mult * generatorsL1[i].production * diff * tickMult
  }
}
/*  \/ ORIGINAL CODE \/
function productionLoop(diff) {
  power += generatorsL1[0].amount * generatorsL1[0].mult * diff
  for (let i = 1; i < 10; i++) {
    generatorsL1[i - 1].amount += generatorsL1[i].amount * generatorsL1[i].mult * diff / 5
  }
}
*/
function mainLoop() {
  diff = (Date.now() - lastUpdate) / 1000
  AutoBuy()
  productionLoop(diff)
  updateGUI()
  saveTimer++
  if (saveTimer > (20 * 60)) {
    autoSave()
    saveTimer = 0
  }

  lastUpdate = Date.now()
  lastPowerUpdate = power
}


setInterval(mainLoop, 50)


updateGUI()
