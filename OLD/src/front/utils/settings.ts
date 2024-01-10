import { DataRequestEnum, DataRequestType } from "../types/settings.type";

export function getBooksFromMain(): void {
  const dataRequest: DataRequestType = {
    type: DataRequestEnum.GET_BOOKS,
    data: null,
  };

  window.api.send("toMain", dataRequest);
}
