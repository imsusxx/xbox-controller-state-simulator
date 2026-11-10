// State variables: power and connection are separate on purpose.
let isOn = false;
let connectionState = "disconnected"; // disconnected | connecting | connected | pairing
let batteryLevel = 100;
let lastButton = "None";

const $ = (id) => document.getElementById(id);
const ui = { controller: $("controller"), power: $("powerButton"), state: $("stateLabel"), message: $("statusMessage"), powerValue: $("powerValue"), connection: $("connectionValue"), last: $("lastButtonValue"), batteryText: $("batteryText"), batteryFill: $("batteryFill"), log: $("eventLog") };

function displayedState() { return isOn ? connectionState.toUpperCase() : "OFF"; }

function addLog(message) {
  const item = document.createElement("li");
  item.textContent = message;
  ui.log.prepend(item);
  while (ui.log.children.length > 6) ui.log.lastElementChild.remove();
}

function statusText() {
  if (!isOn) return "Controller is powered off.";
  if (connectionState === "connecting") return "Looking for the last device...";
  if (connectionState === "connected") return "Ready to send input to the connected device.";
  if (connectionState === "pairing") return "Discoverable: waiting to pair with a device.";
  return "No device connected. Try reconnecting or enter pairing mode.";
}

// This one function redraws the page after every state change.
function render() {
  const state = displayedState();
  ui.state.textContent = state;
  ui.message.textContent = statusText();
  ui.powerValue.textContent = isOn ? "On" : "Off";
  ui.connection.textContent = isOn ? connectionState[0].toUpperCase() + connectionState.slice(1) : "Not active";
  ui.last.textContent = lastButton;
  ui.batteryText.textContent = `${batteryLevel}%`;
  ui.batteryFill.style.width = `${batteryLevel}%`;
  ui.batteryFill.style.background = batteryLevel <= 20 ? "#ff856d" : "var(--green)";
  ui.controller.dataset.state = state;
  ui.power.className = "xbox-button";
  if (isOn && connectionState === "connecting") ui.power.classList.add("light-connecting");
  else if (isOn && connectionState === "pairing") ui.power.classList.add("light-pairing");
  else if (isOn && connectionState === "connected") ui.power.classList.add("light-connected");
}

function powerOn() {
  if (batteryLevel === 0) { addLog("Cannot power on: battery is empty."); return; }
  isOn = true;
  connectionState = "connecting";
  lastButton = "None";
  addLog("Powered on → CONNECTING.");
  render();
}
function powerOff(reason = "Powered off") {
  isOn = false;
  connectionState = "disconnected";
  lastButton = "None"; // clears active input feedback
  addLog(`${reason} → OFF.`);
  render();
}
function needsState(required, action) {
  if (!isOn) { addLog(`${action} ignored: controller is OFF.`); return false; }
  if (connectionState !== required) { addLog(`${action} is only available while ${required.toUpperCase()}.`); return false; }
  return true;
}

ui.power.addEventListener("click", () => { if (isOn) powerOff(); else powerOn(); });
$("successButton").addEventListener("click", () => { if (needsState("connecting", "Connection success")) { connectionState = "connected"; addLog("Connection succeeded → CONNECTED."); render(); } });
$("failButton").addEventListener("click", () => { if (needsState("connecting", "Connection failure")) { connectionState = "disconnected"; addLog("Connection failed → DISCONNECTED."); render(); } });
$("reconnectButton").addEventListener("click", () => { if (!isOn) { addLog("Reconnect ignored: controller is OFF."); } else if (connectionState === "disconnected") { connectionState = "connecting"; addLog("Reconnect requested → CONNECTING."); render(); } else { addLog("Reconnect is available only while DISCONNECTED."); } });
$("pairButton").addEventListener("click", () => { if (!isOn) { addLog("Pairing ignored: controller is OFF."); } else { connectionState = "pairing"; addLog("Pair button pressed → PAIRING."); render(); } });
$("pairSuccessButton").addEventListener("click", () => { if (needsState("pairing", "Pairing success")) { connectionState = "connected"; addLog("Pairing succeeded → CONNECTED."); render(); } });
$("cancelPairButton").addEventListener("click", () => { if (needsState("pairing", "Cancel pairing")) { connectionState = "disconnected"; addLog("Pairing cancelled → DISCONNECTED."); render(); } });

document.querySelectorAll("[data-input]").forEach((button) => button.addEventListener("click", () => {
  const input = button.dataset.input;
  button.classList.add("pressed"); setTimeout(() => button.classList.remove("pressed"), 180);
  if (!isOn) { addLog(`${input} pressed, but controller is OFF.`); }
  else if (connectionState === "connected") { lastButton = input; addLog(`${input} input sent to connected device.`); render(); }
  else { lastButton = input; addLog(`${input} recognized. No device connected.`); render(); }
}));
document.querySelectorAll("[data-battery]").forEach((button) => button.addEventListener("click", () => {
  batteryLevel = Math.max(0, batteryLevel + Number(button.dataset.battery));
  addLog(`Battery test: ${batteryLevel}% remaining.`);
  if (batteryLevel === 0 && isOn) powerOff("Battery reached 0%"); else render();
}));
$("chargeButton").addEventListener("click", () => { batteryLevel = 100; addLog("Battery charged to 100%."); render(); });

render();
