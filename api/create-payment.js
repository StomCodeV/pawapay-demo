const response = await axios.post(
    'https://api.sandbox.pawapay.io/v2/checkouts',
    {
        checkoutId: `test_${Date.now()}`,
        returnUrl: 'https://example.com',
        returnMethod: 'INSTANT', // Recommended per docs
        defaultLanguage: 'en',
        countries: ['RWA'],
        expiresAfter: 60,
        amounts: [{ 
            country: 'RWA', 
            currency: 'RWF', 
            amount: amount.toString() // <-- Must be a string
        }],
        payer: { // <-- This entire "payer" object is required for checkouts
            type: 'MMO',
            accountDetails: {
                phoneNumber: phone,
                provider: provider,
                allowCustomerToOverride: true
            }
        },
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
