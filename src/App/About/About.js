import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

// Import images directly
import person1 from '../../assets/person1.png';
import person2 from '../../assets/person2.png';
import person3 from '../../assets/person3.png';

const About = () => {
  const navigate = useNavigate();

  const teamMembers = [
    { name: 'Alice Johnson', role: 'CEO', imageUrl: person1 },
    { name: 'Bob Smith', role: 'CTO', imageUrl: person2 },
    { name: 'Catherine Lee', role: 'CFO', imageUrl: person3 },
  ];

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, p: 4, borderRadius: 2 }}>
      {/* Back Button */}
      <Button variant="link" onClick={handleBackClick} className="p-0">
        <FaArrowLeft size={20} />
      </Button>

      {/* Header */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: '#3f51b5', fontWeight: 'bold', textTransform: 'uppercase', mb: 4 }}
      >
        About Us
      </Typography>

      {/* Our Mission Section */}
      <section style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '40px' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1565c0' }}>
          Our Mission
        </Typography>
        <Typography variant="body1">
          Our mission is to deliver innovative solutions that empower our clients to succeed in a rapidly changing digital landscape.
        </Typography>
      </section>

      {/* Our Team Section */}
      <section>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1565c0' }}>
          Our Team
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={member.imageUrl}
                  alt={member.name}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{member.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{member.role}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </section>

      {/* Our Story Section */}
      <section style={{ backgroundColor: '#f1f8e9', padding: '20px', borderRadius: '8px', marginTop: '40px' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
          Our Story
        </Typography>
        <Typography variant="body1">
          Since our founding, we have grown from a small team to an industry leader in tech solutions, always staying true to our values and mission.
        </Typography>
      </section>
    </Container>
  );
};

export default About;
