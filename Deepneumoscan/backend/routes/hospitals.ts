import { Router } from 'express';

const router = Router();

// Mock hospital data (replace with real API in production)
const mockHospitals = [
  {
    id: 1,
    name: "City General Hospital",
    address: "123 Main St, Bangalore",
    phone: "+91 80 1234 5678",
    distance: "2.5 km",
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: 2,
    name: "Lung Care Center",
    address: "456 Health Ave, Mysore",
    phone: "+91 821 9876 5432",
    distance: "15.3 km",
    lat: 12.2958,
    lng: 76.6394,
  },
  {
    id: 3,
    name: "PneumoSpecialists Clinic",
    address: "789 Chest Rd, Chennai",
    phone: "+91 44 5555 6666",
    distance: "8.1 km",
    lat: 13.0827,
    lng: 80.2707,
  },
];

router.get('/', async (req, res) => {
  try {
    // In real app: get user location via geolocation API
    // Here, we return mock data
    res.json(mockHospitals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

export default router;