# SceneSwitcher

This appwill switch scenes for Streamlabs OBS depending on the League Client state, either into a "Queue" Scene or an "Ingame" scene.

Queue scene means that you are currently not in a game.
Ingame scene means you are in a game.

Not very far developed yet, only start it when both Slobs (streamlabs obs) and the League Client are running already.


How to run source:

Install (Electron Forge)[https://electronforge.io/] (you will need Node and npm as well)

simply run electron-forge start inside the folder

Or download the package and execute the exe.

You will also need to allow remote control in your Slobs.
* run Streamlabs-OBS with `--adv-settings` parameter
* enable websokets in `settings->API`
* Port should be 59650

