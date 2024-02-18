class ApiFeature {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }
    //2)filter
    filter() {
        const queryStringObjObj = { ...this.queryString }
        const executeFiled = ["page", "limit", "sort", "fields", "search"];
        executeFiled.forEach((filed) => { delete queryStringObjObj[filed] })

        //filter using gte|gt|lte|lt
        let queryStr = JSON.stringify(queryStringObjObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr))
        return this;
    }
    //3) sort 
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy)
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt')
        } return this;
    }
    //4) fields limit "column select"
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields)
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v')
        }
        return this;
    }

    // 5) search   
    search(modelName) {
        if (this.queryString.search) {
            let query = {};
            if (modelName === "billModel") {
                query = { customerName: { $regex: this.queryString.search, $options: "i" } }

            }
            else {
                query = { name: { $regex: this.queryString.search, $options: "i" } }
            }
            this.mongooseQuery = this.mongooseQuery.find(query)
        }
        return this;
    }
    //2)pagination
    pagination(countDocument) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 20;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;
        // pagination result
        const pagination = {}
        pagination.currentPge = page;
        pagination.limit = limit;
        pagination.numberOfPage = Math.ceil(countDocument / limit)
        //next page
        if (endIndex < countDocument) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.prev = page - 1;
        }



        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
        this.paginationResult = pagination;
        return this
    }

}

export default ApiFeature;