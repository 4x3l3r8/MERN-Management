import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { FaList } from "react-icons/fa";
import { ADD_PROJECT } from "../mutations/projectMutations";
import { GET_CLIENTS } from "../queries/clientQueries";
import { GET_PROJECTS } from "../queries/projectQueries";

const AddProjectModal = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("-1");
  const [status, setStatus] = useState("new");

  // get existing clients
  const { loading, error, data } = useQuery(GET_CLIENTS);

  let project = {
    name,
    description,
    status,
    clientId,
  };

  //   mutation to add project
  const [addProject] = useMutation(ADD_PROJECT, {
    variables: { project: project },
    update(cache, { data: { addProject } }) {
      const { projects } = cache.readQuery({ query: GET_PROJECTS });
      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: projects.concat([addProject]) },
      });
    },
  });

  //   fire Add project
  const onSubmit = async (e) => {
    e.preventDefault();

    if (name === "" || clientId === "" || status === "" || description === "") {
      return alert("Please fill all fields");
    }

    await addProject();

    setDescription("");
    setName("");
    setStatus("new");
    setClientId("-1");
  };

  return (
    <>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProjectModal">
        <div className="d-flex align-items-center">
          <FaList className="icon" />
          <div>New Project</div>
        </div>
      </button>

      <div className="modal fade" id="addProjectModal" tabIndex="-1" aria-labelledby="addProjectModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addProjectModalLabel">
                New Project
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input required type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">description</label>
                  <textarea
                    required
                    type="textare"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="form-select">
                    <option value="new">Not Started</option>
                    <option value="progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Client</label>
                  <select id="status" value={clientId} onChange={(e) => setClientId(e.target.value)} className="form-select">
                    <option value="-1">Select Client</option>
                    {!loading ? (
                      !error ? (
                        data.clients.map((client) => (
                          <option value={client.id} key={client.id}>
                            {client.name}
                          </option>
                        ))
                      ) : (
                        <option value="0">Failed to load clients!</option>
                      )
                    ) : (
                      <option value={"0"}>loading clients...</option>
                    )}
                  </select>
                </div>

                <div className="modal-footer justify-content-between mt-6">
                  <button type="submit" className="btn btn-secondary" data-bs-dismiss="modal">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProjectModal;
