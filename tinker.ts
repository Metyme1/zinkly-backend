
import mongoose from 'mongoose';
import repl from 'repl';
import config from './src/config';

// Import all models
import { User } from './src/app/modules/user/user.model';
import { Avaliablity } from './src/app/modules/avaliablity/avaliablity.model';
import { Booking } from './src/app/modules/booking/booking.model';
import { Bookmark } from './src/app/modules/bookmark/bookmark.model';
import { Category } from './src/app/modules/category/category.model';
import { Lesson } from './src/app/modules/lesson/lesson.model';
import { Notification } from './src/app/modules/notification/notification.model';
import { ResetToken } from './src/app/modules/resetToken/resetToken.model';
import { Review } from './src/app/modules/review/review.model';
import { Rule } from './src/app/modules/rule/rule.model';

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('🚀 Database connected successfully for tinker session.');

    const r = repl.start({
      prompt: '> ',
      useColors: true,
    });

    // Add models to the REPL context
    r.context.User = User;
    r.context.Avaliablity = Avaliablity;
    r.context.Booking = Booking;
    r.context.Bookmark = Bookmark;
    r.context.Category = Category;
    r.context.Lesson = Lesson;
    r.context.Notification = Notification;
    r.context.ResetToken = ResetToken;
    r.context.Review = Review;
    r.context.Rule = Rule;
    
    // You can add other helpers or utilities to the context as well
    r.context.mongoose = mongoose;

    console.log('✅ Models loaded into tinker session: User, Avaliablity, Booking, Bookmark, Category, Lesson, Notification, ResetToken, Review, Rule');
    
    r.on('exit', () => {
      mongoose.disconnect();
      console.log('Database connection closed.');
      process.exit();
    });

  } catch (error) {
    console.error('🤢 Failed to connect to Database for tinker session:', error);
    process.exit(1);
  }
}

bootstrap();
