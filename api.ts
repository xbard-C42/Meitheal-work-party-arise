
const backendUrl = 'http://localhost:3001';

export const searchConversations = async (filters: any) => {
    const response = await fetch(`${backendUrl}/api/conversations`);
    if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
    }
    return await response.json();
};

export const addConversations = async (conversations: any[]) => {
    const response = await fetch(`${backendUrl}/api/conversations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversations),
    });

    if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
    }
    return await response.json();
};