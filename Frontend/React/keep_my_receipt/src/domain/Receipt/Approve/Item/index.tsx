import React, { useState, useEffect } from 'react';
import { Stack, Card, TextField, Grid } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

interface ItemType {
  id: string;
  content: string;
  money: string;
}

interface ListItemType {
  id: string;
  content: string;
  money: string;
  setItems: React.Dispatch<React.SetStateAction<ItemType[]>>;
  newItems: ItemType[];
}

// 영수증 승인페이지에서 영수증을 구성하는 항목을 적어주는 form
export default function ListItem({
  id,
  content,
  money,
  setItems,
  newItems,
}: ListItemType) {
  const [newId, setId] = useState(id);
  const [newContent, setContent] = useState(content);
  const [newMoney, setMoney] = useState(money);

  // x 버튼 누르면 해당 항목란 삭제 및 렌더링
  const deleteItem = () => {
    const nextItems = newItems.filter((items) => items.id !== newId);
    setItems(nextItems);
  };

  // 항목, 금액 입력 시마다 렌더링
  const updateItem = () => {
    const nextItems = [...newItems];
    nextItems.forEach((item) => {
      if (item.id === newId) {
        item.content = newContent;
        item.money = newMoney;
      }
    });
    setItems(nextItems);
  };

  // 금액 입력 시마다 isNaN 체크
  useEffect(() => {
    if (isNaN(Number(newMoney))) {
      alert('숫자만 기입할 수 있습니다');
      setMoney('');
    }
  }, [newMoney]);
  useEffect(updateItem, [newContent, newMoney]);

  return (
    <Stack direction="column" spacing={2} style={{ width: '100%' }}>
      <Card variant="outlined" style={{ padding: 15, width: '100%' }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ width: '100%' }}
        >
          <Grid item xs={4.5} sm={4.5} md={4.5}>
            <TextField
              id={newId.toString()}
              label="내용"
              style={{ width: '100%' }}
              variant="outlined"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={newContent}
              onChange={(e: any) => setContent(e.target.value)}
            />
          </Grid>
          <Grid item xs={4.5} sm={4.5} md={4.5}>
            <TextField
              id={newId.toString()}
              label="금액"
              style={{ width: '100%' }}
              variant="outlined"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={newMoney}
              onChange={(e: any) => setMoney(e.target.value)}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2}>
            <CancelIcon onClick={deleteItem} />
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
}
