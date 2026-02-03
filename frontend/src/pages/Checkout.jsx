import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { ShieldCheck, Lock, CreditCard, MapPin } from 'lucide-react';

// Replace with your public key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ clientSecret, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage("Payment succeeded!");
            onSuccess(paymentIntent.id);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
                <PaymentElement />
            </div>
            {message && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{message}</div>}
            <Button disabled={isLoading || !stripe || !elements} className="w-full bg-coffee-dark hover:bg-gold text-white py-6 text-lg uppercase tracking-widest font-bold">
                {isLoading ? "Processing..." : "Secure Pay Now"}
            </Button>
            <div className="flex justify-center items-center gap-2 text-xs text-gray-400">
                <Lock size={12} /> SSL Encrypted Transaction
            </div>
        </form>
    );
};

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Address, 2: Payment
    const [address, setAddress] = useState({ street: '', city: '', country: '', postal_code: '' });
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (cartItems.length === 0) navigate('/products');
    }, [cartItems, navigate]);

    useEffect(() => {
        // Create PaymentIntent when moving to Payment step
        if (step === 2 && !clientSecret) {
            axios.post('http://localhost:5000/api/create-payment-intent', {
                items: cartItems,
            })
                .then(res => setClientSecret(res.data.clientSecret))
                .catch(err => console.error("Error creating payment intent", err));
        }
    }, [step, cartItems, clientSecret]);

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handlePaymentSuccess = async (paymentIntentId) => {
        // Create Order in DB
        try {
            await axios.post('http://localhost:5000/api/orders', {
                user_id: user?.id || null, // Guest checkout supported (user_id null)
                items: cartItems.map(item => ({
                    product_id: item.id,
                    variant_id: item.variant?.id,
                    quantity: item.quantity,
                    price: item.variant ? item.variant.price : item.price
                })),
                total_price: getCartTotal(),
                shipping_address: JSON.stringify(address),
                payment_intent_id: paymentIntentId
            });

            // Success
            clearCart();
            alert("Order placed successfully!");
            navigate('/');
        } catch (error) {
            console.error("Failed to save order", error);
            alert("Payment successful but failed to save order. Contact support.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-center items-center mb-12 space-y-4 md:space-y-0 text-sm tracking-widest uppercase">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-coffee-dark font-bold' : 'text-gray-400'}`}>
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center">1</span> Shipping
                    </div>
                    <div className="w-12 h-px bg-gray-300 mx-4"></div>
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-coffee-dark font-bold' : 'text-gray-400'}`}>
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center">2</span> Payment
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                            {step === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-serif font-bold text-coffee-dark flex items-center gap-3">
                                        <MapPin className="text-gold" /> Shipping Address
                                    </h2>
                                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Street Address</label>
                                            <Input className="bg-gray-50 border-gray-200 h-12" placeholder="123 Luxury Ave" required value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">City</label>
                                                <Input className="bg-gray-50 border-gray-200 h-12" placeholder="Dubai" required value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Postal Code</label>
                                                <Input className="bg-gray-50 border-gray-200 h-12" placeholder="00000" required value={address.postal_code} onChange={e => setAddress({ ...address, postal_code: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Country</label>
                                            <Input className="bg-gray-50 border-gray-200 h-12" placeholder="United Arab Emirates" required value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} />
                                        </div>

                                        <Button type="submit" className="w-full mt-6 bg-coffee text-white hover:bg-gold uppercase tracking-widest h-12 font-bold transition-all">
                                            Continue to Payment
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {step === 2 && clientSecret && (
                                <div className="w-full">
                                    <h2 className="text-2xl font-serif font-bold text-coffee-dark flex items-center gap-3 mb-6">
                                        <CreditCard className="text-gold" /> Secure Payment
                                    </h2>
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <CheckoutForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
                                    </Elements>
                                    <button onClick={() => setStep(1)} className="mt-4 text-xs text-gray-400 underline hover:text-gold">Edit Shipping Address</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <div className="bg-[#F9F7F5] p-8 rounded-sm sticky top-24 border border-gray-100">
                            <h3 className="font-serif font-bold text-lg text-coffee-dark mb-6 pb-4 border-b border-gray-200">Order Summary</h3>
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-16 w-16 bg-white rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                            <img src={item.imageUrl} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-coffee-dark">{item.name}</h4>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-medium text-coffee-dark">
                                            ${((item.variant ? item.variant.price : item.price) * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-700 font-medium">Free</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                                <span className="font-serif font-bold text-xl text-coffee-dark">Total</span>
                                <span className="font-bold text-xl text-gold">${getCartTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
