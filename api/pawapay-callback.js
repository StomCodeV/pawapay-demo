const response = await axios.post(
    'https://api.sandbox.pawapay.io/v2/deposits',
    {
        depositId: `test_${Date.now()}`, // Use depositId, not checkoutId
        amount: amount.toString(),
        currency: 'RWF',
        payer: {
            type: 'MMO',
            accountDetails: {
                phoneNumber: phone,
                provider: provider
            }
        }
    },
    {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
);
