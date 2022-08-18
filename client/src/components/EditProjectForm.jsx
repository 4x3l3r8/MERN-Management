import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { EDIT_PROJECT } from "../mutations/projectMutations";
import { GET_CLIENTS } from "../queries/clientQueries";
import { GET_PROJECT } from "../queries/projectQueries";

const EditProjectForm = ({ project }) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [clientId, setClientId] = useState(project.client !== null ? project.client.id : "-1");
  const [status, setStatus] = useState("new");

  // get existing clients
  const { loading, error, data } = useQuery(GET_CLIENTS);

  let projectBody = {
    name,
    description,
    status,
    clientId,
  };

  const [editProject] = useMutation(EDIT_PROJECT, {
    variables: {
      id: project.id,
      project: projectBody,
    },
    refetchQueries: [{ query: GET_PROJECT, variables: { id: project.id } }],
  });

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      if (name === "" || clientId === "" || status === "" || description === "") {
        alert("Please fill all fields");
      }

      await editProject();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  return (
    <div className="modal fade" id="editProjectModal" tabIndex="-1" aria-labelledby="editProjectModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editProjectModalLabel">
              Update Project Details
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

              <button type="submit" className="btn btn-success" data-bs-dismiss="modal">
                Save changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProjectForm;
