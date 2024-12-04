import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card, Spinner } from 'react-bootstrap';
import { FaEdit, FaPlus, FaEye, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AddJobModal from '../AddJobDescription/AddJobDescription';
import api from '../../api/api';
import './JobDescription.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);

  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const storedUserDetails = JSON.parse(localStorage.getItem('userDetails'));
    setUserDetails(storedUserDetails);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = jobs.filter((job) =>
      job.jobPostingName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleAddJob = () => {
    setEditMode(false);
    setJobToEdit(null);
    setShowModal(true);
  };

  const handleEditJob = (job) => {
    setEditMode(true);
    setJobToEdit(job);
    setShowModal(true);
  };

  const handleViewJob = (jobId) => {
    navigate(`/layout/viewjob/${jobId}`);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${jobId}`);
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job.');
      }
    }
  };

  const handleJobAdded = () => {
    fetchJobs();
    setShowModal(false);
  };

  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return `${text.substring(0, length)}...`;
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!userDetails) {
    return <div>Loading user details...</div>;
  }

  return (
    <Container className="pt-5">
      <Row className="align-items-center mb-4">
        <Col xs={12} className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Button
              variant="link"
              onClick={() => navigate(-1)}
              className="p-0 me-2"
              style={{ textDecoration: 'none', color: '#007bff' }}
            >
              <FaArrowLeft />
            </Button>
            <h2 className="job-list-heading m-0">Job Details</h2>
          </div>
          {userDetails.role !== 'employee' && (
            <div className="text-end">
              <Button variant="primary" className="me-2" onClick={handleAddJob}>
                <FaPlus /> Add Job
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search jobs by title"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5" style={{ height: '300px' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row>
            {currentJobs.map((job) => (
              <Col key={job._id} md={6} lg={4} className="mb-4">
                <Card className="job-card shadow-sm same-height">
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      {job.jobPostingName}
                      <div className="d-flex gap-2 align-items-center">
                        <Button
                          variant="link"
                          onClick={() => handleViewJob(job.jobId)}
                          className="text-primary p-0"
                          title="View Job"
                        >
                          <FaEye />
                        </Button>
                        {userDetails.role !== 'employee' && (
                          <>
                            <Button
                              variant="link"
                              onClick={() => handleEditJob(job)}
                              className="text-primary p-0"
                              title="Edit Job"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="link"
                              onClick={() => handleDeleteJob(job.jobId)}
                              className="text-danger p-0"
                              title="Delete Job"
                            >
                              <FaTrash />
                            </Button>
                          </>
                        )}
                      </div>
                    </Card.Title>
                    <Card.Text>
                      <strong>Description:</strong> {truncateText(job.description, 100)}{' '}
                      {job.description.length > 100 && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleViewJob(job.jobId)}
                          className="text-primary p-0"
                        >
                          Read more
                        </Button>
                      )}
                      <br />
                      <strong>Salary:</strong> {job.salaryRange} <br />
                      <strong>Experience:</strong> {job.experienceRequired}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <nav aria-label="Page navigation example" className="pagination-container fixed-bottom">
            <ul className="pagination justify-content-end pe-3">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </Button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <Button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </Button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <Button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &raquo;
                </Button>
              </li>
            </ul>
          </nav>
        </>
      )}

      {userDetails.role !== 'employee' && (
        <AddJobModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onAddJob={handleJobAdded}
          onEditJob={handleJobAdded}
          editMode={editMode}
          jobToEdit={jobToEdit}
        />
      )}
    </Container>
  );
};

export default JobList;
