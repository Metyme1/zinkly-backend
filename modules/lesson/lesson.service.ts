import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { ILesson } from "./lesson.interface"
import { Lesson } from "./lesson.model";
import { User } from "../user/user.model";
import unlinkFile from "../../../shared/unlinkFile";

const createLesson = async (payload: ILesson): Promise<ILesson> => {

    const artist = payload.user as unknown as string;
    // check artist is add all bank info or not
    const isExistBank = await User.isAccountCreated(artist);
    /* if(!isExistBank){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Please Put all of your bank info then try again");
    } */

    const result:any = await Lesson.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Failed to create Lesson");
    }

    if(result?._id){         
        await User.findByIdAndUpdate({_id: result?.user}, {$set: {lesson: result?._id}});  
    }

    return result;
}

const updateLesson = async (payload: any, user: any): Promise<ILesson | null> => {

    const isValidUser: any = await User.findById(user?.id);
    const isExistLesson: any = await Lesson.findById(isValidUser?.lesson);

    if (!isExistLesson) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized to edit Lesson");
    }

    const { imagesToDelete, gallery, ...othersValue } = payload;

    // Filter images to delete only if `imagesToDelete` exists
    const updatedImages = isExistLesson.gallery.filter(
        (image: string) => !imagesToDelete?.includes(image)
    );

    // Remove file only if `imagesToDelete` is present
    if (imagesToDelete && imagesToDelete.length > 0) {
        for (let image of imagesToDelete) {
            unlinkFile(image);
        }
    }

    // If new gallery images are provided, add them to the updated images
    if (payload.gallery && payload.gallery.length > 0) {
        updatedImages.push(...payload.gallery);
    }

    // Prepare data for update
    const updateData = {
        ...othersValue,
        gallery: updatedImages.length > 0 ? updatedImages : isExistLesson.gallery
    };

    // Update lesson and return result
    const result = await Lesson.findByIdAndUpdate(
        { _id: isValidUser?.lesson },
        updateData,
        { new: true }
    );
    return result;
};



const moveLesson = async (lessonId: string, newUserId: string): Promise<ILesson | null> => {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Lesson not found");
    }

    const newUser = await User.findById(newUserId);
    if (!newUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "New user not found");
    }

    const oldUserId = lesson.user;

    // Update lesson owner
    lesson.user = newUserId as any;
    await lesson.save();

    // Update old user's lesson field
    await User.findByIdAndUpdate(oldUserId, { $unset: { lesson: 1 } });

    // Update new user's lesson field
    await User.findByIdAndUpdate(newUserId, { $set: { lesson: lessonId } });

    return lesson;
}

const createLessonByAdmin = async (payload: ILesson): Promise<ILesson> => {
    const user = await User.findById(payload.user);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const result:any = await Lesson.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Failed to create Lesson");
    }

    if(result?._id){
        await User.findByIdAndUpdate({_id: result?.user}, {$set: {lesson: result?._id}});
    }

    return result;
}

const updateLessonByAdmin = async (id: string, payload: any): Promise<ILesson | null> => {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Lesson not found");
    }

    const result = await Lesson.findByIdAndUpdate({_id: id}, payload, { new: true });
    return result;
}

export const LessonService = { createLesson, updateLesson, moveLesson, createLessonByAdmin, updateLessonByAdmin } 