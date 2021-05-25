import * as moment from 'moment';
import { Orders } from '../../interfaces/orders.interface';

const ConditionalRowStyles = [
    {
        when: (row: Orders): boolean => {
            let updated_time = new Date(row.updated_time);
            let late15min = moment().subtract(15, "minutes").toDate();
            let late40min = moment().subtract(40, "minutes").toDate();
            let late1510min = moment().subtract(15 + 10, "minutes").toDate();
            let late4030min = moment().subtract(40 + 30, "minutes").toDate();
            if ( row.status === 'delivering' ) {
                if ( row.updated_time 
                    && updated_time <= late40min 
                    && updated_time > late4030min )
                return true;
            } 
            if ( row.updated_time 
                && updated_time <= late15min
                && updated_time > late1510min )
                return true;
            return false;
        },
        style: {
          backgroundColor: '#FFF59D'
        }
    },
    {
        when: (row: Orders): boolean => {
            let updated_time = new Date(row.updated_time);
            let late15min = moment().subtract(15, "minutes").toDate();
            let late40min = moment().subtract(40, "minutes").toDate();
            let late1510min = moment().subtract(15 + 10, "minutes").toDate();
            let late4030min = moment().subtract(40 + 30, "minutes").toDate();
            if ( row.status === 'delivering' ) {
                if ( row.updated_time 
                    && updated_time && updated_time <= late4030min )
                return true;
            } 
            if ( row.updated_time 
                && updated_time <= late1510min )
                return true;
            return false;
        },
        style: {
          backgroundColor: '#FFAB91'
        }
    }
]

export default ConditionalRowStyles;