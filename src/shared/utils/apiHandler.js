const apiHandler = async (promise) => {
    try {
        const res = await promise;
        return res.data; 
    } catch (error) {
        const message = error.customMessage || "Something went wrong";
        showError(message);
        throw error; 
    }
};

export { apiHandler };
