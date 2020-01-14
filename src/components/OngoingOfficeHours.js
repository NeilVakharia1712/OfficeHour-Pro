import React from "react";
import Typography from "@material-ui/core/Typography";

const getCurrentTime = () => {
  const now = new Date();
  var day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  return [day, hour, minute];
};

const convertDayOfWeekStrToNum = day => {
  switch (day) {
    case "su":
      return 0;
    case "mo":
      return 1;
    case "tu":
      return 2;
    case "we":
      return 3;
    case "th":
      return 4;
    case "fr":
      return 5;
    case "sa":
      return 6;
    default:
      return 0;
  }
};



export const areOHOngoing = (courseNumber, officeHours) => {
  const [day, hour, minute] = getCurrentTime();
  const sessions = Object.values(officeHours).filter(
    session => convertDayOfWeekStrToNum(session.weekDay) === day
  );
  if (sessions === undefined || sessions.length === 0) return false;

  for (var potentialOngoingSession of sessions) {
    if ((typeof(potentialOngoingSession) != 'object') || !('startTime' in potentialOngoingSession)) {
        continue;
    }
    const startTime = potentialOngoingSession.startTime.split(":");
    const startTimeHour = startTime[0];
    const startTimeMinute = startTime[1];
    const endTime = potentialOngoingSession.endTime.split(":");
    const endTimeHour = endTime[0];
    const endTimeMinute = endTime[1];

    if (
      (Number(startTimeHour) < hour && hour < Number(endTimeHour)) ||
      (hour === Number(startTimeHour) && minute >= Number(startTimeMinute)) ||
      (hour === Number(endTimeHour) && minute <= Number(endTimeMinute))
    ) {
      return {
        isOngoing: true,
        info: {
          courseNumber: courseNumber,
          startTime: potentialOngoingSession.startTime,
          endTime: potentialOngoingSession.endTime
        }
      };
    }
  }
  return {
    isOngoing: false,
    info: undefined
  };
};

const formatTime = time => {
  const timeArray = time.split(":");
  var timeHour = timeArray[0];
  if (Number(timeHour) > 12) {
    timeHour = Number(timeHour) - 12;
  }
  var timeAMPM = "am";
  if (Number(timeArray[0]) >= 12) {
    timeAMPM = "pm";
  }
  const timeMinute = timeArray[1];
  return `${timeHour}:${timeMinute}${timeAMPM}`;
};

const formatFullDayOfWeekString = day => {
  switch (day) {
    case "su":
      return "Sunday";
    case "mo":
      return "Monday";
    case "tu":
      return "Tuesday";
    case "we":
      return "Wednesday";
    case "th":
      return "Thursday";
    case "fr":
      return "Friday";
    case "sa":
      return "Saturday";
    default:
      return "Sunday";
  }
};

const findNextOHSession = officeHours => {
  var [nowDay, nowHour] = getCurrentTime();
  var nextSession = undefined;
  for (var session of Object.values(officeHours)) {
    if ((typeof(session) !== 'object') || !('weekDay' in session)) {
        continue;
    }

    const weekDay = convertDayOfWeekStrToNum(session.weekDay);
    const startTime = session.startTime.split(":");
    const startHour = Number(startTime[0]);
    const startMinute = Number(startTime[1]);

    // If office hours were today, they already passed, and there are other options for office hours, skip this session
    if (weekDay === nowDay && nowHour > startHour && Object.keys(officeHours).length > 1) {
        continue;
    }

    if (
      !nextSession || // next session hasn't been initialized yet
      weekDay - nowDay < nextSession.day - nowDay ||
      (weekDay - nowDay === nextSession.day - nowDay &&
        startHour < nextSession.startHour)
    ) {
      nextSession = {
        session: session,
        day: weekDay,
        startHour: startHour,
        startMinute: startMinute
      };
    }
  }

  return (
    <div>
      <Typography variant="body2" component="p">
        Next Office Hours Session:{" "}
        {formatFullDayOfWeekString(nextSession.session.weekDay)},{" "}
        {formatTime(nextSession.session.startTime)} -{" "}
        {formatTime(nextSession.session.endTime)}
      </Typography>
    </div>
  );
};

const OngoingOfficeHours = ({ courseNumber, officeHours }) => {
  const ongoingSession = areOHOngoing(courseNumber, officeHours);

  return (
    <div>
      {ongoingSession.isOngoing ? (
        <div>
          <Typography variant="body2" component="p">
            Ongoing Office Hours Session:{" "}
            {formatTime(ongoingSession.info.startTime)} -{" "}
            {formatTime(ongoingSession.info.endTime)}
          </Typography>
          <Typography variant="body2" component="p">
            Current Number of Students in Office Hours: 4{" "}
            {/* TO DO CHANGE THIS, should not hard code students */}
          </Typography>
        </div>
      ) : (
        findNextOHSession(officeHours)
      )}
    </div>
  );
};

export default OngoingOfficeHours;
