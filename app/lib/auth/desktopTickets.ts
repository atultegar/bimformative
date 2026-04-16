type ticket = { userId: string; expiresAt: number };

const tickets = new Map<string, ticket>();

export function createTicket(userId: string, ttlSeconds: number = 30) {
    const ticket = crypto.randomUUID();
    tickets.set(ticket, { userId, expiresAt: Date.now() + ttlSeconds * 1000 });
    return ticket;
}

export function validateTicket(ticket: string): string | null {
    const data = tickets.get(ticket);
    if(!data) return null;
    if (Date.now() > data.expiresAt) {
        tickets.delete(ticket);
        return null;
    }
    tickets.delete(ticket);
    return data.userId;
}