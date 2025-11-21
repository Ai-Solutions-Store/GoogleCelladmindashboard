import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle } from './IconComponents';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    planPrice: string;
    planId: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, planName, planPrice, planId }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [card, setCard] = useState<any>(null);

    useEffect(() => {
        if (!isOpen) return;

        const initializeSquare = async () => {
            try {
                // @ts-ignore - Square Web SDK loaded via script tag
                if (!window.Square) {
                    throw new Error('Square SDK not loaded');
                }

                // @ts-ignore
                const payments = window.Square.payments(
                    import.meta.env.VITE_SQUARE_APPLICATION_ID,
                    import.meta.env.VITE_SQUARE_LOCATION_ID
                );

                const cardInstance = await payments.card();
                await cardInstance.attach('#card-container');
                setCard(cardInstance);
            } catch (error) {
                console.error('Square initialization failed:', error);
                setErrorMessage('Payment system unavailable. Please try again later.');
            }
        };

        initializeSquare();

        return () => {
            if (card) {
                card.destroy();
            }
        };
    }, [isOpen]);

    const handlePayment = async () => {
        if (!card) return;

        setIsProcessing(true);
        setPaymentStatus('processing');
        setErrorMessage('');

        try {
            // Tokenize card details (Square encrypts data client-side)
            const result = await card.tokenize();

            if (result.status === 'OK') {
                // Send token to backend for LIVE payment processing
                const response = await fetch('/api/payments/create-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sourceId: result.token,
                        amount: parseFloat(planPrice.replace('$', '')),
                        planId,
                        userId: localStorage.getItem('userId') || null
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setPaymentStatus('success');
                    setTimeout(() => {
                        onClose();
                        window.location.href = '/dashboard?payment=success';
                    }, 2000);
                } else {
                    throw new Error(data.error || 'Payment failed');
                }
            } else {
                throw new Error(result.errors?.[0]?.message || 'Card validation failed');
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            setPaymentStatus('error');
            setErrorMessage(error.message || 'Payment failed. Please check your card details.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl max-w-md w-full mx-4 p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                {paymentStatus === 'success' ? (
                    <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                        <p className="text-slate-300 mb-4">
                            Thank you for supporting Shriners Children's Hospitals.
                        </p>
                        <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="w-8 h-8 text-purple-400" />
                            <div>
                                <h2 className="text-xl font-bold text-white">{planName} Subscription</h2>
                                <p className="text-slate-400 text-sm">{planPrice}/month</p>
                            </div>
                        </div>

                        <div className="bg-slate-950/50 rounded-xl p-4 mb-6">
                            <div id="card-container" className="min-h-[120px]"></div>
                        </div>

                        {errorMessage && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                                <p className="text-red-400 text-sm font-medium">{errorMessage}</p>
                            </div>
                        )}

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing || !card}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    Pay {planPrice}
                                </>
                            )}
                        </button>

                        <p className="text-xs text-slate-500 text-center mt-4">
                            🔒 Secured by Square • PCI DSS Compliant
                        </p>
                        <p className="text-xs text-green-400 text-center mt-2">
                            50% of your payment goes directly to Shriners Children's Hospitals
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
