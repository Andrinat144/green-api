import { TextField } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../store/app/hooks";
import { postNewMessage, saveMessages } from "../../../store/slices/userSlice";

export interface INewMessage {
  message: string;
}

interface IProps {
  phoneNumber: number;
  index: number;
}

const AddNewMessage = ({ phoneNumber, index }: IProps) => {
  const { user } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const messageInitialValues: INewMessage = {
    message: "",
  };
  const phoneValidationSchema = Yup.object({
    message: Yup.string().required(''),
  });
  const onClickAddNewMessage = (values: INewMessage) => {
    dispatch(saveMessages({ id: index, message: values.message }));
    if (user) {
      dispatch(
        postNewMessage({
          post: {
            chatId: `${phoneNumber}@c.us`,
            message: values.message,
          },
          token: user?.apiTokenInstance,
          user: user?.idInstance,
        })
      );
    }
  };

  return (
    <Formik
      initialValues={messageInitialValues}
      validationSchema={phoneValidationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        onClickAddNewMessage(values);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ errors, touched, handleChange, handleBlur, values }) => (
        <Form>
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
            name="message"
            margin="normal"
            fullWidth
            label={"Введите сообщение"}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.message}
            error={touched.message && Boolean(errors.message)}
            helperText={touched.message && errors.message}
          />
        </Form>
      )}
    </Formik>
  );
};

export default AddNewMessage;
