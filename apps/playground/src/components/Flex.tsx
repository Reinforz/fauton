import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Flex = styled(Box)`
  display: flex;
  gap: ${({theme}) => theme.spacing(1)};
  overflow: auto;
`

export const FlexCol = styled(Flex)`
  flex-direction: column;
`;