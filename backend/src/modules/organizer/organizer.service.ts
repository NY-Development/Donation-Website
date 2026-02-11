import { cloudinary } from '../../config/cloudinary';
import { UserModel } from '../users/user.model';
import type { Express } from 'express';

const uploadImage = async (file: Express.Multer.File, tag: string) => {
  const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
    folder: 'organizer-kyc',
    type: 'private',
    tags: [tag]
  });

  return { publicId: result.public_id, format: result.format };
};

export const organizerService = {
  getStatus: async (userId: string) => {
    const user = await UserModel.findById(userId)
      .select('isOrganizerVerified organizerVerification.status organizerVerification.submittedAt organizerVerification.reviewedAt organizerVerification.rejectionReason')
      .lean();

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return {
      isOrganizerVerified: Boolean(user.isOrganizerVerified),
      status: user.organizerVerification?.status ?? 'pending',
      submittedAt: user.organizerVerification?.submittedAt,
      reviewedAt: user.organizerVerification?.reviewedAt,
      rejectionReason: user.organizerVerification?.rejectionReason
    };
  },
  submitVerification: async (userId: string, files: {
    idFront?: Express.Multer.File;
    idBack?: Express.Multer.File;
    livePhoto?: Express.Multer.File;
  }) => {
    if (!files.idFront || !files.idBack || !files.livePhoto) {
      throw { status: 400, message: 'All verification images are required' };
    }

    const [idFront, idBack, livePhoto] = await Promise.all([
      uploadImage(files.idFront, 'id-front'),
      uploadImage(files.idBack, 'id-back'),
      uploadImage(files.livePhoto, 'live-photo')
    ]);

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        isOrganizerVerified: false,
        organizerVerification: {
          idFront,
          idBack,
          livePhoto,
          status: 'pending',
          submittedAt: new Date(),
          reviewedAt: undefined,
          reviewedBy: undefined,
          rejectionReason: undefined
        }
      },
      { new: true }
    );

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return { status: user.organizerVerification?.status ?? 'pending' };
  }
};
