import { useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import ClientInfo from "../components/ClientInfo";
import DeleteProjectButton from "../components/DeleteProjectButton";
import Spinner from "../components/Spinner";
import EditProjectForm from "../components/EditProjectForm";
import { GET_PROJECT } from "../queries/projectQueries";
import { FaPen } from "react-icons/fa";

const Project = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { id },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong!</p>;
  return (
    <>
      {!loading && !error && (
        <div className="mx-auto w-75 card p-5">
          <div className="d-flex w-100 justify-content-between">
            <Link to={"/"} className="btn btn-light btn-sm w-25 d-inline">
              Back
            </Link>
            <button type="button" className="btn btn-info ms-auto mr-3" data-bs-toggle="modal" data-bs-target="#editProjectModal">
              <div className="d-flex align-items-center">
                <FaPen className="icon" />
              </div>
            </button>
            <DeleteProjectButton projectId={id} />
          </div>

          <h1>{data.project.name}</h1>
          <p>{data.project.description}</p>

          <h5 className="mt-3">Project Status</h5>
          <p className="lead">{data.project.status}</p>
          <hr />
          <ClientInfo client={data.project.client} />
          <EditProjectForm project={data.project} />
        </div>
      )}
    </>
  );
};

export default Project;
