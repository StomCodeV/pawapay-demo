const response = await axios.post(
    'https://api.sandbox.pawapay.io/v2/checkouts',
    {
        checkoutId: `test_${Date.now()}`,
        returnUrl: 'https://example.com',
        returnMethod: 'INSTANT',
        defaultLanguage: 'en',
        countries: ['RWA'],
        expiresAfter: 60,
        amounts: [{
            country: 'RWA',
            currency: 'RWF',
            amount: amount.toString() // PawaPay expects the amount as a string
        }],
        payer: {
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
