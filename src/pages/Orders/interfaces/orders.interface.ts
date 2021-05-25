interface DataDish { 
    name: string;
    price: number;
}

export interface Orders {
    id?: number;
    status?: string | "created" | "accepted" | "driver_assigned" | "delivering" | "done" | "canceled";
    customer_name?: string;
    rider_name?: string;
    order_address?: string;
    merchant_name?: string;
    merchant_address?: string;
    dishes?: DataDish[];
    total_price?: number;
    updated_time: Date | string;
}