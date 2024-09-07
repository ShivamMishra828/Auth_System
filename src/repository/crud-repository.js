// Define a base CRUD repository class
class CrudRepository {
    // Constructor to initialize the repository with a model
    constructor(model) {
        this.model = model;
    }

    // Method to create a new document
    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    // Method to find a single document by a query
    async findOne(query) {
        const response = await this.model.findOne(query);
        return response;
    }

    // Method to find a document by ID
    async findById(query) {
        const response = await this.model.findById(query);
        return response;
    }
}

// Export the CrudRepository class
module.exports = CrudRepository;
