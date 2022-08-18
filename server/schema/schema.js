// Mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLInputObjectType, GraphQLError, GraphQLEnumType } = require('graphql');

// ClentType object declaration
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find(parent.projectId).exec()
            }
        }
    })
})
// Client Input Type object declaration
const ClientTypeInput = new GraphQLInputObjectType({
    name: 'ClientInput',
    fields: () => ({
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        email: {
            type: new GraphQLNonNull(GraphQLString)
        },
        phone: {
            type: new GraphQLNonNull(GraphQLString)
        },
        projectId: {
            type: new GraphQLList(GraphQLID)
        }
    })
})

// ProjectType object declaration
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId);
            }
        }
    })
})

// Project Input type declaration
const ProjectTypeInput = new GraphQLInputObjectType({
    name: 'ProjectInput',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: {
            type: new GraphQLEnumType({
                name: 'ProjectStatus',
                values: {
                    'new': { value: 'Not Started' },
                    'progress': { value: 'In Progress' },
                    'completed': { value: 'Completed' },
                }
            }),
            defaultValue: 'Not Started',
        },
        clientId: { type: new GraphQLNonNull(GraphQLID) },
    })
})




const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find()
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id);
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find();
            }
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id);
            }
        }
    }
});

const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    description: "Base Mutation for both clients and projects",
    fields: {
        // Create a client
        addClient: {
            type: ClientType,
            args: {
                input: {
                    type: ClientTypeInput
                }
            },
            resolve(parent, args) {
                try {
                    // create new client from FE data passed
                    const client = new Client({
                        name: args.input.name,
                        email: args.input.email,
                        phone: args.input.phone,
                    })

                    // save client
                    return client.save();
                } catch (err) {
                    return new GraphQLError({
                        message: err.message,
                    })
                }
            }
        },

        // Delete a client
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                try {
                    Project.find({
                        clientId: args.id
                    }).then((projects) => {
                        projects.forEach((project) => {
                            project.remove();
                        })
                    })
                    // delete client
                    return Client.findByIdAndRemove(args.id);
                } catch (err) {
                    return new GraphQLError({
                        message: err.message,
                    })
                }
            }
        },

        // Add Project
        addProject: {
            type: ProjectType,
            args: {
                input: {
                    type: ProjectTypeInput
                }
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.input.name,
                    description: args.input.description,
                    status: args.input.status,
                    clientId: args.input.clientId,
                })

                return project.save();
            }
        },

        // delete Project
        deleteProject: {
            type: ProjectType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Project.findOneAndRemove(args.id)
            }
        },

        // update a project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                input: {
                    type: ProjectTypeInput,
                }
            },
            resolve(parent, args) {
                // get data to update
                return Project.findOneAndUpdate(args.id, args.input, { new: true });
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
})