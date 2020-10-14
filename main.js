/////Initialization
var power = 10
var generatorsL1 = []
var lastUpdate = Date.now()
var lastPowerUpdate = power
var diff = 0
var L1TierCount = 4
var L1GMult = 1.05
var L1TierReset = 0
var tickSpeedCost = 1000000
var tickMult = 1
var tickIncrement = 1.1
var pageCount = 5
var L1empowerLevel = 0
var saveTimer = 0
var TVcost = 50
var TVlevel = 0
var powerPs = 0
var TVmult = 1.5
var L1TierUpCost = 20
var Kamount = 1
var singularityAmount = 0
var powerPSArray = []
var powerPSTotal = 0
//Gen init
function GeneratorL1Init() {
  for (let i = 0; i < L1TierCount; i++) {
    let generator = {
      cost: Math.pow(10, (i * 2)) * 10,
      bought: 0,
      amount: 0,
      mult: 1,
      Emult: 1,
      production: Math.pow(10, (i * 1.8)),
      autobuy: false,
      autoBuyToggle: true
    }
    document.getElementById("gen" + (i + 1)).classList.remove("TLocked")
    generatorsL1.push(generator)
  }
}
GeneratorL1Init()

function TLockL1Gens() {
  for (let i = 0; i < 10; i++) {
    document.getElementById("gen" + (i + 1)).classList.add("TLocked")
  }
}

//Deleting progress
function startGame() {
  power = 10
  generatorsL1 = []
  lastUpdate = Date.now()
  lastPowerUpdate = power
  diff = 0
  L1TierCount = 4
  L1GMult = 1.05
  L1TierReset = 0
  tickSpeedCost = 1000000
  tickMult = 1
  tickIncrement = 1.1
  pageCount = 5
  L1empowerLevel = 0
  saveTimer = 0
  TVcost = 50
  TVlevel = 0
  powerPs = 0
  TVmult = 1.5
  L1TierUpCost = 20
  Kamount = 1
  singularityAmount = 0
  powerPSArray = []
  powerPSTotal = 0
  GeneratorL1Init()
  GeneratorL1Reset()
  ResetGUI()
}

//Saving
function autoSave() {
  localStorage.setItem('power', JSON.stringify(power));
  localStorage.setItem('generatorsL1', JSON.stringify(generatorsL1));
  localStorage.setItem('lastUpdate', JSON.stringify(lastUpdate));
  localStorage.setItem('lastPowerUpdate', JSON.stringify(lastPowerUpdate));
  localStorage.setItem('diff', JSON.stringify(diff));
  localStorage.setItem('L1TierCount', JSON.stringify(L1TierCount));
  localStorage.setItem('L1GMult', JSON.stringify(L1GMult));
  localStorage.setItem('L1TierReset', JSON.stringify(L1TierReset));
  localStorage.setItem('tickSpeedCost', JSON.stringify(tickSpeedCost));
  localStorage.setItem('tickMult', JSON.stringify(tickMult));
  localStorage.setItem('tickIncrement', JSON.stringify(tickIncrement));
  localStorage.setItem('pageCount', JSON.stringify(pageCount));
  localStorage.setItem('L1empowerLevel', JSON.stringify(L1empowerLevel));
  localStorage.setItem('saveTimer', JSON.stringify(saveTimer));
  localStorage.setItem('TVcost', JSON.stringify(TVcost));
  localStorage.setItem('TVlevel', JSON.stringify(TVlevel));
  localStorage.setItem('powerPs', JSON.stringify(powerPs));
  localStorage.setItem('TVmult', JSON.stringify(TVmult));
  localStorage.setItem('L1TierUpCost', JSON.stringify(L1TierUpCost));
  localStorage.setItem('Kamount', JSON.stringify(Kamount));
  localStorage.setItem('singularityAmount', JSON.stringify(singularityAmount));
  localStorage.setItem('powerPSArray', JSON.stringify(powerPSArray));
  localStorage.setItem('powerPSTotal', JSON.stringify(powerPSTotal));
}

//Loading
function load() {
  power = JSON.parse(localStorage.getItem('power'));
  lastUpdate = JSON.parse(localStorage.getItem('lastUpdate'));
  lastPowerUpdate = JSON.parse(localStorage.getItem('lastPowerUpdate'));
  diff = JSON.parse(localStorage.getItem('diff'));
  L1TierCount = JSON.parse(localStorage.getItem('L1TierCount'));
  GeneratorL1Init()
  generatorsL1 = JSON.parse(localStorage.getItem('generatorsL1'));
  L1GMult = JSON.parse(localStorage.getItem('L1GMult'));
  L1TierReset = JSON.parse(localStorage.getItem('L1TierReset'));
  tickSpeedCost = JSON.parse(localStorage.getItem('tickSpeedCost'));
  tickMult = JSON.parse(localStorage.getItem('tickMult'));
  tickIncrement = JSON.parse(localStorage.getItem('tickIncrement'));
  L1empowerLevel = JSON.parse(localStorage.getItem('L1empowerLevel'));
  saveTimer = JSON.parse(localStorage.getItem('saveTimer'));
  TVcost = JSON.parse(localStorage.getItem('TVcost'));
  TVlevel = JSON.parse(localStorage.getItem('TVlevel'));
  powerPs = JSON.parse(localStorage.getItem('powerPs'));
  TVmult = JSON.parse(localStorage.getItem('TVmult'));
  L1TierUpCost = JSON.parse(localStorage.getItem('L1TierUpCost'));
  Kamount = JSON.parse(localStorage.getItem('Kamount'));
  singularityAmount = JSON.parse(localStorage.getItem('singularityAmount'));
  powerPSArray = JSON.parse(localStorage.getItem('powerPSArray'));
  powerPSTotal = JSON.parse(localStorage.getItem('powerPSTotal'));
}
//Load check

