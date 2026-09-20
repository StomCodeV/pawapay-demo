const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PAWAPAY_TOKEN = process.env.PAWAPAY_TOKEN;

app.post('/api/create-payment', async (req, res) => {
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
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: 'Payment failed' });
    }
});

app.post('/api/pawapay-callback', (req, res) => {
    console.log('🔔 CALLBACK:', JSON.stringify(req.body));
    if (req.body.status === 'COMPLETED') {
        console.log('✅ PAYMENT SUCCESSFUL');
    }
    res.status(200).send('OK');
});

module.exports = app;
