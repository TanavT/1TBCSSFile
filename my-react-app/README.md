# Setup
### What you will need:
NPM
Cloud Service Stack:
    Frontend: Recommend Firebase
    Backend Server: Recommend Render.com
    Backend Redis: Recommend Redis Cloud
    Backend DB: Recommend MongoDB Atlas

    All of these services have free tiers as of the creation of the project, but you will need to make an account!

## Assuming you are using all these services:

## 1. Setting up firebase-cli  (you will need to make an account at firebase.google.com first):
In npm run:

npm install -g firebase-tools
firebase login

## 2. Create an .env file with these parameters in the root level (next to src)
() = replace
For Online:

NODE_OPTIONS='--title="env sucessfully loaded!"'

FRONTEND_CLIENT= (firebase url)

VITE_BACKEND_SERVER= (render.com url)

REDIS_URL= (Redis Cloud public endpoint)
REDIS_PORT= 17307
REDIS_PASSWORD=(Redis Cloud default user password)

MONGO_URL= (Goto connect ->drivers->node.js and add the connection string with your db_password)

ex: 
NODE_OPTIONS='--title="env sucessfully loaded!"'

FRONTEND_CLIENT="https://testing-game-1tbcss.web.app"

VITE_BACKEND_SERVER="https://onetbcssfile.onrender.com"

REDIS_URL="redis-17307.c263.us-east-1-2.ec2.cloud.redislabs.com"
REDIS_PORT=17307
REDIS_PASSWORD="lbsJey9NCaW4awjcVroom52ybQMJbpL7"

MONGO_URL="mongodb+srv://admin:f3lJXIPnGKj8Vvm2@test-1tbcssfile.kzjerbb.mongodb.net/?appName=test-1TBCSSFile"

For cloud, import the .env file into render.com (enviroment -> edit -> add -> import from .env)

For Local:
NODE_OPTIONS='--title="env sucessfully loaded!"'
RONTEND_CLIENT= "http://localhost:8080"

VITE_BACKEND_SERVER= "http://localhost:3000"


MONGO_URL= "mongodb://localhost:27017/"


## 3a. for Cloud
Run npm i
Run npm run dev
Run firebase init in cli-> hosting -> dist (if it asks to replace index.html, say no) 
Run firebase deploy

upload files to github and link to render.com
On render.com run latest commit

website is up and running

## 3a. for Local
Runn npm i
open two terminals
run npm run dev in one
run npm start in the other














# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
