
# NextJS GraphQL Client comparison

This is a comparison of different GraphQL clients for NextJS.

Clients used:

- Apollo
- graphql-query
- urql
- WunderGraph

For each client, there's a branch so you can try out all the clients yourself.

To analyze the bundle size, run `yarn build`.

## Results

Client | gzip | difference | Time to Interactive | Largest Contentful Paint
--- | --- | --- | --- | ---
NextJS | 102,99kb | - | 1.8s | 1,9s
Apollo | 146,28kb | 43,29kb | 2,3s | 2,8s
graphql-request | 110,62kb | 7,63kb | 2,1s | 2,6s
urql | 119,94kb | 16,95kb | 2,2s | 2,4s
**WunderGraph** | **105,31kb** | **2,3kb** | **1,9s** | **2,1s**

Time to Interactive and Largest Contentful Paint was measured using Chrome Lighthouse test.

## It's more than just numbers

It's not just about the raw numbers.
There's a lot more to be said than just file size.

[Please read the accompanying Blog Post](http://wundergraph.com/blog/the_most_powerful_graphql_client_for_the_web_in_just_2kb) to get the full picture.

## Adding more clients

If you want to add another client to the comparison,
please open a PR that adds a new branch.