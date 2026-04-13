const apiHandler = async (promise) => {
    try {
        const res = await promise;
        return {
            success: true,
            data: res.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error.customMessage || 'Something went wrong',
        };
    }
};

export { apiHandler };
