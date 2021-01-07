import { useState, FC, Dispatch, SetStateAction } from "react";
import { SiGooglecalendar } from "react-icons/si";
import { RiLogoutBoxRLine } from "react-icons/ri";
import dayjs from "dayjs";
import { ISchedule } from "../util/types";
import { createSchedule } from "../db/schedule";
import { Modal } from "./Modal";

type IProps = {
  setSchedule: Dispatch<SetStateAction<ISchedule[]>>;
};

export const GAPI: FC<IProps> = ({ setSchedule }) => {
  const [auth, setAuth] = useState(false);
  const [event, setEvent] = useState<Omit<ISchedule, "id">[]>([]);
  const [open, setOpen] = useState(false);

  const CLIENT_ID =
    "840951746882-ksrhra0q5ikp5mt2se38aifbpmidmi2i.apps.googleusercontent.com";
  const API_KEY = "AIzaSyDyDNlcwP4TRieJ7UUktzq2RB0EuGQ8V1s";
  const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  const getData = async () => {
    const res = await (window as any).gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    });
    const arr: ISchedule[] = [];
    const events = res.result.items;
    events.forEach((event: any) => {
      if ("conferenceData" in event || "hangoutLink" in event) {
        arr.push({
          id: dayjs().toString(),
          memo: event.summary || "",
          url:
            event.hangoutLink || event.conferenceData.entryPoints[0].uri || "",
          date:
            dayjs(event.start.dateTime).format("YYYY/MM/DD H:mm").toString() ||
            "",
        });
      }
    });
    setEvent(arr);
    setOpen(true);
  };

  const handleFetch = () => {
    const gapi = (window as any).gapi;
    gapi.load("client:auth2", async () => {
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
      const isLogin = await gapi.auth2.getAuthInstance().isSignedIn.get();
      if (!isLogin) {
        await gapi.auth2.getAuthInstance().signIn();
      }
      setAuth(true);
      getData();
    });
  };

  const handleSignout = () => {
    (window as any).gapi.auth2.getAuthInstance().signOut();
    setEvent([]);
    setAuth(false);
  };

  return (
    <div>
      <button
        className={`button mb-4 ${auth ? "" : "opacity-70 cursor-not-allowed"}`}
        onClick={handleSignout}
        aria-label="logout"
        disabled={!auth}
      >
        <RiLogoutBoxRLine size="20" className="text-red-500" />
      </button>
      <button className="button mb-4" onClick={handleFetch} aria-label="auth">
        <SiGooglecalendar size="20" className="text-blue-500" />
      </button>
      {open && (
        <Modal setOpen={setOpen}>
          {event
            ? event.map(({ memo, url, date }, i) => (
                <div key={i}>
                  <ul>
                    <li>URL： {url}</li>
                    <li>時刻： {date}</li>
                    <li>メモ： {memo}</li>
                  </ul>
                  <button
                    className="button text-white bg-black"
                    onClick={() => {
                      const id = dayjs().toString();
                      createSchedule(url, id, memo, date);
                      setSchedule((prev) => [...prev, { url, id, memo, date }]);
                    }}
                  >
                    追加
                  </button>
                </div>
              ))
            : "URLの設定された予定はありませんでした"}
        </Modal>
      )}
    </div>
  );
};
