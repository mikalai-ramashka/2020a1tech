import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { FilterInfo } from '../context';
import { createBrowserHistory } from 'history';
import { CarsFilter } from './carsFilter';
import { act } from 'react-dom/test-utils';

test('filters ', async() => {
    let filterInfo = new FilterInfo();
    const h = createBrowserHistory();

    let r = render(
        <Router history={h}>
            <CarsFilter filterInfo={filterInfo} />
        </Router>
    );
    let elem = r.getByLabelText('Color');
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveTextContent('All car colors');

    elem = r.getByLabelText('Manufacturer');
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveTextContent('All manufacturers');

    act(() => {
        let btn = r.getByText('Submit') as HTMLButtonElement;
        btn.click();
    });

    let searchParams = new URLSearchParams(h.location.search);
    expect(searchParams.get("page")).toBe("1");

    filterInfo = new FilterInfo();
    filterInfo.colors = ['red', 'white'];
    filterInfo.manufacturers = ['A', 'B'];

    r.rerender(<Router history={h}>
            <CarsFilter filterInfo={filterInfo} />
        </Router>
    );

    await act(async() => {
        let select = r.getByLabelText('Color') as HTMLSelectElement;
        expect(select.options.length).toEqual(3);
        fireEvent.change(select, { target: { value: 'white' } });

        select = r.getByLabelText('Manufacturer') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'A' } });

        await wait(() => expect(select.value).toBe("A"))

        let btn = r.getByText('Submit') as HTMLButtonElement;
        btn.click();
    });

    searchParams = new URLSearchParams(h.location.search);
    expect(searchParams.get("page")).toBe("1");
    expect(searchParams.get("color")).toBe("white");
    expect(searchParams.get("manufacturer")).toBe("A");

    h.goBack();
    r.rerender(<Router history={h}>
        <CarsFilter filterInfo={filterInfo} />
    </Router>
    );

    await act(async() => {
        await wait(() => expect(r.getByLabelText('Color')).toHaveTextContent('All car colors'));

        expect(r.getByLabelText('Manufacturer')).toHaveTextContent('All manufacturers')
    });
});