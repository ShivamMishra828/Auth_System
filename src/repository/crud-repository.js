class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    async findOne(query) {
        const response = await this.model.findOne(query);
        return response;
    }

    async findById(query) {
        const response = await this.model.findById(query);
        return response;
    }
}

module.exports = CrudRepository;
