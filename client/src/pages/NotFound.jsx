import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center mt-5 align-items-center">
      <FaExclamationTriangle className="text-danger" size="5em" />
      <h1>404</h1>
      <p className="lead">Sorry, this page doesn't exist!</p>
      <Link to={"/"} className="btn btn-primary">
        Go Back
      </Link>
    </div>
  );
};

export default NotFound;
