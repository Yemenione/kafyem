import React, { useState } from 'react';
import axios from 'axios';
import { Save, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ProductEditor = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_name: 'Honey',
        images: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            const token = userStr ? JSON.parse(userStr).token : null;

            await axios.post('http://localhost:5000/api/admin/products', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Product Created Successfully!');
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            alert('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" onClick={() => navigate('/admin')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <h1 className="text-3xl font-serif font-bold text-coffee-dark">Add New Product</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Product Name</label>
                            <Input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Royal Sidr Honey" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                name="category_name"
                                value={formData.category_name}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="Honey">Honey</option>
                                <option value="Coffee">Coffee</option>
                                <option value="Spices">Spices</option>
                                <option value="Gifts">Gifts</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Detailed product description..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price ($)</label>
                            <Input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Stock Quantity</label>
                            <Input name="stock" type="number" value={formData.stock} onChange={handleChange} required placeholder="0" />
                        </div>
                    </div>

                    <div className="border-t pt-6 flex justify-end">
                        <Button type="submit" disabled={loading} className="bg-gold hover:bg-gold/90 text-coffee-dark font-bold px-8">
                            {loading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Product</>}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditor;
