const apiHandler = async (fn, retries = 2, delay = 500) => {
    try {
        return await fn();
    } catch (err) {
        if (retries === 0) throw err;
        console.log("retried");

        await new Promise((res) => setTimeout(res, delay));
        return fetchWithRetry(fn, retries - 1, delay * 2);
    }
};

export { apiHandler };
