import { IStore } from "./../index";
import { ActionTypes, IRecord } from "./types";
import { recordsTable } from "../../db";
import { Dispatch } from "redux";
import { toast } from "react-toastify";

export const createRecord = ({ ...record }: IRecord) => async (
  dispatch: Dispatch,
  getState: () => IStore
) => {
  try {
    // 履歴が10件以上のとき、古い履歴を削除
    if (getState().records.length >= 10) {
      const id = getState().records[0].id;
      await recordsTable.delete(id);
      dispatch({
        type: ActionTypes.DELETE_RECORD,
        payload: id,
      });
    }
    await recordsTable.put({ ...record });
    dispatch({
      type: ActionTypes.CREATE_RECORD,
      payload: record,
    });
    toast("履歴に追加しました");
  } catch {
    toast.error("履歴の追加に失敗しました");
  }
};

export const readRecords = () => async (
  dispatch: Dispatch,
  getState: () => IStore
) => {
  try {
    while (getState().records.length > 10) {
      const id = getState().records[0].id;
      await recordsTable.delete(id);
      dispatch({
        type: ActionTypes.DELETE_RECORD,
        payload: id,
      });
    }
    const records = await recordsTable.toArray();
    dispatch({
      type: ActionTypes.READ_RECORDS,
      payload: records,
    });
  } catch {
    toast.error("履歴の読み込みに失敗しました");
  }
};

export const deleteRecord = (id: string) => async (dispatch: Dispatch) => {
  try {
    await recordsTable.delete(id);
    dispatch({
      type: ActionTypes.DELETE_RECORD,
      payload: id,
    });
    toast("履歴を削除しました");
  } catch {
    toast.error("履歴の削除に失敗しました");
  }
};

export const deleteAllRecord = () => async (dispatch: Dispatch) => {
  try {
    await recordsTable.clear();
    dispatch({
      type: ActionTypes.DELETE_ALL_RECORD,
    });
    toast("履歴を全て削除しました");
  } catch {
    toast.error("履歴の削除に失敗しました");
  }
};
