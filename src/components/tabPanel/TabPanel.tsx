import { Typography } from "@mui/material";
import { IPhone } from "../../store/slices/userSlice";
import AddNewMessage from "../forms/loginForms/AddNewMessage";

interface IProps {
  index: number;
  value: number;
  item: IPhone;
}

const TabPanel = (props: IProps) => {
  const { value, index, item, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <>{  
        item.messages?.map((item, index) => (
            <Typography key={index}>{item}</Typography>
        ))
      }
        <AddNewMessage phoneNumber={item.phone} index={index} />
      </> }
      
    </div>
  );
};

export default TabPanel