import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Header } from '../header';
import { Footer } from '../footer';
import { Page404 } from '../404';
import { Cars, CarDetails, CarOders } from '../cars';
import { useObserver } from 'mobx-react';
import { CarsStore, Context } from '../context';

export function App() {
  const context = useContext<CarsStore>(Context);
  
  return useObserver(() => (
      <Router>
          <Header orders={context.orders.length}></Header>
          <Switch>
            <Route exact path="/">
              <Cars 
                items={context.pageInfo.items} loading={context.pageInfo.loading} page={context.pageInfo.page}
                totalItems={context.pageInfo.totalItems} totalPages={context.pageInfo.totalPages}
                onLoad={(p, m, c) => context.load(p, m, c)} filterInfo={context.filterInfo}
              ></Cars>
            </Route>
            <Route exact path="/car/:id">
              <CarDetails loadCar={(id) => context.loadCar(id)} car={context.selectedCar} 
                loading={context.isSelectedCarLoading} order={() => context.orderSelectedCar()}>
              </CarDetails>
            </Route>
            <Route path="/orders">
              <CarOders orders={context.orders} remove={(o) => context.removeOrderedCar(o)}></CarOders>
            </Route>
            <Route path="*">
              <Page404></Page404>
            </Route>
          </Switch>
        <Footer></Footer>
      </Router>
  ));
}
