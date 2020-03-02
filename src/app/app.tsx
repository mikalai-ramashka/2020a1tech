import React from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import { Header } from '../header';
import { Footer } from '../footer';
import { Page404 } from '../404';
import { Cars } from '../cars';

export function App() {
  return (
      <Router>
          <Header></Header>
          <Switch>
            <Route exact path="/">
              <Cars></Cars>
            </Route>
            
            <Route path="/orders">
            </Route>
            <Route path="*">
              <Page404></Page404>
            </Route>
          </Switch>
        <Footer></Footer>
      </Router>
  );
}
