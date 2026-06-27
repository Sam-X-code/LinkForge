const calculateExpiry = (expiresIn) => {
    const now = Date.now();

    switch (expiresIn) {
        case "5m" :
            return new Date(now + 5 * 60 * 1000);

        case "10m" :
            return new Date(now + 10 * 60 * 1000);

        case "30m" :
            return new Date(now + 30 * 60 * 1000);
            
        case "1h":
            return new Date(now + 60 * 60 * 1000);

        case "1d":
            return new Date(now + 24 * 60 * 60 * 1000);

        case "7d":
            return new Date(now + 7 * 24 * 60 * 60 * 1000);

        case "30d":
            return new Date(now + 30 * 24 * 60 * 60 * 1000);

        default:
            return null;
    }
};

export default calculateExpiry;