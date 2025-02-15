import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../Contexts/AuthProvider/AuthProvider';
import { HiOutlineExclamation } from 'react-icons/hi';
import Spinner from '../../Spinner/Spinner';

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Fetching orders from backend
    const { data: orders = [], refetch, isLoading, isFetching } = useQuery({
        queryKey: ['orders', user?.email],
        queryFn: async () => {
            const res = await fetch(`https://used-books-server.vercel.app/bookings?email=${user?.email}`, {
                headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        }
    });
    const [showSpinner, setShowSpinner] = useState(isLoading);
    
    useEffect(() => {
        if (isLoading || isFetching) {
          const timer = setTimeout(() => setShowSpinner(true), 1000);
          return () => clearTimeout(timer);
        } else {
          setShowSpinner(false);
        }
      }, [isLoading, isFetching]);
    
      if (showSpinner) {
        return <Spinner />;
      }

    // Handle Delete Order
    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                const res = await fetch(`https://used-books-server.vercel.app/bookings/reported/${id}`, {
                    method: 'DELETE',
                    headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` }
                });
                if (res.ok) {
                    toast.success('Deleted Successfully!');
                    refetch();
                }
            } catch (error) {
                toast.error('Error deleting booking.');
            }
        }
    };

    // Handle Report Order
    const reportHandler = async (id) => {
        try {
            const res = await fetch(`https://used-books-server.vercel.app/bookings/reported/${id}`, {
                method: 'PUT',
                headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (res.ok) {
                toast.success('Reported Successfully!');
                refetch();
            }
        } catch (error) {
            toast.error('Error reporting booking.');
        }
    };

    // Handle Payment Redirection
    const handlePaymentRedirect = (orderId) => {
        navigate(`/dashboard/payments/${orderId}`);
    };
    

    return (
        <>
            {orders.length > 0 ? (
                <div className="overflow-x-auto mt-24">
                    <h2 className='text-3xl font-bold pb-4'>My Orders</h2>
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>Name</th>
                                <th>Product</th>
                                <th>Used Time</th>
                                <th>Price</th>
                                <th>Remove</th>
                                <th>Report</th>
                                <th>Buy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, i) => (
                                <tr key={order._id}>
                                    <th>{i + 1}</th>
                                    <td>{order.buyer}</td>
                                    <td>{order.productName}</td>
                                    <td>{order.usedTime}</td>
                                    <td>{order.oldPrice}</td>
                                    <td>
                                        <button 
                                            onClick={() => deleteHandler(order._id)} 
                                            className='btn btn-sm btn-error btn-outline'>
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                    <td>
                                        {order.reported ? (
                                            <h4 className='text-error font-bold'>REPORTED</h4>
                                        ) : (
                                            <button 
                                                onClick={() => reportHandler(order._id)} 
                                                className='btn btn-sm btn-circle hover:bg-orange-100 hover:border-orange-500 bg-orange-100 border-orange-100 ease-linear duration-500'>
                                                <HiOutlineExclamation className='text-xl text-orange-500 font-bold'/>
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {order.oldPrice && !order.paid ? (
                                            <button 
                                                onClick={() => handlePaymentRedirect(order._id)} 
                                                className='btn btn-sm btn-success cursor-pointer'>
                                                Pay Now
                                            </button>
                                        ) : (
                                            order.oldPrice && order.paid && 
                                            <span className='text-success font-semibold'>PAID</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <h2 className='text-5xl text-center text-orange-500'>You haven't placed any orders yet!</h2>
            )}
        </>
    );
};

export default MyOrders;