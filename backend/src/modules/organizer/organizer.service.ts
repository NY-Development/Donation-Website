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
      throw { status: 404, message: 'errors.userNotFound' };
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
  }, payload?: { documentType?: 'national_id' | 'driver_license' | 'passport' }) => {
    if (!files.idFront || !files.livePhoto) {
      throw { status: 400, message: 'errors.idFrontAndLivePhotoRequired' };
    }

    const documentType = payload?.documentType ?? 'national_id';
    const requiresBack = documentType !== 'passport';
    if (requiresBack && !files.idBack) {
      throw { status: 400, message: 'errors.idBackRequired' };
    }

    const uploads = await Promise.all([
      uploadImage(files.idFront, 'id-front'),
      files.idBack ? uploadImage(files.idBack, 'id-back') : Promise.resolve(undefined),
      uploadImage(files.livePhoto, 'live-photo')
    ]);

    const [idFront, idBack, livePhoto] = uploads;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        isOrganizerVerified: false,
        organizerVerification: {
          idFront,
          idBack,
          livePhoto,
          documentType,
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
      throw { status: 404, message: 'errors.userNotFound' };
    }

    return { status: user.organizerVerification?.status ?? 'pending' };
  }
};
