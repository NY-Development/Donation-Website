import { SupportRequestModel } from './support.model';

export const supportRepository = {
  create: (payload: {
    user?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => SupportRequestModel.create(payload),

  findById: (id: string) =>
    SupportRequestModel.findById(id)
      .populate('user', 'name email role')
      .populate('replies.sentBy', 'name email role')
      .lean(),

  addReply: (payload: {
    id: string;
    subject: string;
    content: string;
    sentBy?: string;
  }) =>
    SupportRequestModel.findByIdAndUpdate(
      payload.id,
      {
        $push: {
          replies: {
            subject: payload.subject,
            content: payload.content,
            sentBy: payload.sentBy,
            sentAt: new Date()
          }
        }
      },
      { new: true }
    )
      .populate('user', 'name email role')
      .populate('replies.sentBy', 'name email role')
      .lean(),

  list: (options: {
    page: number;
    limit: number;
    search?: string;
    status?: 'open' | 'resolved';
  }) => {
    const filter: Record<string, unknown> = {};

    if (options.status) {
      filter.status = options.status;
    }

    if (options.search) {
      filter.$or = [
        { name: { $regex: options.search, $options: 'i' } },
        { email: { $regex: options.search, $options: 'i' } },
        { subject: { $regex: options.search, $options: 'i' } },
        { message: { $regex: options.search, $options: 'i' } }
      ];
    }

    const skip = (options.page - 1) * options.limit;

    return Promise.all([
      SupportRequestModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(options.limit)
        .populate('user', 'name email role')
        .populate('replies.sentBy', 'name email role')
        .lean(),
      SupportRequestModel.countDocuments(filter)
    ]);
  }
};
