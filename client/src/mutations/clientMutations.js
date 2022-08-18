import { gql } from "@apollo/client";

const ADD_CLIENT = gql`
    mutation addClient($client: ClientInput!){
        addClient(input: $client){
            id
            name
            email
            phone
        }
    }
`

const DELETE_CLIENT = gql`
    mutation deleteClient($id: ID!){
        deleteClient(id: $id){
            id
            name
            email
            phone
        }
    }
`;

export { ADD_CLIENT, DELETE_CLIENT }