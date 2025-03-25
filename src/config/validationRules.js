module.exports = {
  //? Validation Rules
  VALIDATION_RULES: {
    ADMIN: {
      name: "required|string|min:2|max:30",
      email: "required|email",
      password:
        "required|min:8|max:16|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$/",
      gender: "required|string|in:male,female,other",
      city: "required|string|min:2|max:100",
      country: "required|string|min:2|max:100",
      companyName: "string|min:2|max:100", // Adjusted max length to match model
    },
  },
};
