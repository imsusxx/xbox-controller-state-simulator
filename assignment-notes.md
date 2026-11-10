# Week 8–9 Doodle: Xbox Wireless Controller State Simulator

**Student name:** [Add your name]  
**Course:** [Add course name]  
**Live project:** https://xbox-controller-state-simulator-14557.goodnight-riye.chatgpt.site  
**GitHub repository:** https://github.com/imsusxx/xbox-controller-state-simulator
**Codex conversation:** [Paste this Codex chat link here]

## Appliance image

Insert a photo of an Xbox Wireless Controller here. I used the controller's front layout as visual inspiration: two analog sticks, a D-pad, A/B/X/Y buttons, an Xbox power button, shoulder buttons, and a pairing button.

## Appliance inspiration and design goal

This project models an Xbox Wireless Controller. The focus is not a game or a real Bluetooth connection. It is a simplified computational model of what the controller does when it is powered on, tries to connect, fails, reconnects, pairs, receives button input, or loses battery power.

The most important design decision is that **power and connection are separate**. A controller can be turned on without being connected to a device.

## States and variables

| Variable | Values | Purpose |
| --- | --- | --- |
| `isOn` | `true` / `false` | Tracks whether the controller has power. |
| `connectionState` | `disconnected`, `connecting`, `connected`, `pairing` | Tracks the connection process when the controller is on. |
| `batteryLevel` | 0–100 | Stores simulated battery percentage. |
| `lastButton` | Button name or `None` | Stores the most recent controller input. |

The displayed `OFF` state is created by `isOn === false`. When `isOn === true`, the displayed state comes from `connectionState`. This prevents a contradictory combination such as “OFF and CONNECTED.”

## State transition table

| Current state | User/test event | Next state | Visual feedback |
| --- | --- | --- | --- |
| OFF | Xbox button, battery above 0% | CONNECTING | Xbox light slowly flashes |
| CONNECTING | Connection successful | CONNECTED | Xbox light stays on |
| CONNECTING | Connection failed | DISCONNECTED | Clear disconnected message |
| DISCONNECTED | Reconnect | CONNECTING | Xbox light slowly flashes |
| Any powered-on state | Pair button | PAIRING | Xbox light flashes quickly |
| PAIRING | Pair successfully | CONNECTED | Xbox light stays on |
| PAIRING | Cancel pairing | DISCONNECTED | Clear disconnected message |
| Any on state | Xbox button or battery reaches 0% | OFF | Light turns off and last input clears |

## Event handling and control flow

Every clickable control has an `addEventListener("click", ...)`. The listener changes variables only when the current state allows that action, then calls `render()` to redraw the status panel and Xbox light.

The `if / else if / else` condition for controller inputs is a key example:

```js
if (!isOn) {
  // An OFF controller cannot send input.
} else if (connectionState === "connected") {
  // Save and report input as sent to the device.
} else {
  // The controller is on, but there is no connected device.
}
```

## Testing checklist — verified in implementation

The following paths were checked against the coded state conditions and event listeners:

- [x] Power on → Connecting → Connected
- [x] Power on → Connecting → Disconnected
- [x] Disconnected → Reconnect → Connected
- [x] Powered on → Pairing → Connected
- [x] A pressed while connected shows the input sent
- [x] A pressed while disconnected shows “No device connected” in the event log
- [x] A pressed while powered off does not activate the controller
- [x] Turning off during pairing resets to OFF and clears input feedback
- [x] Battery reaches 0% without dropping below 0 and turns the controller off
- [x] Pairing and reconnect buttons reject invalid states instead of creating contradictory states

These eight transition paths were also run through a small local JavaScript test harness on November 10, 2026. Browser visual QA still needs to be completed by opening `index.html` locally and clicking through the same checklist before submission.

## AI assistance

AI was used to help organize the project requirements, propose the state model, and draft the HTML/CSS/JavaScript structure. The actual simulator logic was implemented as an inspectable JavaScript state model with separate variables and visible testing controls.

## Reflection to write yourself

Before submitting, add your own short reflection here or in the required Google Doc. For example: what was surprising while defining states, which test path you tried yourself in the browser, and any visual or logic changes you personally decided to make. This project does not claim personal experiences or changes that have not happened.

## Honest development record for the Google Doc

The work actually completed in this project was:

- I began with a simple state plan for OFF, CONNECTING, CONNECTED, DISCONNECTED, and PAIRING.
- I kept `isOn` and `connectionState` separate after recognizing that a controller can be powered on without being connected.
- I added explicit testing controls for connection success, failure, reconnection, pairing success/cancellation, and battery drain so that different state paths could be tested deliberately.
- I tested eight important state-transition paths with a JavaScript test harness, then revised the page visuals several times to make the controller shape and green interface clearer.
- AI helped turn the assignment requirements into a state table, code structure, and test checklist. The final project is a simulation, not a real Bluetooth connection.

Add your own response below; do not claim a feeling or experience that is not yours:

> While working with Codex, I was thinking about…  
> The most difficult decision for me was…  
> One change I asked for or made was…  
> If I had more time, I would…

## Final submission checklist

- [ ] Replace the student-name and course placeholders.
- [ ] Paste an appliance/controller image and its short caption.
- [ ] Add your personal reflection in the section above.
- [ ] Add the GitHub repository URL after it is created.
- [ ] Add the Codex conversation URL.
- [ ] Copy this content into the required Google Doc and submit that Google Doc link to Canvas.
