import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/es";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs().utc();
dayjs.locale("es");

export default dayjs;
