import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { AuthProvider } from './AuthContext.tsx';


ReactDOM.createRoot(document.getElementById('root')).render(
    //<React.StrictMode>
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
    //</React.StrictMode>,
)

