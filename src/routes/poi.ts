import express from 'express';
import { getRepository } from 'typeorm';
import { PointOfInterest } from '../entity/PointOfInterest';

const router = express.Router();

// Get all POIs
router.get('/', async (req, res) => {
  try {
    console.log("-req: " + JSON.stringify(req));
    const poiRepository = getRepository(PointOfInterest);
    const pois = await poiRepository.find();
    res.json(pois);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching POIs' });
  }
});

// Get POIs within radius
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;
    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);
    const rad = parseFloat(radius as string);

    if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
      return res.status(400).json({ message: 'Invalid parameters' });
    }

    const poiRepository = getRepository(PointOfInterest);
    
    // Using Postgres earth_distance function to find POIs within radius
    const pois = await poiRepository
      .createQueryBuilder('poi')
      .where(
        `earth_distance(
          ll_to_earth($1, $2),
          ll_to_earth(poi.latitude, poi.longitude)
        ) <= $3`,
        [lat, lon, rad * 1000] // Convert km to meters
      )
      .getMany();

    res.json(pois);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nearby POIs' });
  }
});

// Create POI
router.post('/', async (req, res) => {
  try {
    console.log("-req.body: " + JSON.stringify(req.body));
    const poiRepository = getRepository(PointOfInterest);
    const poi = poiRepository.create(req.body);
    await poiRepository.save(poi);
    res.status(201).json(poi);
  } catch (error) {
    res.status(500).json({ message: 'Error creating POI' });
  }
});

// Update POI
router.put('/:id', async (req, res) => {
  try {
    const poiRepository = getRepository(PointOfInterest);
    const poi = await poiRepository.findOne({ where: { id: req.params.id } });
    
    if (!poi) {
      return res.status(404).json({ message: 'POI not found' });
    }

    poiRepository.merge(poi, req.body);
    const result = await poiRepository.save(poi);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating POI' });
  }
});

// Delete POI
router.delete('/:id', async (req, res) => {
  try {
    const poiRepository = getRepository(PointOfInterest);
    const result = await poiRepository.delete(req.params.id);
    
    if (result.affected === 0) {
      return res.status(404).json({ message: 'POI not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting POI' });
  }
});

export default router;