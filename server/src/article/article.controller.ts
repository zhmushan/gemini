import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Usr } from '../user/user.decorators';
import { success } from '../common/utils';
import { User } from '../user/user.entity';
import { CreateArticleDTO } from './dto';
import { ArticleService } from './article.service';
import { ArticleVO } from './vo/article.vs';

@Controller('/api/articles')
export class ArticleController {

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Usr() user: User, @Body() createArticleDTO: CreateArticleDTO) {
    const article = await this.articleService.save(user.id, createArticleDTO);
    return success(new ArticleVO(article));
  }

  constructor(
    private readonly articleService: ArticleService
  ) {}
}