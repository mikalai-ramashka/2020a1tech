import React from 'react';
import { observable, runInAction, action, reaction, toJS } from 'mobx';

export interface ICar {
    stockNumber: number;
    manufacturerName: string;
    modelName: string;
    mileage: {
        number: number;
        unit: 'km' | 'mi'
    },
    fuelType: 'Diesel' | 'Petrol',
    color: string;
    pictureUrl: string;
}

export interface IOrder {
    car: ICar;
    id: string;
}

class PageInfo {
    @observable page: number = 1;
    @observable totalPages: number = 0;
    @observable totalItems: number = 0;
    @observable items: ICar[] = [];
    @observable loading: boolean = false;
}

class FilterInfo {
    @observable colors: string[] = [];
    @observable manufacturers: string[] = [];

    @observable ready: boolean = false;

    constructor() {
    }

    load() {
        Promise.all([fetch('https://auto1-mock-server.herokuapp.com/api/colors').then((res) => res.json()).then((res) => {
            runInAction(() => {
                this.colors = res.colors;
            })
        }), fetch('https://auto1-mock-server.herokuapp.com/api/manufacturers').then((res) => res.json()).then((res) => {
            runInAction(() => {
                this.manufacturers = res.manufacturers.map((m: any) => m.name);
            })
        })]).then(() => {
            runInAction(() => {
                this.ready = true;
            })
        });
    }
}

export class CarsStore {
    private _pageInfo: PageInfo;
    private _filterInfo: FilterInfo;
    @observable private _selectedCar: ICar | undefined;
    @observable private _selectedCarLoading: boolean;
    @observable private _orders: IOrder[] = [];

    constructor() {
        this._pageInfo = new PageInfo();
        this._filterInfo = new FilterInfo();
        this._filterInfo.load();
        this._selectedCar = undefined;
        this._selectedCarLoading = true;

        const r = this.getParamsFromUrl(window.location.search);

        this._filterInfo.colors = [r.get('color')];
        this._filterInfo.manufacturers = [r.get('manufacturer')];

        const orders = localStorage.getItem("orders");

        if (orders) {
            this._orders = JSON.parse(orders);
        }

        reaction(() => this._orders.length, () => {
            localStorage.setItem("orders", JSON.stringify(toJS(this._orders)));
        });
    }

    getParamsFromUrl(search: string) {
        const url = search.substr(1);
        const result = new Map();

        url.split("&").forEach((part: string) => {
            const item = part.split("=");
            if (item[1] != undefined) {
                result.set(item[0], decodeURIComponent(item[1]));
            }
        });
        return result;
    }

    @action load(page: number = 1, manufacturer: string, color: string) {
        page = Number(page);
        let url = `page=` + page;

        if (manufacturer) {
            url += `&manufacturer=${encodeURIComponent(manufacturer)}`;
        }

        if (color) {
            url += `&color=${encodeURIComponent(color)}`;
        }

        this._pageInfo.loading = true;
        fetch(`https://auto1-mock-server.herokuapp.com/api/cars?sort=asc&` + url).then((res) => res.json()).then((res) => {
            runInAction(() => {
                this._pageInfo.loading = false;
                this._pageInfo.page = page;
                this._pageInfo.items = res.cars;
                this._pageInfo.totalPages = res.totalPageCount;
                this._pageInfo.totalItems = res.totalCarsCount;
            })
        });
    }

    @action loadCar(id: string) {
        this._selectedCarLoading = true;
        fetch(`https://auto1-mock-server.herokuapp.com/api/cars/` + id).then((res) => res.json()).then((res) => {
            runInAction(() => {
                this._selectedCarLoading = false;
                this._selectedCar = res.car;
            })
        });
    }

    @action orderSelectedCar() {
        this._orders.push({ 
            id: `${this.selectedCar.stockNumber}-${Date.now()}`,
            car: JSON.parse(JSON.stringify(this.selectedCar))
        });
    }

    @action removeOrderedCar(order: IOrder) {
        const index = this.orders.indexOf(order);

        if (index >= 0) {
            this._orders.splice(index, 1);
        }
    }

    get orders() {
        return this._orders;
    }

    get selectedCar(): ICar {
        return this._selectedCar as ICar;
    }

    get isSelectedCarLoading() {
        return this._selectedCarLoading;
    }

    get filterInfo() {
        return this._filterInfo;
    }

    get pageInfo() {
        return this._pageInfo;
    }
}

const Context = React.createContext<CarsStore>(undefined as any);

export { Context };