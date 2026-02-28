import styled from 'styled-components';
import { Button } from '@mui/material';

const baseBtn = `
  && {
    font-family: var(--font-base);
    font-weight: 600;
    border-radius: 10px;
    text-transform: none;
    font-size: 0.875rem;
    letter-spacing: 0.01em;
    padding: 10px 20px;
    transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
    &:hover { transform: translateY(-1px); }
    &:active { transform: translateY(0); }
  }
`;

export const LightPurpleButton = styled(Button)`
  && {
    font-family: var(--font-base);
    font-weight: 700;
    border-radius: 10px;
    text-transform: none;
    font-size: 0.95rem;
    background: linear-gradient(135deg, #6C63FF, #A855F7);
    color: #fff;
    box-shadow: 0 4px 16px rgba(108,99,255,0.35);
    transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
    &:hover {
      background: linear-gradient(135deg, #5a52d5, #9333ea);
      box-shadow: 0 8px 28px rgba(108,99,255,0.45);
      transform: translateY(-1px);
    }
    &:active { transform: translateY(0); }
  }
`;

export const PurpleButton = styled(Button)`
  ${baseBtn}
  && {
    background: #6C63FF;
    color: #fff;
    box-shadow: 0 4px 14px rgba(108,99,255,0.3);
    &:hover { background: #5a52d5; box-shadow: 0 6px 20px rgba(108,99,255,0.4); }
  }
`;

export const BlueButton = styled(Button)`
  ${baseBtn}
  && {
    background: linear-gradient(135deg, #3B82F6, #06B6D4);
    color: #fff;
    box-shadow: 0 4px 14px rgba(59,130,246,0.3);
    &:hover { box-shadow: 0 6px 20px rgba(59,130,246,0.45); }
  }
`;

export const GreenButton = styled(Button)`
  ${baseBtn}
  && {
    background: linear-gradient(135deg, #22C55E, #10B981);
    color: #fff;
    box-shadow: 0 4px 14px rgba(34,197,94,0.3);
    &:hover { box-shadow: 0 6px 20px rgba(34,197,94,0.4); }
  }
`;

export const RedButton = styled(Button)`
  ${baseBtn}
  && {
    background: linear-gradient(135deg, #EF4444, #DC2626);
    color: #fff;
    box-shadow: 0 4px 14px rgba(239,68,68,0.3);
    margin-left: 4px;
    &:hover { box-shadow: 0 6px 20px rgba(239,68,68,0.4); }
  }
`;

export const DarkRedButton = styled(Button)`
  ${baseBtn}
  && {
    background: #B91C1C;
    color: #fff;
    &:hover { background: #EF4444; }
  }
`;

export const BlackButton = styled(Button)`
  ${baseBtn}
  && {
    background: rgba(255,255,255,0.08);
    color: rgba(240,239,255,0.85);
    border: 1px solid rgba(255,255,255,0.1);
    margin-left: 4px;
    &:hover {
      background: rgba(255,255,255,0.13);
      border-color: rgba(255,255,255,0.2);
      color: #fff;
    }
  }
`;

export const BrownButton = styled(Button)`
  ${baseBtn}
  && {
    background: linear-gradient(135deg, #92400e, #b45309);
    color: #fff;
    &:hover { background: linear-gradient(135deg, #b45309, #d97706); }
  }
`;

export const IndigoButton = styled(Button)`
  ${baseBtn}
  && {
    background: linear-gradient(135deg, #4338CA, #6C63FF);
    color: #fff;
    box-shadow: 0 4px 14px rgba(67,56,202,0.3);
    &:hover { box-shadow: 0 6px 20px rgba(67,56,202,0.4); }
  }
`;
