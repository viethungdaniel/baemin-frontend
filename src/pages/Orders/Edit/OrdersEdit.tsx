import React, { Component } from "react";
import * as moment from 'moment';
import socketIOClient from "socket.io-client";
import http from '@/api';
import { formatMoney } from '@/utils';
import { statusName } from '../utils/orders-status-names.util';
import "./orders-edit.scss";
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
  Form
} from 'react-bootstrap';


// core components

const backendServer = "http://127.0.0.1:3030";
const socket = socketIOClient(backendServer,{
  transports: ["websocket"]
});
socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err}`);
});


interface OrderUpdate {
  id?: number;
  status?: string;
  rider_name?: string;
  order_address?: string;
  merchant_name?: string;
  merchant_address?: string;
}

interface State {
  order: Orders | null;
  order_id: number;
  isFetchingOrders: boolean;
  isUpdatingOrders: boolean;
}

interface Prop {
  match: {
    params: {
      id: string;
    }
  };
}

class OrdersEdit extends Component<Prop> {

  state: State = {
    order: null,
    order_id: parseInt(this.props.match.params.id),
    isFetchingOrders: true,
    isUpdatingOrders: false
    // {
    //   id: 1,
    //   status: "created",
    //   customer_name: "Việt Hùng",
    //   rider_name: "A Tài",
    //   order_address: "129/23 Trần Quang Khải",
    //   merchant_name: "Quang ngon",
    //   merchant_address: "120 D2 Bình Thạnh",
    //   dishes: [{
    //       name: "Mì quảng thịt heo",
    //       price: 40000
    //   }],
    //   total_price: 40000,
    //   updated_time: "2021-05-24 09:30:00"
    // }
  }

  updateOrders = (order: OrderUpdate) => {
    let body = {
      id: this.state.order_id
    };
    Object.assign(body,order);
    this.setState({
      isUpdatingOrders: true
    })
    http.post<{ data: Orders }>(`/orders/update`,body).then( response => {
      const { data } = response;
      socket.emit("update_orders",data.data)
      this.setState({
        order: data.data,
        isUpdatingOrders: false
      })
    }).catch(e => {
      console.log(e)
      alert("Update orders error! Please try again later.");
      this.setState({
        isUpdatingOrders: false
      })
    })
  }

  executeAction = (action: string) => {
    this.updateOrders({
      status: action
    })
  }

  fetchOrder = (id: number) => {
    http.get<{ data: Orders }>(`/orders/get/${id}`).then( response => {
      const { data } = response;
      if ( !data.data ) {
        alert("Orders is not found!");
        return
      }
      this.setState({
        order: data.data,
        isFetchingOrders: false
      })
    }).catch(e => {
      console.log(e)
      alert("Get orders error! Please try again later.");
    })
  }

  statusUpdatedTime = () => {
    if ( !this.state.order ) return 
    let warning10min = moment().subtract(10, "minutes").toDate();
    let late15min = moment().subtract(15, "minutes").toDate();
    let warning30min = moment().subtract(30, "minutes").toDate();
    let late40min = moment().subtract(40, "minutes").toDate();
    let updated_time = new Date(this.state.order.updated_time);
    let status = this.state.order.status;

    if ( status === 'delivering' ) {
      if ( updated_time > warning30min ) {
        return null
      } else if ( updated_time <= warning30min && updated_time > late40min ) {
        return {
          color: '#FDD835',
          label: 'WARNING'
        }
      } else {
        return {
          color: '#F4511E',
          label: 'LATE'
        }
      }
    } else {
      if ( updated_time > warning10min ) {
        return null
      } else if ( updated_time <= warning10min && updated_time > late15min ) {
        return {
          color: '#FDD835',
          label: 'WARNING'
        }
      } else {
        return {
          color: '#F4511E',
          label: 'LATE'
        }
      }
    }
  }

  renderButtonAction = () => {
    // "created" | "accepted" | "driver_assigned" | "delivering" | "done" | "canceled";
    const acceptBtn = <Button disabled={this.state.isUpdatingOrders} onClick={ () => this.executeAction('accepted') } variant="success">Accept</Button>;
    const deliveryBtn = <Button disabled={this.state.isUpdatingOrders} onClick={ () => this.executeAction('delivering') } variant="primary">Delivery</Button>;
    const assignedDriverBtn = <Button disabled={this.state.isUpdatingOrders} onClick={ () => this.executeAction('driver_assigned') } variant="primary">Assigned driver</Button>;
    const reassignedDriverBtn = <Button disabled={this.state.isUpdatingOrders} onClick={ () => this.executeAction('driver_assigned') } variant="primary">Reassigned driver</Button>;
    const cancelBtn = <Button disabled={this.state.isUpdatingOrders} onClick={ () => this.executeAction('canceled') } variant="danger">Cancel</Button>;
    const doneBtn = <Button disabled={this.state.isUpdatingOrders} onClick={ () => this.executeAction('done') } variant="info">Done</Button>;
    if ( this.state.order?.status === 'created' ) {
      return acceptBtn
    } else if ( this.state.order?.status === 'accepted' ) {
      return (
        <>
          {assignedDriverBtn}
          {cancelBtn}
        </>
      )
    } else if ( this.state.order?.status === 'driver_assigned' ) {
      return (
        <>
          {reassignedDriverBtn}
          {deliveryBtn}
          {cancelBtn}
        </>
      )
    } else if ( this.state.order?.status === 'delivering' ) {
      return (
        <>
          {doneBtn}
        </>
      )
    }
    return null
  }

  componentDidMount() {
    this.fetchOrder(this.state.order_id);
  }

  render() {
    const screenLoading = () => {
      return (
        <>
          <h1 className="text-center mb-0">Đang tải...!</h1>
        </>
      )
    }
    const statusUpdatedTime = () => {
      let sut = this.statusUpdatedTime();
      if ( !sut ) return null;
      else return (
        <span style={{backgroundColor: sut.color, color: "#FFF" }} className={ `ml-1 badge h5 mb-0` }><span className="font-weight-bold">{sut.label}</span></span>
      )
    }
    const screenOrdersEdit = () => {
      return (
        <>
          <div className="toolbar mb-3">
            { this.renderButtonAction()}
          </div>
          <Row className="w-100">
            <Col md="8" >
              <Card>
                <Card.Body>
                    <Card.Title className="mb-3 bold">
                      <div className="d-flex align-items-center mb-1">
                        <div>Edit Orders</div> <span className="ml-1 font-weight-bold">ID:{this.state.order?.id}</span> 
                        <span className={ `ml-1 badge badge-info h5 mb-0` }>Status: <span className="font-weight-bold">{statusName(this.state.order?.status).toLocaleUpperCase()}</span></span>
                        {statusUpdatedTime()}
                      </div>
                      <div>{this.state.order?.updated_time}</div>
                    </Card.Title>
                    <Row>
                      <Col md="6" >
                        <Form.Group>
                          <Form.Label>Customer name</Form.Label>
                          <Form.Control value={this.state.order?.customer_name} type="text" readOnly />
                        </Form.Group>  
                      </Col>
                      <Col md="6" >
                        <Form.Group>
                            <Form.Label>Rider name</Form.Label>
                            <Form.Control value={this.state.order?.rider_name} type="text" readOnly />
                        </Form.Group>  
                      </Col>
                    </Row>
                    <Form.Group>
                        <Form.Label>Order address</Form.Label>
                        <Form.Control value={this.state.order?.order_address} type="text" readOnly />
                    </Form.Group>  
                    <Row>
                      <Col md="6" >
                        <Form.Group>
                          <Form.Label>Merchant name</Form.Label>
                          <Form.Control value={this.state.order?.merchant_name} type="text" readOnly />
                        </Form.Group>  
                      </Col>
                      <Col md="6" >
                        <Form.Group>
                          <Form.Label>Merchant address</Form.Label>
                          <Form.Control value={this.state.order?.merchant_address} type="text" readOnly />
                        </Form.Group>  
                      </Col>
                    </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
            <Card>
                <Card.Body>
                    <Card.Title className="mb-3 bold">Dishes</Card.Title>
                    <table className="table">
                      <tbody>
                        {
                          this.state.order?.dishes ? this.state.order?.dishes.map( (item,index) => {
                            return (
                              <tr key={index}>
                                <th>{item.name}</th>
                                <td className="text-right">{formatMoney(item.price)}</td>
                              </tr>
                            )
                          }) : <tr>
                                <th>Not Dishes</th>
                              </tr>
                        }
                        <tr>
                          <th>Total</th>
                          <td className="text-right">{formatMoney(this.state.order?.total_price)}</td>
                        </tr>
                      </tbody>
                    </table>
                    
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )
    }
    return (
      // paginationTotalRows={this.state.orders.length}
      // progressPending={this.state.dataTables.loading}
      
      <>
        {
          this.state.isFetchingOrders ? 
          screenLoading() :
          screenOrdersEdit()
        }
      </>
    )
  }
}

export default OrdersEdit;