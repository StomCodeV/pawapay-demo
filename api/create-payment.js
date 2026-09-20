import axios from 'axios';
import crypto from 'node:crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount } = req.body;
    const token = process.env.PAWAPAY_TOKEN;

    if (!token) {
        return res.status(500).json({ error: 'PAWAPAY_TOKEN is not configured in Vercel' });
    }

    try {
        const response = await axios.post(
            'https://api.sandbox.pawapay.io/v2/checkouts',
            {
                checkoutId: crypto.randomUUID(), // Fixed: Must be a UUID
                returnUrl: 'https://pawapay-demo.vercel.app/', // Where user goes after paying
                defaultLanguage: 'en',
                countries: ['RWA'],
                expiresAfter: 60,
                amounts: [
                    {
                        country: 'RWA',
                        currency: 'RWF',
                        amount: String(amount)
                    }
                ],
                clientReferenceId: `demo-${Date.now()}`,
                reason: { en: 'Demo Payment' }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Return the redirectUrl so the frontend can use it
        return res.json({
            success: true,
            checkoutId: response.data.checkoutId,
            redirectUrl: response.data.redirectUrl
        });
    } catch (error) {
        console.error('PAWAPAY ERROR:', error.response?.data || error.message);
        
        // Return the real error so you can see it in the browser
        return res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
}
