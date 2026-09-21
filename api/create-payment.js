import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount, phone, provider } = req.body;
    const secretKey = process.env.FLW_SECRET_KEY;

    // 👇 DEBUGGING: This will show up in your Vercel Runtime Logs
    console.log("Received Data:", { amount, phone, provider });

    if (!secretKey) {
        return res.status(500).json({ error: 'Flutterwave secret key is not configured' });
    }

    // 👇 NEW CHECK: Stop if phone number is missing
    if (!phone) {
        return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    try {
        const response = await axios.post(
            'https://api.flutterwave.com/v3/charges?type=mobile_money_rwanda',
            {
                amount: amount,
                currency: 'RWF',
                email: 'customer@example.com', 
                tx_ref: `tx-${Date.now()}`, 
                phone_number: phone, // This is what Flutterwave needs
                network: provider, 
                redirect_url: 'https://pawapay-demo.vercel.app/api/flw-callback' 
            },
            {
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.json({
            success: true,
            paymentLink: response.data.data.link
        });

    } catch (error) {
        console.error('FLUTTERWAVE ERROR:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
}
