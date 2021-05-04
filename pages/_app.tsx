import '../styles/globals.css'

import {createClient, Provider} from 'urql';

const client = createClient({
    url: 'http://localhost:3000/graphql',
});

function MyApp({Component, pageProps}) {
    return (
        <Provider value={client}>
            <Component {...pageProps} />
        </Provider>
    )
}

export default MyApp
