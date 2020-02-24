// FIXME i18n
import React, { useContext, useState, useEffect } from 'react';
import { request } from 'graphql-request';
import isEmail from 'validator/es/lib/isEmail';
import { SharedContext } from '../state/shared';

const messageQuery = `mutation($email: String!, $message: String!) {
  sendMessage(email: $email, message: $message)
}`;

export const Contact = () => {
    const { language } = useContext(SharedContext);

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState(null);

    const submitMessage = () => {
        setResponse('loading');
        if (email && isEmail(email) && message) {
            request('https://api.amadeus2.hr', messageQuery, {
                email,
                message,
            }).then(data => setResponse(data.sendMessage));
        }
    };

    const getInfo = status => {
        switch (status) {
            case 'success':
                return 'Succesfuly sent message.';
            case 'failure':
                return 'There was error, please try again.';
            case 'loading':
                return 'Sending message.';
        }
    };

    return (
        <section>
            <h2 className='featured_heading'>Kontaktirajte nas</h2>
            <div className='form_heading'>
                <input
                    type='email'
                    placeholder='Vaš email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className='contact_email'
                />
                <button
                    type='submit'
                    onClick={() => submitMessage()}
                    disabled={!email || !isEmail(email) || !message}
                    className='contact_submit'
                >
                    Pošalji
                </button>
            </div>
            <textarea
                placeholder='Poruka'
                value={message}
                onChange={e => setMessage(e.target.value)}
                className='contact_textarea'
                rows={5}
            />
            {response && <p className='contact_info'>{getInfo(response)}</p>}
        </section>
    );
};
