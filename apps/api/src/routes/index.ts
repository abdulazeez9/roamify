import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/user/user.routes';
import { adventureRoutes } from '../modules/adventure/adventure.routes';
import { adventureGalleryRoutes } from '../modules/adventure-gallery/gallery.routes';
import { reviewRoutes } from '../modules/review/review.routes';
import { postRoutes } from '../modules/community/post/post.routes';
import { eventRoutes } from '../modules/event/event.routes';
import { tripRequestRoutes } from '../modules/trip-request/trip-request.routes';
import { callbackRequestRoutes } from '../modules/callback-request/callback-request.routes';
import { generalInquiryRoutes } from '../modules/general-enquiry/general-inquiry.routes';
import { tripPlanningCallRoutes } from '../modules/trip-planning-call/trip-planning-call.routes';
import { itineraryRoutes } from 'src/modules/itinerary/itinerary.routes';
import { dashboardRoute } from 'src/modules/dashboard/dashboard.routes';
import { newsletterRoutes } from 'src/modules/newsletter/newsletter.routes';
import { platformGalleryRoutes } from 'src/modules/platform-gallery/platform-gallery.routes';
import { platformSettingsRoutes } from 'src/modules/platform-settings/platform-settings.routes';

const router: Router = Router();
const adventureRouter: Router = Router();

adventureRouter.use(itineraryRoutes);
adventureRouter.use(adventureGalleryRoutes);
adventureRouter.use(adventureRoutes);

// // Auth & User
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);

// // Adventures
router.use('/api/adventures', adventureRouter);
// // Reviews
router.use('/api/reviews', reviewRoutes);
router.use('/api/newsletters', newsletterRoutes);
router.use('/api/platform-settings', platformSettingsRoutes);

// // Community
router.use('/api/posts', postRoutes);
router.use('/api/platform-galleries', platformGalleryRoutes);
// // Events & Requests
router.use('/api/events', eventRoutes);
router.use('/api/trip-requests', tripRequestRoutes);
router.use('/api/callback-requests', callbackRequestRoutes);
router.use('/api/inquiries', generalInquiryRoutes);

// // Calls
router.use('/api/trip-planning-calls', tripPlanningCallRoutes);

//Statistics
router.use('/api/dashboard', dashboardRoute);

export default router;
