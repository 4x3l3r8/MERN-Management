import { useMutation } from "@apollo/client";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { ADD_CLIENT } from "../mutations/clientMutations";
import { GET_CLIENTS } from "../queries/clientQueries";

const AddClientModal = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  let user = {
    name,
    email,
    phone,
  };

  const [addClient] = useMutation(ADD_CLIENT, {
    variables: { client: user },
    update(cache, { data: { addClient } }) {
      const { clients } = cache.readQuery({ query: GET_CLIENTS });
      cache.writeQuery({
        query: GET_CLIENTS,
        data: { clients: clients.concat([addClient]) },
      });
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (name === "" || email === "" || phone === "") {
      return alert("Please fill all fields");
    }

    await addClient();

    setEmail("");
    setName("");
    setPhone("");
  };

  return (
    <>
      <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addClientModal">
        <div className="d-flex align-items-center">
          <FaUser className="icon" />
          <div>Add Client</div>
        </div>
      </button>

      <div className="modal fade" id="addClientModal" tabIndex="-1" aria-labelledby="addClientModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addClientModalLabel">
                Add Client
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
                  <label className="form-label">Email</label>
                  <input required type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input required type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" />
                </div>
                {/* <button className="btn btn-secondary" type="submit" data-bs-dismiss="modal">
                  Submit
                </button> */}
                <div className="modal-footer justify-content-between mt-6">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
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

export default AddClientModal;
