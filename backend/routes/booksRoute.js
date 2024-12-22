import express from 'express';
import { Book } from '../models/bookModel.js';

const router  = express.Router();


router.post('/', async (request,response)=> {
    try{
        if(
        !request.body.title ||
        !request.body.author ||
        !request.body.publishYear
){
        
        return response.status(400).send({
            message: 'Send all required fields: title,author,publishYear',
        });
}
    const newBook = {
        title: request.body.title,
        author: request.body.author,
        publishYear: request.body.publishYear,
    };

    const book =await Book.create(newBook);
    return response.status(201).send (book);
    } catch (error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

router.get('/',async (request,response)=> {
    try{
        const books =await Book.find({});
        return response.status(200).json ({
            count: books.length,
            data: books
        });
    } catch (error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        // Fetch the book by its ID
        const book = await Book.findById(id);

        // If no book is found, return a 404 error
        if (!book) {
            return response.status(404).json({ message: 'Book not found' });
        }

        // Return the book details
        return response.status(200).json(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

router.put('/:id', async (request, response) => {
    try {
        // Validate required fields
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }

        const { id } = request.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: 'Invalid ID format' });
        }

        // Find and update the book
        const result = await Book.findByIdAndUpdate(id, request.body, { new: true });

        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }

        return response.status(200).json({
            message: 'Book updated successfully',
            data: result, // Include updated book data if needed
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Book.findByIdAndUpdate(id);

        // If no book is found, return a 404 error
        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }
        return response.status(200).json({
            message: 'Book deleted successfully'});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;