import { TextField } from "@mui/material";
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
  });
  const onClickAddNewPhoneNumber = (values: INewPhone) => {
    dispatch(saveNumber(values))
  };

  return (
    <Formik
      initialValues={phoneInitialValues}
      validationSchema={phoneValidationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        onClickAddNewPhoneNumber(values);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ handleChange, handleBlur, values }) => (
        <Form style={{padding: "0 10px"}}>
          <TextField
            sx={{
              backgroundColor: '#222e35',
              borderRadius: '20px',
              input: { color: 'white' },
            }}
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{
              style: { color: 'white' }
            }}
            name="phone"
            margin="normal"
            fullWidth
            label={"Добавить новый номер"}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.phone}
          />
        </Form>
      )}
    </Formik>
  );
};

export default AddNewNumber;
