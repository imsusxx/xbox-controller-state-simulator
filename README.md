# Xbox Wireless Controller State Simulator

A beginner-friendly HTML, CSS, and JavaScript simulation for a Week 8–9 “Thinking in States and Steps” assignment. It models controller power separately from connection state; it does not connect to a real Xbox or Bluetooth device.

## Run it

Open `index.html` in a web browser, or open this folder in VS Code and use Live Server. No installation, framework, or backend is needed.

## Try these flows

1. Click the Xbox button: `OFF → CONNECTING`.
2. Click **Connection successful**: `CONNECTING → CONNECTED`.
3. Power on again and choose **Connection failed**: `CONNECTING → DISCONNECTED`.
4. Choose **Reconnect**, then **Connection successful**.
5. While on, choose **PAIR** and then **Pair successfully**.
6. Click A/B/X/Y while connected, disconnected, and off to compare the feedback.
7. Use the battery controls until it reaches 0%.

## Files

- `index.html` — page structure and buttons
- `style-v2.css` — responsive layout, controller illustration, and light animations
- `script.js` — state variables, conditions, event listeners, and UI updates
- `assignment-notes.md` — state table and submission-ready implementation notes
