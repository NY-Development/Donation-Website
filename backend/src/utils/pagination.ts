import { Types } from 'mongoose';

export type CursorParams = {
  limit: number;
  cursor?: string;
  sort?: 'asc' | 'desc';
};

export const buildCursorFilter = (cursor?: string, sort: 'asc' | 'desc' = 'desc') => {
  if (!cursor) {
    return {};
  }

  const direction = sort === 'desc' ? -1 : 1;
  const [createdAt, id] = cursor.split('_');
  const date = new Date(createdAt);
  const objectId = new Types.ObjectId(id);

  return {
    $or: [
      { createdAt: { [direction === -1 ? '$lt' : '$gt']: date } },
      { createdAt: date, _id: { [direction === -1 ? '$lt' : '$gt']: objectId } }
    ]
  };
};

export const makeCursor = (createdAt: Date, id: string) =>
  `${createdAt.toISOString()}_${id}`;
