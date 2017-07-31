## Tornado Tracker

### Background

Each year, approximately 1,200 tornadoes hit the continental United States. The National Oceanic and Atmospheric Administration has maintained records on these events since the 1950s, but visualizing such large amounts of data in a clear and understandable way can be a challenge. To that end, I will implement an interactive data visualization using the D3.js library and data available through Data.gov and NOAA's Storm Prediction Center website (http://www.spc.noaa.gov/wcm/).

### Functionality & MVP

With Tornado Tracker, users will be able to visualize tornado tracks along measures of:

-F-Scale
-Seasonality
-Property Damage
-Lethality

The core functionality of the app will include the following:

-A landing page with background knowledge and an explanation of the app's functionality
-An interactive data visualization displaying graphic information on historical tornado data rendered in the D3 js library
-A production readme


### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript and D3.js (a JS library for visualizing data using web standards - implemented with SVG, Canvas, and HTML)

### Implementation Timeline

**Day 1**:

Setup all necessary Node modules, including getting webpack up and running and D3 installed.  

Create `webpack.config.js` as well as `package.json`.  Write a basic entry file and the bare bones of all 3 scripts outlined above.  

Import datasets from Data.gov and NOAA SPC.

Familiarize self with D3 and refine scope of project based on functionality/limitations of the library.


**Day 2**:

-Begin building charts.
-Have barebones skeletons of charts rendering the relevant data.

**Day 3**:

-Continue building charts.
-Add interactivity/ability to switch between datasets or timeframes.
-Ensure a smooth user experience on a 'slippy' map.
-Begin styling charts.


**Day 4**:

-Style and polish the app.
-Potentially add a second color scheme.
-Add a landing page with background knowledge on the subject and a brief explanation of the app's functionality.

### Bonus Features

Why stop at tornadoes? Scientific agencies collect data on many natural disasters, including earthquakes, wildfires, and storms. In the future, I could extend this app to visualize data on other natural disasters in much the same way.
