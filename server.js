const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ Replace with YOUR token from PawaPay dashboard
const PAWAPAY_TOKEN = 'YOUR_PAWAPAY_API_TOKEN_HERE';

// ✅ Your PawaPay webhook will hit THIS endpoint
app.post('/pawapay-callback', (req, res) => {
    console.log('🔔 CALLBACK RECEIVED:', JSON.stringify(req.body, null, 2));
    
    if (req.body.status === 'COMPLETED') {
        console.log('✅ PAYMENT SUCCESSFUL! Unlocking access...');
    }
    
    res.status(200).send('OK');
});

// ✅ Your frontend calls THIS to start a payment
app.post('/create-payment', async (req, res) => {
    const { amount, phone, provider } = req.body;

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
                    'Authorization': `Bearer ${PAWAPAY_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json({ success: true, checkoutId: response.data.checkoutId });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: 'Payment failed' });
    }
});

app.listen(3000, () => console.log('✅ Server running on port 3000'));
