import React from 'react';
import { useLoaderData, useNavigation } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import ProductMedia from './ProductMedia/ProductMedia';

const Products = () => {
    const navigation = useNavigation();
    const products = useLoaderData();

    if (navigation.state === "loading") {
        return <Spinner />
    }
    return (
        <div className='lg:w-5/6 mx-auto py-24 rounded-xl grid lg:grid-cols-2 gap-10'>
            {
                products?.map((product, i) => <ProductMedia
                    key={i}
                    product={product}
                />)
            }
        </div>
    );
};

export default Products;