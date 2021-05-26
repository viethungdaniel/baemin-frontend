import * as moment from 'moment';
import { Orders } from '../../interfaces/orders.interface';

const ConditionalRowStyles = [
    {
        when: (row: Orders): boolean => {
            let updated_time = new Date(row.updated_time);
            let warning10min = moment().subtract(10, "minutes").toDate();
            let late15min = moment().subtract(15, "minutes").toDate();
            let warning30min = moment().subtract(30, "minutes").toDate();
            let late40min = moment().subtract(40, "minutes").toDate();
            if ( row.status === 'delivering' ) {
                if ( row.updated_time 
                    && updated_time <= warning30min 
                    && updated_time > late40min )
                return true;
            } 
            if ( row.updated_time 
                && updated_time <= warning10min
                && updated_time > late15min )
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
            if ( row.status === 'delivering' ) {
                if ( row.updated_time 
                    && updated_time && updated_time <= late40min )
                return true;
            } 
            if ( row.updated_time 
                && updated_time <= late15min )
                return true;
            return false;
        },
        style: {
          backgroundColor: '#FFAB91'
        }
    }
]

export default ConditionalRowStyles;