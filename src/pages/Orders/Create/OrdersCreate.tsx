import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { useHistory } from "react-router-dom";
import http from '@/api';
import { statusName } from '../utils/orders-status-names.util';

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

interface OrderCreate {
  customer_name: string;
  rider_name: string;
  order_address: string;
  merchant_name: string;
  merchant_address: string;
  dishes: Orders['dishes'];
}

interface State {
  order: OrderCreate;
  order_id: number;
  isCreatingOrders: boolean;
}

interface Prop {
  history: {
    push: Function;
  },
  match: {
    params: {
      id: string;
    }
  };
}

class OrdersCreate extends Component<Prop> {

  state: State = {
    order: {
      customer_name: "",
      rider_name: "",
      order_address: "",
      merchant_name: "",
      merchant_address: "",
      dishes: []
    },
    order_id: parseInt(this.props.match.params.id),
    isCreatingOrders: false
  }

  deepClone(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  addDish = () => {
    let order: OrderCreate = this.deepClone(this.state.order);
    order.dishes?.push({
      name: "",
      price: 0
    })
    this.setState({
      order: order
    })
  }

  removeOrderDish = (index: number) => {
    let order: OrderCreate = this.deepClone(this.state.order);
    order.dishes?.splice(index,1)
    this.setState({
      order: order
    })
  }

  updateOrderDish = (e: React.ChangeEvent<Element>, state: string, type: string, index: number) => {
    let order: OrderCreate = this.deepClone(this.state.order);
    const target = e.target as HTMLInputElement;
    if ( order.dishes ) {
      order.dishes[index][state] = type === 'number' ? target.value ? parseInt(target.value) : 0 : target.value;
    }
    this.setState({
      order: order
    })
  }

  updateOrder = (e: React.ChangeEvent<Element>, state: string, type?: string) => {
    let order = this.deepClone(this.state.order);
    const target = e.target as HTMLInputElement;
    order[state] = type === 'number' ? target.value ? parseInt(target.value) : "" : target.value;
    this.setState({
      order: order
    })
  }

  createOrders = () => {
    let order = this.state.order;
    if ( !order.customer_name ) {
      alert(`Please input customer name`)
      return;
    }
    if ( !order.order_address ) {
      alert(`Please input order address`)
      return;
    }
    if ( !order.customer_name ) {
      alert(`Please input customer name`)
      return;
    }
    if ( !order.merchant_address ) {
      alert(`Please input merchant address`)
      return;
    }
    if ( !order.merchant_name ) {
      alert(`Please input merchant name`)
      return;
    }
    if ( !order.dishes || order.dishes?.length < 1 ) {
      alert(`Please input at least 1 dish`)
      return;
    }
    this.setState({
      isCreatingOrders: true
    })
    http.post<{ data: Orders }>(`/orders/create`,this.state.order).then( response => {
      const { data } = response;
      socket.emit("create_orders",data.data);
      setTimeout(async () => {
        this.setState({
          isCreatingOrders: false
        })
        this.props.history.push(`/orders/edit/${data.data.id}`);
      }, 100);
    }).catch(e => {
      console.log(e)
      alert("Create orders error! Please try again later.");
      this.setState({
        isCreatingOrders: false
      })
    })
  }

  render() {
    return (
      <>
        <Button className="mb-3" onClick={() => this.createOrders()} variant="info">Save</Button>
        <Row className="w-100">
          <Col md="7" >
            <Card>
              <Card.Body>
                  <Card.Title className="mb-3 bold">
                    Create Orders
                  </Card.Title>
                  <Form.Group>
                    <Form.Label>Customer name</Form.Label>
                    <Form.Control value={this.state.order?.customer_name} onChange={(e) => this.updateOrder(e,"customer_name") } type="text" />
                  </Form.Group> 
                  <Form.Group>
                      <Form.Label>Order address</Form.Label>
                      <Form.Control value={this.state.order?.order_address} onChange={(e) => this.updateOrder(e,"order_address") } type="text" />
                  </Form.Group>  
                  <Row>
                    <Col md="6" >
                      <Form.Group>
                        <Form.Label>Merchant name</Form.Label>
                        <Form.Control value={this.state.order?.merchant_name} onChange={(e) => this.updateOrder(e,"merchant_name") } type="text" />
                      </Form.Group>  
                    </Col>
                    <Col md="6" >
                      <Form.Group>
                        <Form.Label>Merchant address</Form.Label>
                        <Form.Control value={this.state.order?.merchant_address} onChange={(e) => this.updateOrder(e,"merchant_address") } type="text" />
                      </Form.Group>  
                    </Col>
                  </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md="5">
          <Card>
              <Card.Body>
                  <Card.Title className="mb-3 bold">Dishes</Card.Title>
                  {
                    this.state.order.dishes?.map( (item,itemIndex) => {
                      return (
                        <Row key={itemIndex} > 
                          <Col md="6" >
                            <Form.Group>
                              <Form.Label>Dish name</Form.Label>
                              <Form.Control value={item.name} onChange={(e) => this.updateOrderDish(e,"name","text",itemIndex) } type="text" />
                            </Form.Group>  
                          </Col>
                          <Col bsPrefix="col" >
                            <Form.Group>
                              <Form.Label>Dish price</Form.Label>
                              <Form.Control value={item.price} onChange={(e) => this.updateOrderDish(e,"price","number",itemIndex) } type="number" />
                            </Form.Group>  
                          </Col>
                          <Col md="auto">
                            <div style={{ display: "flex", alignItems: "center", height: "100%" }} >
                              <Button variant="danger" className="btn-xs" onClick={ () => this.removeOrderDish(itemIndex) }>X</Button>
                            </div>
                          </Col>
                        </Row>
                      )
                    })
                  }
                  <Button variant="info" onClick={ () => this.addDish() }>Add dish</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    )
  }
}

export default OrdersCreate;