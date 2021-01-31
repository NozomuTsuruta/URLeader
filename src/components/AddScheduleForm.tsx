import dayjs from "dayjs";
import { useState, SetStateAction, Dispatch, FC, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createSchedule } from "../db/schedule";
import { confirmClose, urlValidate } from "../util";
import { ISchedule } from "../util/types";
import useOutsideClick from "../util/useOutsideClick";

type IProps = {
  setSchedule: Dispatch<SetStateAction<ISchedule[]>>;
};

type IForm = {
  url: string;
  date: Date;
  memo: string;
};

export const AddScheduleForm: FC<IProps> = ({ setSchedule }) => {
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<IForm>();
  const ref = useRef<HTMLFormElement>();
  const [open, setOpen] = useState(false);

  const submit = ({ date, url, memo }: IForm) => {
    const format = dayjs(date.valueOf()).format("YYYY/MM/DD H:mm").toString();
    createSchedule(url, dayjs().toString(), memo, format);
    setSchedule((prev) => [
      ...prev,
      { url, id: dayjs().toString(), memo, date: format },
    ]);
    setOpen(false);
    toast("追加しました");
  };

  useOutsideClick(ref, () => {
    confirmClose(open, isDirty, setOpen);
  });

  return (
    <>
      {!open && (
        <button
          className="add-button"
          onClick={() => setOpen(true)}
          aria-label="予定追加"
        >
          ＋ 予定を追加
        </button>
      )}
      {open && (
        <form
          className="flex flex-col mb-4 max-w-2xl"
          ref={ref as any}
          onSubmit={handleSubmit(submit)}
        >
          <label
            htmlFor="label"
            className="border border-gray-200 rounded-md flex-col flex p-2 focus-within:border-gray-500 mb-2"
          >
            <input
              type="url"
              id="label"
              className="px-2 pt-2 pb-4 focus:outline-none h-10 rounded-md"
              placeholder="URLを入力"
              name="url"
              ref={register(urlValidate)}
              aria-label="URL"
              autoComplete="https://"
            />
            <div>
              <input
                type="datetime-local"
                name="date"
                min={dayjs().format("YYYY-MM-DDTHH:mm").toString()}
                ref={register({ required: "日付を選択してください" })}
                className="input mb-2 sm:mb-0 mr-2 h-10 w-52 cursor-pointer bg-white focus:bg-gray-100"
                aria-label="日付"
                defaultValue={dayjs()
                  .add(1, "h")
                  .format("YYYY-MM-DDTHH:mm")
                  .toString()}
              />
              <input
                type="text"
                name="memo"
                className="input h-10 w-52 md:w-64"
                placeholder="メモ"
                ref={register}
                aria-label="メモ"
              />
            </div>
          </label>
          <div className="flex w-48 justify-between">
            <button
              className="button text-white bg-black"
              type="submit"
              aria-label="追加"
            >
              追加
            </button>
            <button
              className="button"
              type="button"
              onClick={() => {
                confirmClose(open, isDirty, setOpen);
              }}
              aria-label="キャンセル"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
    </>
  );
};
