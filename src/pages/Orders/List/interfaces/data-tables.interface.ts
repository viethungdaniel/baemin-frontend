interface Column {
    name: string;
    selector: string | undefined;
    sortable: boolean | undefined;
    cell?: any | undefined; 
    allowOverflow?: boolean | undefined;
    wrap?: boolean | undefined;
}

export interface DataTablesInterface {
    columns: Column[];
}