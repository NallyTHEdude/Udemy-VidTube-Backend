import { ApiResponse } from "../utils/api-response.js";

const healthCheck = (req, res) => {
    res.status(200).json(new ApiResponse(200, "API is healthy", null));
};

export { healthCheck };
