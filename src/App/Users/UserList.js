import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/getAll');
      setUsers(response.data.users);
      setFilteredUsers(response.data.users); // Initialize filteredUsers with all users
    } catch (error) {
      console.error('Error fetching users:', error.message);
      setAlertMessage('Failed to load users');
      setAlertVariant('danger');
      autoDismissAlert(); // Auto-dismiss alert for error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = users.filter((user) =>
      user.fullName.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase()) ||
      user.role.toLowerCase().includes(value.toLowerCase()) ||
      user.status?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Handle opening the edit modal
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Handle saving the updated user
  const handleSave = async () => {
    try {
      const { email, fullName, status } = selectedUser;
      // Ensure the payload includes the updated status
      await api.put('/user/edit', { email, fullName, status });
      setAlertMessage('User updated successfully');
      setAlertVariant('success');
      fetchUsers(); // Refresh user list
      setShowEditModal(false);
      autoDismissAlert(); // Auto-dismiss alert for success
    } catch (error) {
      console.error('Error updating user:', error.message);
      setAlertMessage('Failed to update user');
      setAlertVariant('danger');
      autoDismissAlert(); // Auto-dismiss alert for error
    }
  };

  // Auto-dismiss alert after 1 second
  const autoDismissAlert = () => {
    setTimeout(() => {
      setAlertMessage('');
    }, 1000);
  };

  // Handle input changes in the edit modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

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
            <h2 className="user-list-heading m-0">User Management</h2>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xs={12}>
          <Form.Control
            type="text"
            placeholder="Search users by name, email, role, or status"
            value={searchTerm}
            onChange={handleSearchChange}
            className="mb-3"
          />
        </Col>
      </Row>

      {alertMessage && (
        <Row>
          <Col xs={12}>
            <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
              {alertMessage}
            </Alert>
          </Col>
        </Row>
      )}

      {loading ? (
        <Row>
          <Col xs={12} className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xs={12}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => handleEdit(user)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form>
              <Form.Group controlId="formFullName" className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={selectedUser.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email (Read-Only)</Form.Label>
                <Form.Control type="email" value={selectedUser.email} readOnly />
              </Form.Group>
              <Form.Group controlId="formRole" className="mb-3">
                <Form.Label>Role (Read-Only)</Form.Label>
                <Form.Control type="text" value={selectedUser.role} readOnly />
              </Form.Group>
              <Form.Group controlId="formStatus" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={selectedUser.status} // Ensures the dropdown reflects the current status
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserList;
