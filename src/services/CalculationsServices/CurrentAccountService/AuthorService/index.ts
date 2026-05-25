import _ from 'lodash';
import CurrentAuthorImp from '@interfaces/calculations/CurrentAuthorImp';
import { CurrentAuthorTypes } from '@/hooks/interfaces/CurrentAccountHookImp';
import { initialCurrentAuthor } from '@/hooks/currentAccount';
import { ConditionsImp } from '@/hooks/resourses';
import { alertMessages } from '@/hooks/alertMessages';

export interface DuplicateImp {
  author: CurrentAuthorTypes;
  authorIndex: number;
  authorsConditions?: ConditionsImp;
}
export interface RemoveImp {
  author: CurrentAuthorTypes;
  authorIndex: number;
}

export interface CreateImp {
  author: CurrentAuthorTypes;
  authorsConditions?: ConditionsImp;
  authorName: string;
}

export default class AuthorService {
  private alertMessages = alertMessages();
  private authorsConditions?: ConditionsImp;
  private author: CurrentAuthorTypes = {} as CurrentAuthorTypes;

  private validateResource() {
    if (this.authorsConditions?.limit && this.author.list.length > this.authorsConditions.limit) {
      this.alertMessages.error(`Você atingiu o limite autores permitidos!`);
      throw '';
    }
  }

  duplicate({ author, authorIndex, authorsConditions }: DuplicateImp) {
    this.author = author;
    this.authorsConditions = authorsConditions;

    console.info('duplicate-author_service');
    try {
      this.validateResource();

      const newAuthorList = _.cloneDeep(author.list);
      const duplicated: CurrentAuthorImp = newAuthorList[authorIndex];
      newAuthorList.push(_.cloneDeep(duplicated));

      const newAuthor: CurrentAuthorTypes = {
        ...author,
        list: newAuthorList,
      };

      return newAuthor;
    } catch (error) {
      this.alertMessages.error(`Erro ao duplicar autor!`);
      return author;
    }
  }
  remove({ author, authorIndex }: RemoveImp) {
    console.info('remove-author_service');
    try {
      const newAuthorList = _.cloneDeep(author.list);

      newAuthorList.splice(authorIndex, 1);

      const newAuthor: CurrentAuthorTypes = {
        ...author,
        list: newAuthorList,
      };

      return newAuthor;
    } catch (error) {
      return author;
    }
  }
  create({ author, authorName, authorsConditions }: CreateImp) {
    console.info('create-author_service');
    this.author = author;
    this.authorsConditions = authorsConditions;

    try {
      this.validateResource();

      const resetValues: CurrentAuthorImp = {
        ...initialCurrentAuthor,
        name: authorName,
        occurrences: [],
      };

      const list = author.list;
      list.push(_.cloneDeep(resetValues));

      const newAuthor: CurrentAuthorTypes = {
        ...author,
        list,
      };
      return newAuthor;
    } catch (error) {
      return author;
    }
  }
}
