var power = 10
var generatorsL1 = []
var lastUpdate = Date.now()
var lastPowerUpdate = power
var diff = 0
var L1TierCount = 4
var L1TierReset = 0

//Gen init
function GeneratorL1Init() {
  for (let i = 0; i < L1TierCount; i++) {
    let generator = {
      cost: Math.pow(10, (i * 2)) * 10,
      bought: 0,
      amount: 0,
      mult: 1,
      production: Math.pow(10, (i * 1.75))
    }
    document.getElementById("gen" + (i + 1)).classList.remove("TLocked")
    generatorsL1.push(generator)
  }
}
GeneratorL1Init()

function GeneratorL1Reset() {
  for (let i = 0; i < L1TierCount; i++ ){
    generatorsL1[i].amount = 0
    generatorsL1[i].cost = Math.pow(10, (i * 2)) * 10
    generatorsL1[i].bought = 0
    generatorsL1[i].mult = 1
    generatorsL1[i].production = Math.pow(10, (i * 1.75))
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

//Gen buying
function buyGenerator(i) {
  let g = generatorsL1[i - 1]
  if (g.cost > power) return
  power -= g.cost
  g.amount += 1
  g.bought += 1
  g.mult *= 1.05
  g.cost *= 1.5
}

//L1 Reset
function L1Reset() {
  if (generatorsL1[L1TierCount - 1].amount < 20) return
  L1TierCount +=1
  power = 10
  GeneratorL1Init()
  GeneratorL1Reset()
  L1TierReset += 1
  for (let i = 0; i < L1TierCount; i++) {
    generatorsL1[i].mult *= Math.pow(2, L1TierReset)
  }
}

//Updating GUI
function updateGUI() {
  document.getElementById("currency").textContent = "You have " + format(power) + " power"
  document.getElementById("currencyPS").textContent = "You gain " + format((power - lastPowerUpdate) * diff * 400) + " power per second"
  if (generatorsL1[L1TierCount - 1].amount < 20) { document.getElementById("L1ResetButton").classList.add("locked") }
  else { document.getElementById("L1ResetButton").classList.remove("locked") }
  document.getElementById("L1ResetButton").innerHTML = "Reset Level 1 to gain:<br>New Tier and 2x mult<br>Requires:<br>20 Tier " + L1TierCount + "s"
  for (let i = 0; i < L1TierCount; i++) {
    let g = generatorsL1[i]
    document.getElementById("gen" + (i + 1)).innerHTML = "Generator Tier " + (i + 1) + "<br>Amount: " + format(g.amount) + "<br>Bought: " + g.bought + "<br>Mult: " + format(g.mult) + "x<br>Cost: " + format(g.cost) + "<br>Production: " + format(g.production)
    if (g.cost > power) document.getElementById("gen" + (i + 1)).classList.add("locked")
    else document.getElementById("gen" + (i + 1)).classList.remove("locked")
  }
}

function productionLoop(diff) {
  for (let i = 0; i < L1TierCount; i++) {
    power += generatorsL1[i].amount * generatorsL1[i].mult * generatorsL1[i].production * diff
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

  productionLoop(diff)
  updateGUI()

  lastUpdate = Date.now()
  lastPowerUpdate = power
}

setInterval(mainLoop, 50)

updateGUI()
