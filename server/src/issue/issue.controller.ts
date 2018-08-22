import { Controller, Post, UseGuards, Body, Put, Param, Get, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Usr } from '../user/user.decorators';
import { User } from '../user/user.entity';
import { IssueService } from './issue.service';
import { success, response, ResponseCode } from '../common/utils/response.util';
import { ObjectId } from 'mongodb';
import { GeminiError } from '../common/error';
import { Issue, Reply } from './issue.entity';
import { UserService } from '../user/user.service';
import { CreateIssueDTO, UpdateIssueDTO, CreateReplyDTO, CreateSubReplyDTO, FetchIssueByTagsDTO } from './dto';
import { IssueVO, ReplyVO, SubReplyVO } from './vo';

@Controller('/api/issues')
export class IssueController {

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Usr() user: User, @Body() createIssueDTO: CreateIssueDTO) {
    const issue = await this.issueService.save(user.id.toHexString(), createIssueDTO);
    return success(new IssueVO(issue));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Usr() user: User, @Param('id') id: string) {
    this.issueService.delete(user.id.toHexString(), id);
    return success();
  }

  @Get()
  async findAll() {
    const issues = await this.issueService.findAll();
    return success(issues.map(issue => new IssueVO(issue)));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const issue = await this.issueService.findById(id);
    return success(new IssueVO(issue));
  }

  @Post('fetch/by-tag/intersect')
  async findByTag(@Body() fetchIssueByTagsDTO: FetchIssueByTagsDTO) {
    const issues = await this.issueService.findAll();
    return success(issues.filter(
      issue =>
        (issue.tags.length + fetchIssueByTagsDTO.tags.length) !==
        new Set([...issue.tags, ...fetchIssueByTagsDTO.tags]).size
    ).map(issue => new IssueVO(issue)));
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateOne(
    @Usr() user: User,
    @Body() updateIssueDTO: UpdateIssueDTO,
    @Param('id') id: string
  ) {
    const res = await this.issueService.updateById(user.id.toHexString(), id, updateIssueDTO);
    if (res instanceof GeminiError) return response(res.code);
    return success(new IssueVO(res));
  }

  @Put(':id/watch')
  @UseGuards(AuthGuard('jwt'))
  async watch(@Usr() user: User, @Param('id') id: string) {
    const issue = await this.issueService.findById(id);
    if (!issue) return response(ResponseCode.NOT_EXISIT);
    const index = user.watchIssuesId.findIndex(v => v === id);
    if (index === -1) {
      user.watchIssuesId.push(id);
      issue.watchersId.push(user.id.toHexString());
    } else {
      user.watchIssuesId.splice(index, 1);
      issue.watchersId.splice(issue.watchersId.findIndex(v => v === user.id.toHexString()), 1);
    }
    let res: any = this.userService.updateById(user.id.toHexString(), { watchIssuesId: user.watchIssuesId } as User);
    if (res instanceof GeminiError) return response(res.code);
    res = this.issueService.updateById(issue.authorId, id, { watchersId: issue.watchersId } as Issue);
    if (res instanceof GeminiError) return response(res.code);
    return success(user.watchIssuesId);
  }

  @Post(':id/reply')
  @UseGuards(AuthGuard('jwt'))
  async createReply(
    @Usr() user: User,
    @Body() createReplyDTO: CreateReplyDTO,
    @Param('id') id: string
  ) {
    const issue = await this.issueService.findById(id);
    if (!issue) return response(ResponseCode.NOT_EXISIT);
    const reply = await this.issueService.createReply(user.id.toHexString(), createReplyDTO);
    if (!reply) return response(ResponseCode.UNKNOWN);
    issue.replysId.push(reply.id.toHexString());
    const res = await this.issueService.updateById(issue.authorId, id, { replysId: issue.replysId } as Issue);
    if (res instanceof GeminiError) return response(res.code);
    return success(new ReplyVO(reply));
  }

  @Post('reply/:id/subreply')
  @UseGuards(AuthGuard('jwt'))
  async createSubReply(
    @Usr() user: User,
    @Body() createSubReplyDTO: CreateSubReplyDTO,
    @Param('id') id: string
  ) {
    const reply = await this.issueService.findReplyById(id);
    if (!reply) return response(ResponseCode.NOT_EXISIT);
    const subreply = await this.issueService.createSubReply(user.id.toHexString(), createSubReplyDTO);
    if (!subreply) return response(ResponseCode.UNKNOWN);
    reply.subReplysId.push(subreply.id.toHexString());
    const res = await this.issueService.updateReplyById(reply.authorId, id, { subReplysId: reply.subReplysId } as Reply);
    if (res instanceof GeminiError) return response(res.code);
    return success(new SubReplyVO(subreply));
  }

  @Post('reply/ids')
  async findReplyGroup(@Body() ids: string[]) {
    const replys = await this.issueService.findReplysById(ids.map(id => new ObjectId(id)));
    const res: ReplyVO[] = [];
    for (const r of replys) {
      const author = await this.userService.findById(r.authorId);
      res.push({
        ...new ReplyVO(r),
        authorUsername: author.username,
        authorAvatar: author.avatar
      } as ReplyVO);
    }
    return success(res);
  }

  @Post('reply/subreply/ids')
  async findSubReplyGroup(@Body() ids: string[]) {
    const subreplys = await this.issueService.findSubReplysById(ids.map(id => new ObjectId(id)));
    const res: SubReplyVO[] = [];
    for (const s of subreplys) {
      const from = await this.userService.findById(s.from);
      const to = await this.userService.findById(s.to);
      res.push({
        ...new SubReplyVO(s),
        fromUsername: from.username,
        fromAvatar: from.avatar,
        toUsername: to.username,
        toAvatar: to.avatar
      } as SubReplyVO);
    }
    return success(res);
  }

  @Put('reply/:id/up')
  @UseGuards(AuthGuard('jwt'))
  async replyUp(@Usr() user: User, @Param('id') id: string) {
    const reply = await this.issueService.findReplyById(id);
    if (!reply) return response(ResponseCode.NOT_EXISIT);
    if (reply.downersId.findIndex(v => v === user.id.toHexString()) !== -1) return response(ResponseCode.REPEAT_OPERATION);
    const index = reply.upersId.findIndex(v => v === user.id.toHexString());
    if (index === -1) {
      reply.upersId.push(user.id.toHexString());
    } else {
      reply.upersId.splice(index, 1);
    }
    const res = await this.issueService.updateReplyById(reply.authorId, id, { upersId: reply.upersId } as Reply);
    if (res instanceof GeminiError) return response(res.code);
    return success();
  }

  @Put('reply/:id/down')
  @UseGuards(AuthGuard('jwt'))
  async replyDown(@Usr() user: User, @Param('id') id: string) {
    const reply = await this.issueService.findReplyById(id);
    if (!reply) return response(ResponseCode.NOT_EXISIT);
    if (reply.upersId.findIndex(v => v === user.id.toHexString()) !== -1) return response(ResponseCode.REPEAT_OPERATION);
    const index = reply.downersId.findIndex(v => v === user.id.toHexString());
    if (index === -1) {
      reply.downersId.push(user.id.toHexString());
    } else {
      reply.downersId.splice(index, 1);
    }
    const res = await this.issueService.updateReplyById(reply.authorId, id, { downersId: reply.downersId } as Reply);
    if (res instanceof GeminiError) return response(res.code);
    return success();
  }

  constructor(
    private readonly issueService: IssueService,
    private readonly userService: UserService
  ) { }
}
