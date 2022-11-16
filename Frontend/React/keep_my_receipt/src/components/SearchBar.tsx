import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Box, TextField, Fade, styled } from '@mui/material';
import { Search, Close } from '@mui/icons-material';

SearchBar.defaultProps = {
  fadeDisplay: true,
  value: '',
  close: false,
};

interface searchBarProps {
  value: string;
  setValue: any;
  fadeDisplay?: boolean;
  setFadeDisplay?: any;
  navi?: string;
  placeholder?: string;
  close?: boolean;
  onSearch?: any;
}

const SearchTextField = styled(TextField)({
  '& .MuiInput-underline:after': {
    borderBottomColor: '#ffaa00',
  },
});

export default function SearchBar({
  value,
  setValue,
  fadeDisplay,
  setFadeDisplay,
  navi,
  placeholder,
  close,
  onSearch,
}: searchBarProps) {
  const navigate = useNavigate();

  const searchWord = () => {
    // if (value.length < 2) {
    //   console.log('검색은 2글자 이상');
    //   setValue('');
    //   return;
    // }

    if (navi) {
      navigate(navi + '?' + 'query=' + value);
    } else {
    }
    if (onSearch) {
      onSearch();
    }
  };

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <Fade in={fadeDisplay}>
      <Box
        height="3rem"
        sx={{
          backgroundColor: 'white',
          display: fadeDisplay ? 'block' : 'none',
          paddingLeft: '2rem',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SearchTextField
            autoFocus
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                searchWord();
              }
            }}
            value={value}
            placeholder={placeholder}
            variant="standard"
            sx={{ outlineColor: 'black', width: '14rem' }}
          />
          <IconButton onClick={searchWord}>
            <Search sx={{ color: 'black', fontSize: '2rem' }} />
          </IconButton>
          {close ? (
            <IconButton
              onClick={() => {
                setFadeDisplay((prev: boolean) => !prev);
                setValue('');
              }}
            >
              <Close sx={{ color: 'black', fontSize: '2rem' }} />
            </IconButton>
          ) : null}
        </Box>
      </Box>
    </Fade>
  );
}
