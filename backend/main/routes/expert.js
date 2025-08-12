const express = require('express');
const router = express.Router();

const experts = [
  {
    id: 'expert1',
    email: 'emoji82826@gmail.com',
    password: 'Darshan@1',
    name: 'Dr. Fertilizer Expert',
    specialization: 'Fertilizer & Crop Management'
  },
  {
    id: 'superuser',
    email: 'admin@krishimitra.com',
    password: 'Admin@123',
    name: 'Super Admin',
    specialization: 'All Agricultural Areas'
  }
];

let callRequests = [];

// Expert login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const expert = experts.find(e => e.email === email && e.password === password);
    
    if (expert) {
      res.json({ 
        success: true, 
        expert: {
          id: expert.id,
          email: expert.email,
          name: expert.name,
          specialization: expert.specialization
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get call requests
router.get('/call-requests', (req, res) => {
  res.json({ success: true, requests: callRequests });
});

// Add call request
router.post('/call-request', (req, res) => {
  const { farmerName, issue, roomId, type = 'call' } = req.body;
  const request = {
    id: Date.now(),
    farmerName,
    issue,
    roomId,
    type,
    timestamp: new Date(),
    status: 'pending'
  };
  callRequests.push(request);
  res.json({ success: true, request });
});

// Add chat request
router.post('/chat-request', (req, res) => {
  const { farmerName, issue, roomId } = req.body;
  const request = {
    id: Date.now(),
    farmerName,
    issue,
    roomId,
    type: 'chat',
    timestamp: new Date(),
    status: 'pending'
  };
  callRequests.push(request);
  res.json({ success: true, request });
});

// Accept/Reject call request
router.post('/call-response', (req, res) => {
  const { requestId, action } = req.body;
  const request = callRequests.find(r => r.id == requestId);
  if (request) {
    request.status = action;
    res.json({ success: true, request });
  } else {
    res.status(404).json({ success: false, message: 'Request not found' });
  }
});

module.exports = router;