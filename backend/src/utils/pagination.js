const { config } = require('../config/environment');

const getPaginationParams = (page, limit) => {
  const parsedPage = Math.max(1, Number(page) || 1);
  const parsedLimit = Math.min(
    Math.max(1, Number(limit) || config.defaultPageSize),
    config.maxPageSize
  );
  const skip = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip,
  };
};

const getPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = { getPaginationParams, getPaginationMeta };
