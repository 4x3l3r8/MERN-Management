import { gql } from "@apollo/client";

const GET_PROJECTS = gql`
    query projects {
        projects {
            id
            name
            status
            client{
                id
            }
        }
}`

const GET_PROJECT = gql`
    query getProject($id: ID!){
    project(id:$id){
        id
        name
        description
        status
        client{
            name
            email
            phone
            id
        }
    }
}`

export { GET_PROJECTS, GET_PROJECT }