import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  ValidationPipe,
  BadRequestException,
  UsePipes, NotFoundException, Query
} from "@nestjs/common";
import { FriendRequestService } from "./friend-request.service";
import { CreateFriendRequestDTO } from "./dto/request/CreateFriendRequestDTO";
import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IFriendRequest } from "../interfaces/IFriendRequest";
import { CreateFriendRequestResponseDTO } from "./dto/response/CreateFriendRequestResponseDTO";

@Controller('friend-requests') //This is the path that will be used to access the controller
@ApiTags('Friend Request') //SWAGGER : This is the name of the tag (onglet) that will be shown on swagger for this controller
@UsePipes(ValidationPipe) //This will validate the type of DTOs that are being passed into the controller like @isString() or @isNotEmpty()
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Get('all')
  @ApiOperation({ //SWAGGER : This is the description that will be shown on swagger for this route
    description: 'Get all friend requests. Return empty array if no friend requests are found.'
  })
  async getAllFriendRequests() : Promise<IFriendRequest[]>{
    try {
      return await this.friendRequestService.getAllFriendRequests();
    } catch (err) {
        throw new NotFoundException('Could not get all friend requests. Error: ' + err.message);
    }
  }

  @Get('id/:_id')
  @ApiOperation({
    description: 'Get one friend request by its id. Return 404 if no friend request is found.',
  })
  @ApiParam({ //SWAGGER : This is the default value that will be shown on swagger for this parameter
    name: '_id',
    schema: {
      default: '6461623bda2f1e3425116ed4',
    }
  })
  async getFriendRequestById(@Param('_id') _id: string ) : Promise<IFriendRequest> { // We give a default value to _id so that we can test the route on swagger
    try {
      return await this.friendRequestService.getOneById(_id);
    } catch (err) {
        throw new NotFoundException('Could not get friend request. Error: ' + err.message);
    }
  }

  @Get('fromTo')
  @ApiOperation({
    description: 'Get one friend request by the sender and the receiver. Return 404 if no friend request is found.',
  })
  @ApiQuery({
    name: 'from',
    schema: {
      default: 'dsbdfbshb_USERID_TEST_gfopxopmc',
    }
  })
  @ApiQuery({
    name: 'to',
    schema: {
      default: 'test',
    }
  })
  async getFriendRequestByFromTo(@Query('from') from: string, @Query('to') to: string ) : Promise<IFriendRequest> {
    try {
      return await this.friendRequestService.getOneByFromTo(from, to);
    } catch (err) {
        throw new NotFoundException('Could not get friend request. Error: ' + err.message);
    }
  }


  @Get('from/:from')
  @ApiOperation({
    description: 'Get all by the user pseudo who sent the friend request. Return empty array if no friend requests are found.',
  })
  @ApiParam({
    name: 'from',
    schema: {
      default: 'dsbdfbshb_USERID_TEST_gfopxopmc',
    }
  })
  async getAllFriendRequestsFrom(@Param('from') from: string ) : Promise<IFriendRequest[]> {
    try {
      return await this.friendRequestService.getFriendRequestsFrom(from);
    } catch (err) {
        throw new NotFoundException('Could not get friend requests from this user. Error: ' + err.message);
    }
  }

  @Get('to/:to')
  @ApiOperation({
    description: 'The pseudo of the user pseudo who received the friend request. Return empty array if no friend requests are found.',
  })
  @ApiParam({
    name: 'to',
    schema: {
      default: 'test',
    }
  })
  @ApiResponse({
    status: 200,
    description: 'The friend requests have been successfully retrieved.',
  })
  async getAllFriendRequestsSentTo(@Param('to') to: string) : Promise<IFriendRequest[]>{
    try {
      return await this.friendRequestService.getFriendRequestsSentTo(to);
    } catch (err) {
        throw new NotFoundException('Could not get friend requests sent to this user. Error: ' + err.message);
    }
  }

  @Post('create')
  @ApiOperation({
    description: 'Create a new friend request.',
  })
  @ApiBody({
    type: CreateFriendRequestDTO
  })
  @ApiResponse({
    status: 201,
    description: 'The friend request has been successfully created.',
    type: CreateFriendRequestResponseDTO
  })
  async createRequest(@Body() createFriendRequestDTO: CreateFriendRequestDTO) :  Promise<CreateFriendRequestResponseDTO>{
    try {
      return await this.friendRequestService.createRequest(createFriendRequestDTO);
    } catch (err) {
        throw new BadRequestException('Could not create new friend request. Error: ' + err.message);
    }
  }

  @Patch('accept/:_id')
  @ApiOperation({
    description: 'Accept a friend request',
  })
  @ApiParam({
    name: '_id',
    schema: {
      default: '64616c31fc1e0bf18ae3c6dc',
    }
  })
  async acceptRequest(@Param('_id') _id: string) : Promise<string>{
    try {
      return await this.friendRequestService.acceptRequest(_id);
    } catch (err) {
        throw new NotFoundException('Could not accept friend request. Error: ' + err.message);
    }
  }

  @Patch('accept/fromTo')
  @ApiOperation({
    description: 'Accept a friend request with specified sender and receiver'
  })
  @ApiQuery({
    name: 'from',
    schema: {
      default: 'dsbdfbshb_USERID_TEST_gfopxopmc',
    }
  })
  @ApiQuery({
    name: 'to',
    schema: {
      default: 'test',
    }
  })
  async acceptRequestFromTo(@Query('from') from: string, @Query('to') to: string) : Promise<string>{
    try {
      return await this.friendRequestService.acceptRequestFromTo(from, to);
    } catch (err) {
        throw new NotFoundException('Could not accept friend request. Error: ' + err.message);
    }
  }


  @Patch('refuse/:_id')
  @ApiOperation({
    description: 'Refuse a friend request by giving the its _id',
  })
  @ApiParam({
    name: '_id',
    schema: {
      default: '64616c31fc1e0bf18ae3c6dc',
    }
  })
  async refuseRequest(@Param('_id') _id: string) : Promise<string>{
    try {
      return await this.friendRequestService.refuseRequest(_id);
    } catch (err) {
        throw new NotFoundException('Could not reject friend request. Error: ' + err.message);
    }
  }

  @Patch('refuse/fromTo')
  @ApiOperation({
    description: 'Refuse a friend request with specified sender and receiver',
  })
  @ApiQuery({
    name: 'from',
    schema: {
      default: 'dsbdfbshb_USERID_TEST_gfopxopmc'
    }
  })
  @ApiQuery({
    name: 'to',
    schema: {
      default: 'test',
    }
  })
  async refuseRequestFromTo(@Query('from') from: string, @Query('to') to: string) : Promise<string>{
    try {
      return await this.friendRequestService.refuseRequestFromTo(from, to);
    } catch (err) {
        throw new NotFoundException('Could not reject friend request. Error: ' + err.message);
    }
  }

  @Delete('delete/:_id')
  @ApiOperation({
    description: 'Delete a friend request by its _id',
  })
  async deleteRequest(@Param('_id') _id: string) {
    try {
      return await this.friendRequestService.deleteOneById(_id);
    } catch (err) {
        throw new NotFoundException('Could not delete friend request. Error: ' + err.message);
    }
  }

  @Delete('delete/allFrom/:from')
  @ApiOperation({
    description: 'Delete all friend requests sent by a user',
  })
  async deleteAllRequestsFrom(@Param('from') from: string) : Promise<string>{
    try {
      return await this.friendRequestService.deleteAllFrom(from);
    } catch (err) {
        throw new NotFoundException('Could not delete friend requests. Error: ' + err.message);
    }
  }

  @Delete('delete/allSentTo/:to')
  @ApiOperation({
    description: 'Delete all friend requests sent to a user',
  })
  async deleteAllRequestsSentTo(@Param('to') to: string) : Promise<string>{
    try {
      return await this.friendRequestService.deleteAllSentTo(to);
    } catch (err) {
        throw new NotFoundException('Could not delete friend requests. Error: ' + err.message);
    }
  }

  @Delete('delete/fromTo')
  @ApiOperation({
    description: 'Delete a friend request by its sender and receiver',
  })
  @ApiQuery({
    name: 'from',
    schema: {
      default: 'test',
    },
  })
  @ApiQuery({
    name: 'to',
    schema: {
      default: 'test2',
    }
  })
  async deleteRequestFromTo(@Query('from') from: string, @Query('to') to: string) : Promise<string> {
    try {
      return await this.friendRequestService.deleteOneFromTo(from, to);
    } catch (err) {
      throw new NotFoundException('Could not delete friend request. Error: ' + err.message);
    }
  }





}
