import { TextField } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../store/app/hooks";
import { saveNumber } from "../../../store/slices/userSlice";

export interface INewPhone {
  phone: string;
}

const AddNewNumber = () => {
  const dispatch = useAppDispatch();
  const phoneInitialValues: INewPhone = {
    phone: "",
  };
  const phoneValidationSchema = Yup.object({
    phone: Yup.string()
      .matches(/^\d*$/, "Номер телефона должен содержать только цифры")
      .required("Заполните номер телефона"),
  });

  const onClickAddNewPhoneNumber = (values: INewPhone) => {
    const phoneNumber = Number(values.phone);
    dispatch(saveNumber({ phone: phoneNumber }));
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
        <Form style={{ padding: "0 10px" }}>
          <TextField
            sx={{
              backgroundColor: "#222e35",
              borderRadius: "20px",
              input: { color: "white" },
            }}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{
              style: { color: "white" },
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
