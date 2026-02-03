import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-coffee-dark text-white shadow-xl flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-serif font-bold text-gold">Yemen Kaf</h1>
                    <p className="text-xs text-gray-400 mt-1">Admin Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem to="/admin" end icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem to="/admin/products" icon={<Package size={20} />} label="Products" />
                    <NavItem to="/admin/orders" icon={<ShoppingBag size={20} />} label="Orders" />
                    <NavItem to="/admin/customers" icon={<Users size={20} />} label="Customers" />
                    <div className="pt-4 mt-4 border-t border-gray-700">
                        <NavItem to="/admin/settings" icon={<Settings size={20} />} label="Settings" />
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-300 hover:bg-red-900/20 hover:text-red-200 rounded-md transition-colors"
                    >
                        <LogOut size={18} className="mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label, end }) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                ? 'bg-gold text-coffee-dark'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`
        }
    >
        <span className="mr-3">{icon}</span>
        {label}
    </NavLink>
);

export default AdminLayout;
