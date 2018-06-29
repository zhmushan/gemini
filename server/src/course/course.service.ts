import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class CourseService {

  save(authorId: string, course: Course) {
    course.authorId = authorId;
    return this.courseRepository.save(course);
  }

  async delete(authorId: string, courseId: string) {
    const course = await this.courseRepository.findOne(courseId, { where: { authorId } });
    return this.courseRepository.delete(course);
  }

  findById(id: string) {
    return this.courseRepository.findOne(id);
  }

  findAll() {
    return this.courseRepository.find();
  }

  updateById(id: string, course: Course) {
    return this.courseRepository.update(id, course);
  }

  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: MongoRepository<Course>
  ) {
  }
}