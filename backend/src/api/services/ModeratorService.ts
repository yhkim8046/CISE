import { Injectable, BadRequestException } from "@nestjs/common";
import { Moderator } from "../models/moderator.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RegisterDto } from "../dto/Register.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ModeratorService {
  constructor(@InjectModel(Moderator.name) private moderatorModel: Model<Moderator>) {}

  
  async findAll(): Promise<Moderator[]> {
    return await this.moderatorModel.find().exec();
  }

  
  async findOne(id: string): Promise<Moderator> {
    return await this.moderatorModel.findById(id).exec();
  }

  
  async register(registerDto: RegisterDto): Promise<Moderator> {
    const { email, password, typeOfUser } = registerDto;

    // user duplication check
    const existingUser = await this.moderatorModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await this.hashPassword(password);

    const newModerator = new this.moderatorModel({
      email,
      password: hashedPassword, 
      typeOfUser,
    });

    return await newModerator.save();
  }

  async login(email: string, password: string): Promise<Moderator | null> {
    
    const user = await this.moderatorModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordMatches = await this.comparePasswords(password, user.password);
    if (!passwordMatches) {
      throw new BadRequestException('Invalid credentials');
    }

    return user; 
  }

  //Password Hasing
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  //Verifying hashed password
  private async comparePasswords(enteredPassword: string, storedPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, storedPassword);
  }

  async update(id: string, createArticlesDto: RegisterDto) {
    return await this.moderatorModel.findByIdAndUpdate(id, createArticlesDto, { new: true }).exec();
  }

  async delete(id: string) {
    return await this.moderatorModel.findByIdAndDelete(id).exec();
  }
}
