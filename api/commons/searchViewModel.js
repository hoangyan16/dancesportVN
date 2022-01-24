
SearchViewModel = {
    age: String,
    size: Number,
    searchModel: Object
}

var SearchViewModel = function (page, pageSize, searchModel) {
   this.page = page;
   this.size = size;
   this.searchModel = searchModel;
}

module.exports = SearchViewModel;