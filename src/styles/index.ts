import styled, { createGlobalStyle } from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

export const GlobalStyle = createGlobalStyle`
body {
    background-color: rgb(32, 33, 36) !important;
    font-family: 'Roboto';
    font-weight: 400;
}

a {
    text-decoration: none;
    color: inherit;
}`;

export const MainContainer = styled.main`
  margin: 0 auto;
  max-width: 1200px;
  padding: 16px;
`;

export const FullHeightPaper = styled(Paper)`
  height: 100%;
`;

export const GradientButton = styled(Button)`
  background: ${({ disabled }) =>
    disabled ? 'inherit' : 'linear-gradient(to right, #ff00cc, #333399)'};
  color: #fff !important;
`;

export const ButtonIcon = styled(Icon)`
  margin-left: 0.5rem;
  color: #fff;
`;

export const HeadingSection = styled(Grid)`
  & > :not(span) {
    @media only screen and (max-width: 400px) {
      font-size: 1.72rem;
    }
  }
`;

export const HeadlineIcon = styled(Icon)`
  font-size: 2.5rem !important;
  margin-right: 1rem;

  @media only screen and (max-width: 400px) {
    font-size: 1.7rem !important;
    margin-right: 0.3rem;
  }
`;
