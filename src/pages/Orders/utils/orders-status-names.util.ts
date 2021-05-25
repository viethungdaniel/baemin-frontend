interface StatusName {
    label: string;
    value: string;
}

export const statusNames: StatusName[] = [{
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
}]

export const statusName = (status: any): string  => {
    let statusName = statusNames.find( item => item.value === status );
    return statusName ? statusName.label : status;
};