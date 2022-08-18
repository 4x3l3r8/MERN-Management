import { gql } from "@apollo/client";

const ADD_PROJECT = gql`
mutation addProject($project: ProjectInput!){
  addProject(input: $project){
    id
    name
    description
    status
    client{
      name
      email
      phone
    }
  }
}
`

const EDIT_PROJECT = gql`
mutation editProject($id: ID!, $project: ProjectInput!) {
  updateProject(id: $id, input: $project) {
    id
    name
    description
    status
    client{
      name
      email
      phone
    }
  }
}
`

const DELETE_PROJECT = gql`
mutation deleteProject($id: ID!){
  deleteProject(id: $id){
    id
    name
    status
    description
  }
}
`

export { ADD_PROJECT, DELETE_PROJECT, EDIT_PROJECT }