import express from 'express';
import checkBearerToken from '../middlewares/check-bearer-token';
import errorHandler from '../middlewares/error-handler';
import { createCollection, deleteCollection, getCollections, updateCollection } from '../controllers/collection/CollectionController';

// Initialize router
const router = express.Router();

// POST at route: http://localhost:8080/collections (Create a new collection)
router.post('/', [checkBearerToken], createCollection, errorHandler);

// GET at path: http://localhost:8080/collections (Get all collections)
router.get('/', [checkBearerToken], getCollections, errorHandler);

// PUT at path: http://localhost:8080/collections/:id (Update a collection)
router.put('/:id', [checkBearerToken], updateCollection, errorHandler);

// DELETE at path: http://localhost:8080/collections/:id (Delete a collection)
router.delete('/:id', [checkBearerToken], deleteCollection, errorHandler);

export default router;
