import { useCallback, useEffect, useState } from "react";
import { getMessages, logout } from "../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../store/app/hooks";

export const useHomePage = () => {
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
  return {
    onClickLogaut,
    handleChange,
    phoneNumbers,
    value,
    user,
  };
};
