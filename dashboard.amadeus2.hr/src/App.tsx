import React from 'react';
import {
  withAuthenticator,
  SignIn,
  SignOut,
  ConfirmSignIn,
  RequireNewPassword,
  VerifyContact,
} from 'aws-amplify-react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { List } from './components/list';
import { Item } from './components/item';
import { Create } from './components/create';
// @ts-ignore
import { Banners } from './components/banners';

const theme = {
  button: { backgroundColor: '#0e8fd5' },
};

const App = () => {
  const build = () => {
    fetch("https://api.netlify.com/build_hooks/5e735d2829cacec15b402c7f",
          { method: "post" })
  }

  return (
    <>
      <BrowserRouter>
        <nav>
          <div>
            <Link to='/' className='link'>
              Artikli
            </Link>
            <Link to='/settings/' className='link'>
              Postavke stranice
            </Link>
          </div>
          <div>
            <button onClick={() => build()}>Izgradi stranicu</button>
            (ovo moze trajati do 5 minuta)
          </div>
          <SignOut theme={theme} />
        </nav>
        <Route exact path='/' component={List} />
        <Route exact path='/create/' component={Create} />
        <Route exact path='/item/:id' component={Item} />
        <Route exact path='/settings/' component={Banners} />
      </BrowserRouter>
    </>
  );
};

export default withAuthenticator(
  App,
  false,
  // eslint-disable-next-line react/jsx-key
  [<SignIn />, <ConfirmSignIn />, <VerifyContact />, <RequireNewPassword />],
  null,
  theme,
);
