import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './cars.scss';
import { CarsFilter } from '../carsFilter';
import { Pager } from '../pager';
import { Context, ICar } from '../context';
import { useObserver, observer } from 'mobx-react';
import { useLocation, RouteComponentProps, withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

@observer
class Cars extends React.Component<RouteComponentProps> {
    static contextType = Context;
    context!: React.ContextType<typeof Context>

    load() {
        const r = this.context.getParamsFromUrl(this.props.location.search);

        this.context.load(r.get('page'), r.get('manufacturer'), r.get('color'));
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate(prevProps: any) {
        if (prevProps.location !== this.props.location) {
            this.load();
        }
    }

    get showing() {
        const pageSize = 10;

        if (this.context.pageInfo.page < this.context.pageInfo.totalPages) {
            if (this.context.pageInfo.page === 1) {
                return `${pageSize} of ${this.context.pageInfo.totalItems}`;
            } else {
                return `${pageSize * (this.context.pageInfo.page - 1)} - ${pageSize * this.context.pageInfo.page} of ${this.context.pageInfo.totalItems}`;
            }
        } else {
            return `${pageSize * (this.context.pageInfo.page - 1)} - ${Math.min(pageSize * this.context.pageInfo.page, this.context.pageInfo.totalItems)} of ${this.context.pageInfo.totalItems}`;
        }
    }

    render() {
        return (
            <Container className="cars" fluid>
                <Row>
                    <Col md={4} className="pt-4 pb-4">
                        <div className="card">
                            <div className="card-body">
                                <CarsFilter></CarsFilter>
                            </div>
                        </div>
                    </Col>
                    <Col md={8} className="pt-4 pb-4">
                        <Pager 
                            currentPage={this.context.pageInfo.page} 
                            totalPages={this.context.pageInfo.totalPages} 
                            loading = {this.context.pageInfo.loading}>
                            {this.context.pageInfo.loading ? <p className='h1' style={{marginBottom: 31}}>Loading</p> : <p className='h3'>Available cars</p>}
                            {!this.context.pageInfo.loading && <p className='h5 mb-4'>Showing {this.showing} results</p>}
                            <CarsList cars={this.context.pageInfo.items} isLoading={this.context.pageInfo.loading}></CarsList>
                        </Pager>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export function CarsList(props: {
    cars: ICar[];   
    isLoading: boolean;
}) {

    return <React.Fragment>{props.cars.map((c) => <CarInfo isLoading={props.isLoading} car={c}></CarInfo>)}</React.Fragment>;
}

export function CarInfo(props: {
    car: ICar;
    isLoading: boolean;
}) {
    const car = props.car;
    const className = `car-card card mb-2 ${props.isLoading ? 'loading' : ''}`;

    return (<div className={className}>
        <div className="row no-gutters">
            <div className="col-md-1 p-2">
                <div className='wrapper load-content'>
                    <img src={car.pictureUrl} className="card-img" alt="Picture"/>
                </div>
            </div>
            <div className="col-md-11">
                <div className="card-body p-2">
                    <h3 className="card-title"><span className="load-content">{car.manufacturerName} {car.modelName}</span></h3>
                    <p className="card-text h5 mb-2">
                        <span className="load-content">
                            Stock # {car.stockNumber} - {car.mileage.number} {car.mileage.unit} - {car.fuelType} - {car.color}
                        </span>
                    </p>
                    <p className="card-text h5"><LinkContainer to={`/car/${car.stockNumber}`}><a><span className="load-content">View details</span></a></LinkContainer></p>
                </div>
            </div>
        </div>
    </div>)
}

const CarswithRouter = withRouter(Cars);

export { CarswithRouter as Cars };