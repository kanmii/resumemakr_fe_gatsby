import { RESUMES_HOME_PATH } from "../routing";

/**
 * Wait for a newly created/logged in user to be written to local storage before
 * redirecting user.  On slow systems, we wait for up to 10secs!!!!!!!!!
 */
export async function refreshToMyResumes() {
  window.location.replace(RESUMES_HOME_PATH);
  return;
}
