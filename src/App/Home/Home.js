import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheckCircle, faTimesCircle, faBan } from '@fortawesome/free-solid-svg-icons';
import api from '../../api/api';
import './Home.css';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [colorMap, setColorMap] = useState({});

  // Fetch jobs and candidates
  useEffect(() => {
    const fetchJobsAndCandidates = async () => {
      try {
        const [jobResponse, candidateResponse] = await Promise.all([
          api.get('/jobs'),
          api.get('/candidates'),
        ]);

        const jobData = jobResponse.data;
        const candidateData = candidateResponse.data;

        setJobs(jobData);
        setCandidates(candidateData);

        // Set the first job as default selected
        if (jobData.length > 0) {
          setSelectedJob(jobData[0]);
        }

        // Generate random colors for each job
        const generatedColors = {};
        jobData.forEach((job) => {
          generatedColors[job.jobPostingName] = generateRandomColor();
        });
        setColorMap(generatedColors);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchJobsAndCandidates();
  }, []);

  // Generate random colors for job titles
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Get filtered candidates for the selected job
  const getFilteredCandidates = () => {
    if (!selectedJob) return [];
    return candidates.filter((candidate) => candidate.jobId === selectedJob.jobId);
  };

  // Handle job click
  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  // Calculate stage counts
  const getStageCount = (stage) => {
    return getFilteredCandidates().filter((candidate) => candidate.stage === stage).length;
  };

  return (
    <Container fluid className="content pt-2 px-4">
      {/* Stage Count Cards */}
      <Row className="my-4">
        <Col xs={6} sm={3} className="mb-3">
          <Card className="card-in-progress shadow-sm border-left-primary stage-card">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faSpinner} className="icon mb-2" />
              <h6 className="mb-0">In Progress</h6>
              <h5 className="mt-2">{getStageCount('In Process')}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} sm={3} className="mb-3">
          <Card className="card-selected shadow-sm border-left-success stage-card">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faCheckCircle} className="icon mb-2" />
              <h6 className="mb-0">Selected</h6>
              <h5 className="mt-2">{getStageCount('Selected')}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} sm={3} className="mb-3">
          <Card className="card-cancelled shadow-sm border-left-danger stage-card">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faTimesCircle} className="icon mb-2" />
              <h6 className="mb-0">Cancelled</h6>
              <h5 className="mt-2">{getStageCount('Cancelled')}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} sm={3} className="mb-3">
          <Card className="card-rejected shadow-sm border-left-warning stage-card">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faBan} className="icon mb-2" />
              <h6 className="mb-0">Rejected</h6>
              <h5 className="mt-2">{getStageCount('Rejected')}</h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Job Postings and Candidate Details */}
      <Row>
        <Col lg={6} xs={12} className="mb-4">
          <h4>Job Postings</h4>
          {jobs.map((job) => (
            <Card
              key={job.jobId}
              className={`mb-3 shadow-sm job-wrapper same-height ${
                selectedJob?.jobId === job.jobId ? 'active-job' : ''
              }`}
              style={{
                borderLeft: `8px solid ${colorMap[job.jobPostingName]}`,
              }}
              onClick={() => handleJobClick(job)}
            >
              <Card.Body>
                <p className="card-text job-title">{job.jobPostingName}</p>
                <p className="card-description">{job.description}</p>
                <p className="card-updated">
                  Last Updated: {new Date(job.lastUpdated).toLocaleDateString()}
                </p>
              </Card.Body>
            </Card>
          ))}
        </Col>

        <Col lg={6} xs={12} className="mb-4">
          <h4>Candidate Details for {selectedJob?.jobPostingName || 'Selected Job'}</h4>
          {getFilteredCandidates().length > 0 ? (
            getFilteredCandidates().map((candidate, index) => (
              <Card
                key={index}
                className="mb-3 shadow-sm candidate-wrapper same-height"
                style={{
                  borderLeft: `8px solid ${colorMap[selectedJob?.jobPostingName]}`,
                }}
              >
                <Card.Body>
                  <p className="card-text">
                    {candidate.firstName} {candidate.lastName}
                  </p>
                  <p>Email: {candidate.email}</p>
                  <p>Mobile: {candidate.mobileNo}</p>
                  <p>Status: {candidate.stage}</p>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No candidates available for this job.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
