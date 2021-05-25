import React, { Component } from "react";
import { Orders } from '../../interfaces';

export const dataTables = {
    columns: [
        {
          name: 'ID',
          selector: 'id',
          sortable: false,
        },
        {
          name: 'Status',
          selector: 'status',
          sortable: true,
          right: false,
        },
        {
            name: 'Customer name',
            selector: 'customer_name',
            sortable: false,
        },
        {
            name: 'Rider name',
            selector: 'rider_name',
            sortable: true,
            right: false,
        },
        {
            name: 'Order address',
            selector: 'order_address',
            sortable: false,
        },
        {
            name: 'Merchant name',
            selector: 'merchant_name',
            sortable: true,
            right: false,
        },
        {
            name: 'Merchant address',
            selector: 'merchant_address',
            sortable: false,
        },
        {
            name: 'Dishes',
            selector: 'dishes',
            sortable: true,
            right: false,
            cell: (row: { dishes: Orders['dishes'] } ) => {
                return row.dishes ? row.dishes.map( item => {
                    return `<div>${item.name} ${item.price}</div><br>`;
                }) : "";
            }
        },
        {
            name: 'Total price',
            selector: 'total_price',
            sortable: false,
        },
        {
            name: 'Updated time',
            selector: 'updated_time',
            sortable: true,
            right: true,
        },
    ],
    totalRows: 0,
}