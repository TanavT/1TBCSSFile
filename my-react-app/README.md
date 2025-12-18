# Setup
### What you will need:
NPM and Cloud Service Stack:
    
    Node.js: 6.7 or later
    Frontend: Recommend Firebase
    Backend Server: Recommend Render.com
    Backend Redis: Recommend Redis Cloud
    Backend DB: Recommend MongoDB Atlas

All of these services have free tiers as of the creation of the project, but you will need to make an account!

# Cloud Setup

If at any point, an option isn't mentioned, leave it blank if possible or anything works

## Cloud Services
### 1. Setting up firebase-cli and firebase (you will need to make an account at firebase.google.com first):

In a terminal with npm run:

    npm install -g firebase-tools
    firebase login

If you do not already have a firebase account, you will need to make one now

    npm i
    npm run build

After the build is done, run this in my-react-app directory
    
    firebase init

For the firebase init options:
    
    (Ready to Proceed) Y
    (Firebase features) Hosting
    (Project) You can do either of the first two, but adding to an existing project will require you to have it already made in Firebase
    (If new project, set id) You can put any id you want
    (what to call project) same name as above
    (public directory) dist
    (Configure as single page app) Y
    (setup automatic builds and deploys with github) N
    (file dist/index.html already exists) N
The docs for firebase are also very helpful if you find youself stuck!

After this is all done, run

    npm run build


### 2. Setting up render.com
Make an account

Make a web service

Public Git Repository and paste this link "https://github.com/TanavT/1TBCSSFile"

Options:

    Language: Node
    Branch: cloudSetup
    Build Command: npm install
    Start command: npm start
    Instance Type: Free

Leave enviromental variables empty for now

Go to service settings and set root directory to: my-react-app

### 3. Setting up Redis Cloud
Make Redis Cloud account

Make a new Database

options:

    Price: Free
    Region: Any work but consider same region as past services

### 4. Setting up MongoDB Atlas
Make MongoDB Atlas account

Deploy cluster

options:

    Price: Free

Add any admin user you want

Then for connection method, choose Node.js and version 6.7 or later. If you set up this right after making the cluster you can recieve a string that includes your db password

Go to security quickstart and add the ip address 0.0.0.0 to the ip access list (this stands for any address can connect which is fine for a dev enviroment/proof of concept)

## Create an .env file with these parameters in the my-react-app directory 
Our .env file will be provided in the submission, however our  endpoints for the cloud will be useless to push to as they are configured to our accounts, therefore in order to push to the cloud you will need to set up the cloud stack mentioned above

To create the .env file, () means replace this field and make sure to put quotation marks on strings!:

    NODE_OPTIONS='--title="env sucessfully loaded!"'

    CURRENT = Cloud

    NODE_ENV="production"

    FRONTEND_CLIENT= (firebase website -> go to console -> select your project -> build -> hosting -> domain. Should look something like "testing-game-1tbcss.web.app" in form)

    VITE_BACKEND_SERVER= (render.com url, can be found in service -> events)

    REDIS_URL= (Redis Cloud public endpoint, truncating at :, ex. " redis-17307.c263.us-east-1-2.ec2.cloud.redislabs.com")
    REDIS_PORT= (truncated part after endpoint, ex. 17307) (do NOT put quotation marks)
    REDIS_PASSWORD=(Redis Cloud -> Security -> default user password)

    MONGO_URL= (Goto connect ->drivers->node.js and add the connection string with your db_password)

ex:

    NODE_OPTIONS='--title="env sucessfully loaded!"'

    FRONTEND_CLIENT="https://testing-game-1tbcss.web.app"

    VITE_BACKEND_SERVER="https://onetbcssfile.onrender.com"

    REDIS_URL="redis-17307.c263.us-east-1-2.ec2.cloud.redislabs.com"
    REDIS_PORT=17307
    REDIS_PASSWORD="lbsJey9NCaW4awjcVroom52ybQMJbpL7"

    MONGO_URL="mongodb+srv://admin:f3lJXIPnGKj8Vvm2@test-1tbcssfile.kzjerbb.mongodb.net/?appName=test-1TBCSSFile"


## Placing .env
1) Within the my-react-app directory of the project
2) On render.com, goto your service -> environment -> secret files -> upload files -> upload the .env

## Running Cloud

1)Go to render.com and deploy the latest commit (If the build fails, make sure you set the build and run commands as well as the root directory correctly!)
2)Inside your terminal where you ran the firebase commands, run

    firebase deploy

The terminal will now display the link to the firebase website!
Keep in mind that the render.com server will spin down with inactivity and sometimes close due to its free nature, production level render.com servers do not have this issue


# Local Setup

You will require NPM, Redis with a default setup and MongoDB to be installen

Make a .env file with the following text:

    NODE_OPTIONS='--title="env sucessfully loaded!"'

    Current = Local

    NODE_ENV="development"

    FRONTEND_CLIENT="http://localhost:8080"

    VITE_BACKEND_SERVER="http://localhost:3000"

    REDIS_URL="127.0.0.1"
    REDIS_PORT=6379
    REDIS_PASSWORD=""

    MONGO_URL="mongodb://127.0.0.1:27017"

Place the .env file within the my-react-app directory

run

    npm install

## Running Local
Open two terminals to run the following commands:

    npm run dev
    npm start

Your website will now be running on localhost:8080

# Seeding Database

Set the MONGO_URL to database url (local or cloud address) within .env

(You cannot run this on render.com with the free tier)

run

    npm run seed

You should get the console log "seed planted" if successful






































# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
