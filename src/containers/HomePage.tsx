import { Stack, Tab, Tabs } from "@mui/material";
import LoginForms from "../components/forms/loginForms/LoginForms";
import AddNewNumber from "../components/forms/loginForms/AddNewNumber";
import { useAppSelector } from "../store/app/hooks";
import { useState } from "react";
import TabPanel from "../components/tabPanel/TabPanel";
import { a11yProps } from "../helpers/tabsFunction";

const HomePage = () => {
  const { phoneNumbers, user } = useAppSelector((state) => state.users);
  const [value, setValue] = useState<number>(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      {user ? (
        <>
          <Stack>
            <AddNewNumber />
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: "divider" }}
            >
              {phoneNumbers.map((item, index) => (
                <Tab key={index} label={item.phone} {...a11yProps(index)} />
              ))}
            </Tabs>
          </Stack>
          <Stack>
            {phoneNumbers.map((item, index) => (
              <TabPanel key={index} value={value} index={index} item={item}/>
            ))}
          </Stack>
        </>
      ) : (
        <LoginForms />
      )}
    </>
  );
};

export default HomePage;
