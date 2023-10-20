# Cartography application data analysis and localisation optimization

Front-end of a cartography application to map and update the position of the nodes of an ad-hoc wireless network. 

Based on JavaScript, runs locally the data gathered at Sorbonne Université to compare ground truth with GPS signal only algorithm  and with optimization code.

Analysis of the data gathered on different scenarios and development of the optimization algorithm. 

Whole application can be found in repository [cartography](https://github.com/giuliaprosio/cartography) . 

## Dependencies
NodeJS + NPM

## Build
Create folder out/static in your directory. Build frontend inside the cartography application folder:
```
npm run:build dev
```

This way the bundle.js merging all the JS files will be dynamically created there.

## Start the application locally 
Using live-server, change folder inside 
```
cd ./out/static
```
And start the server locally
```
live-server .
```

## Optimization algorithm
The algorithm proposed takes into account both GPS signals received from the various nodes of the ad-hoc network and the RSSI signal of the Wi-Fi links in between the nodes. 

The key aspects are:
- creating a history of signals for each node, in order to build their movements and thus verify the consistency of the signals received (in accuracy, too far off)
- giving different weights to each node in the wireless network based off the probability that their GPS positioning is accurate (both with accuracy parameter given by GPS signal itself and by comparing new value - if there - with older ones)
- calculate RSSI-to-distance of all the links between all the nodes and find new area of positioning of each node based off said links, giving more importance to distances to "more accurate" nodes (weighted average)
- recalculate the positionings of the nodes, storing this new value and drawing it