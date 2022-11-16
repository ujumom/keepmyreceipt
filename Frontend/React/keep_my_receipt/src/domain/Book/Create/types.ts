/** 영수증 승인에서부터 거래 등록으로 넘어오는 param 타입 */
export type ReceiptStateType = {
  requestId: number;
  imgUrl: string;
  date: string;
  money: number;
  items: {
    id: string;
    content: string;
    money: string;
  }[];
};

export type BSType = {
  bscName: string;
  bscId: number;
};

export type ASType = {
  ascName: string;
  ascId: number;
};

export type TagType = {
  tagId: number;
  tagName: string;
  parentTag: string | null;
};
