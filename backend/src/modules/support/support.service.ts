import { supportRepository } from './support.repository';
import { sendSupportReplyEmail } from '../../utils/mailer';

const mapReply = (reply: unknown) => {
  const value = reply as {
    subject?: string;
    content?: string;
    sentAt?: Date | string;
    sentBy?: { _id?: { toString: () => string }; name?: string; email?: string; role?: string };
  };

  return {
    subject: value.subject ?? '',
    content: value.content ?? '',
    sentAt: value.sentAt,
    sentBy:
      value.sentBy && typeof value.sentBy === 'object'
        ? {
            id: value.sentBy._id?.toString?.() ?? '',
            name: value.sentBy.name,
            email: value.sentBy.email,
            role: value.sentBy.role
          }
        : undefined
  };
};

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
        replies: Array.isArray((item as { replies?: unknown[] }).replies)
          ? ((item as { replies?: unknown[] }).replies ?? []).map(mapReply)
          : [],
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
      replies: Array.isArray((item as { replies?: unknown[] }).replies)
        ? ((item as { replies?: unknown[] }).replies ?? []).map(mapReply)
        : [],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  },

  replyForAdmin: async (payload: {
    id: string;
    subject: string;
    content: string;
    adminId?: string;
  }) => {
    const item = await supportRepository.findById(payload.id);

    if (!item) {
      throw { status: 404, message: 'Support request not found' };
    }

    await sendSupportReplyEmail({
      to: item.email,
      requesterName: item.name,
      subject: payload.subject.trim(),
      content: payload.content.trim()
    });

    const updated = await supportRepository.addReply({
      id: payload.id,
      subject: payload.subject.trim(),
      content: payload.content.trim(),
      sentBy: payload.adminId
    });

    if (!updated) {
      throw { status: 404, message: 'Support request not found' };
    }

    return {
      id: updated._id.toString(),
      to: item.email,
      subject: payload.subject.trim(),
      sent: true,
      replies: Array.isArray((updated as { replies?: unknown[] }).replies)
        ? ((updated as { replies?: unknown[] }).replies ?? []).map(mapReply)
        : []
    };
  }
};
