

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
        console.log('query string',queryStr);
        this.query = this.query.find(JSON.parse(queryStr));


        // const queryStr1 = JSON.parse(queryStr);
        // let queryKey = JSON.stringify(Object.keys(queryStr1)[0]);
        // var queryValue = queryStr1[Object.keys(queryStr1)[0]];
        // let queryValueArray = [];
        // queryValueArray = queryValue.split(',');

        // console.log('queryKey',queryKey);
        // console.log('queryValueArray',queryValueArray);

        // this.query = this.query.find({"category" : {$in: queryValueArray}});
        // this.query = this.query.find({queryKey : {$in: queryValueArray}});
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