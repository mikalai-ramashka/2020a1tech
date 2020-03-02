import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Header } from '../header';
import { Footer } from '../footer';
import { Page404 } from '../404';
import { Cars, CarDetails, CarOders } from '../cars';

export function App() {
  return (
      <Router>
          <Header></Header>
          <Switch>
            <Route exact path="/">
              <Cars></Cars>
            </Route>
            <Route exact path="/car/:id">
              <CarDetails></CarDetails>
            </Route>
            <Route path="/orders">
              <CarOders></CarOders>
            </Route>
            <Route path="*">
              <Page404></Page404>
            </Route>
          </Switch>
        <Footer></Footer>
      </Router>
  );
}
