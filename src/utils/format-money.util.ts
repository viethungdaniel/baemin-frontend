interface Config {
    options?: {
        style?: string;
        currency?: string | 'VND' | 'USD';
    };
    locale?: string;
}

const defaultConfig: Config = {
    options: {
        style: 'currency',
        currency: 'VND'
    },
    locale: "vi" 
}

export const formatMoney = (amount: string | number | undefined, config?: Config ): string | number | undefined => {
    let cloneConfig = defaultConfig;
    if ( config ) {
        Object.assign(cloneConfig,config);
    }
    try {
        const formatter = new Intl.NumberFormat(cloneConfig.locale,cloneConfig.options);
        return formatter.format(Number(amount));
    } catch (e) {
        console.log(e)
    }
    return amount;
};