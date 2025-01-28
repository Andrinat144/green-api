import { Button, Stack, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../store/app/hooks";
import { saveUser } from "../../../store/slices/userSlice";

export interface ILoginState {
  idInstance: string;
  apiTokenInstance: string;
}

const LoginForms = () => {
  const dispatch = useAppDispatch()

  const initialValues: ILoginState = {
    idInstance: "",
    apiTokenInstance: "",
  };
  const loginValidationSchema = Yup.object({
    idInstance: Yup.string().required("Заполните поле ID"),
    apiTokenInstance: Yup.string().required("Заполните поле Token"),
  });
  const onClickHandleSubmit = (values: ILoginState) => {
    dispatch(saveUser(values));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        onClickHandleSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ errors, touched, handleChange, handleBlur, values }) => (
        <Form>
          <TextField
            name="idInstance"
            margin="normal"
            fullWidth
            label={"idInstance"}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.idInstance}
            error={touched.idInstance && Boolean(errors.idInstance)}
            helperText={touched.idInstance && errors.idInstance}
          />

          <TextField
            name="apiTokenInstance"
            margin="normal"
            fullWidth
            label={"apiTokenInstance"}
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.apiTokenInstance}
            autoComplete="current-password"
            error={touched.apiTokenInstance && Boolean(errors.apiTokenInstance)}
            helperText={touched.apiTokenInstance && errors.apiTokenInstance}
          />

          <Stack sx={{ position: "relative", width: "100%" }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="secondary"
            >
              Войти
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForms;
