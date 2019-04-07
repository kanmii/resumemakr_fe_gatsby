import { RESUMES_HOME_PATH } from "./routing";
import { SCHEMA_KEY } from "./constants";

function getUser() {
  const data = localStorage.getItem(SCHEMA_KEY);

  if (!data) {
    return null;
  }

  try {
    const { ROOT_QUERY } = JSON.parse(data);

    if (!ROOT_QUERY) {
      return null;
    }

    return ROOT_QUERY.user;
  } catch {
    return null;
  }
}

/**
 * Wait for a newly created/logged in user to be written to local storage before
 * redirecting user.  On slow systems, we wait for up to 10secs!!!!!!!!!
 */
export default function refreshToHome() {
  if (getUser()) {
    window.location.href = RESUMES_HOME_PATH;
    return;
  }

  let intervalId: number;
  let counter = 0;

  intervalId = setInterval(() => {
    if (getUser() || counter === 1000) {
      clearInterval(intervalId);
      window.location.href = RESUMES_HOME_PATH;
    }

    counter++;
  }, 10);
}
