import productData from "../data/products.js";


class ApiFilters{

    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
      }
    
      search() {
        const keyword = this.queryStr.keyword
          ? {
              name: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            }
          : {};
    
        this.query = this.query.find({ ...keyword });
        return this;
      }
    
      filter() {
        const queryCopy = { ...this.queryStr };
    
        // Fields to remove
        const fieldsToRemove = ["keyword", "page", "pageNumber"];
        fieldsToRemove.forEach((el) => delete queryCopy[el]);
    
        // Advance filter for price, ratings etc
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
      }
    
      pagination(resPerPage) {
        const currentPage = Number(this.queryStr.pageNumber) || 1;
        const skip = resPerPage * (currentPage - 1);
    
        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
      }



}


export default ApiFilters;