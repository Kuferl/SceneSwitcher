# Scene Switcher

This electron app allows you to automatically swap scenes depending on your League of Legends status (ingame or in queue)

## Getting Started

Simply download the latest release, unpack the zip and start the executeable.

### Prerequisites

You will also need to allow remote control in your Slobs.

```
run Streamlabs-OBS with `--adv-settings` parameter
enable websockets in `settings->API`
Port should be 59650
```

### Run source code

Install https://electronforge.io/ (you will need Node and npm as well)
Pull this code.
Then execute following commands inside the folder:

```
npm install
electron-forge start
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
