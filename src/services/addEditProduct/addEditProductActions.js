export const PRODUCT_FETCH = 'PRODUCT_FETCH';


export const fetchProduct = (product) => {

    //console.log('fetchProduct',product);
    return {
        type: PRODUCT_FETCH,
        payload: product
    }
}
