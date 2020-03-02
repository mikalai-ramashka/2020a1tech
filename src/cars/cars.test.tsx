import React from 'react';
import { render } from '@testing-library/react';
import { CarInfo, Cars } from './cars';
import { MemoryRouter } from 'react-router-dom';
import { ICar, FilterInfo } from '../context';

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
            <Cars totalPages={1} page={1} totalItems={1} loading={false} onLoad={fn} items={[car]} filterInfo={filterInfo} />
        </MemoryRouter>
    );
    expect(fn).toBeCalledWith(undefined, undefined, undefined);

    fn = jest.fn();
    r.rerender(<MemoryRouter initialEntries={['/?page=1&color=white']}>
        <Cars totalPages={1} page={1} totalItems={1} loading={false} onLoad={fn} items={[car]} filterInfo={filterInfo} />
    </MemoryRouter>);

    expect(fn).toBeCalledWith(1, undefined, 'white');
});