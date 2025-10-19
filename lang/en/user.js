const MESSAGES = {
    ERRORS: {
        ONLY_SELECT_ALLOWED: "GET requests only support SELECT queries.",
        ONLY_INSERT_ALLOWED: "Only INSERT queries are allowed via POST.",
        METHOD_NOT_ALLOWED: "Method Not Allowed. Only GET and POST are supported",
        INVALID_ENDPOINT: "Invalid endpoint. Please use /lab5/api/v1/sql",
    },
    SUCCESS: {
        SERVER_RUNNING: "Server is running at ${port}",
    },
    INFO: {
        TEST_OK: "Testing, DB is running!",
        EMPTY: "No patient records found. DB is empty."
    }
};

export { MESSAGES };
