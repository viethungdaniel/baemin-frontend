import React from "react";
import { NavLink  } from "react-router-dom";
import { Orders } from '../../interfaces/orders.interface';
import { statusName } from '../../utils/orders-status-names.util';

const currencyFormat = (value: any) => {
    if ( !isNaN(Number(value)) ) {
        value = new Intl.NumberFormat("vi",{ style: 'currency', currency: 'VND' }).format(value);
    }
    return value;
}

const columns = [
    {
        name: 'ID',
        selector: 'id',
        sortable: false,
        grow: 1,
        allowOverflow: true
    },
    {
        name: 'Status',
        selector: 'status',
        sortable: false,
        right: false,
        allowOverflow: true,
        wrap: true,
        grow: 1,
        cell: (row: { status: Orders['status'] } ) => {
            return (
                <>{statusName(row.status)}</>
            );
        }
    },
    {
        name: 'Customer name',
        selector: 'customer_name',
        sortable: false,
        allowOverflow: true,
        wrap: true,
        grow: 1
    },
    {
        name: 'Rider name',
        selector: 'rider_name',
        sortable: false,
        right: false,
        allowOverflow: true,
        wrap: true,
        grow: 1
    },
    {
        name: 'Order address',
        selector: 'order_address',
        sortable: false,
        allowOverflow: true,
        wrap: true,
        grow: 1
    },
    {
        name: 'Merchant name',
        selector: 'merchant_name',
        sortable: false,
        right: false,
        allowOverflow: true,
        wrap: true,
        grow: 1
    },
    {
        name: 'Merchant address',
        selector: 'merchant_address',
        sortable: false,
        allowOverflow: true,
        wrap: true,
        grow: 1
    },
    {
        name: 'Dishes',
        selector: 'dishes',
        sortable: false,
        right: false,
        allowOverflow: true,
        wrap: true,
        cell: (row: { dishes: Orders['dishes'] } ) => {
            if ( row.dishes ) 
                return (
                    <div style={{ whiteSpace: "pre-line" }}>
                        {
                            row.dishes.map( (item,index) => {
                                return (
                                    <div key={index} style={{ whiteSpace: "nowrap" }}>
                                        {item.name} {currencyFormat(item.price)}
                                    </div>
                                );
                            })
                        }
                    </div>
                );
            return null;
        },
        grow: 2
    },
    {
        name: 'Total price',
        selector: 'total_price',
        sortable: false,
        right: true,
        allowOverflow: true,
        wrap: true,
        cell: (row: { total_price: Orders['total_price'] }) => {
            return (
                <>
                    {currencyFormat(row.total_price)}
                </>
            );
        },
        grow: 1
    },
    {
        name: 'Updated time',
        selector: 'updated_time',
        sortable: true,
        center: true,
        allowOverflow: true,
        wrap: true,
        grow: 1
    },
    {
        name: 'Actions',
        selector: 'id',
        sortable: false,
        right: true,
        allowOverflow: true,
        wrap: true,
        cell: (row: Orders) => {
            return (
                <>
                    <NavLink to={`/orders/edit/${row.id}`} className="btn btn-info btn-xs">
                        Edit
                    </NavLink>
                </>
            );
        },
        grow: 1
    },
]

export default columns;