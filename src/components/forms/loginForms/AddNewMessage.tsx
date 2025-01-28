import { Button, Stack, TextField } from "@mui/material";
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
    message: Yup.string().required("Пустое сообщение"),
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
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        onClickAddNewMessage(values);
        setSubmitting(false);
      }}
    >
      {({ errors, touched, handleChange, handleBlur, values }) => (
        <Form>
          <TextField
            name="message"
            margin="normal"
            fullWidth
            label={"message"}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.message}
            error={touched.message && Boolean(errors.message)}
            helperText={touched.message && errors.message}
          />

          <Stack sx={{ position: "relative", width: "100%" }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="secondary"
            >
              Отправить
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default AddNewMessage;
