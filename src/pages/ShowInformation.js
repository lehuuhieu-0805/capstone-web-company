import { Card, CardContent, Typography } from "@mui/material";
import { Container } from "@mui/system";

export const ShowInformationCreateCompany = () => {

  return (
    <Container maxWidth='sm' sx={{ mt: 5 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>Thông báo</Typography>
          <Typography variant="subtitle1" gutterBottom>Yêu cầu tạo công ty của bạn đang được admin phê duyệt.</Typography>
          <Typography variant="subtitle1" gutterBottom>Vui lòng chờ thông báo qua email. Quay về trang <a href='/login'>đăng nhập.</a></Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export const ShowInformationJoinCompany = () => {

  return (
    <Container maxWidth='sm'>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>Thông báo</Typography>
          <Typography variant="subtitle1" gutterBottom>Yêu cầu tham gia công ty của bạn đang được admin phê duyệt.</Typography>
          <Typography variant="subtitle1" gutterBottom>Vui lòng chờ thông báo qua email.</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};