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
        if (email && isEmail(email) && message) {
            request('https://api.amadeus2.hr', messageQuery, {
                email,
                message,
            }).then(data => setResponse(data.sendMessage));
        }
    };

    return (
        <section>
            <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <textarea
                placeholder='Message'
                value={message}
                onChange={e => setMessage(e.target.value)}
            />
            <button
                type='submit'
                onClick={() => submitMessage()}
                disabled={!email || !isEmail(email) || !message}
            >
                submit
            </button>
            {response && <p>{response}</p>}
        </section>
    );
};
