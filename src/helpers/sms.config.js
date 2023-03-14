const axios = require("axios");

const sms = async () => {
    try {
        const response = await axios.post(
            'https://platform.devtest.ringcentral.com/restapi/v1.0/account/16502420200/extension/101/sms',
            '',
            {
                'text': 'hi',
                'to': [
                    {
                        'phoneNumber': '+923170288819'
                    }
                ]
            },
            {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                }
            }
        );

        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

// sms();