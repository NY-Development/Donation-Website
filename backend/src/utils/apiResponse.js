class ApiResponse {
  static success(data, message = 'Success') {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message, errors) {
    return {
      success: false,
      message,
      errors,
    };
  }

  static paginated(data, pagination, message = 'Success') {
    return {
      success: true,
      message,
      data,
      pagination,
    };
  }
}

module.exports = { ApiResponse };
