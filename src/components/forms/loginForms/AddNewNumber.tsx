import { Button, Stack, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../store/app/hooks";
import { saveNumber } from "../../../store/slices/userSlice";

export interface INewPhone {
  phone: number;
}

const AddNewNumber = () => {
   const dispatch = useAppDispatch()
  const phoneInitialValues: INewPhone = {
    phone: 0,
  };
  const phoneValidationSchema = Yup.object({
    phone: Yup.number()
      .required("Заполните номер телефона")
      .min(11, "Недостоверный номер"),
  });
  const onClickAddNewPhoneNumber = (values: INewPhone) => {
    dispatch(saveNumber(values))
  };

  return (
    <Formik
      initialValues={phoneInitialValues}
      validationSchema={phoneValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        onClickAddNewPhoneNumber(values);
        setSubmitting(false);
      }}
    >
      {({ errors, touched, handleChange, handleBlur, values }) => (
        <Form>
          <TextField
            name="phone"
            margin="normal"
            fullWidth
            label={"phone"}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.phone}
            error={touched.phone && Boolean(errors.phone)}
            helperText={touched.phone && errors.phone}
          />

          <Stack sx={{ position: "relative", width: "100%" }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="secondary"
            >
              Сохранить
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default AddNewNumber;
