const MESSAGES = {
    ERRORS: {
        ONLY_SELECT_ALLOWED: "GET requests only support SELECT queries.",
        ONLY_INSERT_ALLOWED: "Only INSERT queries are allowed via POST.",
        INTERNAL_ERROR: "Internal Server Error.",
        BAD_REQUEST: "Bad request or missing parameters.",
        METHOD_NOT_ALLOWED: "Method Not Allowed. Only GET and POST are supported",
    },
    SUCCESS: {
        INSERT_OK: "Patient(s) inserted successfully.",
        SERVER_RUNNING: port => `Server is running on port ${port}`,
        DB_READY: "Database and patient table ready.",
    },
    INFO: {
        TEST_OK: "Testing, DB is running!",
    }
};

export { MESSAGES };
