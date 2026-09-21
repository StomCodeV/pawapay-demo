import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount, phone, provider } = req.body;
    const secretKey = process.env.FLW_SECRET_KEY;

    if (!secretKey) {
        return res.status(500).json({ error: 'Flutterwave secret key is not configured' });
    }

    try {
        const response = await axios.post(
            'https://api.flutterwave.com/v3/charges?type=mobile_money_rwanda',
            {
                amount: amount,
                currency: 'RWF',
                email: 'customer@example.com', 
                tx_ref: `tx-${Date.now()}`, 
                phone_number: phone, 
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

        // Debug: Print the exact response from Flutterwave
        console.log("FLW RESPONSE:", JSON.stringify(response.data, null, 2));

        // Flutterwave might return a link for standard checkout, OR it might be a direct charge
        const paymentLink = response.data?.data?.link || response.data?.meta?.authorization?.redirect;

        if (paymentLink) {
            // If there is a hosted page link, send it to the frontend
            return res.json({
                success: true,
                paymentLink: paymentLink
            });
        } else {
            // If there is no link, it's a direct charge (USSD Push)
            return res.json({
                success: true,
                isDirectCharge: true,
                message: 'Payment initiated. Please check your phone for the PIN prompt.'
            });
        }

    } catch (error) {
        console.error('FLUTTERWAVE ERROR:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
}
