class ApiFeature {
    constructor(moongoseQuery, queryString) {
        this.moongoseQuery = moongoseQuery;
        this.queryString = queryString;
    }
    //2)filter
    filter() {
        const queryStringObjObj = { ...this.queryString }
        const executeFiled = ["page", "limit", "sort", "limitFields", "pagenation", "fields", "search"];
        executeFiled.forEach((filed) => { delete queryStringObjObj[filed] })

        //filter usting gte|gt|lte|lt
        let queryStr = JSON.stringify(queryStringObjObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        this.moongoseQuery = this.moongoseQuery.find(JSON.parse(queryStr))
        return this;
    }
    //3) sort 
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.moongoseQuery = this.moongoseQuery.sort(sortBy)
        } else {
            this.moongoseQuery = this.moongoseQuery.sort('-createdAt')
        } return this;
    }
    //4) fields limit "coulmn select"  
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.moongoseQuery = this.moongoseQuery.select(fields)
        } else {
            this.moongoseQuery = this.moongoseQuery.select('-__v')
        }
        return this;
    }

    // 5) search   
    search(modelName) {
        if (this.queryString.search) {
            let querys = {};
            if (modelName === "billModel") {
                querys = { customerName: { $regex: this.queryString.search, $options: "i" } }

            }
            else {
                querys = { name: { $regex: this.queryString.search, $options: "i" } }
            }
            this.moongoseQuery = this.moongoseQuery.find(querys)
        }
        return this;
    }
    //2)pagination
    pagenation(countDocument) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;
        // pagenation result
        const pagenation = {}
        pagenation.currentPge = page;
        pagenation.limit = limit;
        pagenation.numberOfPage = Math.ceil(countDocument / limit)
        //next page
        if (endIndex < countDocument) {
            pagenation.next = page + 1;
        }
        if (skip > 0) {
            pagenation.prev = page - 1;
        }



        this.moongoseQuery = this.moongoseQuery.skip(skip).limit(limit)
        this.pagenationResult = pagenation;
        return this
    }

}

export default ApiFeature;