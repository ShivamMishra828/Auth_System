const { User } = require("../models");
const CrudRepository = require("./crud-repository");

// Define a user-specific repository class extending CrudRepository
class UserRepository extends CrudRepository {
    // Constructor to initialize the repository with the User model
    constructor() {
        super(User); // Call the CrudRepository constructor with the User model
    }
}

// Export the UserRepository class
module.exports = UserRepository;
