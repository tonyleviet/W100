export const PRODUCT_FETCH = 'PRODUCT_FETCH';
export const PRODUCT_FILTER = 'PRODUCT_FILTER';
export const PRODUCT_PRICE_RANGE = 'PRODUCT_PRICE_RANGE';
export const PRODUCT_PRICE_SUMMARY = 'PRODUCT_PRICE_SUMMARY';

export const fetchProduct = (product) => {

    //console.log('fetchProduct',product);
    return {
        type: PRODUCT_FETCH,
        payload: product
    }
}

export const filterVariants = (filter) => {
    return {
        type: PRODUCT_FILTER,
        payload: filter
    }
}

export const setPriceRange = (range) => {
    return {
        type: PRODUCT_PRICE_RANGE,
        payload: range
    }
}

export const setSummary = (sumamry) => {
    return {
        type: PRODUCT_PRICE_SUMMARY,
        payload: sumamry
    }
}
