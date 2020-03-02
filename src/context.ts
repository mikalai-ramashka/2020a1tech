import React from 'react';
import { observable, runInAction, action } from 'mobx';

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
    @observable private _cars: ICar[];

    constructor() {
        this._pageInfo = new PageInfo();
        this._filterInfo = new FilterInfo();
        this._filterInfo.load();
        this._cars = [];

        const r = this.getParamsFromUrl(window.location.search);

        this._filterInfo.colors = [r.get('color')];
        this._filterInfo.manufacturers = [r.get('manufacturer')];
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

    get filterInfo() {
        return this._filterInfo;
    }

    get pageInfo() {
        return this._pageInfo;
    }
}

const Context = React.createContext<CarsStore>(undefined as any);

export { Context };