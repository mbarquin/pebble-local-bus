pebble-local-bus
========

Introduction
------------
This app is intended to track local bus times in vigo. Local company has a private API to query about bus stops timetables through their systems, but this app doesn't use it. There is a private API which parses some public timetables from another web system and return its values to the pebble app. I have hardcoded some identifiers of my favorite stops, and it has also an index with all stops in Vigo ordered alphabetically (in two JSON data files provided by the server). With this data I can track any bus stop times with my pebble, if some bus is coming in the next 2 minutes, the pebble will vibrate and show this entry in red.. I post some pictures of it.


![](/readme-files/init.png)
![](/readme-files/favoritos.png)
![](/readme-files/stop.png)
![](/readme-files/setup.png)
![](/readme-files/lista.png)
![](/readme-files/paradas.png)