if (!(localStorage.getItem("power") === null)) {
  load()
}


/////BUTTONS
//Gen Level 1 Reset
function GeneratorL1Reset(x) {
  for (let i = 0; i < L1TierCount; i++ ){ // Default
    generatorsL1[i].amount = 0
    generatorsL1[i].cost = Math.pow(10, (i * 2)) * 10
    generatorsL1[i].bought = 0
    generatorsL1[i].mult = 1
    generatorsL1[i].production = Math.pow(10, (i * 1.9)),
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
  g.mult *= L1GMult
  g.cost *= 1.25
  for (let a = i; a < L1TierCount; a++) {
    generatorsL1[a].mult *= (((L1GMult-1) / (Math.pow(2,((a-i)+1))))+1)
  }
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
  tickMult = 1
}

//L1 Tier-Up
function L1Reset() {
  if (generatorsL1[L1TierCount - 1].amount < L1TierUpCost) return
  L1TierReset += 1
  for (let i = 0; i < L1TierCount; i++) {
    generatorsL1[i].mult *= Math.pow(2, L1TierReset)
  }
  if (L1TierCount < 10) {
    L1TierCount++
  }
  if (L1TierCount == 10) {
    L1TierUpCost *= 1.5
  }
  power = 10
  GeneratorL1Init()
  GeneratorL1Reset()
  tickReset()
}

//L1 Empower
function L1Empower() {
  if (generatorsL1[L1empowerLevel].amount < 50) return
  L1empowerLevel +=1
  power = 10
  GeneratorL1Init()
  GeneratorL1Reset()
  tickReset()
  generatorsL1[L1empowerLevel].Emult *= 3
  generatorsL1[L1empowerLevel - 1].autobuy = true
}
function L1EmpowerDelete() {
  L1empowerLevel = 0
  for (let i = 0; i < L1TierCount; i++) {
    generatorsL1[i].autobuy = false
    generatorsL1[i].autoBuyToggle = false
    generatorsL1[i].Emult = 1
  }
}

//Autobuying
function AutoBuy() {
  for (let i = 1; i < L1TierCount+1; i++ ){ 
    if (generatorsL1[i-1].autobuy == true && generatorsL1[i-1].autoBuyToggle == true) {
      buyGenerator(i)
    }
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

//TV-ing
function TVreset() {
  if (generatorsL1[9].amount < TVcost) return
  GeneratorL1Init()
  GeneratorL1Reset()
  tickReset()
  L1EmpowerDelete()
  TLockL1Gens()
  power = 10
  TVlevel += 1
  TVcost *= 1.3
  L1TierCount = 4
  tickIncrement *= Math.pow(TVmult, TVlevel)
}
function TVdelete() {
  TVlevel = 0
  TVcost = 50
  tickIncrement = 1.1
}

//Reseting GUI
function ResetGUI() {
  document.getElementById("AutoButton").classList.add("hidden")
  document.getElementById("L1EmpowerButton").classList.add("hidden")
  document.getElementById("TVButton").classList.add("hidden")
  document.getElementById("singularityCounter").classList.add("hidden")
  TLockL1Gens()
}

//Kugelblitz-ing
function PreKugelblitz() {
  gotoPage(5)
}
function Kugelblitz() {
  gotoPage(1)
  tickReset()
  L1EmpowerDelete()
  TVdelete()
  ResetGUI()
  GeneratorL1Init()
  GeneratorL1Reset()
  document.getElementById("singularityCounter").classList.remove("hidden")
  L1TierCount = 4
  power = 10
  singularityAmount += 1
}

/////MAIN THINGS
//Production Loop
function productionLoop(diff) {
  for (let i = 0; i < L1TierCount; i++) {
    powerPs = generatorsL1[i].amount * generatorsL1[i].mult * generatorsL1[i].Emult * generatorsL1[i].production * diff * tickMult
    power += powerPs
  }
}

////GUI
//Updating GUI
function updateGUI() {
  powerPSTotal = 0
  for (let i = 0; i < L1TierCount; i++){
    powerPSArray[i] = generatorsL1[i].amount * generatorsL1[i].mult * generatorsL1[i].Emult * generatorsL1[i].production * tickMult
  }
  for (let i = 0; i < L1TierCount; i++){
    powerPSTotal += powerPSArray[i]
  }
  // Updating Power
  document.getElementById("currency").textContent = "You have " + format(power) + " power"
  //Updating singularities
  document.getElementById("singularityCounter").textContent = "You have " + format(singularityAmount) + " singularities"
  // Updating Power per second
  document.getElementById("currencyPS").textContent = "You gain " + format(powerPSTotal) + " power per second"
  // Tickspeed Button
  document.getElementById("tickSpeedButton").innerHTML = "Tickspeed<br>Buy to speed up your game by " + format(tickIncrement) + "x<br>Cost: " + format(tickSpeedCost) + "<br>Currently " + format(tickMult) + "x faster"
  if (power < tickSpeedCost) { document.getElementById("tickSpeedButton").classList.add("locked") }
  else { document.getElementById("tickSpeedButton").classList.remove("locked") }
  // Autobuyer Toggle Button
  if (L1empowerLevel > 0) {document.getElementById("AutoButton").classList.remove("hidden")}
  // L1Reset Button
  if (L1TierCount < 10)  { document.getElementById("L1ResetButton").innerHTML = "Tier Up<br>Reset Level 1 to gain:<br>New Tier and 2x mult<br>Requires:<br>"+L1TierUpCost+" Tier " + L1TierCount + "s" }
  else { document.getElementById("L1ResetButton").innerHTML = "Reset Level 1 to gain:<br>2x mult<br>Requires:<br>" + L1TierUpCost + " Tier " + L1TierCount + "s" }
  if (generatorsL1[L1TierCount - 1].amount < 20) { document.getElementById("L1ResetButton").classList.add("locked") }
  else { document.getElementById("L1ResetButton").classList.remove("locked") }
  // L1Empower Button
  if (L1TierReset > 0) document.getElementById("L1EmpowerButton").classList.remove("hidden")
  else document.getElementById("L1EmpowerButton").classList.add("hidden")
  document.getElementById("L1EmpowerButton").innerHTML = "Empower<br>Reset game to Empower Tier " + (L1empowerLevel + 1) + " and gain:<br>An autobuyer and 3x mult on Tier " + (L1empowerLevel + 1) + "<br>Requires:<br> 50 Tier " + (L1empowerLevel + 1) + "s"
  if (generatorsL1[L1empowerLevel].amount < 50) { document.getElementById("L1EmpowerButton").classList.add("locked") }
  else { document.getElementById("L1EmpowerButton").classList.remove("locked") }
  for (let i = 1; i <= L1empowerLevel; i++) {
      document.getElementById("genA" + L1empowerLevel).classList.remove("TLocked")
  }
  //TV Button
  if (L1TierCount > 5 || TVlevel > 0) document.getElementById("TVButton").classList.remove("hidden")
  document.getElementById("TVButton").innerHTML = "TV<br>Reset empowerments and tier-ups to get:<br>A TV to consume your time<br>Upgrade:<br>Tickspeed upgrades by " + TVmult + "<br>Requires:<br>" + TVcost + " Tier 10s"
  if (generatorsL1[9] < TVcost) { document.getElementById("TVButton").classList.add("locked") }
  else { document.getElementById("TVButton").classList.remove("locked") }
  for (let i = 0; i < L1TierCount; i++) {
  ////Kugelblitz
  if (power == Infinity) {
    PreKugelblitz()
  }
  document.getElementById("KugelblitzButton").innerHTML = "Kugelblitz<br>All of your power has condensed into a kugelblitz (a blackhole made purely of energy)<br>Kugelblitz to gain:<br>" + Kamount + " singularities"
    //Updating Generators
    let g = generatorsL1[i]
    document.getElementById("gen" + (i + 1)).innerHTML = "Generator Tier " + (i + 1) + "<br>Amount: " + format(g.amount) + "<br>Mult: " + format(g.mult) + "x<br>Cost: " + format(g.cost) + "<br>Production: " + format((g.production * g.mult))
    if (g.cost > power) document.getElementById("gen" + (i + 1)).classList.add("locked")
    else document.getElementById("gen" + (i + 1)).classList.remove("locked")
    if (g.autoBuyToggle == true) { // Updating Autobuyer Toggle Button
      document.getElementById("genA" + (i + 1)).innerHTML = "Autobuyer Tier " + (i + 1) + "<br>Status: on"
    } else if (g.autoBuyToggle == false) {
      document.getElementById("genA" + (i + 1)).innerHTML = "Autobuyer Tier " + (i + 1) + "<br>Status: off"
    } else {
      document.getElementById("genA" + (i + 1)).innerHTML = "Autobuyer Tier " + (i + 1) + "<br>Status: unfunctional"
    }
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
//Main Loop
function mainLoop() {
  if (power == NaN) {
    power = 10
  }
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

