# Vue_MicroReddit
Vue project for TSW.


To run the project:
1. Setup local databse
    1. Turn on docker
    2. Run ```prepare_db.sh``` script (on windows you can use git bash, or WSL2) 
2. Build frontend
    1. ```cd frontend/micro-reddit```
    2. ```npm install```
    3. ```npm run build```
3. Run backend (it also serves the frontend)
    1. ```npm install express```
    1. ```cd backend```
    2. ```node ./main.js```
4. Access the site on your browser of choice:
    http://localhost:5000/