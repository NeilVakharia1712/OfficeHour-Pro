import React from "react";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core"

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
    if (
      typeof potentialOngoingSession != "object" ||
      !("startTime" in potentialOngoingSession)
    ) {
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
        courseNumber: courseNumber,
        info: potentialOngoingSession
      };
    }
  }
  return {
    isOngoing: false,
    info: undefined
  };
};

export const formatTime = time => {
  console.log("time", time);
  if (!time) return;
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

export const formatFullDayOfWeekString = day => {
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
  var nextSessionThisWeek = undefined;
  var firstSessionNextWeek = undefined;
  for (var session of Object.values(officeHours)) {
    if (typeof session !== "object" || !("weekDay" in session)) {
      continue;
    }

    const weekDay = convertDayOfWeekStrToNum(session.weekDay);
    const startTime = session.startTime.split(":");
    const startHour = Number(startTime[0]);
    const startMinute = Number(startTime[1]);

    // If office hours were today, they already passed, and there are other options for office hours, skip this session
    if (
      weekDay === nowDay &&
      nowHour > startHour &&
      Object.keys(officeHours).length > 1
    ) {
      continue;
    }

    // If the next time this office hours session occurs is this week
    if (weekDay - nowDay >= 0) {
      if (
        !nextSessionThisWeek || // next session hasn't been initialized yet
        weekDay - nowDay < nextSessionThisWeek.day - nowDay ||
        (weekDay - nowDay === nextSessionThisWeek.day - nowDay &&
          startHour < nextSessionThisWeek.startHour)
      ) {
        nextSessionThisWeek = {
          session: session,
          day: weekDay,
          startHour: startHour,
          startMinute: startMinute
        };
      }
    } else if (weekDay - nowDay < 0) {
      // else if the next time this office hours session occurs is next week
      if (
        !firstSessionNextWeek || // next session hasn't been initialized yet
        weekDay - nowDay < firstSessionNextWeek.day - nowDay ||
        (weekDay - nowDay === firstSessionNextWeek.day - nowDay &&
          startHour < firstSessionNextWeek.startHour)
      ) {
        firstSessionNextWeek = {
          session: session,
          day: weekDay,
          startHour: startHour,
          startMinute: startMinute
        };
      }
    }
  }

  // If there are more OH sessions this week, then next OH is this week
  // if not, the next OH is next week
  var nextSession;
  if (nextSessionThisWeek) {
    nextSession = nextSessionThisWeek;
  } else {
    nextSession = firstSessionNextWeek;
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

const OngoingOfficeHours = ({ courseNumber, officeHours, count }) => {
  const ongoingSession = areOHOngoing(courseNumber, officeHours);

  return (
    <div>
      {ongoingSession.isOngoing ? (
        <div className="ongoing">
          <Typography variant="body1" component="p">
            Ongoing Office Hours:
          </Typography>
          <Grid item container>
            <Grid item xs={8}>
              <Typography variant='h6'>
                {formatTime(ongoingSession.info.startTime)} - {formatTime(ongoingSession.info.endTime)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h6' align='right'>
                Current People: {count}/{ongoingSession.info.desiredCapacity}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {ongoingSession.info.TAProf}
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body1' align='right'>
                {ongoingSession.info.location}
              </Typography>
            </Grid>
          </Grid>
        </div>
      ) : (
          findNextOHSession(officeHours)
        )}
    </div>
  );
};

export default OngoingOfficeHours;
