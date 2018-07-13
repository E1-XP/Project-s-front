export const fetchStreamService = async (url: string, method: string, data?: any) => {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: data ? JSON.stringify(data) : null
        });

        const toJSON = await response.json();
        return {
            data: toJSON,
            status: response.status
        };
    }
    catch (err) {
        console.log(err);
        return new Error(err);
    }
};