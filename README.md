## Description

This is an application displaying fake sports club stock prices using Node and Web Sockets. You can view the app running here: http://stephen-young.me.uk:8082/

The app uses a custom MVC pattern to manage and display the data. When the app receives data from the Web Socket server it creates a view object which does the following:

* creates a new row in the table for the sports club and adds this element to the object
* creates a new model object which is bound to the view

The model object holds all of the relevant data about the sports club and updates its properties when it receives new data. When this occurs it updates the view as per the MVC pattern.

## Setup instructions for the node server:

Install the ws package:

	$ npm install ws

Run the app.js file:

	$ node app.js

This will start the WebSocket server, on port 8081 by default (you can change that by editing the app.js file).



