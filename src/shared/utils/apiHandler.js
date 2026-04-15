const apiHandler = async (promise) => {
    try {
        const res = await promise;
        return res.data; // 🔥 direct
    } catch (error) {
        const message = error.customMessage || "Something went wrong";
        showError(message);
        throw error; // let caller decide
    }
};

export { apiHandler };
