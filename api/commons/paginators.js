
exports.getPagination = (page, size) => {
  const limit = size ? + size : 2;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

exports.getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: rows } = data;
  const currentPage = page ? + page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, totalPages, currentPage, rows };
};