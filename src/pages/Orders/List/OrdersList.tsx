import React, { Component } from "react";
import { NavLink  } from "react-router-dom";
import * as moment from 'moment';
import socketIOClient from "socket.io-client";
import http from '@/api';
import { statusNames } from '../utils';
// @material-ui/core components
// import { makeStyles } from "@material-ui/core/styles";
// state
import * as state from './states';
import { 
    DataTablesInterface,
    DataTablesFilter
} from './interfaces';
import { 
  Orders
} from '../interfaces';

import { 
  Card, 
  FormControl,
  InputGroup,
  Button,
  Row,
  Col,
  Modal
} from 'react-bootstrap';

import * as ordersData from './orders';

// core components
import FormFilter from './components/FormFilter';
import Colums from './components/Colums';
import ConditionalRowStyles from './components/ConditionalRowStyles';
import DataTable, { createTheme } from 'react-data-table-component';
const backendServer: string = "http://localhost:3030";
const socket = socketIOClient(backendServer,{
  transports: ["websocket"]
});
socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err}`);
});
let setIntervalUpdate: any = null;

interface State {
  now: Date;
  dataTables: DataTablesInterface;
  orders: Orders[] | [];
  dTFilterText: string;
  dTResetPaginationToggle: boolean;
  modalFilterShow: boolean;
  filters: DataTablesFilter;
  isFetchingOrders: boolean;
  totalDoneStatus: number;
  totalCancelStatus: number;
  totalOrders: number;
}

interface Prop {};

const FilterComponent: React.FC<{ 
  filterText: string, 
  onFilter: React.ChangeEventHandler, 
  onClear: React.MouseEventHandler,
  onShowModalFilter: React.MouseEventHandler
}> = ({ filterText, onFilter, onClear, onShowModalFilter }) => {
  return (
    <Row className="w-100">
      <Col md="auto">
        <Button onClick={onShowModalFilter} size="sm" variant="info">Filters</Button>
      </Col>
      <Col bsPrefix="col" >
        <InputGroup size="sm">
          <FormControl
            id="search"
            value={filterText}
            onChange={onFilter}
            placeholder="Filter By Customer Name, Rider Name, Merchant Name"
            aria-label="Filter By Name"
          />
          <InputGroup.Append>
            <Button size="sm" onClick={onClear} variant="danger">x</Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Row>
  )
};

class OrdersList extends Component<Prop> {
  state: State = {
    now: new Date,
    dataTables: {
      columns: Colums,
    },
    dTFilterText: "",
    dTResetPaginationToggle: false,
    orders: [],
    modalFilterShow: false,
    isFetchingOrders: true,
    totalDoneStatus: 0,
    totalOrders: 0,
    totalCancelStatus: 0,
    filters: {
      customer_name: "",
      merchant_name: "",
      id: "",
      rider_name: "",
      status: "",
      updated_time: ""
    }
  }

  // private refFormFilter: React.LegacyRef<FormFilter>;
  private refFormFilter: React.RefObject<FormFilter>;

  constructor(props: Prop) {
    super(props)
    this.refFormFilter = React.createRef();
  }
  
  updateStateOnEvent = (event: React.ChangeEvent<Element>, state: string) => {
    let prevState = {};
    const target = event.target as HTMLInputElement;
    prevState[state] = target.value;
    this.setState(prevState)
  }

  updateState = (value: any, state: string) => {
    let prevState = {};
    prevState[state] = value;
    this.setState(prevState)
  }

  showModalFilter = () => {
    this.setState({
      modalFilterShow: true
    })
  }
  
  renderSubHeaderComponent = () => {
    const handleClear = () => {
      if (this.state.dTFilterText) {
        this.setState({
          dTFilterText: "",
          dTResetPaginationToggle: false
        })
      }
    };
    
    return (
      <FilterComponent 
        onFilter={ e => this.updateStateOnEvent(e,"dTFilterText") } 
        onShowModalFilter={ this.showModalFilter }
        onClear={handleClear} 
        filterText={this.state.dTFilterText} 
      />
    );  
  }
  
  convertVietnamese = (str: string) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  }

  submitFilter = () => {
    let filters = this.refFormFilter.current?.state.filters as State['filters'];
    let filtersState: State['filters'] = this.deepClone(this.state.filters);
    for (const [key, value] of Object.entries(filters)) {
        filtersState[key] = value
    }
    this.setState({
      filters: filtersState,
      modalFilterShow: false
    })
  }

  deepClone(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  trackUpdatedTime = (status: string) => {
    let warning10min = moment().subtract(10, "minutes").toDate();
    let late15min = moment().subtract(15, "minutes").toDate();
    let warning30min = moment().subtract(30, "minutes").toDate();
    let late40min = moment().subtract(40, "minutes").toDate();
    if ( status == 'normal' ) {
      let orders = this.state.orders.filter( item => {
        let updated_time = new Date(item.updated_time);
        if ( item.status === 'delivering' ) {
          return item.updated_time && updated_time > warning30min;
        } else 
          return item.updated_time && updated_time > warning10min;
      })
      return orders.length;
    } else if ( status == 'warning' ) {
      let orders = this.state.orders.filter( item => {
        let updated_time = new Date(item.updated_time);
        if ( item.status === 'delivering' ) {
          return item.updated_time 
            && updated_time <= warning30min 
            && updated_time > late40min;
        } else 
          return item.updated_time 
            && updated_time <= warning10min
            && updated_time > late15min;
      })
      return orders.length;
    } else if ( status == 'late' ) {
      let orders = this.state.orders.filter( item => {
        let updated_time = new Date(item.updated_time);
        if ( item.status === 'delivering' ) {
          return item.updated_time && updated_time && updated_time <= late40min;
        } else 
          return item.updated_time && updated_time <= late15min;
      })
      return orders.length;
    }
  }

  fetchOrder = async (id: number) => {
    return await http.get<{ data: Orders }>(`/orders/get/${id}`).then( response => {
      const { data } = response;
      return data.data;
    }).catch(e => {
      console.log(e)
      return null;
    })
  }

  getTotalCurrent = (status: string) => {
    let orders = this.state.orders.filter( order => {
      return order.status === status;
    })
    return orders.length;
  }

  fetchOrders = () => {
    this.setState({
      isFetchingOrders: true
    })
    http.get<{ data: Orders[] }>("/orders").then( response => {
      const { data } = response; 
      this.setState({
        orders: data.data,
        isFetchingOrders: false,
        totalOrders: data.data.length
      })
    }).catch(e => {
      console.log(e)
      alert("Get orders error! Please try again later.");
      this.setState({
        isFetchingOrders: false
      })
    })
  }

  componentDidMount() {
    
    socket.on("create_orders", (data: { id: number })  => {
      setTimeout(async () => {
        let order = await this.fetchOrder(data.id) as Orders;
        let totalOrders = this.state.totalOrders;
        totalOrders += 1;
        if ( !order ) return;
        let orders: Orders[] = this.deepClone(this.state.orders);
        orders.unshift(order);
        this.setState({
          orders: orders,
          totalOrders: totalOrders
        })
      }, 100);
    });

    socket.on("update_orders", ( data: { id: number }) => {
      setTimeout(async () => {
        let order = await this.fetchOrder(data.id) as Orders;
        let totalDoneStatus = this.state.totalDoneStatus;
        let totalCancelStatus = this.state.totalCancelStatus;
        if ( !order ) return;
        let orders: Orders[] = this.deepClone(this.state.orders);
        let orderIndex = orders.findIndex((item) => item.id === order.id);
        if ( orderIndex < 0 ) return;
        if ( !['canceled','done'].includes(order.status as string) ) {
          orders[orderIndex] = order;
        } else {
          orders.splice(orderIndex,1)
          if ( order.status === 'done' ) totalDoneStatus += 1;
          if ( order.status === 'canceled' ) totalCancelStatus += 1;
        }
        this.setState({
          orders: orders,
          totalDoneStatus: totalDoneStatus,
          totalCancelStatus: totalCancelStatus
        })
      }, 100);
    });
    this.fetchOrders();
  }

  componentWillUpdate() {
    setIntervalUpdate = setInterval(() =>{
      this.setState({
        now: new Date()
      })
    },3000)
  }

  componentWillUnmount() {
    clearInterval(setIntervalUpdate);
  }

  render() {
    let orders: Orders[] = this.deepClone(this.state.orders).filter( item => {
      if ( this.state.dTFilterText ) 
        return item.customer_name && this.convertVietnamese(item.customer_name.toLowerCase()).includes(this.convertVietnamese(this.state.dTFilterText.toLowerCase())) ||
        item.rider_name && this.convertVietnamese(item.rider_name.toLowerCase()).includes(this.convertVietnamese(this.state.dTFilterText.toLowerCase())) ||
        item.merchant_name && this.convertVietnamese(item.merchant_name.toLowerCase()).includes(this.convertVietnamese(this.state.dTFilterText.toLowerCase()));
      return true;
    });
    let filters: { column: string, value: string }[] = [];
    for (const [key, value] of Object.entries(this.state.filters)) {
      filters.push({
        column: key,
        value: value
      })
    }
    orders = orders.filter( (item) => {
      let valid = filters.every( filter => {
        if ( typeof item[filter.column] !== 'undefined' && filter.value !== '' && filter.value !== null ) {
          if ( filter.column === 'updated_time' ) {
            let lastTime = moment().subtract(filter.value, "minutes").toDate();
            // console.log("A",lastTime ,item.updated_time, new Date(item.updated_time), lastTime > new Date(item.updated_time))
            if ( item.updated_time && lastTime > new Date(item.updated_time) ) 
              return false;
          } else if (  item[filter.column] !== filter.value )
            return false;
        }
        return true
      })
      return valid;
    })
    const dashboard = () => {
      if ( !this.state.isFetchingOrders ) {
        return (
          <Row>
            <Col md="auto" >
              <Card >
                <Card.Body>
                  <Card.Title className="mb-3 bold">Status</Card.Title>
                  <div className="row">
                    {
                      statusNames.filter( item => !['canceled','done',''].includes(item.value) ).map( (item,index) => {
                        return (
                          <div key={index} className="col-auto">
                            <div className="mb-2">{item.label}</div>
                            <h4 className="my-0 font-weight-bold text-center">{this.getTotalCurrent(item.value)}/{this.state.totalOrders}</h4>
                          </div>
                        )
                      })
                    }
                    <div className="col-auto">
                      <div className="mb-2">Done</div>
                      <h4 className="my-0 font-weight-bold text-center">{this.state.totalDoneStatus}/{this.state.totalOrders}</h4>
                    </div>
                    <div className="col-auto">
                      <div className="mb-2">Cancel</div>
                      <h4 className="my-0 font-weight-bold text-center">{this.state.totalCancelStatus}/{this.state.totalOrders}</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md="auto" >
              <Card >
                <Card.Body>
                  <Card.Title className="mb-3 bold">Updated time</Card.Title>
                  <div className="row">
                    <div className="col-auto">
                      <div className="mb-2">Normal</div>
                      <h4 className="my-0 font-weight-bold text-center">{this.trackUpdatedTime('normal')}</h4>
                    </div>
                    <div className="col-auto">
                      <div style={{color: "#FDD835"}} className="mb-2">Warning</div>
                      <h4 style={{color: "#FDD835"}} className="my-0 font-weight-bold text-center">{this.trackUpdatedTime('warning')}</h4>
                    </div>
                    <div className="col-auto">
                      <div style={{color: "#F4511E"}} className="mb-2">Late</div>
                      <h4 style={{color: "#F4511E"}} className="my-0 font-weight-bold text-center">{this.trackUpdatedTime('late')}</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )
      }
      return <></>
    }
    return (
      <>
        <NavLink to="/orders/new" className="btn btn-info mb-3">
            Create Orders
        </NavLink>
        {dashboard()}
        <Card >
          <Card.Body>
            <Card.Title className="mb-3 bold">Orders List</Card.Title>
            <DataTable
              progressPending={this.state.isFetchingOrders}
              data={orders}
              columns={this.state.dataTables.columns}
              conditionalRowStyles={ConditionalRowStyles}
              pagination
              paginationResetDefaultPage={this.state.dTResetPaginationToggle}
              noHeader
              subHeader
              subHeaderComponent={this.renderSubHeaderComponent()}
              defaultSortField="updated_time"
              defaultSortAsc
            />
          </Card.Body>
        </Card>
        <Modal show={this.state.modalFilterShow} onHide={() => this.updateState(false,"modalFilterShow")}>
          <Modal.Header closeButton>
            <Modal.Title className="my-0">Filters</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormFilter
              ref={this.refFormFilter}
              value={this.state.filters}
            ></FormFilter>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.updateState(false,"modalFilterShow")}>
              Close
            </Button>
            <Button variant="primary" onClick={() => this.submitFilter()}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default OrdersList;