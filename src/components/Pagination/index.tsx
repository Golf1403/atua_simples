import React from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Tooltip from '../DefaultTooltip';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '@store/index';
import PaginateResponseImp from '@interfaces/PaginateResponseImp';
import { setAccountPagination } from '@store/simple/actions';
import { Button, Container, PageNumber, Separator } from './styles';
import { useCore } from '@/hooks/core';

interface IPagination {
  firstPage?: Function;
  prev?: Function;
  reload?: Function;
  next?: Function;
  lastPage?: Function;
  pageNumber?: number;
  totalPages?: number;
  isCurrent?: boolean;
  isSimple?: boolean;
}

const Pagination = (props: IPagination) => {
  const { isCurrent = false, isSimple = false } = props;
  const { accountPagination: simplePagination } = useSelector((state: ApplicationState) => state.simple);
  const dispatch = useDispatch();
  const { pagination, setPagination } = useCore();

  const setCurrentNewPage = (newPage: number) => {
    const _pagination: PaginateResponseImp = { ...pagination, current: newPage };
    setPagination(_pagination);
    props?.reload && props.reload(undefined, newPage);
  };

  const setSimpleNewPage = (newPage: number) => {
    dispatch(setAccountPagination({ ...simplePagination, current: newPage }));
  };

  const nextPage = () => {
    if (isCurrent) {
      const { current, pages: maxPage } = pagination;
      const newPage = Math.min(current + 1, maxPage);
      if (newPage !== current) setCurrentNewPage(newPage);
      return;
    }

    if (isSimple) {
      const { current, pages: maxPage } = simplePagination;
      const newPage = Math.min(current + 1, maxPage);
      if (newPage !== current) setSimpleNewPage(newPage);
      return;
    }
  };

  const prevPage = () => {
    if (isCurrent) {
      const { current } = pagination;
      const newPage = Math.max(current - 1, 1);
      if (newPage !== current) setCurrentNewPage(newPage);
      return;
    }
    if (isSimple) {
      const { current } = simplePagination;
      const newPage = Math.max(current - 1, 1);
      if (newPage !== current) setSimpleNewPage(newPage);
      return;
    }
  };

  const firstPage = () => {
    if (isCurrent) return setCurrentNewPage(1);
    if (isSimple) return setSimpleNewPage(1);
  };
  const lastPage = () => {
    if (isCurrent) return setCurrentNewPage(pagination.pages);
    if (isSimple) return setSimpleNewPage(simplePagination.pages);
    return;
  };

  const currentPage = () => {
    if (isCurrent) return pagination.current;
    if (isSimple) return simplePagination.current;

    return 0;
  };

  const totalPage = () => {
    if (isCurrent) return pagination.pages;
    if (isSimple) return simplePagination.pages;

    return 0;
  };

  return (
    <Container>
      <Button type="button" onClick={firstPage}>
        <Tooltip withoutHoverColor={true} text="Primeiro">
          <FaAngleDoubleLeft />
        </Tooltip>
      </Button>
      <Button type="button" onClick={prevPage}>
        <Tooltip withoutHoverColor={true} text="Anterior">
          <FaAngleLeft />
        </Tooltip>
      </Button>
      <PageNumber>{currentPage()}</PageNumber>
      <Separator>/</Separator>
      <PageNumber>{totalPage()}</PageNumber>
      <Button type="button" onClick={nextPage}>
        <Tooltip withoutHoverColor={true} text="Próximo">
          <FaAngleRight />
        </Tooltip>
      </Button>
      <Button type="button" onClick={lastPage}>
        <Tooltip withoutHoverColor={true} text="Último">
          <FaAngleDoubleRight />
        </Tooltip>
      </Button>
    </Container>
  );
};

export default Pagination;
