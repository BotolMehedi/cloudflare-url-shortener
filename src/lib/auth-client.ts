export const getClientId = (): string => {
    const STORAGE_KEY = "ahcx_client_id";
    let clientId = localStorage.getItem(STORAGE_KEY);

    if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, clientId);
    }

    return clientId;
};
