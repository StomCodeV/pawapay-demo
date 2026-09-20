const axios = require('axios');

module.exports = async (req, res) => {
    // Vercel handles CORS automatically
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount, phone, provider } = req.body;
    
    // This pulls the token securely from Vercel settings
    const token = process.env.PAWAPAY_TOKEN; 

    try {
        const response = await axios.post(
            'https://api.sandbox.pawapay.io/v2/checkouts',
            {
                checkoutId: `test_${Date.now()}`,
                returnUrl: 'https://example.com',
                countries: ['RWA'],
                amounts: [{ country: 'RWA', currency: 'RWF', amount: amount }],
                reason: { en: 'Demo Payment' },
                metadata: [{ customerPhone: phone, provider: provider }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json({ success: true, checkoutId: response.data.checkoutId });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: 'Payment failed' });
    }
};