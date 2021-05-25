import React, { Component } from "react";
import { 
    Form, 
    FormControl,
    InputGroup,
    Button,
    Row,
    Col,
    Modal
} from 'react-bootstrap';

import { DataTablesFilter } from "../interfaces"

interface Prop {
    value: DataTablesFilter;
}

interface State {
    filters: DataTablesFilter
}

const status = [{
    label: "Choose status",
    value: ""
},{
    label: "Created",
    value: "created"
},{
    label: "Accepted",
    value: "accepted"
},{
    label: "Driver Assigned",
    value: "driver_assigned"
},{
    label: "Delivering",
    value: "delivering"
},{
    label: "Done",
    value: "done"
},{
    label: "Canceled",
    value: "canceled"
}];

class FormFilter extends Component<Prop> {
    state: State = {
        filters: {
            customer_name: "",
            merchant_name: "",
            id: "",
            rider_name: "",
            status: "",
            updated_time: ""
        }
    }
    
    deepClone(data: any) {
        return JSON.parse(JSON.stringify(data));
    }

    updateFilter = (e: React.ChangeEvent<Element>, state: string, type?: string) => {
        let filters = this.deepClone(this.state.filters);
        const target = e.target as HTMLInputElement;
        filters[state] = type === 'number' ? target.value ? parseInt(target.value) : "" : target.value;
        this.setState({
            filters: filters
        })
    }

    componentWillMount() {
        let filters: DataTablesFilter = this.deepClone(this.state.filters);
        // filters.customer_name = this.props.value.customer_name;
        // filters.merchant_name = this.props.value.merchant_name;
        filters.id = this.props.value.id;
        // filters.rider_name = this.props.value.rider_name;
        filters.status = this.props.value.status;
        filters.updated_time = this.props.value.updated_time;
        this.setState({
            filters: filters
        })
    }

    render() {
        return (
            <>
                <Form.Group controlId="formID">
                    <Form.Label>ID</Form.Label>
                    <Form.Control value={this.state.filters.id} onChange={(e) => this.updateFilter(e,"id","number") } type="text" placeholder="Enter ID" />
                </Form.Group>  
                <Form.Group controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control value={this.state.filters.status} onChange={(e) => this.updateFilter(e,"status") } as="select" placeholder="Choose status">
                        {status.map( (ele,eleIndex) => {
                            return (
                                <option key={eleIndex} value={ele.value}>{ele.label}</option>
                            )
                        })}
                    </Form.Control>
                </Form.Group>  
                {/* <Form.Group controlId="formCustomerName">
                    <Form.Label>Customer name</Form.Label>
                    <Form.Control value={this.state.filters.customer_name} onChange={(e) => this.updateFilter(e,"customer_name") } type="text" placeholder="Enter customer name" />
                </Form.Group>   */}
                {/* <Form.Group controlId="formRiderName">
                    <Form.Label>Rider name</Form.Label>
                    <Form.Control value={this.state.filters.rider_name} onChange={(e) => this.updateFilter(e,"rider_name") } type="text" placeholder="Enter rider name" />
                </Form.Group>   */}
                {/* <Form.Group controlId="formMerchantName">
                    <Form.Label>Merchant name</Form.Label>
                    <Form.Control value={this.state.filters.merchant_name} onChange={(e) => this.updateFilter(e,"merchant_name") } type="text" placeholder="Enter merchant name" />
                </Form.Group>  */}
                <Form.Group controlId="formUpdatedTime">
                    <Form.Label>Updated time</Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Last</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Enter minute"
                            type="number"
                            value={this.state.filters.updated_time}
                            onChange={(e) => this.updateFilter(e,"updated_time","number") }
                        />
                        <InputGroup.Append>
                            <InputGroup.Text>minute</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>  
            </>
        )
        
    }
} 

export default FormFilter;