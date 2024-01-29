import React, {Fragment, useContext} from 'react';
import Login from './login/Login';
import Dashboard from './Dashboard/Dashboard';
import BackOffice from './BackOffice/BackOffice';
import Register from './register/Register';
import CustomNavbar from './components/CustomNavbar';

import {  Navigate, Route, Routes } from 'react-router-dom';
import { LoginContext } from './context/LoginContext';

export default function App() {
  const { user } = useContext(LoginContext);


    return (
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  user.role == 'agent' ? (
                    <Fragment>
                      <CustomNavbar title={'BackOffice'}/>
                      <BackOffice />
                    </Fragment>
                  ) : (
                    <Fragment>
                        <CustomNavbar title={'Dashboard'}/>
                      <Dashboard  user={user}/>
                    </Fragment>
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/login"
              element={!user ?<Fragment> <Login />
                      <p className="register text-right">
                          No account yet ? <a  href="/register">Register</a>
                      </p>

                  </Fragment>
                  : <Navigate to="/" />}
            />
              <Route
                  path="/register" element={<Fragment><Register/>  <p className="register text-right">
                  Already have an account ? <a  href="/login">Login</a>
              </p></Fragment> }>

              </Route>
          </Routes>
  );
}
