import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import useAdmin from '../Components/MyHooks/useAdmin/useAdmin';
import useSeller from '../Components/MyHooks/useSeller/useSeller';
import Footer from '../Components/Shared/Footer/Footer';
import Navbar from '../Components/Shared/Navbar/Navbar';
import { AuthContext } from '../Contexts/AuthProvider/AuthProvider';

const DashboardLayout = () => {
    const { user } = useContext(AuthContext);
    const [isAdmin] = useAdmin(user.email);
    const [isSeller] = useSeller(user.email);
    return (
        <div>
            <Navbar />
            <div className="drawer drawer-mobile">
                <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <Outlet />
                </div>
                <div className="drawer-side">
                    <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 bg-base-100 text-base-content">
                        {
                            !isSeller && !isAdmin &&
                            <li><Link to='/dashboard/myOrders'>My Orders</Link></li>
                        }
                        {
                            isSeller &&
                            <>
                                <li><Link to='/dashboard/myProducts'>My Products</Link></li>
                                <li><Link to='/dashboard/addProducts'>Add a Product</Link></li>
                            </>
                        }
                        {
                            isAdmin &&
                            <>
                                <li><Link to='/dashboard/users/sellers'>All Sellers</Link></li>
                                <li><Link to='/dashboard/users/buyers'>All Buyers</Link></li>
                                <li><Link to='/dashboard/reported'>Reported Items</Link></li>
                            </>
                        }
                    </ul>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayout;