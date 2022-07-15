# Everything about Marvel App

Welcome to my Marvel App is an information web app for Marvel info.

#  Overview 

##  Features:
This Marvel search app will have the following features: 
* 1.Marvel character search by entering name and add characters to user profile
* 2.Marvel comics search by entering id and add comics to user profile
* 3.Marvel creator search by entering creator name
* 4.profile page to show the user profile

#  Build
* Enter localhost:3000 in your browser to run the app
<img src="https://i.postimg.cc/5NbYdX1Z/2022-07-15-6-57-51.png" width="500" height="300">

* First signup/login and it will redirects you to this page again if you sign up with an existed username
<img src="https://i.postimg.cc/W42XdNMK/2022-07-15-6-58-49.png" width="500" height="300">

* Click on character on menubar to search infos about marvel characters
<img src="https://i.postimg.cc/nhQCqB19/2022-07-15-7-13-27.png" width="500" height="300">

* Click on comics on menubar to search infos about marvel comics, if you do not
* know the comics id, you can use creator search to find the id of comics created
* by a specific creator
<img src="https://i.postimg.cc/BbMM5d4p/2022-07-15-7-13-38.png" width="500" height="300">

* Click on creator on menubar to search infos about marvel creators
<img src="https://i.postimg.cc/XvY9MQSG/2022-07-15-7-13-44.png" width="500" height="300">

### Installing and Executing Program

Download the project from github and cd into the folder

Install the packages with
``` bash
npm install
```
Start the project with
``` bash
bash startup.sh
```

## Author

Grant Gu

### Dependecies
```
"axios": "^0.27.2",
"bcrypt": "^5.0.1",
"cookie-parser": "~1.4.4",
"debug": "~2.6.9",
"ejs": "~2.6.1",
"express": "~4.16.1",
"express-ejs-layouts": "^2.5.1",
"express-session": "^1.17.3",
"http-errors": "~1.6.3",
"mongoose": "^6.4.1",
"morgan": "~1.9.1"
```

### Future plans
* 1.I will work on redirecting the user to Marvel.com when the specific comics/characters are clicked
* 2.I will work on moving this app to a mobile app such that user can search for marvel info on their phone
* 3.I will work on creating cooler layout page such that I have a Marvel heros image flashing on the background
* 4.Probably I could embed a youtube video to introduce this character on character search page

