import React, { useState, useContext } from 'react';
import { navigate } from 'gatsby';
import { request } from 'graphql-request';
import { Helmet } from 'react-helmet';
import { SharedContext } from '../state/shared';
import { Layout } from '../components/layout';

const messageQuery = `mutation($email: String!, $message: String!) {
	sendReceipt(email: $email, message: $message)
}`;

const checkout = ({ pageContext }) => {
    const { language } = pageContext;
    const { cart, convertToCurrency } = useContext(SharedContext);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [number, setNumber] = useState('');

    const submit = method => {
        if (email && name && address && number) {
            const message = `
Podaci o narudžbi:

${cart
    .map(item => {
        return `${item.name[language]}, ${
            item.quantity
        } kom., ${convertToCurrency(item.discountedPrice)}\n`;
    })
    .join('')}
Ukupno: ${convertToCurrency(
                cart.reduce(
                    (acc, obj) => acc + obj.discountedPrice * obj.quantity,
                    0
                )
            )}

Metoda plaćanja: ${method}

Kupac:
${name}
${email}
${number}
${address}

Za više informacija kontaktirajte nas:

Amadeus II d.o.o.
Vladimira Nazora 45, 20340 Ploče
info@pioneer.hr
amadeus@pioneer.hr
+385-95-9120-211
+385-20-670-111
OIB: 78248871009
IBAN: HR0823400091100187471
`;
            request('https://api.amadeus2.hr', messageQuery, {
                email,
                message,
                subject: 'Narudžba na Amadeus 2 Webshop-u',
            });
        }
    };

    return (
        <Layout language={language}>
            <Helmet defer={false}>
                <title>Checkout</title>
            </Helmet>
            <h1>Checkout</h1>
            <form className='checkout_form'>
                <label>
                    Ime
                    <input
                        type='text'
                        onChange={e => setName(e.target.value)}
                        value={name}
                    />
                </label>
                <label>
                    Email
                    <input
                        type='email'
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                    />
                </label>
                <label>
                    Broj
                    <input
                        type='text'
                        onChange={e => setNumber(e.target.value)}
                        value={number}
                    />
                </label>
                <label>
                    Adresa
                    <textarea
                        onChange={e => setAddress(e.target.value)}
                        value={address}
                        rows={4}
                    />
                </label>
                <div className='buttons'>
                    <input
                        type='submit'
                        value='Plaćanje uplatom po ponudi'
                        disabled={!cart.length}
                        className='buy_button'
                        onClick={e => {
                            e.preventDefault();
                            submit('Uplatom po ponudi');
                            navigate('/uplata_po_ponudi/');
                        }}
                    />
                    <span>ili</span>
                    <input
                        type='submit'
                        value='Plaćanje otkupninom'
                        disabled={!cart.length}
                        className='buy_button'
                        onClick={e => {
                            e.preventDefault();
                            submit('Otkupninom');
                            navigate('/success/');
                        }}
                    />
                </div>
            </form>
        </Layout>
    );
};

export default checkout;
