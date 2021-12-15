import createAuth0Client from "@auth0/auth0-spa-js";
import React,  { useEffect, useState }  from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, useHistory } from "react-router-dom";

import './index.css';

function App() {
  const [, setAuth0] = useState();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const client = await createAuth0Client({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
          domain:  process.env.REACT_APP_AUTH0_DOMAIN,
          redirect_uri: window.location.origin
        });
        setAuth0(client);
        if (
          window.location.search.includes("code=") &&
          window.location.search.includes("state=")
        ) {
          await client.handleRedirectCallback();
          history.push(window.location.pathname)
        }
        const authed = await client.isAuthenticated();
        if (authed) {
          const [currentUser, token] = await Promise.all([
            client.getUser(),
            client.getTokenSilently()
          ]);
          console.log('currentUser, token', { currentUser, token });
        } else {
          await client.loginWithRedirect()
        }
      } catch (error) {
        console.error('error', error);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      Test Auth App
    </div>
  );
}

// WORKS AS EXPECTED (i.e. React <= 17)
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// THROWS AN ERROR (i.e. React >= 18)
// const root = ReactDOM.createRoot(document.getElementById('root'))

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );
