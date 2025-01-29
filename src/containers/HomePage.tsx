import { Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import LoginForms from "../components/forms/loginForms/LoginForms";
import AddNewNumber from "../components/forms/loginForms/AddNewNumber";
import { useAppDispatch, useAppSelector } from "../store/app/hooks";
import { useCallback, useEffect, useState } from "react";
import TabPanel from "../components/tabPanel/TabPanel";
import { a11yProps } from "../helpers/tabsFunction";
import { getMessages, logout } from "../store/slices/userSlice";

const HomePage = () => {
  const { phoneNumbers, user } = useAppSelector((state) => state.users);
  const [value, setValue] = useState<number>(0);
  const dispatch = useAppDispatch();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onClickLogaut = () => {
    dispatch(logout());
  };

  const fetchGuide = useCallback(() => {
    if (user) {
      dispatch(
        getMessages({ user: user?.idInstance, token: user?.apiTokenInstance })
      );
    }
  }, [user]);

  useEffect(() => {
    fetchGuide();

    const intervalId = setInterval(() => {
      fetchGuide();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [fetchGuide]);

  return (
    <>
      {user ? (
        <>
          <Stack
            direction={"row"}
            sx={{ backgroundColor: "#222e35", height: "100%" }}
          >
            <Stack
              sx={{
                backgroundColor: "#111b21",
                width: "30%",
                borderRight: "2px solid #222c33",
                justifyContent: 'space-between'
              }}
            >
              <Stack paddingTop={1}>
                <Typography style={{ color: "white", marginLeft: "10px" }}>
                  Чаты
                </Typography>
                <AddNewNumber />
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="Vertical tabs example"
                  sx={{
                    borderRight: 1,
                    borderColor: "divider",
                    "& .MuiTab-root": { color: "#cfd4d6", borderRight: "none" },
                    "& .Mui-selected": { backgroundColor: "#2a3942" },
                    "& .MuiTabs-indicator": { backgroundColor: "#fff" },
                  }}
                >
                  {phoneNumbers.map((item, index) => (
                    <Tab
                      key={index}
                      label={item.phone}
                      {...a11yProps(index)}
                      sx={{
                        "&:hover": { backgroundColor: "#333" },
                        textTransform: "none",
                        fontSize: "16px",
                      }}
                    />
                  ))}
                </Tabs>
              </Stack>
              <Stack padding={1}>
                <Button style={{color: 'white'}} sx={{backgroundColor: '#2a3942'}} onClick={onClickLogaut} variant="contained">Выйти</Button>
              </Stack>
            </Stack>
            <Stack
              sx={{
                position: "relative",
                backgroundImage:
                  "linear-gradient(rgba(17, 27, 33, 0.9), rgba(17, 27, 33, 0.9)), url(https://static.whatsapp.net/rsrc.php/v4/yl/r/gi_DckOUM5a.png)",
                width: "70%",
                height: "100%",
              }}
            >
              {phoneNumbers.map((item, index) => (
                <TabPanel
                  key={index}
                  value={value}
                  index={index}
                  phone={item}
                />
              ))}
            </Stack>
          </Stack>
        </>
      ) : (
        <LoginForms />
      )}
    </>
  );
};

export default HomePage;
