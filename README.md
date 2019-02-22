# Scene Switcher

This electron app allows you to automatically swap scenes in Streamlabs OBS depending on your League of Legends status (ingame or in queue).

### Prerequisites

You will need to allow remote control in your Streamlabs OBS.

```
run Streamlabs-OBS with `--adv-settings` parameter
enable websockets in `settings->API`
Port should be 59650
```

### Prebuilt

Prebuilt binaries for Windows can be found [here](https://github.com/Kuferl/SceneSwitcher/releases)

### Build from source

1. Clone repository
`git clone https://github.com/Kuferl/SceneSwitcher.git`

2. Install [electron-forge](https://electronforge.io/)

3. Install dependencies
`npm install`

4. Start Scene Switcher
`electron-forge start`
