import React from 'react';
import { render } from '@testing-library/react';
import { CarInfo, Cars, CarDetails } from './cars';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { ICar, FilterInfo } from '../context';
import { createBrowserHistory } from 'history';

const car: ICar = {"stockNumber":50230,"manufacturerName":"Chrysler","modelName":"Le Baron","color":"white","mileage":{"number":100009,"unit":"km"},"fuelType":"Petrol","pictureUrl":"https://auto1-js-task-api--mufasa71.repl.co/images/car.svg"};

test('car card content', () => {
    let r = render(
        <MemoryRouter>
        <CarInfo isLoading={false} car={car} />
        </MemoryRouter>
    );
    let image = r.getByAltText(/Car/i) as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', car.pictureUrl);

    let link = r.getByText(/View details/i).parentNode as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/car/' + car.stockNumber);
});


test('cars list', () => {
    let fn = jest.fn();
    let filterInfo = new FilterInfo();
    filterInfo.colors = ['white'];
    let r = render(
        <MemoryRouter initialEntries={['/']}>
            <Cars totalPages={1} page={1} totalItems={1} loading={true} onLoad={fn} items={[car]} filterInfo={filterInfo} />
        </MemoryRouter>
    );
    let elem = r.getByText(/Loading/i);
    expect(elem).toBeInTheDocument();
    r.unmount()
    expect(fn).toBeCalledWith(undefined, undefined, undefined);

    fn = jest.fn();
    r = render(<MemoryRouter initialEntries={['/?page=1&color=white']}>
        <Cars totalPages={1} page={1} totalItems={1} loading={false} onLoad={fn} items={[car]} filterInfo={filterInfo} />
    </MemoryRouter>);

    expect(fn).toBeCalledWith('1', undefined, 'white');
    elem = r.getByText(/Showing/i);
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveTextContent('Showing 0 - 1 of 1 results');
});

test('cars details', () => {
    let fn = jest.fn();
    let fn2 = jest.fn();
    let filterInfo = new FilterInfo();
    filterInfo.colors = ['white'];
    const h = createBrowserHistory();

    h.push('/car/' + car.stockNumber);

    let r = render(
        <Router history={h}>
            <Route exact path="/car/:id">
                <CarDetails loading={true} loadCar={fn} order={fn2} car={undefined as any} />
            </Route>
        </Router>
    );
    let elem = r.getByText(/Loading/i);
    expect(elem).toBeInTheDocument();
    expect(fn).toBeCalledWith('' + car.stockNumber);

    fn = jest.fn();
    r.rerender(
        <Router history={h}>
            <Route exact path="/car/:id">
                <CarDetails loading={false} loadCar={fn} order={fn2} car={car} />
            </Route>
        </Router>
    );
    const btn = r.getByText('Save') as HTMLButtonElement;
    btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    elem = r.getByText(new RegExp(car.manufacturerName, 'i'));
    expect(elem).toBeInTheDocument();

    expect(fn).not.toBeCalled();
    expect(fn2).toBeCalled();

    r.unmount();
});