import { Stack, Typography } from "@mui/material";
import { IPhone } from "../../store/slices/userSlice";
import AddNewMessage from "../forms/loginForms/AddNewMessage";
import { formatTime } from "../../helpers/formatTime";

interface IProps {
  index: number;
  value: number;
  phone: IPhone;
}

const TabPanel = (props: IProps) => {
  const { value, index, phone, ...other } = props;

  return (
    <div
      style={{ height: "100%" }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Stack height={"100%"} justifyContent={"space-between"}>
        <Stack sx={{ height: "40px", backgroundColor: "#202c33" }}>
          <Typography
            style={{ color: "white", marginLeft: "10px" }}
            variant="h4"
          >
            {phone.phone}
          </Typography>
        </Stack>
        <Stack gap={1}>
          {value === index && (
            <>
              <Stack
                spacing={1}
                padding={1}
                sx={{
                  maxHeight: 'calc(90vh - 122px)',
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#555",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#222e35",
                  },
                }}
              >
                {phone.messages?.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    sx={{
                      alignSelf: item.user ? "flex-end" : "flex-start",
                      backgroundColor: item.user ? "#005c4b" : "#202c33",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      maxWidth: "70%",
                      color: "white",
                    }}
                  >
                    <Typography
                      style={{ color: "white" }}
                      sx={{ fontSize: "14px", wordBreak: "break-word" }}
                    >
                      {item.text}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        color: "rgba(255, 255, 255, 0.4)",
                        marginLeft: "8px",
                        marginTop: "10px",
                      }}
                    >
                      {formatTime(item.date)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Stack sx={{ backgroundColor: "#202c33" }}>
                <AddNewMessage phoneNumber={phone.phone} index={index} />
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
    </div>
  );
};

export default TabPanel;
