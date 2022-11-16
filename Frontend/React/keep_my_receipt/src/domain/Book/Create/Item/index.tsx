import React from 'react';

import ItemInfo from '../ItemInfo';
import ItemMainType from '../ItemMainType';
import ItemLargeCategory from '../ItemLargeCategory';
import ItemSmallCategory from '../ItemSmallCategory';
import ItemTagFirst from '../ItemTagFirst';
import { BookAction, BookItemType, updateItem } from '../bookReducer';

type ItemType = {
  clubId: string;
  item: BookItemType;
  itemIndex: number;
  dispatch: React.Dispatch<BookAction>;
  currencyEditable: boolean;
};

export default function Item({
  clubId,
  item,
  itemIndex,
  dispatch,
  currencyEditable,
}: ItemType) {
  // 토글 값 바꾸는 함수
  function setMainCategory(value: string) {
    dispatch(updateItem(itemIndex, 'type', value));
    // 토글 값이 바뀔 때 대분류와 중분류 초기화
    dispatch(updateItem(itemIndex, 'largeCategory', ''));
    dispatch(updateItem(itemIndex, 'smallCategory', ''));
    dispatch(updateItem(itemIndex, 'categoryId', 0));
  }

  // 대분류 바꾸는 함수
  const setLargeCategory = (value: string | number) => {
    dispatch(updateItem(itemIndex, 'largeCategory', value));
    // 대분류가 바뀔 때, 중분류 초기화
    dispatch(updateItem(itemIndex, 'smallCategory', ''));
    dispatch(updateItem(itemIndex, 'categoryId', 0));
  };

  // 소분류 바꾸는 함수
  const setSmallCategory = (value: string | number) => {
    dispatch(updateItem(itemIndex, 'smallCategory', value));
    // dispatch(updateItem(itemIndex, 'categoryId', id));
  };

  const setLargeTag = (value: string | number) => {
    dispatch(updateItem(itemIndex, 'largeTag', value));
    dispatch(updateItem(itemIndex, 'smallTag', ''));
    // dispatch(updateItem(itemIndex, 'tagId', tagId));
    // if (tagId) {
    //   setTempTagId(tagId);
    // }
  };

  // const setSmallTag = (name: string, tagId: number) => {
  //   dispatch(updateItem(itemIndex, 'smallTag', name));
  //   // 태그2 선택을 취소할 경우, 기존 태그 id로 복구
  //   dispatch(updateItem(itemIndex, 'tagId', tagId === 0 ? tempTagId : tagId));
  // };

  return (
    <>
      {/* 항목 이름 & 금액 & 메모 */}
      <ItemInfo
        item={item}
        itemIndex={itemIndex}
        dispatch={dispatch}
        currencyEditable={currencyEditable}
      />

      {/* 유형 토글 버튼 */}
      <ItemMainType item={item} setMainCategory={setMainCategory} />

      {/* 대분류 */}
      {item.type && (
        <ItemLargeCategory item={item} setLargeCategory={setLargeCategory} />
      )}

      {/* 대분류
      <EditableListWrapped
        categoryName="대분류"
        dialogContent={<></>}
        originalList={largeCategories[toggleValue]}
        onSelect={setLargeCategory}
        selected={item.largeCategory}
        fixed
      /> */}

      {/* 소분류 */}
      {item.largeCategory && (
        <ItemSmallCategory
          label="소분류"
          clubId={clubId}
          typeName={item.type}
          largeCatName={item.largeCategory}
          value={item.smallCategory}
          setValue={setSmallCategory}
          requestCreateValue={(value) => {
            console.log('소분류 추가 API 요청', value);
          }}
        />
      )}

      {/* <EditableListWrappedForCategory
        categoryName="소분류"
        dialogContent={<p>설명</p>}
        clubId={clubId}
        typeName={item.type}
        lcName={item.largeCategory}
        onSelect={setSmallCategory}
        selected={item.smallCategory}
      /> */}

      {/* 1차 태그 */}
      {(item.type === '지출' || item.type === '자산') && (
        <ItemTagFirst
          label="태그"
          clubId={clubId}
          value={item.largeTag}
          setValue={setLargeTag}
          requestCreateValue={(value) => {
            console.log('태그 추가 API 요청', value);
          }}
        />
      )}

      {/* <EditableListWrappedForTag
        clubId={clubId}
        categoryName={!item.largeTag ? '태그' : '태그 1'}
        dialogContent={<p>설명</p>}
        onSelect={setLargeTag}
        selected={item.largeTag}
        parentTag={null}
      />

      {item.largeTag && (
        <EditableListWrappedForTag
          clubId={clubId}
          categoryName="태그 2"
          dialogContent={<p>설명</p>}
          onSelect={setSmallTag}
          selected={item.smallTag}
          parentTag={item.largeTag}
        />
      )} */}
    </>
  );
}
