import { supportRepository } from './support.repository';

export const supportService = {
  createRequest: async (payload: {
    userId?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const created = await supportRepository.create({
      user: payload.userId,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      subject: payload.subject.trim(),
      message: payload.message.trim()
    });

    return {
      id: created._id.toString(),
      name: created.name,
      email: created.email,
      subject: created.subject,
      message: created.message,
      status: created.status,
      createdAt: created.createdAt
    };
  },

  listForAdmin: async (options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'open' | 'resolved';
  }) => {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(Math.max(10, options.limit ?? 20), 100);

    const [items, total] = await supportRepository.list({
      page,
      limit,
      search: options.search,
      status: options.status
    });

    return {
      data: items.map((item) => ({
        id: item._id.toString(),
        user:
          item.user && typeof item.user === 'object'
            ? {
                id: (item.user as { _id?: { toString: () => string } })._id?.toString() ?? '',
                name: (item.user as { name?: string }).name,
                email: (item.user as { email?: string }).email,
                role: (item.user as { role?: string }).role
              }
            : undefined,
        name: item.name,
        email: item.email,
        subject: item.subject,
        message: item.message,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })),
      total,
      page,
      limit
    };
  },

  getByIdForAdmin: async (id: string) => {
    const item = await supportRepository.findById(id);

    if (!item) {
      throw { status: 404, message: 'Support request not found' };
    }

    return {
      id: item._id.toString(),
      user:
        item.user && typeof item.user === 'object'
          ? {
              id: (item.user as { _id?: { toString: () => string } })._id?.toString() ?? '',
              name: (item.user as { name?: string }).name,
              email: (item.user as { email?: string }).email,
              role: (item.user as { role?: string }).role
            }
          : undefined,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }
};
