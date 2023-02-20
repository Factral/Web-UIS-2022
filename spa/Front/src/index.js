import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import App from './App';
import Login from './Components/AuthArea/Login/Login.js';
import Page404 from './Components/SharedArea/Page404/Page404';
import './Index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"}/>}/>
        <Route path="/todo" element={<App />}>
        </Route>
        <Route path="/login" exact element={<Login/>}/>
        <Route path="*" element={<Page404/>}/>
      </Routes>
    </BrowserRouter>
  
  // <Login/>
  // <App />
  );
  
  // {/* <Route index element={<Home />} />
  //           <Route path="blogs" element={<Blogs />} />
  //           <Route path="contact" element={<Contact />} />
  //           <Route path="*" element={<NoPage />} /> */}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);

