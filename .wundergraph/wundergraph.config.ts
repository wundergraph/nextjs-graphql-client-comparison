import {
    Application,
    configureWunderGraphApplication,
    cors,
    introspect,
    IntrospectionPolicy,
    templates
} from "@wundergraph/sdk";


const spaceX = introspect.graphql({
    url: "https://api.spacex.land/graphql/",
    source: IntrospectionPolicy.Network,
});

/*
uncomment this section to create an API from multiple federated GraphQL upstreams

const federatedApi = introspect.federation({
    source: IntrospectionPolicy.Network,
    upstreams: [
        {
            url: "http://localhost:4001/graphql"
        },
        {
            url: "http://localhost:4002/graphql"
        },
        {
            url: "http://localhost:4003/graphql"
        },
        {
            url: "http://localhost:4004/graphql",
            // You can use headers to securely communicate with GraphQL upstreams
            headers: {
                Authorization: "Bearer token",
                "CustomHeader": "foo"
            }
        },
    ]
});*/

/*
uncomment this section to create an API from an OpenAPI Specification

const openAPI = introspect.openApi({
    source: {
        kind: "file",
        filePath: "my_api_oas.json"
    },
    headers: {
        // Add any headers for protected REST APIs
        Authorization: "Bearer token"
    }
});*/


/*
uncomment this section to create an API from a GraphQL upstream

const graphQLAPI = introspect.graphql({
    source: IntrospectionPolicy.Network,
    url: "http://localhost:4000",
    headers: {
        // You can use Headers for introspection so that protected APIs can be used too.
        Authorization: "Bearer token"
    }
});*/

const myApplication = new Application({
    name: "app",
    apis: [
        spaceX,
        /*federatedApi,
        openAPI,
        graphQLAPI*/
    ],
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
    application: myApplication,
    codeGenerators: [
        {
            templates: [
                // use all the typescript react templates to generate a client
                ...templates.typescript.all,
                templates.typescript.namespaces,
                templates.typescript.operations,
                templates.typescript.mocks,
                templates.typescript.linkBuilder,
                ...templates.typescript.react,
            ],
            // create-react-app expects all code to be inside /src
            // path: "../frontend/src/generated",
        }
    ],
    cors: {
        ...cors.allowAll,
        allowedOrigins: process.env.NODE_ENV === "production" ?
            [
                // change this before deploying to production to the actual domain where you're deploying your app
                "http://localhost:3000",
            ] :
            [
                "http://localhost:3003",
            ]
    },
});
