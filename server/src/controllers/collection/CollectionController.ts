import { type RequestHandler } from 'express'
import joi from '../../utils/joi'
import Collection from '../../models/Collection' // Assuming Collection model exists

// Create a new collection
const createCollection: RequestHandler = async (req, res, next) => {
  try {
    const { name, isFavorite, dueDate, icon } = req.body;

    // Ensure `req.auth.uid` is being extracted correctly
    if (!req.auth?.uid) {
      return next({ statusCode: 401, message: 'Unauthorized. No user ID found.' });
    }

    const collection = new Collection({
      name,
      account: req.auth.uid, // Assign logged-in user's account ID
      isFavorite: isFavorite || false,
      dueDate,
      icon: icon || 'person', // Use provided icon or default
      tasks: [],
    });

    await collection.save();

    res.status(201).json({
      message: 'Collection created successfully',
      data: collection,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Get all collections for the authenticated user
const getCollections: RequestHandler = async (req, res, next) => {
  try {
    const { uid } = req.auth || {}
    console.log(req.auth);
    
    const collections = await Collection.find({ account: uid })

    res.status(200).json({
      message: 'Collections fetched successfully',
      data: collections,
    })
  } catch (error) {
    console.log(error);
    next(error)
  }
}

// Update a collection
const updateCollection: RequestHandler = async (req, res, next) => {
  try {
    const validationError = await joi.validate(
      {
        name: joi.instance.string().optional(),
        isFavorite: joi.instance.boolean().optional(),
        dueDate: joi.instance.date().optional(),
        icon: joi.instance.string().optional(), // Add icon validation
      },
      req.body
    )

    if (validationError) return next(validationError)

    const { id: collectionId } = req.params
    const { uid } = req.auth || {}
    const updates = req.body

    const collection = await Collection.findOneAndUpdate(
      { _id: collectionId, account: uid },
      { $set: updates },
      { new: true }
    )

    console.log(req.params , uid);
    
    if (!collection) {
      return next({ statusCode: 404, message: 'Collection not found' })
    }

    res.status(200).json({
      message: 'Collection updated successfully',
      data: collection,
    })
  } catch (error) {
    next(error)
  }
}

// Delete a collection
const deleteCollection: RequestHandler = async (req, res, next) => {
  try {
    const {id: collectionId } = req.params
    const { uid } = req.auth || {}

    const collection = await Collection.findOneAndDelete({ _id: collectionId, account: uid })

    if (!collection) {
      return next({ statusCode: 404, message: 'Collection not found' })
    }

    res.status(200).json({
      message: 'Collection deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

export { createCollection, getCollections, updateCollection, deleteCollection }
