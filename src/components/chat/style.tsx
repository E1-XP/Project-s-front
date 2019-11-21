import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Chip, { ChipProps } from '@material-ui/core/Chip';

export const Wrapper = styled.div`
  position: relative;
  text-align: center;
  margin-left: 8px;

  & :nth-child(2) {
    animation-delay: -1.1s;
  }

  & :nth-child(3) {
    animation-delay: -0.9s;
  }
`;

export const anim = keyframes`
	0%, 60%, 100% {
		transform: initial;
	}

	30% {
		transform: translateY(-12px);
	}`;

export const Dot = styled.span`
  background: white;
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-right: 3px;
  animation: ${anim} 1.3s linear infinite;
`;

export const ChatListWrapper = styled.div<{ chatHeight: string | undefined }>`
  height: ${({ chatHeight }) => chatHeight || '600px'};
  overflow: auto;

  @media only screen and (max-width: 960px) {
    height: ${({ chatHeight }) => chatHeight || '350px'};
  }
`;

export const PositionedIconButton = styled(IconButton)`
  position: absolute !important;
  right: 0;
  top: 0;

  & :hover {
    background-color: transparent;
  }
`;

export const TextFieldWithPadding = styled(TextField)`
  margin-top: 0 !important;

  & :first-child {
    padding-top: 1.3rem;
  }
`;

export const ChipWithOpacity = styled(({ isWriting, ...props }) => (
  <Chip {...props} />
))<{ isWriting: boolean }>`
  opacity: ${props => (props.isWriting ? 1 : 0)};
`;
