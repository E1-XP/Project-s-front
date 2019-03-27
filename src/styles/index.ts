import styled, { createGlobalStyle } from 'styled-components';
import Paper from '@material-ui/core/Paper';
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
  padding: 1rem;
  padding-top: 30px;
`;

export const FullHeightPaper = styled(Paper)`
  height: 100%;
`;

export const HeadlineIcon = styled(Icon)`
  font-size: 2.5rem !important;
  margin-right: 1rem;
`;