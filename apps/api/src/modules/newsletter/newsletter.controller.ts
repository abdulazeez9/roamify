import { Request, Response, RequestHandler } from 'express';
import { NewsletterRepository } from './newsletter.repository';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';

const repo = new NewsletterRepository();

export const subscribeToNewsletter: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return ResponseUtil.error(res, 'A valid email is required', 400);
    }

    await repo.subscribe(email);

    return ResponseUtil.success(
      res,
      null,
      'You have successfully joined the movement!',
    );
  },
);

export const getSubscribers: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const subscribers = await repo.getAllSubscribers();
    return ResponseUtil.success(res, subscribers, 'Subscribers retrieved');
  },
);
